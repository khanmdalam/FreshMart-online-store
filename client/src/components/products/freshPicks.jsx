import ProductCard from './productCard'

const products = [
  { _id: 1, name: 'Organic Red Tomatoes', price: 40, unit: 'per kg', image: '🍅' },
  { _id: 2, name: 'Farm Eggs', price: 80, unit: 'per dozen', image: '🥚' },
  { _id: 3, name: 'Fresh Bananas', price: 30, unit: 'per kg', image: '🍌' },
  { _id: 4, name: 'Fresh Whole Milk', price: 60, unit: 'per litre', image: '🥛' },
  { _id: 5, name: 'Premium Basmati Rice', price: 120, unit: 'per kg', image: '🌾' },
]

function FreshPicks() {
  return (
    <section className="px-10 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Fresh Picks</h2>
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700">
          Show All
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-5 gap-4">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>

    </section>
  )
}

export default FreshPicks
