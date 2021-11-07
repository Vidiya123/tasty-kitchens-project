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
    isLoadingCarousal: carouselStatus.initial,
    carouserList: [],
  }

  componentDidMount() {
    this.fetchCarouselList()
  }

  onSuccessCarousal = data => {
    this.setState({
      carouserList: data,
      isLoadingCarousal: carouselStatus.success,
    })
  }

  onFailCarousal = () => {
    this.setState({isLoadingCarousal: carouselStatus.fail})
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
    <div
      className="products-loader-container"
      testid="restaurants-offers-loader"
    >
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

    if (isLoadingCarousal === carouselStatus.initial) {
      return this.carousalLoaderView()
    }
    if (isLoadingCarousal === carouselStatus.success) {
      return this.carousalSuccessView()
    }
    return this.carousalFailedView()
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }

    return <div className="carousel-container">{this.getCarouselCard()}</div>
  }
}

export default withRouter(CarouselView)
