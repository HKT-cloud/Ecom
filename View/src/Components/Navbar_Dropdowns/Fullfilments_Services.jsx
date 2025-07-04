import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../../styles/fulfillment-services.css';

const Fullfilments_Services = () => {
  return (
    <div className="shipping-services">
      <Container>
        <div className="text-center mb-5">
          <h1 className="page-title">Fullfilment Services</h1>
          <p className="page-description">
            Our fulfillment services provide end-to-end solutions for managing your inventory and delivering products to customers efficiently.
          </p>
          <h2 className="section-title">Cutting edge features of our fulfillment solutions</h2>
        </div>
        <div className="page-header">
          <p className="page-description">
            We are a company with robust warehousing and process capabilities to provide a wide range of fulfillment services including warehousing and order management that meet the dynamic needs of our customers. Our fulfillment centers are strategically located in key geographies across the country.
          </p>
        </div>

        <Row className="g-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Strategic Footprint</Card.Title>
                <Card.Text className="card-text">
                  32 strategically located warehouses<br />
                  Stock closer to your customers for faster delivery
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Different Storage Templates</Card.Title>
                <Card.Text className="card-text">
                  Explore different templates as per your requirements<br />
                  JIT marketplace, mother hub, community warehouses and dark stores
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mt-4">
          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Branded Services</Card.Title>
                <Card.Text className="card-text">
                  Customer centric uniform branding across warehouses<br />
                  Comprehensive warehousing, order management & inventory control services
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="service-card">
              <Card.Body>
                <Card.Title className="card-title">Dedicated Facilities</Card.Title>
                <Card.Text className="card-text">
                  100% company managed and controlled facilities<br />
                  Returns processing with QC
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Fullfilments_Services