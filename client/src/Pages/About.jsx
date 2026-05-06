// function About() {
//   return (
//     <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-3">About FreshMart</h1>
//       <p className="text-gray-600 max-w-3xl leading-7 mb-6">
//         FreshMart is your neighborhood online grocery store built for fast delivery, fair pricing,
//         and dependable quality. We bring fruits, vegetables, dairy, bakery, and daily essentials
//         from trusted sources to your doorstep.
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-2">Our Promise</h2>
//           <p className="text-sm text-gray-600 leading-6">
//             Fresh products, transparent pricing, and safe checkout every time you shop.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-2">Fast Delivery</h2>
//           <p className="text-sm text-gray-600 leading-6">
//             Smart routing and local inventory help us deliver quickly and reliably.
//           </p>
//         </div>
//         <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
//           <h2 className="font-semibold text-gray-800 mb-2">Customer First</h2>
//           <p className="text-sm text-gray-600 leading-6">
//             Our support team is available to resolve issues and keep your orders smooth.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default About




import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-6 md:px-16 overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">

      {/* Background Effects */}
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-green-300 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
          About <span className="text-green-600">FreshMart</span>
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
          FreshMart brings farm-fresh groceries, daily essentials, and quality products 
          right to your doorstep. Built for speed, convenience, and trust — we redefine 
          the way you shop online.
        </p>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">

          <div className="backdrop-blur-lg bg-white/70 dark:bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Quality You Trust
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Carefully selected fresh products with transparent pricing and safe checkout.
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 dark:bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Fast Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smart logistics ensures groceries reach you quickly and reliably.
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 dark:bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Customer First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We prioritize your experience with dedicated support and smooth service.
            </p>
          </div>

        </div>

        {/* ✅ Fixed Button */}
        <button
          onClick={() => navigate("/shop")}
          className="mt-12 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          Start Shopping
        </button>

      </div>
    </section>
  );
}

export default About;