import { useState, useEffect } from 'react'
import API from '../../services/api'
import { Link } from 'react-router-dom'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders')
      setOrders(data)
    } catch (err) {
      console.log(err)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status })
      fetchOrders()
    } catch (err) {
      console.log(err)
    }
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Admin Navbar */}
      <div className="bg-gray-900 text-white px-10 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-400">🛒 FreshMart Admin</h1>
        <div className="flex gap-6 text-sm">
          <Link to="/admin/dashboard" className="hover:text-green-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-green-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-green-400">Orders</Link>
          <Link to="/" className="hover:text-green-400">← Back to Store</Link>
        </div>
      </div>

      <div className="px-10 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Manage Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <p>Customer: <span className="font-medium text-gray-800">{order.user?.name || 'N/A'}</span></p>
                    <p>Items: <span className="font-medium text-gray-800">{order.items?.length}</span></p>
                  </div>
                  <p className="font-bold text-green-600 text-lg">₹{order.totalAmount}</p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
