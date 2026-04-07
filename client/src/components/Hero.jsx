function Hero() {
  return (
    <section className="relative w-full min-h-[18rem] sm:h-80 lg:h-96 rounded-2xl mx-auto mt-4 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #22723a 0%, #0d5c28 100%)' }}>

      {/* Left Content */}
      <div className="relative z-20 text-white max-w-[11rem] sm:max-w-xs lg:absolute lg:left-16 lg:top-1/2 lg:-translate-y-1/2">
        <p className="text-sm mb-2 opacity-80"></p>
        <button className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 sm:px-6 py-2 rounded-full mt-2 sm:mt-4 text-sm sm:text-base hover:bg-green-50">
          Shop Now →
        </button>
      </div>

      {/* Big Text */}
      <div className="relative z-10 flex items-center justify-center mt-6 sm:mt-8 lg:mt-0 lg:absolute lg:inset-0">
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white opacity-90 tracking-tight leading-none">
          FreshMart
        </h1>
      </div>

      {/* Right Card */}
      <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 lg:right-16 lg:top-1/2 lg:-translate-y-1/2 bg-white rounded-2xl p-3 sm:p-4 shadow-lg text-center w-28 sm:w-36 z-20">
        <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">🥬</div>
        <p className="font-semibold text-xs sm:text-sm text-gray-700">Fresh Vegetables</p>
        <p className="text-green-600 font-bold mt-1 text-sm sm:text-base">₹20</p>
      </div>

      {/* Delivery Badge */}
      <div className="hidden sm:block absolute top-4 lg:top-6 right-24 lg:right-52 bg-green-400 text-white text-xs px-3 py-1 rounded-full rotate-12 z-20">
       Delivery in 15 Minutes
      </div>

    </section>
  )
}

export default Hero
