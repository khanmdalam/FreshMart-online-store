const categories = [
  { name: 'Fresh Vegetables', count: 23, emoji: '🥬' },
  { name: 'Fruits', count: 18, emoji: '🍎' },
  { name: 'Dairy & Eggs', count: 8, emoji: '🥛' },
  { name: 'Bakery', count: 12, emoji: '🍞' },
  { name: 'Meat & Fish', count: 9, emoji: '🥩' },
  { name: 'Beverages', count: 15, emoji: '🧃' },
]

function Categories() {
  return (
    <section className="px-10 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Popular Categories</h2>
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700">
          Show All
        </button>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-6 gap-4">
        {categories.map((cat, index) => (
          <div key={index}
            className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer hover:-translate-y-1 transition-all border border-gray-100">
            <div className="text-5xl mb-3">{cat.emoji}</div>
            <p className="font-semibold text-sm text-gray-800 text-center">{cat.name}</p>
            <p className="text-xs text-gray-400 mt-1">{cat.count} Products</p>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Categories