import {TiTick} from 'react-icons/ti'
import Header from '../Header'
import './index.css'

const PaymentPage = props => {
  const onGotoHomeClicked = () => {
    const {history} = props
    history.replace('/')
  }

  return (
    <>
      <Header />
      <div className="payment-container">
        <TiTick className="tick-container" />
        <h1>Payment Successful</h1>
        <p>Thank you for ordering Your payment is successfully completed</p>

        <button
          type="button"
          className="go-to-home-button"
          onClick={onGotoHomeClicked}
        >
          Go To Home Page
        </button>
      </div>
    </>
  )
}

export default PaymentPage
