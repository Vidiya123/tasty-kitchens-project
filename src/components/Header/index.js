import {withRouter} from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Cookies from 'js-cookie'

import RestaurantContext from '../../context/RestaurantContext'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Header = props => {
  const onLoggedOutClicked = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const renderCartItemsCount = () => (
    <RestaurantContext.Consumer>
      {value => {
        const {cartList} = value
        return <span className="cart-count-badge">{cartList.length}</span>
      }}
    </RestaurantContext.Consumer>
  )
  return (
    <Navbar expand="sm" className="nav-bar-header mb-5" fixed="top">
      <Container width="100%" bg="secondary">
        <Navbar.Brand href="/" className="nav-bar-logo-container">
          <img
            src="https://i.postimg.cc/XNZMm0J3/Frame-274-1.jpg"
            alt="website logo"
            className="nav-bar-logo"
          />
          <h1 className="tasty-kitchen-heading">Tasty Kitchens</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="menu-items-card" bg="light">
            <Nav className="m-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/cart">
                Cart
                {renderCartItemsCount()}
              </Nav.Link>
              <button
                onClick={onLoggedOutClicked}
                className="log-out-button"
                type="button"
              >
                Log Out
              </button>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default withRouter(Header)
