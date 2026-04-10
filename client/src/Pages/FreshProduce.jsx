import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import ProductCard from '../components/products/productCard'

const fallbackProduce = {
  vegetables: [
    { _id: 'fpv1', name: 'Organic Spinach', price: 35, imageURL: '🥬' },
    { _id: 'fpv2', name: 'Fresh Broccoli', price: 60, imageURL: '🥦' },
    { _id: 'fpv3', name: 'Red Bell Pepper', price: 85, imageURL: '🫑' },
    { _id: 'fpv4', name: 'Carrot Bunch', price: 40, imageURL: '🥕' },
    { _id: 'fpv5', name: 'Tomatoes', price: 30, imageURL: '🍅' },
  ],
  fruits: [
    { _id: 'fpf1', name: 'Fresh Apple', price: 120, imageURL: '🍎' },
    { _id: 'fpf2', name: 'Banana', price: 45, imageURL: '🍌' },
    { _id: 'fpf3', name: 'Orange', price: 90, imageURL: '🍊' },
    { _id: 'fpf4', name: 'Pomegranate', price: 140, imageURL: '🍎' },
    { _id: 'fpf5', name: 'Watermelon', price: 50, imageURL: '🍉' },
  ]
}

function FreshProduce() {
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('vegetables')
  const [loading, setLoading] = useState(true)

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

  const produce = useMemo(() => {
    const vegetables = products.filter((p) => {
      const category = (p.category?.name || '').toLowerCase()
      return category.includes('vegetable')
    })

    const fruits = products.filter((p) => {
      const category = (p.category?.name || '').toLowerCase()
      return category.includes('fruit')
    })

    const mappedVegetables = vegetables.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      unit: p.unit || 'per kg',
      image: p.imageURL
    }))

    const mappedFruits = fruits.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      unit: p.unit || 'per kg',
      image: p.imageURL
    }))

    return {
      vegetables: mappedVegetables.length > 0
        ? mappedVegetables
        : fallbackProduce.vegetables.map((p) => ({ ...p, image: p.imageURL, unit: 'per kg' })),
      fruits: mappedFruits.length > 0
        ? mappedFruits
        : fallbackProduce.fruits.map((p) => ({ ...p, image: p.imageURL, unit: 'per kg' }))
    }
  }, [products])

  const currentItems = activeTab === 'vegetables' ? produce.vegetables : produce.fruits

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <div
        className="relative rounded-2xl p-8 mb-8 text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #22723a 0%, #0d5c28 100%)' }}
      >
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        <div className="relative z-10">
          <p className="text-sm font-semibold mb-2 text-green-50">Farm To Door</p>
          <h1 className="text-3xl font-bold mb-2 text-white">Fresh Produce</h1>
          <p className="text-sm text-green-50">Handpicked fruits and vegetables delivered fresh every day.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('vegetables')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === 'vegetables'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Vegetables
          </button>
          <button
            onClick={() => setActiveTab('fruits')}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === 'fruits'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            Fruits
          </button>
        </div>

        <Link
          to={`/shop?categoryName=${encodeURIComponent(activeTab === 'vegetables' ? 'Fresh Vegetables' : 'Fruits')}`}
          className="w-full sm:w-auto text-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Show All In Shop
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 text-gray-500">Loading fresh produce...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentItems.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              unit={product.unit}
              image={product.image}
              categoryName={activeTab === 'vegetables' ? 'Fresh Vegetables' : 'Fruits'}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FreshProduce
