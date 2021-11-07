import {Component} from 'react'
import Slider from 'react-slick'
import {Link, withRouter, Redirect} from 'react-router-dom'
import {BsFilterRight, BsFillStarFill} from 'react-icons/bs'
import {FcSearch} from 'react-icons/fc'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

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
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

class Home extends Component {
  state = {
    activeOptionId: sortByOptions[1].value,
    searchInput: '',
    activePage: 1,
    isLoading: apiStatus.initial,
    restaurantList: [],
    isLoadingCarousal: apiStatus.initial,
    carouserList: [],
  }

  componentDidMount() {
    this.getRestaurantsList()
    this.fetchCarouselList()
  }

  /*  carousal functions start */

  onSuccessCarousal = data => {
    this.setState({
      carouserList: data,
      isLoadingCarousal: apiStatus.success,
    })
  }

  onFailCarousal = () => {
    this.setState({isLoadingCarousal: apiStatus.fail})
  }

  fetchCarouselList = async () => {
    const token = Cookies.get('jwt_token')

    const carouselUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(carouselUrl, options)
    if (response.ok) {
      const data = await response.json()

      const {offers} = data

      const carouselList = offers.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
      }))

      this.onSuccessCarousal(carouselList)
    } else {
      this.onFailCarousal()
    }
  }

  carousalLoaderView = () => (
    <div className="loader-container" testid="restaurants-offers-loader">
      <Loader type="TailSpin" color="#F7931E" height="50" width="50" />
    </div>
  )

  carousalSuccessView = () => {
    const {carouserList} = this.state
    const settings = {
      dots: true,
      infinite: true,
      speed: 2000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
    }
    return (
      <Slider {...settings}>
        {carouserList.map(item => (
          <li key={item.id}>
            <img src={item.imageUrl} alt="offer" className="carousel-image" />
          </li>
        ))}
      </Slider>
    )
  }

  carousalFailedView = () => <h1>Retry</h1>

  getCarouselCard = () => {
    const {isLoadingCarousal} = this.state

    if (isLoadingCarousal === apiStatus.initial) {
      return this.carousalLoaderView()
    }
    if (isLoadingCarousal === apiStatus.success) {
      return this.carousalSuccessView()
    }
    return this.carousalFailedView()
  }

  /* carousal functions end */

  onChangeSortBy = event => {
    this.setState({activeOptionId: event.target.value}, this.getRestaurantsList)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getRestaurantsList)
  }

  onSuccess = data => {
    this.setState({restaurantList: data, isLoading: apiStatus.success})
  }

  restaurantCard = card => {
    const {imageUrl, id, rating, name, totalReviews, cuisine} = card

    return (
      <li key={id} className="restaurant-card" testid="restaurant-item">
        <Link to={`/restaurant/${id}`} className="linking">
          <div className="restaurant-item">
            <img
              src={imageUrl}
              alt="restaurant"
              className="restaurant-card-image"
            />
            <div className="restaurant-description-card">
              <h1 className="restaurant-card-heading">{name}</h1>
              <p className="restaurant-card-food-type">{cuisine}</p>
              <div className="rating-card">
                <BsFillStarFill className="rating-icon" />
                <p className="rating-number">{rating}</p>
                <h1 className="total-review-number">({totalReviews} rating)</h1>
              </div>
            </div>
          </div>
        </Link>
      </li>
    )
  }

  successView = () => {
    const {restaurantList} = this.state

    return (
      <ul className="restaurant-container">
        {restaurantList.map(card => this.restaurantCard(card))}
      </ul>
    )
  }

  getRestaurantsList = async () => {
    const {
      activePage = 1,
      activeOptionId = sortByOptions[1].value,
      searchInput = '',
    } = this.state

    const offset = (activePage - 1) * 9
    const restaurantListUrl = `https://apis.ccbp.in/restaurants-list?sort_by_rating=${activeOptionId}&offset=${offset}&limit=9&search=${searchInput}`

    const token = Cookies.get('jwt_token')
    console.log('sort option in home: ', activeOptionId)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(restaurantListUrl, options)

    if (response.ok) {
      const data = await response.json()

      const {restaurants} = data
      console.log(restaurants)
      const formattedData = restaurants.map(item => ({
        id: item.id,
        imageUrl: item.image_url,
        name: item.name,
        cuisine: item.cuisine,
        rating: item.user_rating.rating,
        totalReviews: item.user_rating.total_reviews,
      }))

      this.onSuccess(formattedData)
    } else {
      this.setState({isLoading: apiStatus.fail})
    }
  }

  onDecrementPage = () => {
    this.setState(
      prevState => ({
        activePage:
          prevState.activePage > 1
            ? prevState.activePage - 1
            : prevState.activePage,
      }),
      this.getRestaurantsList,
    )
  }

  onIncrementPage = () => {
    this.setState(
      prevState => ({
        activePage:
          prevState.activePage < 4
            ? prevState.activePage + 1
            : prevState.activePage,
      }),
      this.getRestaurantsList,
    )
  }

  getPaginationCard = () => {
    const {activePage} = this.state

    return (
      <div className="pagination-card">
        <button
          type="button"
          onClick={this.onDecrementPage}
          testid="pagination-left-button"
        >
          {'<'}
        </button>
        <span testid="active-page-number">{`${activePage} of 20`}</span>
        <button
          testid="pagination-right-button"
          type="button"
          onClick={this.onIncrementPage}
        >
          {'>'}
        </button>
      </div>
    )
  }

  loaderView = () => (
    <div className="loader-container" testid="restaurants-list-loader">
      <Loader type="Oval" color="#0b69ff" height="50" width="50" />
    </div>
  )

  failureView = () => <h1>Retry</h1>

  renderRestaurants = () => {
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
    const {activeOptionId, searchInput} = this.state
    const token = Cookies.get('jwt_token')

    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <>
        <Header />
        <div className="home-container">
          {this.getCarouselCard()}
          <div>
            <h1 className="popular-restaurant-heading">Popular Restaurants</h1>
            <p className="popular-restaurant-description">
              Select Your favourite restaurant special dish and make your day
              happy...
            </p>

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
                <p className="sort-by-para">Sort By</p>
                <select
                  value={activeOptionId}
                  onChange={this.onChangeSortBy}
                  className="filter-options"
                >
                  {sortByOptions.map(eachOption => (
                    <option key={eachOption.id} value={eachOption.value}>
                      {eachOption.displayText}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {this.renderRestaurants()}
            {this.getPaginationCard()}
          </div>
          <Footer />
        </div>
      </>
    )
  }
}

export default withRouter(Home)
