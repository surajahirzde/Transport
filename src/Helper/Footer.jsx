import React from 'react';
import './styles/Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="transport-footer">
      <div className="footer-wrapper">
        
        {/* Top Section - Logo & Description */}
        <div className="footer-top-section">
          <div className="footer-logo">
            <span className="footer-logo-icon">🚚</span>
            <div className="footer-logo-text">
              <h3 className="footer-company-name">TransportOnWeb</h3>
              <p className="footer-tagline">Fast & Reliable Logistics Solutions</p>
            </div>
          </div>
          
          <div className="footer-description">
            <p>Your trusted partner for all transportation and logistics needs across India.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="footer-main-content">
          
          {/* Contact Info */}
          <div className="footer-contact-box">
            <h4 className="footer-section-title">Contact Us</h4>
            <div className="contact-details">
              <div className="contact-line">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Sector 63, Noida, Uttar Pradesh</span>
              </div>
              <div className="contact-line">
                <FaPhone className="contact-icon" />
                <a href="tel:+919211336188" className="contact-link">
                  +91 92113 36188
                </a>
              </div>
              <div className="contact-line">
                <FaEnvelope className="contact-icon" />
                <a href="mailto:support@transportonweb.com" className="contact-link">
                  support@transportonweb.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-box">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="/services">Our Services</a></li>
              <li><a href="/track">Track Shipment</a></li>
              <li><a href="/book">Book Now</a></li>
              <li><a href="/quote">Get Quote</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer-links-box">
            <h4 className="footer-section-title">Company</h4>
            <ul className="footer-links-list">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/privacy">Privacy</a></li>
            </ul>
          </div>

          {/* GST Info */}
          <div className="footer-info-box">
            <h4 className="footer-section-title">Business Info</h4>
            <div className="business-info">
              <p>GSTIN: 09AAGCC6826R1Z1</p>
              <p>CIN: U60210DL2023PTC432156</p>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom-section">
          <div className="footer-copyright">
            © {currentYear} TransportOnWeb. All rights reserved.
          </div>
          <div className="footer-disclaimer">
            <p>ISO 9001:2015 Certified • Registered with MoRTH</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;