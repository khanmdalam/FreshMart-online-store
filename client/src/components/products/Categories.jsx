import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../services/api'
import {
  defaultProductImagePath,
  productImageAssetPath,
  productItemImagePath
} from '../../utils/productImage'

const fallbackCategories = [
  { name: 'Fresh Vegetables', image: productImageAssetPath('vegetables.webp') },
  { name: 'Fruits', image: productImageAssetPath('fruits.webp') },
  { name: 'Dairy & Eggs', image: productImageAssetPath('dairy.webp') },
  { name: 'Bakery', image: productImageAssetPath('bakery.webp') },
  { name: 'Meat & Fish', image: productImageAssetPath('meat-fish.webp') },
  { name: 'Beverages', image: productImageAssetPath('beverages.webp') },
  
]

const fallbackCountByCategory = {
  'freshvegetables': 5,
  'fruits': 5,
  'dairyeggs': 5,
  'bakery': 5,
  'meatfish': 5,
  'beverages': 5,
}

const normalizeCategory = (value) =>
  String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const isCigaretteCategory = (normalizedName) =>
  /(cig|ciger|smok)/.test(String(normalizedName || ''))

const categoryImageByNormalizedName = {
  freshvegetables: productImageAssetPath('vegetables.webp'),
  fruits: productImageAssetPath('fruits.webp'),
  dairyeggs: productImageAssetPath('dairy.webp'),
  bakery: productImageAssetPath('bakery.webp'),
  meatfish: productImageAssetPath('meat-fish.webp'),
  beverages: productImageAssetPath('beverages.webp'),
  cigarette: productItemImagePath('cigeratte.webp'),
  cigarettes: productItemImagePath('cigeratte.webp'),
  cigeratte: productItemImagePath('cigeratte.webp'),
  cigeratee: productItemImagePath('cigeratte.webp'),
}

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
    const productCountByNormalizedName = products.reduce((acc, product) => {
      const normalizedName = normalizeCategory(product.category?.name)
      if (!normalizedName) return acc
      acc[normalizedName] = (acc[normalizedName] || 0) + 1
      return acc
    }, {})

    const fallbackMap = new Map(
      fallbackCategories.map((item) => [normalizeCategory(item.name), item])
    )

    const dbMapped = dbCategories.map((cat) => {
      const normalizedName = normalizeCategory(cat.name)
      const fallback = fallbackMap.get(normalizedName)
      const dbCount = productCountByNormalizedName[normalizedName] || 0
      const fallbackCount = fallbackCountByCategory[normalizedName] || 0
      const mappedCategoryImage = isCigaretteCategory(normalizedName)
        ? productItemImagePath('cigeratte.webp')
        : categoryImageByNormalizedName[normalizedName]
      const dbCategoryImage = typeof cat.image === 'string' ? cat.image.trim() : ''
      const forceMapped = isCigaretteCategory(normalizedName)
      const image = forceMapped
        ? (mappedCategoryImage || dbCategoryImage || fallback?.image || defaultProductImagePath())
        : (dbCategoryImage || mappedCategoryImage || fallback?.image || defaultProductImagePath())

      return {
        key: cat._id,
        name: cat.name,
        image,
        count: dbCount + fallbackCount,
        to: `/shop?category=${cat._id}`
      }
    })

    const existingNames = new Set(dbMapped.map((item) => normalizeCategory(item.name)))
    const fallbackOnly = fallbackCategories
      .filter((item) => !existingNames.has(normalizeCategory(item.name)))
      .map((item) => ({
        key: item.name,
        name: item.name,
        image: item.image,
        count: (productCountByNormalizedName[normalizeCategory(item.name)] || 0) +
          (fallbackCountByCategory[normalizeCategory(item.name)] || 0),
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
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                onError={(e) => { e.target.src = defaultProductImagePath() }}
              />
            </div>
            <p className="font-semibold text-sm text-gray-800 text-center">{cat.name}</p>
            <p className="text-xs text-gray-400 mt-1">{cat.count} Products</p>
          </Link>
        ))}
      </div>

    </section>
  )
}

export default Categories
