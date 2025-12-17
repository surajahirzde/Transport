// src/components/layout/Footer.jsx
import React from 'react';
import '../Helper/styles/Footer.css';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand">
            <div className="company-logo">
              <span className="logo-icon">🚀</span>
              <div className="logo-text">
                <h2 className="company-name">TransportOnWeb</h2>
                <p className="company-tagline">Fast and Reliable Delivery</p>
              </div>
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="footer-main">
          
          {/* Contact Information */}
          <div className="footer-section contact-section">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">
                  <FaMapMarkerAlt />
                </span>
                <div className="contact-text">
                  Plot No. SCO-4, Dayal Bagh Market,<br />
                  Sector-39, Surajkund,<br />
                  Faridabad - 121009<br />
                  Haryana, India
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">
                  <FaPhoneAlt />
                </span>
                <div className="contact-text">
                  <a href="tel:01294020010" className="contact-link">
                   9211336188
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">
                  <FaEnvelope />
                </span>
                <div className="contact-text">
                  <a href="mailto:info@chagans.com" className="contact-link">
                    tansportonweb.com
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📋</span>
                <div className="contact-text">
                  GSTIN: 06AAGCC6826R2Z0
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="footer-section company-section">
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer-section services-section">
            <h3 className="footer-heading">Services</h3>
            <ul className="footer-links">
              <li><a href="/fastag">Fastag Payments</a></li>
              <li><a href="/tools">Tools</a></li>
              <li><a href="/geo-map">Geo Map Generator</a></li>
              <li><a href="/emi-calculator">Loan EMI Calculator</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-section legal-section">
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-links">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms and Conditions</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Newsletter Subscription */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated</h3>
              <p>Subscribe to our newsletter for the latest updates and offers</p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} Chagans Technologies Limited. All Rights Reserved.
          </div>
          <div className="bottom-links">
            <a href="/sitemap">Sitemap</a>
            <span className="separator">•</span>
            <a href="/accessibility">Accessibility</a>
            <span className="separator">•</span>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;