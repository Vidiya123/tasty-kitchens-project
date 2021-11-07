import {Route, Switch, Redirect} from 'react-router-dom'
import {Component} from 'react'
import LoginFile from './components/LoginFile'
import ProtectedRoute from './components/ProtectedRoute'
import DetailedRestaurant from './components/DetailedRestaurant'
import Cart from './components/Cart'
import Home from './components/Home'
import RestaurantContext from './context/RestaurantContext'
import PaymentPage from './components/PaymentPage'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  updateCartList = data => {
    localStorage.setItem('cartData', JSON.stringify(data))
    this.setState({cartList: data})
  }

  decreaseCartItem = id => {
    const localData = localStorage.getItem('cartData')
    const parsedValidData = JSON.parse(localData)

    const updatedData = parsedValidData.map(item => {
      if (item.id === id) {
        const modifiedCart = item
        if (modifiedCart.quantity >= 1) {
          modifiedCart.quantity = item.quantity - 1
          return modifiedCart
        }
      }
      return item
    })
    const filteredList = updatedData.filter(item => item.quantity > 0)
    localStorage.setItem('cartData', JSON.stringify(filteredList))
    this.setState({cartList: filteredList})
  }

  increaseCartItem = id => {
    const localData = localStorage.getItem('cartData')
    const parsedValidData = JSON.parse(localData)

    const updatedData = parsedValidData.map(item => {
      if (item.id === id) {
        const modifiedCart = item
        modifiedCart.quantity = item.quantity + 1
        return modifiedCart
      }
      return item
    })

    localStorage.setItem('cartData', JSON.stringify(updatedData))
    this.setState({cartList: updatedData})
  }

  deleteCartItem = id => {
    const localData = localStorage.getItem('cartData')
    const parsedLocalData = JSON.parse(localData)
    const deleteItemIndex = parsedLocalData.findIndex(item => item.id === id)
    parsedLocalData.splice(deleteItemIndex, 1)

    localStorage.setItem('cartData', JSON.stringify(parsedLocalData))
    this.setState({cartList: parsedLocalData})
  }

  render() {
    const localData = localStorage.getItem('cartData')
    if (localData === null) {
      localStorage.setItem('cartData', JSON.stringify([]))
    }

    const updatedLocalData = localStorage.getItem('cartData')
    const parsedValidData = JSON.parse(updatedLocalData)

    return (
      <RestaurantContext.Provider
        value={{
          cartList: parsedValidData,
          updateCartList: this.updateCartList,
          decreaseCartItem: this.decreaseCartItem,
          increaseCartItem: this.increaseCartItem,
          deleteCartItem: this.deleteCartItem,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginFile} />
          <ProtectedRoute exact path="/" component={Home} />

          <ProtectedRoute
            exact
            path="/restaurant/:id"
            component={DetailedRestaurant}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <ProtectedRoute exact path="/payment" component={PaymentPage} />
          <ProtectedRoute exact path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </RestaurantContext.Provider>
    )
  }
}

export default App
