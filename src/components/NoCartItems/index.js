import {withRouter} from 'react-router-dom'
import './index.css'

const NoCartItems = props => {
  const onOrderNowClicked = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <div className="no-cart-container">
      <div className="no-cart-card">
        <img
          alt="empty cart"
          src="https://i.ibb.co/c8zPZms/cooking-1.jpg"
          className="no-cart-image"
        />
        <h1 className="no-cart-heading">No Orders Yet!</h1>
        <p className="no-cart-para">
          Your cart is empty. Add something from the menu.
        </p>
        <button
          type="button"
          className="order-now-button"
          onClick={onOrderNowClicked}
        >
          Order Now
        </button>
      </div>
    </div>
  )
}

export default withRouter(NoCartItems)
