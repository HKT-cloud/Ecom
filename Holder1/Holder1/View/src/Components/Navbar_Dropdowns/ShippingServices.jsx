import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/shipping-services.css';

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
          <Col md={6}>
            <Card className="service-card">
              <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/efficient-delivery-solutions.516096b1.svg" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">Trucks</Card.Title>
                <Card.Text className="card-text">
                  Efficient truck-based delivery network for bulk shipments and long-distance transportation
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/shipping_services.d4cd402d.svg" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">Two Wheeler</Card.Title>
                <Card.Text className="card-text">
                  Quick and agile last-mile delivery solution for urban areas and congested locations
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/heavies-and-bulkies.701bcf74.svg" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">Packers and Movers</Card.Title>
                <Card.Text className="card-text">
                  Professional packing and moving services for safe transportation of your valuable items
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Img variant="top" src="https://www.ecomexpress.in/_nuxt/location.c6f0d28c.svg" className="card-image" />
              <Card.Body>
                <Card.Title className="card-title">International Services</Card.Title>
                <Card.Text className="card-text">
                  Seamless cross-border shipping solutions with customs clearance and international logistics expertise
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShippingServices;