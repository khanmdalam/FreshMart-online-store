function Policy() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Policy</h1>
      <p className="text-gray-500 mb-8">Please review our key policies before placing an order.</p>

      <div className="space-y-4">
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping Policy</h2>
          <p className="text-gray-600 text-sm leading-6">
            Orders are usually delivered within the promised time slot based on your location and availability.
            Delivery timelines may vary during heavy demand or weather disruptions.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Return & Refund Policy</h2>
          <p className="text-gray-600 text-sm leading-6">
            If an item arrives damaged, missing, or incorrect, contact support within 24 hours of delivery.
            Eligible cases are refunded to the original payment method after verification.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Privacy Policy</h2>
          <p className="text-gray-600 text-sm leading-6">
            We use your data only to process orders, improve experience, and provide support.
            Personal information is never sold to third parties.
          </p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Terms of Service</h2>
          <p className="text-gray-600 text-sm leading-6">
            By using FreshMart, you agree to provide accurate order details and follow platform usage guidelines.
            We reserve the right to cancel suspicious or invalid orders.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Policy
