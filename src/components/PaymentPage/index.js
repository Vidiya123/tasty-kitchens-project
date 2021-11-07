import {Link} from 'react-router-dom'
import {TiTick} from 'react-icons/ti'
import Header from '../Header'
import './index.css'

const PaymentPage = () => (
  <>
    <Header />
    <div className="payment-container">
      <TiTick className="tick-container" />
      <h1>Payment Successful</h1>
      <p>Thank you for ordering Your payment is successfully completed.</p>
      <Link to="/" style={{textDecoration: 'none'}}>
        <button type="button" className="go-to-home-button">
          Go To Home Page
        </button>
      </Link>
    </div>
  </>
)

export default PaymentPage
