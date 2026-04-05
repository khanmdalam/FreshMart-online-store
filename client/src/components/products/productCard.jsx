import { useCart } from "../../context/useCart"
import { useNavigate } from 'react-router-dom'

function ProductCard({ _id, name, price, unit, image }) {
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart()
  const navigate = useNavigate()

  const cartItem = cartItems.find((item) => item._id === _id)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ _id, name, price, unit, image })
  }

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer group"
    >

      {/* Image */}
      <div className="flex items-center justify-center h-32 mb-3">
        <span className="text-6xl group-hover:scale-110 transition-transform">{image}</span>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-400 mb-1">Local Farmers</p>
      <p className="font-semibold text-gray-800 text-sm">{name}</p>
      <p className="text-green-600 font-bold mt-1">₹{price} <span className="text-gray-400 font-normal text-xs">{unit}</span></p>

      {/* Add to Cart / Quantity Control */}
      {!cartItem ? (
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-xl transition-colors"
        >
          + Add to Cart
        </button>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between mt-3 bg-green-50 rounded-xl px-3 py-1"
        >
          <button
            onClick={() => decreaseQty(_id)}
            className="text-green-600 font-bold text-lg hover:text-green-800"
          >
            −
          </button>
          <span className="font-semibold text-green-700">{cartItem.quantity}</span>
          <button
            onClick={() => increaseQty(_id)}
            className="text-green-600 font-bold text-lg hover:text-green-800"
          >
            +
          </button>
        </div>
      )}

    </div>
  )
}

export default ProductCard