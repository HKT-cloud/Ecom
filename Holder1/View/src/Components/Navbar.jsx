import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar as BsNavbar, Nav, Dropdown, Offcanvas } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../styles/navbar.css';
import '../styles/login-page.css';

const Navbar = ({ onOTPVerification }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showMediaDropdown, setShowMediaDropdown] = useState(false);
  const [user, setUser] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage and navigate even if request fails
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleDropdownClose = () => {
    setShowServicesDropdown(false);
    setShowCompanyDropdown(false);
    setShowMediaDropdown(false);
  };

  return (
    <BsNavbar expand="lg" className="navbar">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="navbar-brand">
          <motion.div
            className="navbar-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://www.ecomexpress.in/_nuxt/logo.a5977302.svg"
              alt="Ecom Express Logo"
              className="navbar-logo"
            />
          </motion.div>
        </BsNavbar.Brand>

        <motion.button
          className="navbar-toggler"
          type="button"
          onClick={handleMobileMenuToggle}
          aria-controls="navbar-collapse"
          aria-expanded={showMobileMenu}
          aria-label="Toggle navigation"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {showMobileMenu ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
        </motion.button>

        <BsNavbar.Collapse id="navbar-collapse">
          <Nav className="me-auto">
            <Dropdown
              show={showServicesDropdown}
              onToggle={(isOpen) => setShowServicesDropdown(isOpen)}
              onSelect={handleDropdownClose}
              className="nav-dropdown"
            >
              <Dropdown.Toggle
                as={Nav.Link}
                className="dropdown-link nav-item"
                id="services-dropdown"
              >
                Services
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => navigate('/shippingservices')}>
                  <div className="dropdown-item-title">Shipping Services</div>
                  <div className="dropdown-item-subtitle">Fastest and reliable shipping</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/fullfilments')}>
                  <div className="dropdown-item-title">Fullfilment Services</div>
                  <div className="dropdown-item-subtitle">Storage and warehousing solutions</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/samedaydelivery')}>
                  <div className="dropdown-item-title">Sameday Delivery</div>
                  <div className="dropdown-item-subtitle">Efficient and timely delivery</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/heaviesandbulkies')}>
                  <div className="dropdown-item-title">Heavies And Bulkies</div>
                  <div className="dropdown-item-subtitle">Delivering heavy and bulky goods</div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              show={showCompanyDropdown}
              onToggle={(isOpen) => setShowCompanyDropdown(isOpen)}
              onSelect={handleDropdownClose}
              className="nav-dropdown"
            >
              <Dropdown.Toggle
                as={Nav.Link}
                className="dropdown-link nav-item"
                id="company-dropdown"
              >
                Company
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => navigate('/aboutus')}>
                  <div className="dropdown-item-title">About Us</div>
                  <div className="dropdown-item-subtitle">Our story</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/career')}>
                  <div className="dropdown-item-title">Career</div>
                  <div className="dropdown-item-subtitle">Join us</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/contactus')}>
                  <div className="dropdown-item-title">Contact Us</div>
                  <div className="dropdown-item-subtitle">Get in touch with us</div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              show={showMediaDropdown}
              onToggle={(isOpen) => setShowMediaDropdown(isOpen)}
              onSelect={handleDropdownClose}
              className="nav-dropdown"
            >
              <Dropdown.Toggle
                as={Nav.Link}
                className="dropdown-link nav-item"
                id="media-dropdown"
              >
                Media Center
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => navigate('/news')}>
                  News
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/blogs')}>
                  Blogs
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/videogallery')}>
                  Video Gallery
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link as={Link} to="/login" className="nav-link nav-item">
                  Sign In
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link nav-item">
                  Sign Up
                </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;