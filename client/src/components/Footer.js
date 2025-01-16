import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../style/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col sm={12} md={6} className="footer-col">
            <h5>Contact Us</h5>
            <p>Address: 123 Store Street</p>
            <p>Email: info@store.com</p>
            <p>Phone: +1234567890</p>
          </Col>
          <Col sm={12} md={6} className="footer-col">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <FaFacebook />
              <FaInstagram />
              <FaTwitter />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p>&copy; 2025 Online Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
