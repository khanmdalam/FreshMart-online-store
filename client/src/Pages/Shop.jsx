import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../services/api'
import ProductCard from '../components/products/productCard'

const homepageCategoryNames = [
  'Fresh Vegetables',
  'Fruits',
  'Dairy & Eggs',
  'Bakery',
  'Meat & Fish',
  'Beverages'
]

const staticProductsByCategory = {
  'Fresh Vegetables': [
    { _id: 'sv1', name: 'Seedless Green Grapes', price: 133, imageURL: '🍇' },
    { _id: 'sv2', name: 'Organic Strawberries', price: 133, imageURL: '🍓' },
    { _id: 'sv3', name: 'Imported Kiwi', price: 133, imageURL: '🥝' },
    { _id: 'sv4', name: 'Sweet Pomegranate', price: 133, imageURL: '🍎' },
    { _id: 'sv5', name: 'Rose Papaya', price: 120, imageURL: '🍈' },
  ],
  Fruits: [
    { _id: 'sf1', name: 'Fresh Mango', price: 150, imageURL: '🥭' },
    { _id: 'sf2', name: 'Watermelon', price: 40, imageURL: '🍉' },
    { _id: 'sf3', name: 'Pineapple', price: 80, imageURL: '🍍' },
    { _id: 'sf4', name: 'Fresh Orange', price: 90, imageURL: '🍊' },
    { _id: 'sf5', name: 'Banana Bunch', price: 30, imageURL: '🍌' },
  ],
  'Dairy & Eggs': [
    { _id: 'sd1', name: 'Fresh Whole Milk', price: 60, imageURL: '🥛' },
    { _id: 'sd2', name: 'Farm Eggs', price: 80, imageURL: '🥚' },
    { _id: 'sd3', name: 'Butter', price: 50, imageURL: '🧈' },
    { _id: 'sd4', name: 'Paneer', price: 90, imageURL: '🧀' },
    { _id: 'sd5', name: 'Curd', price: 40, imageURL: '🍶' },
  ],
  Bakery: [
    { _id: 'sb1', name: 'Whole Wheat Bread', price: 45, imageURL: '🍞' },
    { _id: 'sb2', name: 'Croissant', price: 30, imageURL: '🥐' },
    { _id: 'sb3', name: 'Muffin', price: 25, imageURL: '🧁' },
    { _id: 'sb4', name: 'Baguette', price: 50, imageURL: '🥖' },
    { _id: 'sb5', name: 'Cookies', price: 60, imageURL: '🍪' },
  ],
  'Meat & Fish': [
    { _id: 'sm1', name: 'Fresh Chicken', price: 200, imageURL: '🍗' },
    { _id: 'sm2', name: 'Salmon Fillet', price: 350, imageURL: '🐟' },
    { _id: 'sm3', name: 'Prawns', price: 400, imageURL: '🦐' },
    { _id: 'sm4', name: 'Mutton', price: 500, imageURL: '🥩' },
    { _id: 'sm5', name: 'Tuna', price: 300, imageURL: '🐠' },
  ],
  Beverages: [
    { _id: 'sbv1', name: 'Orange Juice', price: 80, imageURL: '🧃' },
    { _id: 'sbv2', name: 'Green Tea', price: 120, imageURL: '🍵' },
    { _id: 'sbv3', name: 'Coconut Water', price: 40, imageURL: '🥥' },
    { _id: 'sbv4', name: 'Lemonade', price: 50, imageURL: '🍋' },
    { _id: 'sbv5', name: 'Mango Smoothie', price: 90, imageURL: '🥤' },
  ],
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all')
  const [activeCategoryName, setActiveCategoryName] = useState(searchParams.get('categoryName') || '')
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(true)
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000)

  const normalizeCategory = (value) =>
    String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

  const staticCatalog = useMemo(
    () =>
      Object.entries(staticProductsByCategory).flatMap(([categoryName, items]) =>
        items.map((item) => ({
          ...item,
          _id: `static-${categoryName}-${item._id}`,
          category: { name: categoryName, _id: 'static' },
          createdAt: '2000-01-01T00:00:00.000Z'
        }))
      ),
    []
  )

  const priceBounds = useMemo(() => {
    const prices = [...products, ...staticCatalog]
      .map((p) => Number(p.price))
      .filter((p) => !Number.isNaN(p))

    if (prices.length === 0) {
      return { min: 0, max: 1000 }
    }

    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    }
  }, [products, staticCatalog])

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

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    setSearch(searchParams.get('q') || '')
    setActiveCategory(searchParams.get('category') || 'all')
    setActiveCategoryName(searchParams.get('categoryName') || '')
  }, [searchParams])

  useEffect(() => {
    setSelectedMaxPrice(priceBounds.max)
  }, [priceBounds.max])

  useEffect(() => {
    let result = [...products]

    // Filter by selected category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category?._id === activeCategory)

      const selectedCategoryName = categories.find((cat) => cat._id === activeCategory)?.name || ''
      const staticFallback = Object.entries(staticProductsByCategory)
        .find(([name]) => normalizeCategory(name) === normalizeCategory(selectedCategoryName))?.[1] || []

      const staticProducts = staticFallback.map((item) => ({
        ...item,
        _id: `static-${selectedCategoryName}-${item._id}`,
        category: { name: selectedCategoryName, _id: 'static' },
        createdAt: '2000-01-01T00:00:00.000Z'
      }))

      result = [...result, ...staticProducts]
    } else if (activeCategoryName) {
      result = result.filter((p) => {
        const categoryName = p.category?.name || ''
        const normalizedProductCategory = normalizeCategory(categoryName)
        const normalizedActiveCategory = normalizeCategory(activeCategoryName)

        return normalizedProductCategory === normalizedActiveCategory ||
          normalizedProductCategory.includes(normalizedActiveCategory) ||
          normalizedActiveCategory.includes(normalizedProductCategory)
      })

      const staticFallback = Object.entries(staticProductsByCategory)
        .find(([name]) => normalizeCategory(name) === normalizeCategory(activeCategoryName))?.[1] || []

      const staticProducts = staticFallback.map((item) => ({
        ...item,
        _id: `static-${activeCategoryName}-${item._id}`,
        category: { name: activeCategoryName, _id: 'static' },
        createdAt: '2000-01-01T00:00:00.000Z'
      }))

      result = [...result, ...staticProducts]
    } else {
      // "All" should show complete catalog: database + homepage category products
      result = [...result, ...staticCatalog]
    }

    // Filter by search
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by selected price range
    result = result.filter((p) => {
      const value = Number(p.price)
      if (Number.isNaN(value)) return false
      return value <= selectedMaxPrice
    })

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    }

    // Prevent duplicates when DB and static catalog share same product names.
    const seen = new Set()
    result = result.filter((item) => {
      const key = item.name?.trim().toLowerCase()
      if (!key) return true
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    setFiltered(result)
  }, [products, categories, staticCatalog, activeCategory, activeCategoryName, sortBy, search, selectedMaxPrice])

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories')
      setCategories(data)
    } catch (err) {
      console.log(err)
    }
  }

  const updateUrlParams = (nextSearch, nextCategory) => {
    const params = {}
    const trimmedSearch = nextSearch.trim()

    if (trimmedSearch) params.q = trimmedSearch
    if (nextCategory && nextCategory !== 'all') {
      if (nextCategory.type === 'id') {
        params.category = nextCategory.value
      } else if (nextCategory.type === 'name') {
        params.categoryName = nextCategory.value
      }
    }

    setSearchParams(params, { replace: true })
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    const selectedCategory = activeCategory !== 'all'
      ? { type: 'id', value: activeCategory }
      : (activeCategoryName ? { type: 'name', value: activeCategoryName } : null)
    updateUrlParams(value, selectedCategory)
  }

  const handleCategoryChange = (nextCategory) => {
    if (!nextCategory || nextCategory.value === 'all') {
      setActiveCategory('all')
      setActiveCategoryName('')
      updateUrlParams(search, null)
      return
    }

    if (nextCategory.type === 'id') {
      setActiveCategory(nextCategory.value)
      setActiveCategoryName('')
    } else {
      setActiveCategory('all')
      setActiveCategoryName(nextCategory.value)
    }

    updateUrlParams(search, nextCategory)
  }

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

  const activeCategoryLabel = useMemo(() => {
    if (activeCategory !== 'all') {
      return mergedCategories.find((cat) => cat.type === 'id' && cat.value === activeCategory)?.label || ''
    }

    return activeCategoryName || ''
  }, [activeCategory, activeCategoryName, mergedCategories])

  const isCustomPriceRange = selectedMaxPrice < priceBounds.max

  const activeFilters = [
    search.trim() ? `Search: ${search.trim()}` : null,
    activeCategoryLabel ? `Category: ${activeCategoryLabel}` : null,
    isCustomPriceRange ? `Price: Up to ₹${selectedMaxPrice}` : null
  ].filter(Boolean)

  const clearAllFilters = () => {
    setSearch('')
    setSortBy('default')
    setActiveCategory('all')
    setActiveCategoryName('')
    setSelectedMaxPrice(priceBounds.max)
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Shop Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Shop All Products</h1>

        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 w-full sm:w-80">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                aria-label="Search products"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
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

          <button
            onClick={clearAllFilters}
            className="w-full lg:w-auto border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-4 p-4 rounded-2xl border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Price</p>
            <p className="text-sm text-gray-500">Up to ₹{selectedMaxPrice}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">₹{priceBounds.min}</span>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={selectedMaxPrice}
              onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <span className="text-xs text-gray-400">₹{priceBounds.max}</span>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filterItem) => (
              <span
                key={filterItem}
                className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-200"
              >
                {filterItem}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row">

        {/* Sidebar Categories */}
        <div className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 lg:min-h-screen p-4 sm:p-6">
          <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              key="all"
              onClick={() => handleCategoryChange({ type: 'all', value: 'all' })}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                activeCategory === 'all' && !activeCategoryName
                  ? 'bg-green-500 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {mergedCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                  (cat.type === 'id' && activeCategory === cat.value) ||
                  (cat.type === 'name' && activeCategoryName.toLowerCase() === cat.value.toLowerCase())
                    ? 'bg-green-500 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((product) => {
                  const categoryName = String(product.category?.name || '').toLowerCase()
                  const isProduce = categoryName.includes('fruit') || categoryName.includes('vegetable')
                  const unit = product.unit || (isProduce ? 'per kg' : 'per unit')
                  return (
                  <ProductCard
                    key={product._id}
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    unit={unit}
                    image={product.imageURL}
                    categoryName={product.category?.name}
                  />
                  )
                })}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Shop
