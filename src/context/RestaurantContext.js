import React from 'react'

const RestaurantContext = React.createContext({
  cartList: [],
  updateCartList: () => {},
  deleteCartItem: () => {},
  decreaseCartItem: () => {},
  increaseCartItem: () => {},
})

export default RestaurantContext
