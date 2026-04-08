function About() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">About FreshMart</h1>
      <p className="text-gray-600 max-w-3xl leading-7 mb-6">
        FreshMart is your neighborhood online grocery store built for fast delivery, fair pricing,
        and dependable quality. We bring fruits, vegetables, dairy, bakery, and daily essentials
        from trusted sources to your doorstep.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Our Promise</h2>
          <p className="text-sm text-gray-600 leading-6">
            Fresh products, transparent pricing, and safe checkout every time you shop.
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Fast Delivery</h2>
          <p className="text-sm text-gray-600 leading-6">
            Smart routing and local inventory help us deliver quickly and reliably.
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-2">Customer First</h2>
          <p className="text-sm text-gray-600 leading-6">
            Our support team is available to resolve issues and keep your orders smooth.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
