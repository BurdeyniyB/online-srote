import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import {
  INDEX_ROUTE,
  STORE_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
} from "../utils/const";
import "../style/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid className="footer-top">
        <Container>
          <Row className="footer-links-row">
            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">Shop</h6>
              <ul className="footer-list">
                <li><Link to={STORE_ROUTE}>All Products</Link></li>
                <li><Link to={STORE_ROUTE}>New Arrivals</Link></li>
                <li><Link to={STORE_ROUTE}>Best Sellers</Link></li>
                <li><Link to={STORE_ROUTE}>Special Offers</Link></li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">Customer Service</h6>
              <ul className="footer-list">
                <li><a href="#how-to-order">How to Order</a></li>
                <li><a href="#delivery">Delivery Info</a></li>
                <li><a href="#returns">Returns & Refunds</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">My Account</h6>
              <ul className="footer-list">
                <li><Link to={LOGIN_ROUTE}>Sign In</Link></li>
                <li><Link to={REGISTER_ROUTE}>Register</Link></li>
                <li><Link to={BASKET_ROUTE}>My Basket</Link></li>
                <li><a href="#orders">My Orders</a></li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">Company</h6>
              <ul className="footer-list">
                <li><Link to={INDEX_ROUTE}>About Us</Link></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#team">Our Team</a></li>
                <li><a href="#careers">Careers</a></li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">Support</h6>
              <ul className="footer-list">
                <li><a href="#help">Help Center</a></li>
                <li><a href="#track">Track Order</a></li>
                <li><a href="#warranty">Warranty</a></li>
                <li><a href="#feedback">Feedback</a></li>
              </ul>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2} className="footer-col">
              <h6 className="footer-heading">Legal</h6>
              <ul className="footer-list">
                <li><a href="#terms">Terms of Use</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Container>

      <div className="footer-bottom">
        <Container>
          <div className="footer-bottom-inner">
            <Link to={INDEX_ROUTE} className="footer-brand">
              Online<span>.Store</span>
            </Link>
            <p className="footer-copy">&copy; 2026 Online Store. All rights reserved.</p>
            <div className="footer-socials">
              <a href="#instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="#facebook" aria-label="Facebook"><FaFacebook /></a>
              <a href="#twitter" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
