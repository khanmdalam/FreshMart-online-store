import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 lg:px-10 py-12 mt-8">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-3">🛒 FreshMart</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Shop from thousands of farm-fresh fruits, vegetables, dairy and daily essentials at unbeatable prices.
          </p>
          <div className="flex gap-3 mt-4">
            <span className="bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-green-500 transition-colors">📘</span>
            <span className="bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-green-500 transition-colors">📸</span>
            <span className="bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-green-500 transition-colors">🐦</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-green-400">Home</Link></li>
            <li><Link to="/shop" className="hover:text-green-400">Shop</Link></li>
            <li><Link to="/fresh" className="hover:text-green-400">Fresh Produce</Link></li>
            <li><Link to="/deals" className="hover:text-green-400">Deals</Link></li>
            <li><Link to="/about" className="hover:text-green-400">About Us</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-bold text-lg mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link to="/faqs" className="hover:text-green-400">FAQs</Link></li>
            <li><Link to="/policy" className="hover:text-green-400">Shipping Policy</Link></li>
            <li><Link to="/policy" className="hover:text-green-400">Return Policy</Link></li>
            <li className="hover:text-green-400 cursor-pointer">Track Order</li>
            <li><Link to="/help" className="hover:text-green-400">Help & Support</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📧 support@freshmart.com</li>
            <li>📞 +91 8294224590</li>
            <li>📍Greater Noida, Uttar Pradesh</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Download App</p>
            <div className="flex gap-2">
              <span className="bg-gray-700 px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-green-500 transition-colors">🍎 App Store</span>
              <span className="bg-gray-700 px-3 py-1 rounded-lg text-xs cursor-pointer hover:bg-green-500 transition-colors">🤖 Play Store</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-gray-400 text-sm">
        <p>© 2026 FreshMart. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/policy" className="hover:text-green-400">Privacy Policy</Link>
          <Link to="/policy" className="hover:text-green-400">Terms of Service</Link>
        </div>
      </div>

    </footer>
  )
}

export default Footer
