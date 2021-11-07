import RestaurantContext from '../../context/RestaurantContext'
import NoCartItems from '../NoCartItems'
import Header from '../Header'
import CartItem from '../CartItem'
import './index.css'

const Cart = props => (
  <RestaurantContext.Consumer>
    {value => {
      const {cartList} = value
      const cartItemsCount = cartList.length

      const getTotalBill = () => {
        let sum = 0
        cartList.map(item => {
          sum += item.quantity * item.cost

          return null
        })

        return sum
      }

      const placeOrderClicked = () => {
        const {history} = props
        history.replace('/payment')
      }

      return (
        <>
          <Header />
          {cartItemsCount === 0 ? (
            <NoCartItems />
          ) : (
            <div className="cart-container">
              <div className="cart-header">
                <h1 className="cart-header-items-heading">Item</h1>
                <h1 className="cart-header-items-heading">Quantity</h1>
                <h1 className="cart-header-items-heading">Price</h1>
              </div>

              <ul className="cart-items-container">
                {cartList.map(cartItemData => (
                  <CartItem cartItemData={cartItemData} key={cartItemData.id} />
                ))}
              </ul>
              <div className="dashed-line">.</div>
              <div className="billing-card">
                <div className="billing">
                  <h1 className="billing-heading">Order Total:</h1>
                  <p testid="total-price" className="billing-heading">
                    ₹ {getTotalBill()}.00
                  </p>
                </div>

                <button
                  type="button"
                  className="place-order-button"
                  onClick={placeOrderClicked}
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </>
      )
    }}
  </RestaurantContext.Consumer>
)

export default Cart
