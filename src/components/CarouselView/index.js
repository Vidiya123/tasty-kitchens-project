import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {Redirect, withRouter} from 'react-router-dom'

import './index.css'

const carouselStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
}

class CarouselView extends Component {
  state = {
    isLoading: carouselStatus.initial,
    carouserList: [],
  }

  componentDidMount() {
    this.fetchCarouselList()
  }

  onSuccess = data => {
    this.setState({carouserList: data, isLoading: carouselStatus.success})
  }

  onFail = () => {
    this.setState({isLoading: carouselStatus.fail})
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

      this.onSuccess(carouselList)
    } else {
      this.onFail()
    }
  }

  loaderView = () => (
    <div
      className="products-loader-container"
      testid="restaurants-offers-loader"
    >
      <Loader type="TailSpin" color="#F7931E" height="50" width="50" />
    </div>
  )

  successView = () => {
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
          <div key={item.id}>
            <img src={item.imageUrl} alt="offer" className="carousel-image" />
          </div>
        ))}
      </Slider>
    )
  }

  failedView = () => <h1>Retry</h1>

  getCarouse = () => {
    const {isLoading} = this.state

    if (isLoading === carouselStatus.initial) {
      return this.loaderView()
    }
    if (isLoading === carouselStatus.success) {
      return this.successView()
    }
    return this.failedView()
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return <div className="carousel-container">{this.getCarouse()}</div>
  }
}

export default withRouter(CarouselView)
