import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import { resolveProductImage } from '../utils/productImage'
import { useCart } from '../context/useCart'

const fallbackDeals = [
  { id: 'fd1', name: 'Fresh Mango', categoryName: 'Fruits', price: 150, image: '', discount: 18 },
  { id: 'fd2', name: 'Organic Strawberries', categoryName: 'Fresh Vegetables', price: 133, image: '', discount: 20 },
  { id: 'fd3', name: 'Farm Eggs', categoryName: 'Dairy & Eggs', price: 80, image: '', discount: 15 },
  { id: 'fd4', name: 'Whole Wheat Bread', categoryName: 'Bakery', price: 45, image: '', discount: 12 },
  { id: 'fd5', name: 'Fresh Chicken', categoryName: 'Meat & Fish', price: 200, image: '', discount: 22 },
  { id: 'fd6', name: 'Orange Juice', categoryName: 'Beverages', price: 80, image: '', discount: 17 },
]

function Deals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products')
        setProducts(data)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const deals = useMemo(() => {
    const dbDeals = products.map((product, index) => {
      const discount = product.isFeatured ? 25 : [10, 12, 15, 18, 20][index % 5]
      return {
        id: product._id,
        name: product.name,
        categoryName: product.category?.name || 'General',
        price: product.price,
        unit: product.unit || 'per unit',
        image: product.imageURL,
        discount,
        source: 'db'
      }
    })

    const merged = [...dbDeals, ...fallbackDeals.map((item) => ({ ...item, source: 'fallback' }))]
    const seen = new Set()
    return merged.filter((item) => {
      const key = item.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div className="relative rounded-2xl p-8 mb-8 text-white bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="relative z-10">
          <p className="text-sm font-semibold mb-2 text-orange-50">Limited Time</p>
          <h1 className="text-3xl font-bold mb-2 text-white">FreshMart Mega Deals</h1>
          <p className="text-sm text-orange-50">Save big on daily essentials, fresh produce, and pantry must-haves.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today&apos;s Offers</h2>
        <Link to="/shop" className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700">
          Browse Full Shop
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-gray-500">Loading deals...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deals.map((deal) => {
            const discountedPrice = Math.round(deal.price * (1 - deal.discount / 100))
            const resolvedImage = resolveProductImage(deal.name, deal.image)
            const cartItem = cartItems.find((item) => item._id === deal.id)

            return (
              <div key={deal.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
                    {deal.discount}% OFF
                  </span>
                  <span className="text-xs text-gray-400">{deal.categoryName}</span>
                </div>

                <div className="h-28 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden mb-3">
                  <img src={resolvedImage} alt={deal.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>

                <p className="font-semibold text-gray-800 mb-1">{deal.name}</p>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-green-600 font-bold">₹{discountedPrice}</p>
                  <p className="text-gray-400 text-sm line-through">₹{deal.price}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  {!cartItem ? (
                    <button
                      onClick={() => addToCart({
                        _id: deal.id,
                        name: deal.name,
                        price: discountedPrice,
                        unit: deal.unit || 'per unit',
                        image: resolvedImage
                      })}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium"
                    >
                      Add Deal to Cart
                    </button>
                  ) : (
                    <div className="w-full flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
                      <button aria-label={`Decrease quantity for ${deal.name}`} onClick={() => decreaseQty(deal.id)} className="text-green-600 font-bold text-lg">−</button>
                      <span className="text-green-700 font-semibold">{cartItem.quantity}</span>
                      <button aria-label={`Increase quantity for ${deal.name}`} onClick={() => increaseQty(deal.id)} className="text-green-600 font-bold text-lg">+</button>
                    </div>
                  )}

                  {deal.source === 'db' ? (
                    <Link
                      to={`/product/${deal.id}`}
                      state={{ dealOffer: { discount: deal.discount, discountedPrice } }}
                      className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium"
                    >
                      View Deal
                    </Link>
                  ) : (
                    <Link
                      to={`/shop?categoryName=${encodeURIComponent(deal.categoryName)}`}
                      className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-medium"
                    >
                      Explore Category
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Deals
