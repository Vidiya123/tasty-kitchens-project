import RestaurantContext from '../../context/RestaurantContext'

import './index.css'

const CartItem = props => (
  <RestaurantContext.Consumer>
    {value => {
      const {decreaseCartItem, increaseCartItem, deleteCartItem} = value
      const {cartItemData} = props
      const {imageUrl, id, name, cost, quantity} = cartItemData

      const onDecrement = event => {
        decreaseCartItem(event.target.value)
      }

      const onIncrement = event => {
        increaseCartItem(event.target.value)
      }

      const onCanceledItem = event => {
        deleteCartItem(event.target.value)
      }
      return (
        <li key={id}>
          <div className="cart-card" testid="cartItem">
            <div className="cart-image-container">
              <img src={imageUrl} alt={name} className="cart-image" />
              <h1 className="cart-heading-lg">{name}</h1>
            </div>
            <div className="cart-data-1">
              <h1 className="cart-heading-sm">{name}</h1>
              <div className="pagination-card-1">
                <button
                  type="button"
                  onClick={onDecrement}
                  value={id}
                  testid="decrement-quantity"
                >
                  -
                </button>
                <p className="count-display" testid="item-quantity">
                  {quantity}
                </p>
                <button
                  type="button"
                  onClick={onIncrement}
                  value={id}
                  testid="increment-quantity"
                >
                  +
                </button>
              </div>
              <p className="price-container" testid="total-price">
                ₹ {cost * quantity}.00
              </p>
              <button
                type="button"
                onClick={onCanceledItem}
                value={id}
                className="cancel-button cancel-icon"
              >
                X
              </button>
            </div>
          </div>
        </li>
      )
    }}
  </RestaurantContext.Consumer>
)

export default CartItem
