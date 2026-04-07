function HelpSupport() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Help & Support</h1>
      <p className="text-gray-500 mb-8">Need help with an order, payment, or account? We are here for you.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Support</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>📧 Email: support@freshmart.com</p>
            <p>📞 Phone: +91 8294224590</p>
            <p>🕒 Hours: 8:00 AM - 10:00 PM (IST)</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">What To Include In Your Message</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Order ID (if available)</li>
            <li>Issue details (wrong/missing item, payment issue, delay, etc.)</li>
            <li>Screenshots or photos for faster resolution</li>
          </ul>
        </section>
      </div>

      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Response Time</h2>
        <p className="text-sm text-gray-600 leading-6">
          Most requests are answered within a few hours. During peak times, please allow up to 24 hours.
        </p>
      </section>
    </div>
  )
}

export default HelpSupport
