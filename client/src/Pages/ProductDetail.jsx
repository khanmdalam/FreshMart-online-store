import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'
import { useCart } from '../context/useCart'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`)
      setProduct(data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

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

  const cartItem = cartItems.find((item) => item._id === product._id)

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-4xl mx-auto">
        
        <div className="grid grid-cols-2 gap-8">

          {/* Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-2xl p-8">
            <img
              src={product.imageURL}
              alt={product.name}
              className="w-64 h-64 object-cover rounded-xl"
              onError={(e) => e.target.src = 'https://via.placeholder.com/256'}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-gray-400 mb-2">Local Farmers</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-green-600">₹{product.price}</p>
              <span className="text-gray-400 text-sm">per kg</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {!cartItem ? (
              <button
                onClick={() => addToCart({ _id: product._id, name: product.name, price: product.price, unit: 'per kg', image: product.imageURL })}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl font-semibold transition-colors w-fit"
              >
                + Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4 bg-green-50 rounded-xl px-6 py-3 w-fit">
                <button
                  onClick={() => decreaseQty(product._id)}
                  className="text-green-600 font-bold text-xl hover:text-green-800"
                >
                  −
                </button>
                <span className="font-semibold text-green-700 text-lg">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQty(product._id)}
                  className="text-green-600 font-bold text-xl hover:text-green-800"
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
