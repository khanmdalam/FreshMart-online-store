import { Link } from 'react-router-dom'
import ProductCard from './productCard'

const products = [
  { _id: 1, name: 'Organic Red Tomatoes', price: 40, unit: 'per kg', image: '' },
  { _id: 2, name: 'Farm Eggs', price: 80, unit: 'per dozen', image: '' },
  { _id: 4, name: 'Fresh Whole Milk', price: 60, unit: 'per litre', image: '' },
  { _id: 5, name: 'Premium Basmati Rice', price: 120, unit: 'per kg', image: '' },
]

function FreshPicks() {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Fresh Picks</h2>
        <Link
          to="/shop"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
        >
          Show All
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>

    </section>
  )
}

export default FreshPicks
