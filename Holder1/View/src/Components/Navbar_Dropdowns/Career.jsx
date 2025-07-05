import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../../styles/career.css';

const Career = () => {
  const testimonials = [
    {
      text: "Working at Ecom Express has been a transformative experience for me. The company's commitment to excellence and continuous improvement has pushed me to grow professionally and personally. I've had the opportunity to work on cutting-edge logistics solutions and lead projects that have real impact on our clients' businesses. The collaborative culture here is truly special - everyone is supportive and willing to share their knowledge. One of my proudest moments was leading our team in optimizing our last-mile delivery network, which resulted in a 20% improvement in delivery efficiency.",
      name: "Rahul Sharma",
      role: "Senior Logistics Manager"
    },
    {
      text: "I joined Ecom Express right out of college and it was the best career decision I've made. The company's investment in employee development is unmatched. From day one, I was given meaningful responsibilities and access to state-of-the-art technology. One of the most rewarding aspects of my role is working with our diverse team of professionals. We have people from all backgrounds who bring unique perspectives to solving complex logistics challenges. Recently, I led a project to implement AI-powered route optimization that reduced our carbon footprint by 15%. The company's focus on sustainability aligns perfectly with my personal values.",
      name: "Priya Gupta",
      role: "Senior Supply Chain Analyst"
    },
    {
      text: "The culture at Ecom Express is what sets us apart. It's not just about moving packages - it's about creating solutions that transform the e-commerce landscape. Our teams work closely with clients to understand their unique needs and develop tailored logistics strategies. I've been particularly proud of our recent initiative to implement real-time tracking and analytics for perishable goods, which has revolutionized how our clients manage their supply chains. The company's commitment to innovation and customer success is evident in everything we do.",
      name: "Ajay Kumar",
      role: "Operations Director"
    },
    {
      text: "What drew me to Ecom Express was their reputation for technical excellence. As a tech lead, I've been able to work on groundbreaking projects that are shaping the future of logistics. One of my key achievements was developing our predictive analytics platform that helps clients forecast demand with 95% accuracy. The company provides an environment where technical innovation is encouraged and rewarded. I've also appreciated the opportunities for cross-functional collaboration - working closely with operations and client teams has given me a holistic view of our business. The best part is seeing our solutions make a real difference in people's lives.",
      name: "Sneha Verma",
      role: "Head of Technology Innovation"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(testimonials[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setCurrentTestimonial(testimonials[currentIndex]);
        setIsTransitioning(false);
      }, 1000); // Wait for animation
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, testimonials]);
  return (
    <div className="career-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="page-title">Transform the future of e-commerce logistics solutions</h1>
          <h2 className="section-title">Explore career opportunities with Ecom Express</h2>
        </div>

        <div className="chro-message mb-5">
          <div className="message-box">
            <p className="message-text">
              As we look ahead, our company stands poised for remarkable growth, driven by innovation and a commitment to excellence. We foster and environment where talent is nurtures, contributions are values, and career aspirations are realized. Join us to be a part of a team where your career journey is both rewarding and inspiring!
            </p>
            <div className="chro-signature">
              <p className="chro-name">Swati Mor</p>
              <p className="chro-title">CHRO</p>
            </div>
          </div>
        </div>

        <Row className="g-4">
          <Col md={12}>
            <div className="career-section">
              <h2 className="section-title">We are always looking for great talent</h2>
              <p className="career-description">
                People who make the impossible possible
              </p>
              <p className="career-description">
                Our invigorated strategy is underpinned by our focus on empowering our team
              </p>
              <p className="career-description">
                We are a bunch of doers who value diversity, ambition and a collaborative attitude. Whether you are a fresher or looking for a next step in your career, Ecom Express offers interesting and challenging jobs. You will get all the support you need to make your career as rewarding as possible.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mt-5">
          <Col md={12}>
            <div className="employee-speak-section">
              <h2 className="section-title">Employee Speak</h2>
              <p className="career-description mb-4">
                At Ecom Express, our success is fueled by our dedicated employees. We are committed to providing them with an environment rich in opportunities!
              </p>
              <div className={`employee-testimonial ${isTransitioning ? 'is-transitioning' : ''}`}>
                <div className="testimonial-content">
                  <p className={`testimonial-text ${isTransitioning ? 'is-transitioning' : ''}`}>{currentTestimonial.text}</p>
                  <div className={`testimonial-author ${isTransitioning ? 'is-transitioning' : ''}`}>
                    <p className="author-name">{currentTestimonial.name}</p>
                    <p className="author-role">{currentTestimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Career;
