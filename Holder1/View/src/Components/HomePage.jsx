import React from 'react';
import '../styles/home.css';

const HomePage = () => {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const userEmail = userData.email || 'Guest';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <img 
              src="https://www.ecomexpress.in/_nuxt/logo.a5977302.svg" 
              alt="Ecom Express Logo" 
              className="hero-logo"
            />
            <h1 className="hero-title">Welcome to EcomExpress</h1>
            <h3>{userEmail}</h3>
            <div className="hero-description">
              Experience excellence in logistics with our comprehensive solutions for shipping, warehousing, and international delivery.
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose EcomExpress?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Nationwide Coverage</h3>
              <p>
                Our vast network spans 29,000+ pin codes across India, ensuring your products reach customers everywhere.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast & Reliable</h3>
              <p>
                Optimized routes, real-time tracking, and automated logistics hubs ensure your goods are always on time.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Transparent</h3>
              <p>
                Secure packaging, end-to-end tracking, and OTP-based delivery confirmations ensure safe and transparent deliveries.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧩</div>
              <h3>Custom Solutions</h3>
              <p>
                Tailored logistics solutions for e-commerce, heavy goods, and international shipping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Core Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Shipping Services</h3>
              <p>Door-to-door delivery for eCommerce, D2C brands, and retailers.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏢</div>
              <h3>Fulfillment & Warehousing</h3>
              <p>Inventory storage, picking, packing, and real-time stock management.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h3>Same-Day Delivery</h3>
              <p>Urgent shipments and premium customer experiences.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Heavy Logistics</h3>
              <p>Specialized transportation for furniture, appliances, and large items.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🌍</div>
              <h3>Cross-Border</h3>
              <p>International shipping with customs clearance and global tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="technology-section">
        <div className="container">
          <h2 className="section-title">Technology-Driven Logistics</h2>
          <div className="technology-content">
            <div className="tech-description">
              <p>
                EcomExpress integrates AI-powered routing, real-time tracking, automated sorting, and analytics dashboards — 
                making your logistics smart, visible, and optimized.
              </p>
              <div className="tech-features">
                <div className="tech-feature">🤖 AI Routing</div>
                <div className="tech-feature">📊 Analytics</div>
                <div className="tech-feature">🔄 Automation</div>
                <div className="tech-feature">🎯 Optimization</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="section-title">Join 10,000+ Trusted Brands</h2>
            <p className="cta-description">
              From startups to large enterprises, we empower businesses to scale with efficient and affordable logistics.
            </p>
            <div className="cta-buttons">
              <button className="cta-button primary">Get Started</button>
              <button className="cta-button secondary">Contact Us</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
