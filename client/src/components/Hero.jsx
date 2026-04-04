function Hero() {
  return (
    <section className="relative w-full h-96 rounded-2xl mx-auto mt-4 px-10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #22723a 0%, #0d5c28 100%)' }}>

      {/* Left Content */}
      <div className="absolute left-16 top-1/2 -translate-y-1/2 text-white max-w-xs">
        <p className="text-sm mb-2 opacity-80"></p>
        <button className="flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-2 rounded-full mt-4 hover:bg-green-50">
          Shop Now →
        </button>
      </div>

      {/* Big Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-8xl font-black text-white opacity-90 tracking-tight">
          FreshMart
        </h1>
      </div>

      {/* Right Card */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-lg text-center w-36">
        <div className="text-4xl mb-2">🥬</div>
        <p className="font-semibold text-sm text-gray-700">Fresh Vegetables</p>
        <p className="text-green-600 font-bold mt-1">₹20</p>
      </div>

      {/* Delivery Badge */}
      <div className="absolute top-6 right-52 bg-green-400 text-white text-xs px-3 py-1 rounded-full rotate-12">
       Delivery in 15 Minutes
      </div>

    </section>
  )
}

export default Hero