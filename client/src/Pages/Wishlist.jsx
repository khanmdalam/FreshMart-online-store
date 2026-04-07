import { Link, useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/useWishlist'
import { useCart } from '../context/useCart'

function Wishlist() {
  const navigate = useNavigate()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-7xl mb-4">❤️</span>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No loved products yet</h2>
        <p className="text-gray-400 mb-6">Save your favorite products here for quick access.</p>
        <Link to="/shop" className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600">
          Explore Products
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Loved Products ❤️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div
              className="h-36 rounded-xl bg-gray-50 mb-3 overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => navigate(`/product/${item._id}`)}
            >
              {item.image && item.image.startsWith('http') ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">{item.image || '📦'}</span>
              )}
            </div>

            <p className="font-semibold text-gray-800 mb-1">{item.name}</p>
            <p className="text-green-600 font-bold mb-3">₹{item.price}</p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(item)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-sm font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="bg-red-50 text-red-500 hover:bg-red-100 py-2 rounded-xl text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
