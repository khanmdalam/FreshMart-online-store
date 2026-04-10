import { useEffect, useMemo, useState } from 'react'
import API from '../../services/api'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [activeDetail, setActiveDetail] = useState('orders')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products'),
          API.get('/users')
        ])

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : [])
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : [])
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : [])
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const productMap = useMemo(() => {
    const map = new Map()
    products.forEach((product) => {
      map.set(String(product._id), product)
    })
    return map
  }, [products])

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0)
    const pendingOrders = orders.filter((order) => order.status === 'pending').length
    const deliveredOrders = orders.filter((order) => order.status === 'delivered').length
    const paidRevenue = orders
      .filter((order) => order.paymentStatus === 'paid')
      .reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0)
    const lowStockProducts = products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 5).length

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: users.length,
      totalProducts: products.length,
      pendingOrders,
      deliveredOrders,
      paidRevenue,
      lowStockProducts
    }
  }, [orders, products, users])

  const revenueByCategory = useMemo(() => {
    const bucket = new Map()

    orders.forEach((order) => {
      ;(order.items || []).forEach((item) => {
        const amount = (Number(item.price) || 0) * (Number(item.quantity) || 0)
        const productId = item.product?._id ? String(item.product._id) : (item.product ? String(item.product) : '')
        const product = productMap.get(productId)
        const categoryName = product?.category?.name || 'Uncategorized'

        bucket.set(categoryName, (bucket.get(categoryName) || 0) + amount)
      })
    })

    return [...bucket.entries()]
      .map(([categoryName, revenue]) => ({ categoryName, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [orders, productMap])

  const revenueByPayment = useMemo(() => {
    const statuses = ['paid', 'pending', 'failed']
    return statuses.map((status) => ({
      status,
      revenue: orders
        .filter((order) => order.paymentStatus === status)
        .reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0),
      count: orders.filter((order) => order.paymentStatus === status).length
    }))
  }, [orders])

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [users]
  )

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [products]
  )

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-bold text-green-400">🛒 FreshMart Admin</h1>
        <div className="flex flex-wrap gap-4 sm:gap-6 text-sm">
          <Link to="/admin/dashboard" className="hover:text-green-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-green-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-green-400">Orders</Link>
          <Link to="/" className="hover:text-green-400">← Back to Store</Link>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => setActiveDetail('orders')}
            className={`text-left bg-white rounded-2xl p-6 shadow-sm border transition-colors ${
              activeDetail === 'orders' ? 'border-green-400 bg-green-50/40' : 'border-gray-100 hover:border-green-200'
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            <p className="text-xs mt-2 text-gray-500">
              <span className="text-amber-600 font-semibold">{stats.pendingOrders}</span> pending •{' '}
              <span className="text-green-600 font-semibold">{stats.deliveredOrders}</span> delivered
            </p>
          </button>

          <button
            onClick={() => setActiveDetail('revenue')}
            className={`text-left bg-white rounded-2xl p-6 shadow-sm border transition-colors ${
              activeDetail === 'revenue' ? 'border-green-400 bg-green-50/40' : 'border-gray-100 hover:border-green-200'
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
            <p className="text-xs mt-2 text-gray-500">
              Paid revenue: <span className="text-green-600 font-semibold">₹{stats.paidRevenue}</span>
            </p>
          </button>

          <button
            onClick={() => setActiveDetail('users')}
            className={`text-left bg-white rounded-2xl p-6 shadow-sm border transition-colors ${
              activeDetail === 'users' ? 'border-green-400 bg-green-50/40' : 'border-gray-100 hover:border-green-200'
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            <p className="text-xs mt-2 text-gray-500">Click to view all user names</p>
          </button>

          <button
            onClick={() => setActiveDetail('products')}
            className={`text-left bg-white rounded-2xl p-6 shadow-sm border transition-colors ${
              activeDetail === 'products' ? 'border-green-400 bg-green-50/40' : 'border-gray-100 hover:border-green-200'
            }`}
          >
            <p className="text-gray-500 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            <p className="text-xs mt-2 text-gray-500">
              Low stock (≤5): <span className="text-red-500 font-semibold">{stats.lowStockProducts}</span>
            </p>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {loading ? (
            <p className="text-gray-500">Loading dashboard details...</p>
          ) : activeDetail === 'orders' ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Order Details</h3>
              {sortedOrders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Order ID</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Items</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Payment</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedOrders.map((order) => (
                        <tr key={order._id} className="border-b last:border-b-0 text-gray-700">
                          <td className="py-3 pr-4 font-medium">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="py-3 pr-4">{order.user?.name || 'N/A'}</td>
                          <td className="py-3 pr-4">{order.items?.length || 0}</td>
                          <td className="py-3 pr-4 capitalize">{order.status}</td>
                          <td className="py-3 pr-4 capitalize">{order.paymentStatus}</td>
                          <td className="py-3 pr-4 font-semibold text-green-700">₹{order.totalAmount}</td>
                          <td className="py-3 pr-4">{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : activeDetail === 'revenue' ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Revenue Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Revenue By Payment Status</h4>
                  <div className="space-y-2">
                    {revenueByPayment.map((row) => (
                      <div key={row.status} className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-3">
                        <span className="capitalize text-gray-700">{row.status} ({row.count} orders)</span>
                        <span className="font-semibold text-green-700">₹{row.revenue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Revenue By Category</h4>
                  <div className="space-y-2 max-h-80 overflow-auto pr-1">
                    {revenueByCategory.length === 0 ? (
                      <p className="text-sm text-gray-500">No category-level revenue yet.</p>
                    ) : (
                      revenueByCategory.map((row) => (
                        <div key={row.categoryName} className="flex items-center justify-between text-sm border border-gray-100 rounded-xl px-4 py-3">
                          <span className="text-gray-700">{row.categoryName}</span>
                          <span className="font-semibold text-green-700">₹{Math.round(row.revenue)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : activeDetail === 'users' ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">All User Details</h3>
              {sortedUsers.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Joined On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.map((user) => (
                        <tr key={user._id} className="border-b last:border-b-0 text-gray-700">
                          <td className="py-3 pr-4 font-medium">{user.name}</td>
                          <td className="py-3 pr-4">{user.email}</td>
                          <td className="py-3 pr-4 capitalize">{user.role}</td>
                          <td className="py-3 pr-4">{new Date(user.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">All Product Details</h3>
              {sortedProducts.length === 0 ? (
                <p className="text-gray-500">No products found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4">Product</th>
                        <th className="py-2 pr-4">Category</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Stock</th>
                        <th className="py-2 pr-4">Created On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.map((product) => (
                        <tr key={product._id} className="border-b last:border-b-0 text-gray-700">
                          <td className="py-3 pr-4 font-medium">{product.name}</td>
                          <td className="py-3 pr-4">{product.category?.name || 'General'}</td>
                          <td className="py-3 pr-4 font-semibold text-green-700">₹{product.price}</td>
                          <td className="py-3 pr-4">
                            <span className={Number(product.stock) <= 5 ? 'text-red-500 font-semibold' : 'text-gray-700'}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 pr-4">{new Date(product.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link to="/admin/products" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Products</h3>
            <p className="text-gray-400 text-sm">Add, edit or delete products from your store</p>
          </Link>
          <Link to="/admin/orders" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="text-4xl mb-3">🧾</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Orders</h3>
            <p className="text-gray-400 text-sm">View and update delivery status of orders</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
