import { useCart } from "../../context/useCart"
import { useWishlist } from '../../context/useWishlist'
import { useNavigate } from 'react-router-dom'
import { defaultProductImagePath, resolveProductImage } from '../../utils/productImage'

const normalizeName = (value) => String(value || '').trim().toLowerCase()

function ProductCard({ _id, name, price, unit, image, categoryName, stock, description }) {
  const { addToCart, cartItems, increaseQty, decreaseQty } = useCart()
  const { toggleWishlist, isLoved } = useWishlist()
  const navigate = useNavigate()

  const cartItem = cartItems.find((item) => item._id === _id || normalizeName(item.name) === normalizeName(name))
  const cartItemId = cartItem?._id || _id
  const loved = isLoved(_id)
  const resolvedImage = resolveProductImage(name, image)
  const stockValue = Number(stock)
  const hasStock = Number.isFinite(stockValue)
  const isOutOfStock = hasStock && stockValue <= 0
  const reachedStockLimit = hasStock && cartItem && cartItem.quantity >= stockValue
  const normalizedCategory = String(categoryName || '').toLowerCase()
  const isLocalFarmCategory = normalizedCategory.includes('vegetable') || normalizedCategory.includes('fruit')
  const sourceLabel = isLocalFarmCategory ? 'Local Farmers' : 'FreshMart Quality'

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (isOutOfStock) return
    addToCart({
      _id,
      name,
      price,
      unit,
      image: resolvedImage,
      ...(hasStock ? { stock: stockValue } : {})
    })
  }

  return (
    <div
      onClick={() => navigate(`/product/${_id}`, {
        state: {
          productSnapshot: {
            _id,
            name,
            price,
            unit,
            imageURL: resolvedImage,
            ...(hasStock ? { stock: stockValue } : {}),
            description: description || 'Fresh and quality product from FreshMart.'
          }
        }
      })}
      className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer group"
    >
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleWishlist({ _id, name, price, unit, image: resolvedImage })
          }}
          className={`text-lg sm:text-xl transition-colors min-w-9 min-h-9 flex items-center justify-center ${loved ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
          aria-label={loved ? 'Remove from loved' : 'Add to loved'}
        >
          ♥
        </button>
      </div>

      {/* Image */}
      <div className="flex items-center justify-center h-28 sm:h-32 mb-2.5 sm:mb-3 overflow-hidden rounded-xl">
        <img
          src={resolvedImage}
          alt={name}
          className="w-full h-28 sm:h-32 object-cover rounded-xl group-hover:scale-110 transition-transform"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = defaultProductImagePath() }}
        />
      </div>

      {/* Info */}
      <p className="text-[11px] sm:text-xs text-gray-400 mb-1">{sourceLabel}</p>
      <p className="font-semibold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">{name}</p>
      <p className="text-green-600 font-bold mt-1 text-sm sm:text-base">₹{price} <span className="text-gray-400 font-normal text-[11px] sm:text-xs">{unit}</span></p>

      {/* Add to Cart / Quantity Control */}
      {!cartItem ? (
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full mt-2.5 sm:mt-3 bg-green-500 hover:bg-green-600 text-white text-sm py-2.5 rounded-xl transition-colors min-h-10 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between mt-2.5 sm:mt-3 bg-green-50 rounded-xl px-3 py-1.5 min-h-10"
        >
          <button
            onClick={() => decreaseQty(cartItemId)}
            className="text-green-600 font-bold text-lg hover:text-green-800 min-w-9 min-h-9"
            aria-label={`Decrease quantity for ${name}`}
          >
            −
          </button>
          <span className="font-semibold text-green-700">{cartItem.quantity}</span>
          <button
            onClick={() => increaseQty(cartItemId)}
            disabled={reachedStockLimit}
            className="text-green-600 font-bold text-lg hover:text-green-800 min-w-9 min-h-9 disabled:text-gray-300 disabled:cursor-not-allowed"
            aria-label={`Increase quantity for ${name}`}
          >
            +
          </button>
        </div>
      )}

    </div>
  )
}

export default ProductCard
