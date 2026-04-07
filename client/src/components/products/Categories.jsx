import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../services/api'

const fallbackCategories = [
  { name: 'Fresh Vegetables', emoji: '🥬' },
  { name: 'Fruits', emoji: '🍎' },
  { name: 'Dairy & Eggs', emoji: '🥛' },
  { name: 'Bakery', emoji: '🍞' },
  { name: 'Meat & Fish', emoji: '🥩' },
  { name: 'Beverages', emoji: '🧃' },
]

function Categories() {
  const [dbCategories, setDbCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products')
        ])
        setDbCategories(categoriesRes.data)
        setProducts(productsRes.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const categories = useMemo(() => {
    const productCountByName = products.reduce((acc, product) => {
      const categoryName = product.category?.name || ''
      if (!categoryName) return acc
      acc[categoryName] = (acc[categoryName] || 0) + 1
      return acc
    }, {})

    const fallbackMap = new Map(fallbackCategories.map((item) => [item.name.toLowerCase(), item]))

    const dbMapped = dbCategories.map((cat) => {
      const fallback = fallbackMap.get(cat.name.toLowerCase())
      return {
        key: cat._id,
        name: cat.name,
        emoji: fallback?.emoji || '📦',
        count: productCountByName[cat.name] || 0,
        to: `/shop?category=${cat._id}`
      }
    })

    const existingNames = new Set(dbMapped.map((item) => item.name.toLowerCase()))
    const fallbackOnly = fallbackCategories
      .filter((item) => !existingNames.has(item.name.toLowerCase()))
      .map((item) => ({
        key: item.name,
        name: item.name,
        emoji: item.emoji,
        count: productCountByName[item.name] || 0,
        to: `/shop?categoryName=${encodeURIComponent(item.name)}`
      }))

    return [...dbMapped, ...fallbackOnly]
  }, [dbCategories, products])

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
        <Link
          to="/shop"
          className="w-full sm:w-auto text-center flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
        >
          Show All
        </Link>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            to={cat.to}
            key={cat.key}
            className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1 transition-all border border-gray-100">
            <div className="text-5xl mb-3">{cat.emoji}</div>
            <p className="font-semibold text-sm text-gray-800 text-center">{cat.name}</p>
            <p className="text-xs text-gray-400 mt-1">{cat.count} Products</p>
          </Link>
        ))}
      </div>

    </section>
  )
}

export default Categories
