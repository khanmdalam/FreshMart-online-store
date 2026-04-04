import { Link } from 'react-router-dom'

function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <span className="text-8xl mb-4">🎉</span>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h2>
      <p className="text-gray-400 mb-8">Your fresh groceries are on their way</p>
      <Link to="/" className="bg-green-500 text-white px-8 py-3 rounded-xl hover:bg-green-600 font-semibold">
        Continue Shopping
      </Link>
    </div>
  )
}

export default OrderSuccess