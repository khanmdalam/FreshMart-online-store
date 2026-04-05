import { useState, useEffect } from 'react'
import API from '../services/api'
import ProductCard from '../components/products/productCard'

const categories = [
  { id: 'all', name: 'All' },
  { id: 'vegetables', name: 'Fresh Vegetables' },
  { id: 'fruits', name: 'Fruits' },
  { id: 'dairy', name: 'Dairy & Eggs' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'meat', name: 'Meat & Fish' },
  { id: 'beverages', name: 'Beverages' },
]

function Shop() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, activeCategory, sortBy, search])

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products')
      setProducts(data)
      setFiltered(data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const filterProducts = () => {
    let result = [...products]

    // Filter by search
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }

    setFiltered(result)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop Header */}
      <div className="bg-white border-b border-gray-200 px-10 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Shop All Products</h1>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 w-80">
            <span className="text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex">

        {/* Sidebar Categories */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-green-500 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">Loading products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-400">No products found.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-4">{filtered.length} products found</p>
              <div className="grid grid-cols-4 gap-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    unit="per kg"
                    image={product.imageURL}
                  />
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Shop
