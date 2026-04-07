import { createContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext()
const STORAGE_KEY = 'freshmart_wishlist'

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setWishlistItems(JSON.parse(stored))
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id)
      if (exists) return prev

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit || 'per unit',
          image: product.image || product.imageURL || ''
        }
      ]
    })
  }

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id))
  }

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id)
      if (exists) {
        return prev.filter((item) => item._id !== product._id)
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          unit: product.unit || 'per unit',
          image: product.image || product.imageURL || ''
        }
      ]
    })
  }

  const isLoved = (id) => wishlistItems.some((item) => item._id === id)

  const value = useMemo(() => ({
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isLoved,
    lovedCount: wishlistItems.length
  }), [wishlistItems])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export { WishlistContext }
