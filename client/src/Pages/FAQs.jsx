const faqItems = [
  {
    q: 'How can I place an order?',
    a: 'Browse products, add items to cart, proceed to checkout, complete payment, and your order will appear in My Orders.'
  },
  {
    q: 'How do I track my order?',
    a: 'Open My Orders from the navbar to view current status like pending, processing, shipped, or delivered.'
  },
  {
    q: 'Can I cancel an order?',
    a: 'Please contact support as soon as possible. Cancellation depends on the current processing stage.'
  },
  {
    q: 'What payment options are supported?',
    a: 'FreshMart supports Razorpay-enabled online payments.'
  },
  {
    q: 'What if I receive damaged or wrong products?',
    a: 'Report it within 24 hours through Help & Support so our team can verify and assist with replacement or refund.'
  }
]

function FAQs() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">FAQs</h1>
      <p className="text-gray-500 mb-8">Answers to common questions from FreshMart customers.</p>

      <div className="space-y-4">
        {faqItems.map((item) => (
          <div key={item.q} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{item.q}</h2>
            <p className="text-sm text-gray-600 leading-6">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQs
