import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/useCart'
import { useWishlist } from '../../context/useWishlist'
import API from '../../services/api'

const homepageCategoryNames = [
  'Fresh Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Bakery',
  'Meat & Fish',
  'Beverages'
]

const normalizeGender = (gender) => String(gender || '').trim().toLowerCase()

function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { lovedCount } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const categoryMenuRef = useRef(null)
  const profileMenuRef = useRef(null)
  const searchFromUrl = new URLSearchParams(location.search).get('q') || ''
  const [categories, setCategories] = useState([])
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const normalizedGender = normalizeGender(user?.gender)
  const fallbackProfileIcon = normalizedGender === 'female' ? '👩‍🦰' : '🧑'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories')
        setCategories(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    setShowCategoryMenu(false)
    setShowProfileMenu(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setShowCategoryMenu(false)
      }

      if (!profileMenuRef.current?.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const mergedCategories = useMemo(() => {
    const dbCategories = categories.map((cat) => ({
      key: cat._id,
      label: cat.name,
      type: 'id',
      value: cat._id
    }))

    const dbNames = new Set(categories.map((cat) => cat.name.toLowerCase()))
    const homepageOnlyCategories = homepageCategoryNames
      .filter((name) => !dbNames.has(name.toLowerCase()))
      .map((name) => ({
        key: name,
        label: name,
        type: 'name',
        value: name
      }))

    return [...dbCategories, ...homepageOnlyCategories]
  }, [categories])

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = String(formData.get('search') || '').trim()
    navigate(`/shop${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <header className="w-full">

      {/* Top Navbar */}
      <div className="flex flex-col gap-2 px-4 sm:px-6 lg:px-10 py-3 bg-white border-b border-gray-200 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-600 self-start"> 
            <img src="https://flagcdn.com/w40/in.png" alt="India Flag" className="w-5 h-5 object-cover rounded-sm" />
            <span>India</span>
          </div>

          <form onSubmit={handleSearch} className="flex items-center w-full lg:max-w-md bg-gray-100 rounded-full px-4 py-2 gap-2">
            <span className="text-gray-400"></span>
            <input
              type="text"
              name="search"
              aria-label="Search grocery items"
              placeholder="Search Grocery Items..."
              key={`${location.pathname}-${location.search}`}
              defaultValue={searchFromUrl}
              className="bg-transparent outline-none text-sm w-full text-gray-500"
            />
          </form>
        </div>
        

         <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-gray-800 self-center lg:justify-self-center"
        >
          FreshMart
        </Link> 


        <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6 text-sm text-gray-700 w-full lg:w-auto lg:justify-self-end lg:justify-end">
          <Link to="/cart" className="flex items-center gap-1 hover:text-green-600">
            🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
          {user ? (
            <div ref={profileMenuRef} className="relative flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 cursor-pointer"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-gray-200 bg-gray-100 text-base" aria-hidden="true">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'Profile'} className="h-full w-full object-cover" />
                  ) : (
                    <span>{fallbackProfileIcon}</span>
                  )}
                </span>
                <span>{user.name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Loved {lovedCount > 0 ? `(${lovedCount})` : ''}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false)
                      logout()
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-50 hover:text-red-600"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 hover:text-green-600">
              👤 Login/Signup
            </Link>
          )}
        </div>

      </div>

      {/* Bottom Navbar */}
      <div className="px-4 sm:px-6 lg:px-10 py-2 bg-white border-b border-gray-100 text-sm text-gray-700 overflow-visible">
        <div className="sm:hidden -mx-1 overflow-x-auto">
          <div className="inline-flex items-center gap-5 px-1 py-1 whitespace-nowrap">
            <Link to="/shop" className="hover:text-green-600">Shop</Link>
            <Link to="/shop" className="hover:text-green-600">Categories</Link>
            <Link to="/deals" className="hover:text-green-600 text-red-500 font-medium">Deals</Link>
            <Link to="/fresh" className="hover:text-green-600">Fresh Produce</Link>
            <Link to="/about" className="hover:text-green-600">About</Link>
            <Link to="/policy" className="hover:text-green-600">Policy</Link>
            <Link to="/faqs" className="hover:text-green-600">FAQs</Link>
            <Link to="/help" className="hover:text-green-600">Help & Support</Link>
          </div>
        </div>

        <div className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-8">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link to="/shop" className="hover:text-green-600">Shop</Link>
          <div
            ref={categoryMenuRef}
            className="relative"
          >
            <button
              type="button"
              className="hover:text-green-600"
              onClick={() => setShowCategoryMenu((prev) => !prev)}
            >
              Categories ▾
            </button>

            {showCategoryMenu && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-30">
                <Link
                  to="/shop"
                  className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                  onClick={() => setShowCategoryMenu(false)}
                >
                  All Categories
                </Link>
                {mergedCategories.map((cat) => (
                  <Link
                    key={cat.key}
                    to={cat.type === 'id'
                      ? `/shop?category=${cat.value}`
                      : `/shop?categoryName=${encodeURIComponent(cat.value)}`
                    }
                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/deals" className="hover:text-green-600 text-red-500 font-medium">Deals</Link>
          <Link to="/fresh" className="hover:text-green-600">Fresh Produce</Link>
          <Link to="/about" className="hover:text-green-600">About</Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link to="/policy" className="hover:text-green-600">Policy</Link>
          <Link to="/faqs" className="hover:text-green-600">FAQs</Link>
          <Link to="/help" className="hover:text-green-600">Help & Support</Link>
          </div>
        </div>
      </div>

    </header>
  )
}

export default Navbar
