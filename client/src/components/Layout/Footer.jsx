function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-10 py-12 mt-8">
      
      <div className="grid grid-cols-4 gap-8 mb-8">
        
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
            <li className="hover:text-green-400 cursor-pointer">Home</li>
            <li className="hover:text-green-400 cursor-pointer">Shop</li>
            <li className="hover:text-green-400 cursor-pointer">Fresh Produce</li>
            <li className="hover:text-green-400 cursor-pointer">Deals</li>
            <li className="hover:text-green-400 cursor-pointer">About Us</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-bold text-lg mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-green-400 cursor-pointer">FAQs</li>
            <li className="hover:text-green-400 cursor-pointer">Shipping Policy</li>
            <li className="hover:text-green-400 cursor-pointer">Return Policy</li>
            <li className="hover:text-green-400 cursor-pointer">Track Order</li>
            <li className="hover:text-green-400 cursor-pointer">Help & Support</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📧 support@freshmart.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 Mumbai, Maharashtra, India</li>
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
      <div className="border-t border-gray-700 pt-6 flex items-center justify-between text-gray-400 text-sm">
        <p>© 2026 FreshMart. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-green-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-green-400 cursor-pointer">Terms of Service</span>
        </div>
      </div>

    </footer>
  )
}

export default Footer