import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './productCard'

const tabs = ['Fresh Vegetables', 'Fruits', 'Dairy & Eggs', 'Bakery', 'Meat & Fish', 'Beverages']
const productsByTab = {
  'Fresh Vegetables': [
    { _id: 'v1', name: 'Seedless Green Grapes', price: 133, unit: 'per kg', image: '🍇' },
    { _id: 'v2', name: 'Organic Strawberries', price: 133, unit: 'per kg', image: '🍓' },
    { _id: 'v3', name: 'Imported Kiwi', price: 133, unit: 'per kg', image: '🥝' },
    { _id: 'v4', name: 'Sweet Pomegranate', price: 133, unit: 'per kg', image: '🍎' },
    { _id: 'v5', name: 'Rose Papaya', price: 120, unit: 'per kg', image: '🍈' },
  ],
  'Fruits': [
    { _id: 'f1', name: 'Fresh Mango', price: 150, unit: 'per kg', image: '🥭' },
    { _id: 'f2', name: 'Watermelon', price: 40, unit: 'per kg', image: '🍉' },
    { _id: 'f3', name: 'Pineapple', price: 80, unit: 'per piece', image: '🍍' },
    { _id: 'f4', name: 'Fresh Orange', price: 90, unit: 'per kg', image: '🍊' },
  ],
  'Dairy & Eggs': [
    { _id: 'd1', name: 'Fresh Whole Milk', price: 60, unit: 'per litre', image: '🥛' },
    { _id: 'd2', name: 'Farm Eggs', price: 80, unit: 'per dozen', image: '🥚' },
    { _id: 'd3', name: 'Butter', price: 50, unit: 'per 100g', image: '🧈' },
    { _id: 'd4', name: 'Paneer', price: 90, unit: 'per 200g', image: '🧀' },
    { _id: 'd5', name: 'Curd', price: 80, unit: 'per 500g', image: '🍶' },
  ],
  'Bakery': [
    { _id: 'b1', name: 'Whole Wheat Bread', price: 45, unit: 'per loaf', image: '🍞' },
    { _id: 'b2', name: 'Croissant', price: 30, unit: 'per piece', image: '🥐' },
    { _id: 'b3', name: 'Muffin', price: 25, unit: 'per piece', image: '🧁' },
    { _id: 'b4', name: 'Baguette', price: 50, unit: 'per piece', image: '🥖' },
    { _id: 'b5', name: 'Cookies', price: 60, unit: 'per pack', image: '🍪' },
  ],
  'Meat & Fish': [
    { _id: 'm1', name: 'Fresh Chicken', price: 200, unit: 'per kg', image: '🍗' },
    { _id: 'm2', name: 'Salmon Fillet', price: 350, unit: 'per kg', image: '🐟' },
    { _id: 'm3', name: 'Prawns', price: 400, unit: 'per kg', image: '🦐' },
    { _id: 'm4', name: 'Mutton', price: 500, unit: 'per kg', image: '🥩' },
    { _id: 'm5', name: 'Tuna', price: 300, unit: 'per kg', image: '🐠' },
  ],
  'Beverages': [
    { _id: 'bv1', name: 'Orange Juice', price: 80, unit: 'per litre', image: '🧃' },
    { _id: 'bv2', name: 'Green Tea', price: 120, unit: 'per pack', image: '🍵' },
    { _id: 'bv3', name: 'Coconut Water', price: 40, unit: 'per piece', image: '🥥' },
    { _id: 'bv4', name: 'Lemonade', price: 50, unit: 'per litre', image: '🍋' },
    { _id: 'bv5', name: 'Mango Smoothie', price: 90, unit: 'per bottle', image: '🥤' },
  ],
}

function BestSelling() {
  const [activeTab, setActiveTab] = useState('Fresh Vegetables')

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Best Selling Items</h2>
        <Link
          to={`/shop?categoryName=${encodeURIComponent(activeTab)}`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700"
        >
          Show All
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {productsByTab[activeTab].map((product, index) => (
          <ProductCard key={index} {...product} categoryName={activeTab} />
        ))}
      </div>

    </section>
  )
}

export default BestSelling
