import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../styles/order-lists.css';

const OrderLists = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    company: '',
    monthlyVolume: '',
    businessType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you can add API call to submit the form data
  };

  const monthlyVolumeOptions = [
    '1-100',
    '100-500',
    '500-1000',
    'Above 1000'
  ];

  const businessTypeOptions = [
    'Proprietorship',
    'Partnership',
    'Private',
    'Public',
    'LLP'
  ];

  return (
    <div className="order-lists-container">
      <Container className="order-lists-content">
        <h1 className="section-title">Order Lists</h1>
        <p className="section-description">Fast and reliable shipping, across India. A reliable partner for your shipping requirements with pick-up and delivery of products from warehouses and sellers to end-consumers using automated infrastructure and information systems.</p>

        <Form onSubmit={handleSubmit} className="order-form">
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="company">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group controlId="monthlyVolume">
                <Form.Label>Select Monthly Shipment Volume</Form.Label>
                <Form.Select
                  name="monthlyVolume"
                  value={formData.monthlyVolume}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Volume</option>
                  {monthlyVolumeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="businessType">
                <Form.Label>Select Business Type</Form.Label>
                <Form.Select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {businessTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button
              type="submit"
              className="submit-btn"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default OrderLists;
