import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Login from './Pages/Login'
import Cart from './Pages/cart'
import OrderSuccess from './Pages/OrderSuccess'
import Checkout from './Pages/CheckOut'
import { useAuth } from './context/useAuth'
import Dashboard from './Pages/admin/Dashboard'
import Products from './Pages/admin/product'
import Orders from './Pages/admin/Order'
import Shop from './Pages/Shop'
import ProductDetail from './Pages/ProductDetail'
import Profile from './Pages/Profile'
import OrderHistory from './Pages/OrderHistory'
import Deals from './Pages/Deals'
import FreshProduce from './Pages/FreshProduce'
import Wishlist from './Pages/Wishlist'
import Policy from './Pages/Policy'
import FAQs from './Pages/FAQs'
import HelpSupport from './Pages/HelpSupport'
import About from './Pages/About'

const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />
  }
  return children
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/fresh" element={<FreshProduce />} />
        <Route path="/about" element={<About />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        <Route path="/admin/dashboard" element={<Navigate to="/admin" />} />
        <Route path="/admin/products" element={
          <AdminRoute>
            <Products />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <Orders />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
