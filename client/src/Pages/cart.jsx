import { useCart } from '../context/useCart'
import { Link } from 'react-router-dom'

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, cartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <span className="text-8xl mb-4">🛒</span>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some fresh groceries to get started</p>
        <Link to="/" className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600">
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart 🛒</h1>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Cart Items */}
        <div className="col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
              
              {/* Image */}
              <span className="text-5xl">{item.image}</span>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-400">{item.unit}</p>
                <p className="text-green-600 font-bold mt-1">₹{item.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-2">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="text-green-600 font-bold text-lg hover:text-green-800"
                >
                  −
                </button>
                <span className="font-semibold text-green-700 w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item._id)}
                  className="text-green-600 font-bold text-lg hover:text-green-800"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <p className="font-bold text-gray-800 w-20 text-right">₹{item.price * item.quantity}</p>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-600 text-xl ml-2"
              >
                ✕
              </button>

            </div>
          ))}

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="text-red-400 hover:text-red-600 text-sm underline"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-500">FREE</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-xl font-semibold transition-colors"
          >
            Proceed to Checkout →
          </Link>

          <Link
            to="/"
            className="block w-full text-center text-gray-400 hover:text-green-600 text-sm mt-3"
          >
            Continue Shopping
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Cart
