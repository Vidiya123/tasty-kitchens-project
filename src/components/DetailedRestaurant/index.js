import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {BsFilterRight, BsFillStarFill} from 'react-icons/bs'
import {FcSearch} from 'react-icons/fc'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import RestaurantContext from '../../context/RestaurantContext'
import NotFound from '../NotFound'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
}
const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest Price',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest Price',
    value: 'Lowest',
  },
]

class DetailedRestaurant extends Component {
  state = {
    isLoading: apiStatus.initial,
    restaurantData: [],
    foodItemsList: [],
    searchInput: '',
    activeOptionId: sortByOptions[0].value,
  }

  componentDidMount() {
    this.getRestaurantsList()
  }

  onChangeSortBy = event => {
    this.setState({activeOptionId: event.target.value}, this.getRestaurantsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getRestaurantsList)
  }

  onSuccess = (data, foodItems) => {
    this.setState({
      restaurantData: data,
      foodItemsList: foodItems,
      isLoading: apiStatus.success,
    })
  }

  restaurantCard = card => {
    const {imageUrl, id, rating, name, cost} = card

    return (
      <li key={id} className="restaurant-card" testid="foodItem">
        <div className="restaurant-item">
          <img src={imageUrl} alt={name} className="restaurant-card-image" />
          <div className="restaurant-description-card">
            <h1 className="restaurant-card-heading">{name}</h1>
            <p className="restaurant-card-food-type">{cost}.00</p>
            <div className="rating-card-main">
              <BsFillStarFill className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
            {this.getAddOrSubtractCard(id)}
          </div>
        </div>
      </li>
    )
  }

  getRestaurantTopSection = () => {
    const {restaurantData} = this.state
    const {
      costForTwo,
      imageUrl,
      location,
      rating,
      name,
      cuisine,
      reviewsCount,
    } = restaurantData
    return (
      <div className="detailed-restaurant-top-section">
        <img
          src={imageUrl}
          alt="restaurant"
          className="detailed-restaurant-top-section-image"
        />
        <div className="detailed-restaurant-top-section-data-container">
          <h1 className="detailed-restaurant-top-header">{name}</h1>
          <p className="separate-restaurant-type">{cuisine}</p>
          <p className="location">{location}</p>
          <div className="card-3">
            <div className="detailed-rating-card-2">
              <div className="detailed-rating-card-1">
                <BsFillStarFill className="rating-icon" />
                <p className="rating">{rating}</p>
              </div>
              <p className="reviews">{`${reviewsCount}+ Ratings`}</p>
            </div>
            <div className="vertical-line">.</div>
            <div className="detailed-rating-card-2">
              <p className="rating">{costForTwo}</p>
              <p className="reviews">Cost for Two</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  successView = () => {
    const {foodItemsList} = this.state

    return (
      <ul className="restaurant-container">
        {foodItemsList.map(card => this.restaurantCard(card))}
      </ul>
    )
  }

  getAddOrSubtractCard = id => (
    <RestaurantContext.Consumer>
      {value => {
        const {foodItemsList} = this.state
        const currentItemIndex = foodItemsList.findIndex(item => item.id === id)

        const {quantity, showAddButton} = foodItemsList[currentItemIndex]

        const addNow = event => {
          const addId = event.target.value
          const {updateCartList, cartList} = value
          const currentAddItemIndex = foodItemsList.findIndex(
            item => item.id === addId,
          )

          const CurrentItem = foodItemsList[currentAddItemIndex]

          const itemAlreadyInCartIndex = cartList.findIndex(
            item => item.id === addId,
          )

          if (itemAlreadyInCartIndex === -1) {
            if (CurrentItem.quantity > 0) {
              updateCartList([...cartList, CurrentItem])
            }
          } else {
            const updatedList = cartList
            if (CurrentItem.quantity > 0) {
              updatedList[itemAlreadyInCartIndex].quantity =
                CurrentItem.quantity
            } else {
              updatedList.splice(itemAlreadyInCartIndex, 1)
            }

            updateCartList(updatedList)
          }
        }

        const addButtonClicked = event => {
          const addButtonId = event.target.value

          const currentAddButtonIndex = foodItemsList.findIndex(
            item => item.id === addButtonId,
          )

          foodItemsList[currentAddButtonIndex].showAddButton = false
          foodItemsList[currentAddButtonIndex].quantity += 1
          this.setState({foodItemsList}, addNow(event))
        }

        const onIncreaseItemCount = event => {
          const incId = event.target.value
          const currentIncItemIndex = foodItemsList.findIndex(
            item => item.id === incId,
          )
          foodItemsList[currentIncItemIndex].quantity += 1

          this.setState({foodItemsList}, addNow(event))
        }

        const onDecreaseItemCount = event => {
          const DecId = event.target.value

          const currentDecItemIndex = foodItemsList.findIndex(
            item => item.id === DecId,
          )
          // let newItem = foodItemsList

          if (foodItemsList[currentItemIndex].quantity === 1) {
            foodItemsList[currentDecItemIndex].quantity = 0
            foodItemsList[currentItemIndex].showAddButton = true
          } else if (foodItemsList[currentDecItemIndex].quantity > 1) {
            foodItemsList[currentDecItemIndex].quantity -= 1
            foodItemsList[currentItemIndex].showAddButton = false
          }

          this.setState({foodItemsList}, addNow(event))
        }

        return (
          <>
            {showAddButton ? (
              <button
                type="submit"
                value={id}
                className="add-button"
                onClick={addButtonClicked}
              >
                Add
              </button>
            ) : (
              <div className="pagination-card-main">
                <button
                  testid="decrement-count"
                  type="button"
                  onClick={onDecreaseItemCount}
                  value={id}
                >
                  -
                </button>
                <button
                  type="button"
                  testid="active-count"
                  className="quantity-button"
                >
                  {quantity}
                </button>
                <button
                  testid="increment-count"
                  type="button"
                  onClick={onIncreaseItemCount}
                  value={id}
                >
                  +
                </button>
              </div>
            )}
          </>
        )
      }}
    </RestaurantContext.Consumer>
  )

  getRestaurantsList = async () => {
    const {searchInput, activeOptionId} = this.state
    const {match} = this.props
    const {params} = match
    const {id} = params

    const restaurantListUrl = `https://apis.ccbp.in/restaurants-list/${id}`

    const token = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(restaurantListUrl, options)

    if (response.ok) {
      const data = await response.json()

      const formattedRestaurantData = {
        costForTwo: data.cost_for_two,
        id: data.id,
        cuisine: data.cuisine,
        imageUrl: data.image_url,
        location: data.location,
        name: data.name,
        rating: data.rating,
        reviewsCount: data.reviews_count,
      }

      const foodItems = data.food_items.map(item => ({
        cost: item.cost,
        foodType: item.food_type,
        id: item.id,
        imageUrl: item.image_url,
        name: item.name,
        rating: item.rating,
        showAddButton: true,
        quantity: 0,
      }))

      const filterRestaurantList = foodItems.filter(item =>
        item.name.toUpperCase().includes(searchInput.toUpperCase()),
      )

      if (activeOptionId === 'Highest') {
        filterRestaurantList.sort((a, b) => b.cost - a.cost)
      } else {
        filterRestaurantList.sort((a, b) => a.cost - b.cost)
      }

      this.onSuccess(formattedRestaurantData, filterRestaurantList)
    } else {
      this.setState({isLoading: apiStatus.fail})
    }
  }

  loaderView = () => (
    <div
      className="products-loader-container restaurant-container"
      testid="restaurant-details-loader"
    >
      <Loader type="Oval" height="50" width="50" className="loader" />
    </div>
  )

  failureView = () => <NotFound />

  renderRestaurant = () => {
    const {isLoading} = this.state
    if (isLoading === apiStatus.initial) {
      return this.loaderView()
    }
    if (isLoading === apiStatus.success) {
      return this.successView()
    }
    return this.failureView()
  }

  render() {
    const {searchInput, activeOptionId} = this.state

    return (
      <div className="home-container">
        <Header />
        {this.getRestaurantTopSection()}
        <div>
          <div className="user-input-section">
            <div className="input-box">
              <input
                className="input-field"
                type="text"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <FcSearch className="filter-right-icon" />
            </div>
            <div className="filter-container">
              <BsFilterRight className="filter-right-icon" />
              <select value={activeOptionId} onChange={this.onChangeSortBy}>
                {sortByOptions.map(eachOption => (
                  <option
                    key={eachOption.id}
                    value={eachOption.value}
                    className="filter-options"
                  >
                    {eachOption.displayText}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {this.renderRestaurant()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default withRouter(DetailedRestaurant)
