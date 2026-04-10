function Hero() {
  return (
    <section className="w-full mt-3 sm:mt-4 px-3 sm:px-6 lg:px-10">
      <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden h-[12.5rem] sm:h-auto">
        <img
          src="/hero/target-hero-cropped.webp"
          alt="FreshMart hero banner"
          className="w-full h-full sm:h-auto object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  )
}

export default Hero
