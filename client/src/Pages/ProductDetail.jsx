import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import API from '../services/api'
import { useCart } from '../context/useCart'
import { useWishlist } from '../context/useWishlist'
import { defaultProductImagePath, resolveProductImage } from '../utils/productImage'
import { inferProductUnit } from '../utils/productUnit'

const normalizeName = (value) => String(value || '').trim().toLowerCase()

function ProductDetail() {
  const { id } = useParams()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart()
  const { toggleWishlist, isLoved } = useWishlist()
  const isMongoId = /^[a-fA-F0-9]{24}$/.test(String(id || ''))
  const dealOffer = location.state?.dealOffer

  useEffect(() => {
    let cancelled = false
    const snapshot = location.state?.productSnapshot

    const loadProduct = async () => {
      if (snapshot && String(snapshot._id) === String(id)) {
        setProduct(snapshot)
        setLoading(false)
      } else {
        setLoading(true)
      }

      if (!snapshot && !isMongoId) {
        setProduct(null)
        setLoading(false)
        return
      }

      try {
        if (isMongoId) {
          const { data } = await API.get(`/products/${id}`)
          if (!cancelled) {
            setProduct(data)
          }
          return
        }

        try {
          const { data } = await API.get(`/products/lookup?name=${encodeURIComponent(snapshot?.name || '')}`)
          if (!cancelled) {
            setProduct(data)
          }
          return
        } catch {
          // Older deployed backends may not have the lookup route yet, so fall back to the full list.
        }

        const { data } = await API.get('/products')
        const matchingProduct = data.find((product) => normalizeName(product.name) === normalizeName(snapshot?.name))
        if (!cancelled && matchingProduct) {
          setProduct(matchingProduct)
        }
      } catch (err) {
        console.log(err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      cancelled = true
    }
  }, [id, isMongoId, location.state])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Product not found.</p>
    </div>
  )

  const cartItem = cartItems.find((item) => item._id === product._id || normalizeName(item.name) === normalizeName(product.name))
  const cartItemId = cartItem?._id || product._id
  const loved = isLoved(product._id)
  const resolvedImage = resolveProductImage(product.name, product.imageURL || product.image)
  const hasDeal = Boolean(dealOffer?.discountedPrice)
  const effectivePrice = hasDeal ? Number(dealOffer.discountedPrice) : Number(product.price)
  const unitLabel = product.unit || inferProductUnit(product.name, product.category?.name)
  const stockValue = Number(product.stock)
  const hasStock = Number.isFinite(stockValue)
  const isOutOfStock = hasStock && stockValue <= 0
  const reachedStockLimit = hasStock && cartItem && cartItem.quantity >= stockValue

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8">
            <img
              src={resolvedImage}
              alt={product.name}
              className="w-full max-w-64 h-auto aspect-square object-cover rounded-xl"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onError={(e) => { e.target.src = defaultProductImagePath() }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-2">Local Farmers</p>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
              <button
                onClick={() => toggleWishlist({
                  _id: product._id,
                  name: product.name,
                  price: product.price,
                  unit: unitLabel,
                  image: resolvedImage
                })}
                className={`text-2xl ${loved ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
                aria-label={loved ? 'Remove from loved' : 'Add to loved'}
              >
                ♥
              </button>
            </div>
            <p className="text-gray-500 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-green-600">₹{effectivePrice}</p>
              {hasDeal && (
                <>
                  <span className="text-gray-400 text-lg line-through">₹{product.price}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
                    {dealOffer.discount}% OFF
                  </span>
                </>
              )}
              <span className="text-gray-400 text-sm">{unitLabel}</span>
            </div>

            {hasStock && (
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockValue > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {stockValue > 0 ? `${stockValue} in stock` : 'Out of stock'}
                </span>
              </div>
            )}

            {!cartItem ? (
              <button
                onClick={() =>
                  addToCart({
                    _id: product._id,
                    name: product.name,
                    price: effectivePrice,
                    unit: unitLabel,
                    image: resolvedImage,
                    ...(hasStock ? { stock: stockValue } : {})
                  })
                }
                disabled={isOutOfStock}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl font-semibold transition-colors w-fit disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isOutOfStock ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-green-50 rounded-xl px-6 py-3 w-fit">
                <button
                  onClick={() => decreaseQty(cartItemId)}
                  className="text-green-600 font-bold text-xl hover:text-green-800"
                  aria-label={`Decrease quantity for ${product.name}`}
                >
                  −
                </button>
                <span className="font-semibold text-green-700 text-lg">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQty(cartItemId)}
                  disabled={reachedStockLimit}
                  className="text-green-600 font-bold text-xl hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  aria-label={`Increase quantity for ${product.name}`}
                >
                  +
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail 
