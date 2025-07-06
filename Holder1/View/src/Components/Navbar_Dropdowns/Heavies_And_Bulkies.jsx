import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/heavies-and-bulkies.css';

const Heavies_And_Bulkies = () => {
  return (
    <div className="heavies-bulkies-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="page-title">Delivering Heavy and Bulky Goods Efficiently</h1>
          <p className="page-description">
            Heavies and Bulkies service streamlines the transportation of large and heavy items, making it easier for businesses and consumers to receive essential products. With a focus on efficiency and reliability, this service ensures that your bulky goods reach their destination safely and on time.
          </p>
          <h2 className="section-title">How our services help your business?</h2>
        </div>

        <Row className="g-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Seamless Integration</Card.Title>
                <Card.Text className="card-text">
                  Effortlessly connects through API for large clients and offers a user-friendly client panel for smaller businesses, making order management straightforward
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Zero Damage Guarantee</Card.Title>
                <Card.Text className="card-text">
                  Implementing quality checks throughout the process ensures that products arrive in perfect condition through reliable delivery solutions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Flexible Delivery Options</Card.Title>
                <Card.Text className="card-text">
                  Provides same-day and next-day delivery services for heavy goods delivery, catering to diverse customer needs and urgency.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Scheduled Delivery</Card.Title>
                <Card.Text className="card-text">
                  Customers can choose their preferred delivery time slots, enhancing convenience and reducing missed deliveries
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Heavies_And_Bulkies;