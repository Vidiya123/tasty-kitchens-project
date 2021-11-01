import {Component} from 'react'

import {withRouter} from 'react-router-dom'
import {BsFilterRight, BsFillStarFill} from 'react-icons/bs'
import {FcSearch} from 'react-icons/fc'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import RestaurantContext from '../../context/RestaurantContext'
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

  onSuccess = data => {
    this.setState({restaurantData: data, isLoading: apiStatus.success})
  }

  restaurantCard = card => {
    const {imageUrl, id, rating, name, cost} = card

    return (
      <li key={id} className="restaurant-card" testid="foodItem">
        <div className="restaurant-item">
          <img src={imageUrl} alt={name} className="restaurant-card-image" />
          <div className="restaurant-description-card">
            <h1 className="restaurant-card-heading">{name}</h1>
            <p className="restaurant-card-food-type">{`${cost}.00`}</p>
            <div className="rating-card">
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
    const {restaurantData} = this.state
    const {foodItems} = restaurantData

    return (
      <ul className="restaurant-container">
        {foodItems.map(card => this.restaurantCard(card))}
      </ul>
    )
  }

  getAddOrSubtractCard = id => (
    <RestaurantContext.Consumer>
      {value => {
        const {restaurantData} = this.state
        const {foodItems} = restaurantData
        const currentItemIndex = foodItems.findIndex(item => item.id === id)

        const {quantity, showAddButton} = foodItems[currentItemIndex]

        const addNow = event => {
          const addId = event.target.value
          const {updateCartList, cartList} = value
          const currentAddItemIndex = foodItems.findIndex(
            item => item.id === addId,
          )
          const CurrentItem = foodItems[currentAddItemIndex]

          delete CurrentItem.showAddButton
          delete CurrentItem.foodType
          delete CurrentItem.rating

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

          const currentAddButtonIndex = foodItems.findIndex(
            item => item.id === addButtonId,
          )

          foodItems[currentAddButtonIndex].showAddButton = false
          foodItems[currentAddButtonIndex].quantity += 1
          restaurantData.foodItems = foodItems
          this.setState({restaurantData}, addNow(event))
        }

        const onIncreaseItemCount = event => {
          const incId = event.target.value
          const currentIncItemIndex = foodItems.findIndex(
            item => item.id === incId,
          )
          foodItems[currentIncItemIndex].quantity += 1
          restaurantData.foodItems = foodItems
          this.setState({restaurantData}, addNow(event))
        }

        const onDecreaseItemCount = event => {
          const DecId = event.target.value

          const currentDecItemIndex = foodItems.findIndex(
            item => item.id === DecId,
          )

          if (foodItems[currentItemIndex].quantity === 1) {
            foodItems[currentDecItemIndex].quantity = 0
            foodItems[currentItemIndex].showAddButton = true
          } else if (foodItems[currentDecItemIndex].quantity > 1) {
            foodItems[currentDecItemIndex].quantity -= 1
          }

          restaurantData.foodItems = foodItems

          this.setState({restaurantData}, addNow(event))
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
              <div className="pagination-card">
                <button
                  type="button"
                  onClick={onDecreaseItemCount}
                  value={id}
                  testid="decrement-count"
                >
                  -
                </button>
                <p testid="active-count">{quantity}</p>
                <button
                  type="button"
                  onClick={onIncreaseItemCount}
                  value={id}
                  testid="increment-count"
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

      const formattedData = {
        costForTwo: data.cost_for_two,
        id: data.id,
        imageUrl: data.image_url,
        location: data.location,
        name: data.name,
        rating: data.rating,
        reviewsCount: data.reviews_count,

        foodItems: data.food_items.map(item => ({
          cost: item.cost,
          foodType: item.food_type,
          id: item.id,
          imageUrl: item.image_url,
          name: item.name,
          rating: item.rating,
          showAddButton: true,
          quantity: 0,
        })),
      }
      const filterRestaurantList = formattedData.foodItems.filter(item =>
        item.name.toUpperCase().includes(searchInput.toUpperCase()),
      )

      if (activeOptionId === 'Highest') {
        filterRestaurantList.sort((a, b) => b.cost - a.cost)
      } else {
        filterRestaurantList.sort((a, b) => a.cost - b.cost)
      }

      formattedData.foodItems = filterRestaurantList

      this.onSuccess(formattedData)
    } else {
      this.setState({isLoading: apiStatus.fail})
    }
  }

  loaderView = () => (
    <div className="products-loader-container restaurant-container">
      <Loader
        testid="restaurant-details-loader"
        type="TailSpin"
        height="50"
        width="50"
        className="loader"
      />
    </div>
  )

  failureView = () => <h1>Retry</h1>

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
