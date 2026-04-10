import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import API from '../services/api'
import Hero from '../components/Hero'
import ProductCard from '../components/products/productCard'

const Categories = lazy(() => import('../components/products/Categories'))
const FreshPicks = lazy(() => import('../components/products/freshPicks'))
const BestSelling = lazy(() => import('../components/products/BestSelling'))

function Home() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const query = (searchParams.get('q') || '').trim().toLowerCase()

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

  const visibleProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (!query) return sorted.slice(0, 10)

    return sorted.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query)
      const categoryMatch = product.category?.name?.toLowerCase().includes(query)
      return nameMatch || categoryMatch
    })
  }, [products, query])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      <Suspense fallback={<div className="px-4 sm:px-6 lg:px-10 py-6 text-sm text-gray-400">Loading sections...</div>}>
        <Categories />
        <FreshPicks />
        <BestSelling />
      </Suspense>

      <section className="px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {query ? `Search Results for "${searchParams.get('q')}"` : 'Latest Added Products'}
          </h2>
          <Link
            to="/shop"
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
          >
            Open Shop
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-gray-500">
            Loading products...
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-gray-500">
            No products found for this search.
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {query ? `${visibleProducts.length} products found` : 'Newest products from admin dashboard'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visibleProducts.map((product) => {
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
      </section>
    </div>
  )
}

export default Home
