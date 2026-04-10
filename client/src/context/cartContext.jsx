import { createContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id)
      if (exists) {
        return prev.map((item) =>
          item._id === product._id
            ? {
              ...item,
              quantity: item.quantity + 1,
              price: Math.min(Number(item.price) || 0, Number(product.price) || 0) || item.price
            }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id))
  }

  // Increase quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  // Decrease quantity
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
    )
  }

  // Total items count
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Total price
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // Clear cart
  const clearCart = () => setCartItems([])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      increaseQty,
      decreaseQty,
      cartCount,
      cartTotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export { CartContext }
