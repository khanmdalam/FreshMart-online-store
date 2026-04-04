import { useState, useEffect } from 'react'
import API from '../../services/api'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          API.get('/orders'),
          API.get('/products')
        ])

        const orders = ordersRes.data
        const products = productsRes.data

        const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)

        setStats({
          totalOrders: orders.length,
          totalRevenue: revenue,
          totalUsers: 0,
          totalProducts: products.length
        })
      } catch (err) {
        console.log(err)
      }
    }

    fetchStats()
  }, [])
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
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            <p className="text-green-500 text-xs mt-2">↑ All time</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</p>
            <p className="text-green-500 text-xs mt-2">↑ All time</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            <p className="text-green-500 text-xs mt-2">↑ Registered</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-sm mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            <p className="text-green-500 text-xs mt-2">↑ In store</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-6">
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
