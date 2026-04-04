import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/useCart'

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  
  return (
    <header className="w-full">
      
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-10 py-3 bg-white border-b border-gray-200">
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🌐 India</span>
        </div>

        <div className="flex items-center w-96 bg-gray-100 rounded-full px-4 py-2 gap-2">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search Grocery Items..."
            className="bg-transparent outline-none text-sm w-full text-gray-600"
          />
        </div>

        <Link to="/" className="text-2xl font-bold text-gray-800">
          FreshMart
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-700">
          <Link to="/wishlist" className="flex items-center gap-1 hover:text-green-600">
            ♡ Loved
          </Link>
          <Link to="/cart" className="flex items-center gap-1 hover:text-green-600">
            🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-green-600 font-medium">👤 {user.name}</span>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 hover:text-green-600">
              👤 Login/Signup
            </Link>
          )}
        </div>

      </div>

      {/* Bottom Navbar */}
      <div className="flex items-center justify-between px-10 py-2 bg-white border-b border-gray-100 text-sm text-gray-700">
        <div className="flex items-center gap-6">
          <Link to="/shop" className="hover:text-green-600">Shop</Link>
          <Link to="/categories" className="hover:text-green-600">Categories ▾</Link>
          <Link to="/deals" className="hover:text-green-600 text-red-500 font-medium">Deals</Link>
          <Link to="/fresh" className="hover:text-green-600">Fresh Produce</Link>
          <Link to="/about" className="hover:text-green-600">About</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/policy" className="hover:text-green-600">Policy</Link>
          <Link to="/faqs" className="hover:text-green-600">FAQs</Link>
          <Link to="/help" className="hover:text-green-600"> Help & Support</Link>
        </div>
      </div>

    </header>
  )
}

export default Navbar
