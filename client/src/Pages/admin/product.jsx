import { useState, useEffect } from 'react'
import API from '../../services/api'
import { Link } from 'react-router-dom'
import { defaultProductImagePath } from '../../utils/productImage'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [catLoading, setCatLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    imageURL: '',
    description: '',
    category: ''
  })
  const [catForm, setCatForm] = useState({
    name: '',
    image: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [catError, setCatError] = useState('')
  const [catSuccess, setCatSuccess] = useState('')
  const [showCatForm, setShowCatForm] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products')
      setProducts(data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories')
      setCategories(data)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCatChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await API.post('/products', form)
      setSuccess('Product added successfully!')
      setForm({ name: '', price: '', stock: '', imageURL: '', description: '', category: '' })
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleAddCategory = async () => {
    setCatError('')
    setCatSuccess('')
    setCatLoading(true)
    try {
      await API.post('/categories', catForm)
      setCatSuccess('Category added!')
      setCatForm({ name: '', image: '', description: '' })
      fetchCategories()
    } catch (err) {
      setCatError(err.response?.data?.message || 'Something went wrong')
    }
    setCatLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Admin Navbar */}
      <div className="bg-gray-900 text-white px-10 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-400">🛒 FreshMart Admin</h1>
        <div className="flex gap-6 text-sm">
          <Link to="/admin" className="hover:text-green-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-green-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-green-400">Orders</Link>
          <Link to="/" className="hover:text-green-400">← Back to Store</Link>
        </div>
      </div>

      <div className="px-10 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Manage Products</h2>

        <div className="grid grid-cols-3 gap-8">

          {/* Left Column — Forms */}
          <div className="space-y-6">

            {/* Add Product Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Product</h3>

              {error && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
              {success && <div className="bg-green-50 text-green-500 text-sm px-4 py-3 rounded-xl mb-4">{success}</div>}

              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price (₹)"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
                <input
                  type="text"
                  name="imageURL"
                  placeholder="Image URL"
                  value={form.imageURL}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />

                {/* Category Dropdown */}
                <div className="flex gap-2">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 text-gray-600"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowCatForm(!showCatForm)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    + New
                  </button>
                </div>

                <textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                />
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : '+ Add Product'}
                </button>
              </div>
            </div>

            {/* Add Category Form */}
            {showCatForm && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Category</h3>

                {catError && <div className="bg-red-50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">{catError}</div>}
                {catSuccess && <div className="bg-green-50 text-green-500 text-sm px-4 py-3 rounded-xl mb-4">{catSuccess}</div>}

                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={catForm.name}
                    onChange={handleCatChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  />
                  <input
                    type="text"
                    name="image"
                    placeholder="Category Image URL"
                    value={catForm.image}
                    onChange={handleCatChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  />
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={catForm.description}
                    onChange={handleCatChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400"
                  />
                  <button
                    onClick={handleAddCategory}
                    disabled={catLoading}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {catLoading ? 'Adding...' : '+ Add Category'}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Products List */}
          <div className="col-span-2">
            <div className="space-y-3">
              {products.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
                  No products yet. Add your first product!
                </div>
              ) : (
                products.map((product) => (
                  <div key={product._id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={product.imageURL}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = defaultProductImagePath() }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-400">{product.description}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-green-600 font-bold text-sm">₹{product.price}</span>
                        <span className="text-gray-400 text-sm">Stock: {product.stock}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Products
