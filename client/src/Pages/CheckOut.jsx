import { useState } from 'react'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { resolveProductImage } from '../utils/productImage'

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    if (!address.street || !address.city || !address.state || !address.pincode) {
      setError('Please fill in all address fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1 — Create Razorpay order from backend
      const { data } = await API.post('/payment/create-order', {
        amount: cartTotal
      })

      // Step 2 — Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'FreshMart',
        description: 'Fresh Groceries Order',
        order_id: data.id,
        handler: async (response) => {
          try {
            // Step 3 — Verify payment
            const { data: verifyData } = await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verifyData.success) {
              // Step 4 — Save order in database after payment verification
              await API.post('/orders', {
                items: cartItems.map((item) => ({
                  product: item._id,
                  quantity: item.quantity,
                  price: item.price,
                  name: item.name,
                  image: resolveProductImage(item.name, item.image)
                })),
                deliveryAddress: address
              })

              clearCart()
              navigate('/order-success')
            } else {
              setError('Payment verification failed')
            }
          } catch (error) {
            setError(error.response?.data?.message || 'Payment succeeded but order could not be saved')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#22c55e'
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-xl">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Address Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Address</h2>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
                <input
                  type="text"
                  name="street"
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={address.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">State</label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Maharashtra"
                    value={address.state}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="400001"
                  value={address.pincode}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-gray-800 mb-6">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay →'}
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default Checkout
