import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/contact-us.css';

const ContactUs = () => {
  return (
    <div className="contact-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="page-title">Still got questions?</h1>
          <h2 className="section-title">Reach out to our experts!</h2>
        </div>

        <Row className="g-4">
          <Col md={12}>
            <div className="contact-box">
              <div className="contact-info">
                <div className="contact-item">
                  <h3 className="contact-title">Mobile</h3>
                  <p className="contact-value">+91-8376888888</p>
                  <p className="contact-subtext">(Automated IVR Support 24/7)</p>
                </div>

                <div className="contact-item">
                  <h3 className="contact-title">Email</h3>
                  <p className="contact-value">sales@ecomexpress.in</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
