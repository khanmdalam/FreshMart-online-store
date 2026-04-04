import Hero from "../components/Hero"
import Categories from "../components/products/Categories"
import FreshPicks from "../components/products/freshPicks"
import BestSelling from "../components/products/BestSelling"

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      <Categories />
      <FreshPicks />
      <BestSelling />
    </div>
  )
}

export default Home
