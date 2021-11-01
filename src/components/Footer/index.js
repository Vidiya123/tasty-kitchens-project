import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'

import './index.css'

const FooterSection = () => (
  <div className="footer-container">
    <div className="icon-container">
      <img
        src="https://res.cloudinary.com/dppqkea7f/image/upload/v1625978524/footer-icon_cs8bzb.png"
        alt="website-footer-logo"
        className="icon-img"
      />
      <h1 className="icon-heading">Tasty Kitchen</h1>
    </div>
    <p className="footer-description">
      The only thing we are serious about is food. Contact us on
    </p>
    <div className="social-icon-container">
      <FaPinterestSquare
        testid="pintrest-social-icon"
        className="social-icon"
      />
      <FaInstagram testid="instagram-social-icon" className="social-icon" />
      <FaTwitter testid="twitter-social-icon" className="social-icon" />
      <FaFacebookSquare testid="facebook-social-icon" className="social-icon" />
    </div>
  </div>
)

export default FooterSection
