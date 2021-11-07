import {withRouter, Link} from 'react-router-dom'
import './index.css'

const NoCartItems = () => (
  <div className="no-cart-container">
    <div className="no-cart-card">
      <img
        alt="empty cart"
        src="https://i.ibb.co/c8zPZms/cooking-1.jpg"
        className="no-cart-image"
      />
      <h1 className="no-cart-heading">No Order Yet!</h1>
      <p className="no-cart-para">
        Your cart is empty. Add something from the menu.
      </p>
      <Link to="/" style={{textDecoration: 'none'}}>
        {' '}
        <button type="button" className="order-now-button">
          Order Now
        </button>
      </Link>
    </div>
  </div>
)

export default withRouter(NoCartItems)
