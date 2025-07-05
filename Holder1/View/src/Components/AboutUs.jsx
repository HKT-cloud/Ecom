import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/about.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Company Overview Section */}
      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="section-title">About Ecom Express</h1>
              <p className="section-description">
                Ecom Express is a leading logistics solutions provider specializing in end-to-end delivery services for e-commerce businesses and heavy goods transportation.
              </p>
              <p className="section-description">
                Established with the mission to transform logistics efficiency in India, we leverage technology, innovation, and operational excellence to offer seamless and scalable shipping services across urban and rural geographies.
              </p>
            </Col>
            <Col lg={6} className="text-center">
              <div className="about-image-placeholder">
                {/* Add your company logo or hero image here */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <Container>
          <h2 className="section-title">Corporate Values</h2>
          <Row>
            <Col md={3}>
              <div className="value-card">
                <h3>Integrity</h3>
                <p>We uphold honesty, transparency, and fairness in all our dealings.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="value-card">
                <h3>Customer First</h3>
                <p>Our services are designed with the customer’s success in mind.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>We continuously innovate to provide smarter, faster, and greener logistics.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="value-card">
                <h3>Accountability</h3>
                <p>We take ownership of our promises and deliver results.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <Container>
          <h2 className="section-title">Our Journey</h2>
          <Row>
            <Col>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="year">2015</span>
                  <p>Established with three hubs and a small team</p>
                </div>
                <div className="timeline-item">
                  <span className="year">2016</span>
                  <p>Crossed 10 million parcel deliveries</p>
                </div>
                <div className="timeline-item">
                  <span className="year">2018</span>
                  <p>Launched heavy goods vertical and warehouse automation</p>
                </div>
                <div className="timeline-item">
                  <span className="year">2020</span>
                  <p>Reached pan-India coverage</p>
                </div>
                <div className="timeline-item">
                  <span className="year">2022</span>
                  <p>Achieved carbon-neutral status for fleet operations</p>
                </div>
                <div className="timeline-item">
                  <span className="year">2024</span>
                  <p>Introduced drone-based delivery trials</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <Container>
          <h2 className="section-title">Our Team</h2>
          <Row>
            <Col md={3}>
              <div className="team-member">
                <h3>Ravi Mehta</h3>
                <p>Chief Executive Officer</p>
                <p>A logistics veteran with 20+ years of experience</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="team-member">
                <h3>Aarushi Verma</h3>
                <p>Chief Operating Officer</p>
                <p>Leads nationwide operations with a focus on quality</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="team-member">
                <h3>Aniket Shah</h3>
                <p>Head of Technology</p>
                <p>Building cutting-edge logistics tech platforms</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="team-member">
                <h3>Nisha Kapoor</h3>
                <p>Director of Customer Experience</p>
                <p>Ensures client satisfaction and resolves challenges</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CSR Section */}
      <section className="csr-section">
        <Container>
          <h2 className="section-title">Corporate Social Responsibility</h2>
          <Row>
            <Col>
              <div className="csr-grid">
                <div className="csr-item">
                  <h3>Green Logistics</h3>
                  <p>Transitioning to electric vehicles and reducing carbon footprint</p>
                </div>
                <div className="csr-item">
                  <h3>Skill Development</h3>
                  <p>Training programs for youth in logistics and supply chain management</p>
                </div>
                <div className="csr-item">
                  <h3>Community Outreach</h3>
                  <p>Supporting local communities with education and health programs</p>
                </div>
                <div className="csr-item">
                  <h3>Women Empowerment</h3>
                  <p>Encouraging female participation in logistics roles</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Awards Section */}
      <section className="awards-section">
        <Container>
          <h2 className="section-title">Awards & Recognition</h2>
          <Row>
            <Col>
              <div className="awards-grid">
                <div className="award-item">
                  <span className="award-year">2022</span>
                  <h3>Best E-commerce Logistics Provider</h3>
                  <p>India Logistics Awards</p>
                </div>
                <div className="award-item">
                  <span className="award-year">2023</span>
                  <h3>Excellence in Green Transportation</h3>
                  <p>EcoMove</p>
                </div>
                <div className="award-item">
                  <span className="award-year">2024</span>
                  <h3>Top Innovator in Last-Mile Delivery</h3>
                  <p>SmartLog India</p>
                </div>
                <div className="award-item">
                  <span className="award-year">2023</span>
                  <h3>Employer of Choice</h3>
                  <p>WorkLife India Awards</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
