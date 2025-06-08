import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='nav-holder'>
                   <Link to="/"> <img alt="Ecom Express Logo" className="h-8 md:h-10 lazy-img lazyLoad isLoaded" loading="lazy" width="182" height="40" data-v-8058c8cf="" src="https://www.ecomexpress.in/_nuxt/logo.a5977302.svg"></img> </Link>
        <div className='nav-main'>
            <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-services">
                    Services
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#">
                        <div className="dropdown-item-title"><Link to="/shippingservices"> <img src="https://www.ecomexpress.in/_nuxt/shipping_services.d4cd402d.svg" alt="photo" />Shipping Services </Link></div>
                        <div className="dropdown-item-subtitle">  Fastest and reliable shipping</div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        <div className="dropdown-item-title"><Link to="/fullfilments"> <img src="https://www.ecomexpress.in/_nuxt/fulfillment_services.a36fc069.svg" alt="photo" /> Fullfilment Services </Link></div> 
                        <div className="dropdown-item-subtitle">Storage and warehousing solutions</div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        <div className="dropdown-item-title"> <Link to="/samedaydelivery"> <img src="https://www.ecomexpress.in/_nuxt/efficient-delivery-solutions.516096b1.svg" alt="photo" /> Sameday Delivery </Link></div>
                        <div className="dropdown-item-subtitle">Efficient and timely delivery</div>
                    </Dropdown.Item>
                    <Dropdown.Item href="#">
                        <div className="dropdown-item-title"> <Link to="/heaviesandbulkies"> <img src="https://www.ecomexpress.in/_nuxt/heavies-and-bulkies.701bcf74.svg" alt="photo" /> Heavies And Bulkies </Link></div>
                        <div className="dropdown-item-subtitle">Delivering heavy and bulky goods</div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-company">
                    Company
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/aboutus">
                                <img src="https://www.ecomexpress.in/_nuxt/about-us.9011a705.svg" alt="photo" />About Us
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Our story</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/career">
                                <img src="https://www.ecomexpress.in/_nuxt/career.c01f1e5d.svg" alt="photo" />Career
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Join us</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/contactus">
                                <img src="https://www.ecomexpress.in/_nuxt/contacts.20a32bbb.svg" alt="photo" />Contact Us
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Get in touch with us</div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
                <Dropdown.Toggle variant="link" id="dropdown-media-center">
                    Media Center
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/news">
                                <img src="https://www.ecomexpress.in/_nuxt/news.f58cb538.svg" alt="phto" />News
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Latest updates</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/blogs">
                                <img src="https://www.ecomexpress.in/_nuxt/blogs.c85a689e.svg" alt="photo" />Blogs
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Insights and articles</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="dropdown-item-title">
                            <Link to="/videogallery">
                                <img src="https://www.ecomexpress.in/_nuxt/video-gallery.08d4413e.svg" alt="photo" />Video Gallery
                            </Link>
                        </div>
                        <div className="dropdown-item-subtitle">Watch our videos</div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    </div>
  )
}

export default Navbar