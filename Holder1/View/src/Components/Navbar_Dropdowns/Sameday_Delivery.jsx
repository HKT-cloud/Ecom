import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/sameday-delivery.css';

const Sameday_Delivery = () => {
  return (
    <div className="sameday-delivery-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="page-title">Sameday Delivery</h1>
          <p className="page-description">
            We provide efficient and reliable same-day delivery services for your urgent needs.
          </p>
          <h2 className="section-title">How our services help your business?</h2>
        </div>
        <p className="description-text">
          At Ecom Express, we offer fast, reliable delivery services to ensure your packages reach their destinations on time. Whether you need Same-Day deliveries within the city or Next-Day delivery across regions, we provide flexible solutions tailored to your needs.
        </p>

        <Row className="g-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Timely Pickup & Delivery Windows</Card.Title>
                <Card.Text className="card-text">
                  With set pickup and delivery times, we ensure your shipments arrive within the agreed timeframe, minimizing delays.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Broad Coverage Across Key Cities</Card.Title>
                <Card.Text className="card-text">
                  We serve a wide range of metro cities and intercity routes, ensuring that your deliveries are covered across various regions, both local and national.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">High SLA Adherence</Card.Title>
                <Card.Text className="card-text">
                  We pride ourselves on a 98% SLA adherence, ensuring that your packages are delivered on time, every time with our efficient delivery solutions
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Customizable Solutions</Card.Title>
                <Card.Text className="card-text">
                  We offer tailored services, including flexible pickup locations and times, designed to meet the specific needs of your business
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sameday_Delivery;