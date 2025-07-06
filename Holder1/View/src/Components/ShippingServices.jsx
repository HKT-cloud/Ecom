import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/shipping-services.css';

const ShippingServices = () => {
  return (
    <div className="shipping-services-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="primary-heading">Fast and reliable shipping, across India</h1>
          <p className="description-text">
            A reliable partner for your shipping requirements with pick-up and delivery of products from warehouses and sellers to end-consumers using automated infrastructure and information systems.
          </p>
        </div>

        <Row className="g-4">
          <Col md={6} lg={3}>
            <Link to="/orderlists" className="service-card clickable-card">
              <Card>
                <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/trucks.56789012.svg" className="card-image" />
                <Card.Body>
                  <Card.Title className="card-title">Trucks</Card.Title>
                  <Card.Text className="card-text">
                    Efficient truck-based delivery network for bulk shipments and long-distance transportation
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Link to="/orderlists" className="service-card clickable-card">
              <Card>
                <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/two_wheeler.34567890.svg" className="card-image" />
                <Card.Body>
                  <Card.Title className="card-title">Two Wheeler</Card.Title>
                  <Card.Text className="card-text">
                    Quick and agile last-mile delivery solution for urban areas and congested locations
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Link to="/orderlists" className="service-card clickable-card">
              <Card>
                <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/packers_and_movers.12345678.svg" className="card-image" />
                <Card.Body>
                  <Card.Title className="card-title">Packers and Movers</Card.Title>
                  <Card.Text className="card-text">
                    Professional packing and moving services for safe transportation of your valuable items
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Link to="/orderlists" className="service-card clickable-card">
              <Card>
                <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/international_services.90123456.svg" className="card-image" />
                <Card.Body>
                  <Card.Title className="card-title">International Services</Card.Title>
                  <Card.Text className="card-text">
                    Seamless cross-border shipping solutions with customs clearance and international logistics expertise
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShippingServices;
