import { useState, useEffect } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'
import { defaultProductImagePath, resolveProductImage } from '../utils/productImage'

function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders')
      setOrders(data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  const trackingSteps = ['pending', 'processing', 'shipped', 'delivered']

  const statusLabel = (status) => status.charAt(0).toUpperCase() + status.slice(1)

  const formatTimestamp = (value) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimelineMap = (order) => {
    const map = {}
    const timeline = Array.isArray(order.statusTimeline) ? order.statusTimeline : []

    timeline.forEach((entry) => {
      if (entry?.status && entry?.changedAt && !map[entry.status]) {
        map[entry.status] = entry.changedAt
      }
    })

    if (!map.pending && order.createdAt) {
      map.pending = order.createdAt
    }

    if (!map[order.status] && order.updatedAt && order.status !== 'cancelled') {
      map[order.status] = order.updatedAt
    }

    return map
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400">Loading orders...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <span className="text-6xl mb-4 block"></span>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
          <Link to="/shop" className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {(() => {
                const timelineMap = getTimelineMap(order)
                const currentStepIndex = trackingSteps.indexOf(order.status)
                return (
                  <>

              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabel(order.status)}
                  </span>
                  <p className="font-bold text-green-600 text-lg">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Order Tracking</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {trackingSteps.map((step, index) => {
                    const completed = Boolean(timelineMap[step]) || (currentStepIndex >= index && currentStepIndex !== -1)
                    const timestamp = formatTimestamp(timelineMap[step])

                    return (
                      <div
                        key={step}
                        className={`rounded-xl border px-3 py-3 ${
                          completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <p className={`text-xs font-semibold ${completed ? 'text-green-700' : 'text-gray-500'}`}>
                          {statusLabel(step)}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {timestamp || 'Pending'}
                        </p>
                      </div>
                    )
                  })}
                </div>
                {order.status === 'cancelled' && (
                  <p className="text-xs text-red-500 mt-2">
                    Cancelled on {formatTimestamp(order.updatedAt) || 'N/A'}
                  </p>
                )}
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img
                        src={resolveProductImage(item.product?.name || item.productName, item.product?.imageURL || item.productImage)}
                        alt={item.product?.name || item.productName || 'Product'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.target.src = defaultProductImagePath() }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.product?.name || item.productName || 'Product'}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">₹{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              {order.deliveryAddress && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">
                  <p className="font-medium text-gray-700 mb-1">📍 Delivery Address</p>
                  <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                </div>
              )}
                  </>
                )
              })()}

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
