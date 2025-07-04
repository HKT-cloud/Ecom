import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/blogs.css';

const Blogs = () => {
  return (
    <div className="blogs-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="page-title">Latest Blogs</h1>
          <h2 className="section-title">Beyond Delivery: How Ecom Express Builds Customer Trust Through Seamless Experiences</h2>
          <p className="page-description">
            Ecom Express builds customer trust with fast, reliable deliveries, real-time tracking, AI-driven precision, and impactful marketing. Their diverse delivery options ensure seamless service and strong customer relationships.
          </p>
        </div>

        <Row className="g-4">
          <Col md={6}>
            <div className="blog-card">
              <div className="blog-content">
                <h3 className="blog-title">Empowering Delivery Partners: How Ecom Express Is Redefining the Gig Economy in Logistics</h3>
                <p className="blog-excerpt">
                  The gig economy has taken over a lot of sectors in the Indian business topography. Logistics is no exception in this regard. And in India, Ecom Express stands out as a paragon of the gig economy by empowering its delivery partners. 
                </p>
                <div className="blog-read-more">
                  <a href="#" className="read-more-link">Read More</a>
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="blog-card">
              <div className="blog-content">
                <h3 className="blog-title">Modular Plug-and-Play Logistics: The Future of Scalable E-Commerce Fulfillment with Ecom Express</h3>
                <p className="blog-excerpt">
                  Modern businesses need logistical solutions that are flexible and efficient. You want to start your deliveries asap, right? Who wants to wait around for infrastructure to be constructed before they can actually rake in the profits? No one. 
                </p>
                <div className="blog-read-more">
                  <a href="#" className="read-more-link">Read More</a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mt-4">
          <Col md={6}>
            <div className="blog-card">
              <div className="blog-content">
                <h3 className="blog-title">The Evolution of Warehousing: Smart Warehouses and 3PL Services in India</h3>
                <p className="blog-excerpt">
                  Your growing business should be a cause for celebration, not stress. But more often than not, that is exactly what happens when orders start pouring in and you don't have your warehouses in order. Inventory is misplaced, orders are delayed, and customers are unhappy. 
                </p>
                <div className="blog-read-more">
                  <a href="#" className="read-more-link">Read More</a>
                </div>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="blog-card">
              <div className="blog-content">
                <h3 className="blog-title">The Future of blog: How D2C Brands Can Adapt to Fast, Free, and Flexible Delivery Models</h3>
                <p className="blog-excerpt">
                  The future of eCommerce is now. To meet the ever-evolving customer demands, efficient shipping has become a central concern for Direct-to-Consumer (D2C) brands. Online shopping rates keep surging, increasing the demand for fast, free, and flexible delivery options.
                </p>
                <div className="blog-read-more">
                  <a href="#" className="read-more-link">Read More</a>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blogs;
