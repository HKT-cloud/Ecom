import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import './styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={3}>
            <h4>About Us</h4>
            <ul className="footer-links">
              <li><RouterLink to="/aboutus">About Ecom Express</RouterLink></li>
              <li><RouterLink to="/aboutus">Corporate Values</RouterLink></li>
              <li><RouterLink to="/aboutus">Our Journey</RouterLink></li>
              <li><RouterLink to="/aboutus">Team</RouterLink></li>
              <li><RouterLink to="/career">Career</RouterLink></li>
              <li><RouterLink to="/aboutus">CSR</RouterLink></li>
              <li><RouterLink to="/aboutus">Awards & Recognition</RouterLink></li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Services</h4>
            <ul className="footer-links">
              <li><RouterLink to="/shippingservices">Shipping Services</RouterLink></li>
              <li><RouterLink to="/fullfilments">Fulfillment Services</RouterLink></li>
              <li><RouterLink to="/aboutus">Developers</RouterLink></li>
              <li><RouterLink to="/aboutus">API reference</RouterLink></li>
            </ul>
          </Col>
          <Col md={3}>
            <h4>Corporate Office</h4>
            <p>10th Floor, Ambience Tower II, Ambience Island, Gurugram - 122002 Haryana</p>
            <h4>Registered Office</h4>
            <p>Ground Floor, 13/16 min, 17 min, Samalka, Old Delhi-Gurugram Road, Kapashera, New Delhi – 110037</p>
            <h4>CIN Number:</h4>
            <p>U63000DL2012PLC241107</p>
          </Col>
          <Col md={3} className="d-flex flex-column">
            <h4>Follow us on</h4>
            <div className="social-links-container">
              <div className="social-links">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.ecomexpress.in/_nuxt/fb.0aeee458.svg" alt="Facebook" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.ecomexpress.in/_nuxt/linkedin.5626c592.svg" alt="LinkedIn" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.ecomexpress.in/_nuxt/twitter.a20d9742.svg" alt="Twitter" />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src="https://www.ecomexpress.in/_nuxt/ig.8d753498.svg" alt="Instagram" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
