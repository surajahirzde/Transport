import React, { useState } from 'react';
import './styles/Footer.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileContract, FaShieldAlt, FaMoneyCheckAlt, FaTimes } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);

  // Close modal when clicking outside
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setTermsModalVisible(false);
        setPrivacyModalVisible(false);
        setRefundModalVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const PolicyModal = ({ isOpen, onClose, title, icon: Icon, children }) => {
    if (!isOpen) return null;

    return (
      <div className="policy-modal-overlay" onClick={onClose}>
        <div className="policy-modal-content" onClick={e => e.stopPropagation()}>
          <div className="policy-modal-header">
            <div className="modal-header-left">
              <Icon className="modal-header-icon" />
              <h2 className="modal-title">{title}</h2>
            </div>
            <button className="modal-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="policy-modal-body">
            {children}
          </div>
          <div className="policy-modal-footer">
            <button className="modal-btn modal-btn-secondary" onClick={onClose}>
              Close
            </button>
            {title === 'Terms & Conditions' && (
              <button className="modal-btn modal-btn-primary" onClick={onClose}>
                I Accept
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
              <h4 className="footer-section-title">Legal & Policies</h4>
              <ul className="footer-links-list">
                <li>
                  <button 
                    className="policy-link-btn"
                    onClick={() => setTermsModalVisible(true)}
                  >
                    <FaFileContract className="policy-icon" /> Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    className="policy-link-btn"
                    onClick={() => setPrivacyModalVisible(true)}
                  >
                    <FaShieldAlt className="policy-icon" /> Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    className="policy-link-btn"
                    onClick={() => setRefundModalVisible(true)}
                  >
                    <FaMoneyCheckAlt className="policy-icon" /> Refund Policy
                  </button>
                </li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
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
              <p>
                By using our services, you agree to our 
                <button className="inline-link" onClick={() => setTermsModalVisible(true)}> Terms & Conditions</button>, 
                <button className="inline-link" onClick={() => setPrivacyModalVisible(true)}> Privacy Policy</button>, and 
                <button className="inline-link" onClick={() => setRefundModalVisible(true)}> Refund Policy</button>.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Terms & Conditions Modal */}
      <PolicyModal
        isOpen={termsModalVisible}
        onClose={() => setTermsModalVisible(false)}
        title="Terms & Conditions"
        icon={FaFileContract}
      >
        <div className="policy-content">
          <div className="policy-header">
            <h3>TransportOnWeb Terms & Conditions</h3>
            <p className="effective-date">Effective Date: {currentYear}</p>
          </div>

          <section className="policy-section">
            <h4>1. Service Agreement</h4>
            <p>By using TransportOnWeb services, you agree to these terms and conditions. Our platform provides logistics and transportation services across India.</p>
          </section>

          <section className="policy-section">
            <h4>2. Service Scope</h4>
            <p>We provide transportation services including but not limited to:</p>
            <ul>
              <li>Door-to-door delivery services</li>
              <li>Warehousing and storage</li>
              <li>Last-mile delivery</li>
              <li>Freight transportation</li>
              <li>Express delivery services</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>3. User Responsibilities</h4>
            <p>Users must:</p>
            <ul>
              <li>Provide accurate shipment details</li>
              <li>Ensure proper packaging of goods</li>
              <li>Declare prohibited items</li>
              <li>Provide valid identification documents</li>
              <li>Make timely payments for services</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>4. Prohibited Items</h4>
            <p>The following items are strictly prohibited:</p>
            <ul>
              <li>Illegal substances or contraband</li>
              <li>Hazardous materials without proper documentation</li>
              <li>Perishable items without special arrangements</li>
              <li>Weapons and ammunition</li>
              <li>Live animals without prior approval</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>5. Liability Limitations</h4>
            <p>TransportOnWeb's liability is limited to:</p>
            <ul>
              <li>Maximum liability equal to the shipping charges paid</li>
              <li>Not responsible for delays due to natural calamities</li>
              <li>Limited liability for perishable goods</li>
              <li>Not liable for improper packaging by user</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>6. Payment Terms</h4>
            <p>All payments must be made in advance or as per agreed credit terms. Late payments may attract interest charges.</p>
          </section>

          <section className="policy-section">
            <h4>7. Dispute Resolution</h4>
            <p>Any disputes shall be resolved through arbitration in Noida, Uttar Pradesh jurisdiction.</p>
          </section>
        </div>
      </PolicyModal>

      {/* Privacy Policy Modal */}
      <PolicyModal
        isOpen={privacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
        title="Privacy Policy"
        icon={FaShieldAlt}
      >
        <div className="policy-content">
          <div className="policy-header">
            <h3>TransportOnWeb Privacy Policy</h3>
            <p className="effective-date">Last Updated: {currentYear}</p>
          </div>

          <section className="policy-section">
            <h4>1. Information We Collect</h4>
            <p>We collect the following information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email, phone number, address</li>
              <li><strong>Business Information:</strong> Company name, GSTIN, business address</li>
              <li><strong>Shipping Information:</strong> Pickup and delivery addresses, package details</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely through payment gateways)</li>
              <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>2. How We Use Your Information</h4>
            <ul>
              <li>To provide and manage our transportation services</li>
              <li>To process payments and invoices</li>
              <li>To communicate service updates and tracking information</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal requirements</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>3. Data Protection & Security</h4>
            <p>We implement the following security measures:</p>
            <ul>
              <li>SSL encryption for all data transmissions</li>
              <li>Secure servers with firewall protection</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication protocols</li>
              <li>Data backup and disaster recovery systems</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>4. Data Sharing & Third Parties</h4>
            <p>We may share data with:</p>
            <ul>
              <li>Service providers (payment processors, cloud services)</li>
              <li>Delivery partners and logistics providers</li>
              <li>Government authorities as required by law</li>
              <li>Legal authorities in case of investigations</li>
            </ul>
            <p>We never sell your personal data to third parties.</p>
          </section>

          <section className="policy-section">
            <h4>5. Your Rights</h4>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request data deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>6. Cookies & Tracking</h4>
            <p>We use cookies for:</p>
            <ul>
              <li>Session management</li>
              <li>User preferences</li>
              <li>Analytics and performance monitoring</li>
              <li>Security purposes</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>7. Contact Information</h4>
            <p>For privacy concerns, contact our Data Protection Officer at:</p>
            <p>Email: transportonweb188.com<br/>
               Phone: +91 92113 36188<br/>
               Address: SCO-4, First floor ,Dayal Bagh Market, Sector-39, Surajkund, Faridabad - 121009 Haryana, India  </p>
          </section>
        </div>
      </PolicyModal>

      {/* Refund Policy Modal */}
      <PolicyModal
        isOpen={refundModalVisible}
        onClose={() => setRefundModalVisible(false)}
        title="Refund & Cancellation Policy"
        icon={FaMoneyCheckAlt}
      >
        <div className="policy-content">
          <div className="policy-header">
            <h3>TransportOnWeb Refund & Cancellation Policy</h3>
            <p className="effective-date">Effective Date: {currentYear}</p>
          </div>

          <section className="policy-section">
            <h4>1. Cancellation Policy</h4>
            <div className="refund-table">
              <div className="refund-row header">
                <div className="refund-col">Cancellation Time</div>
                <div className="refund-col">Refund Amount</div>
                <div className="refund-col">Charges</div>
              </div>
              <div className="refund-row">
                <div className="refund-col">Before pickup (24+ hours)</div>
                <div className="refund-col">100%</div>
                <div className="refund-col">No charges</div>
              </div>
              <div className="refund-row">
                <div className="refund-col">Before pickup (6-24 hours)</div>
                <div className="refund-col">90%</div>
                <div className="refund-col">10% processing fee</div>
              </div>
              <div className="refund-row">
                <div className="refund-col">After pickup assigned</div>
                <div className="refund-col">70%</div>
                <div className="refund-col">30% service charges</div>
              </div>
              <div className="refund-row">
                <div className="refund-col">After pickup completed</div>
                <div className="refund-col">50%</div>
                <div className="refund-col">50% service charges</div>
              </div>
              <div className="refund-row">
                <div className="refund-col">In transit</div>
                <div className="refund-col">No refund</div>
                <div className="refund-col">100% charges apply</div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h4>2. Refund Eligibility</h4>
            <p>Refunds are available in the following cases:</p>
            <ul>
              <li>Service not provided as per agreement</li>
              <li>Significant delay (beyond 48 hours from promised time)</li>
              <li>Damage to goods during transit (with proof)</li>
              <li>Loss of shipment (verified cases)</li>
              <li>Technical error in billing</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>3. Non-Refundable Situations</h4>
            <p>No refunds will be provided for:</p>
            <ul>
              <li>Change of mind after service commencement</li>
              <li>Incorrect address provided by customer</li>
              <li>Refusal to accept delivery</li>
              <li>Custom clearance delays</li>
              <li>Force majeure events (natural disasters, strikes)</li>
              <li>Perishable goods spoilage (unless due to our negligence)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h4>4. Refund Process</h4>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h5>Submit Request</h5>
                  <p>Submit refund request within 7 days of service completion</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h5>Verification</h5>
                  <p>Our team verifies the claim within 3-5 business days</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h5>Approval</h5>
                  <p>If approved, refund processed within 5-7 business days</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h5>Payment</h5>
                  <p>Refund credited to original payment method within 7-10 days</p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h4>5. Special Cases</h4>
            <div className="special-cases">
              <div className="case-item">
                <h5>🔴 Damaged Goods</h5>
                <p>Full refund if damage occurs during transit and is reported within 24 hours of delivery with photographic evidence.</p>
              </div>
              <div className="case-item">
                <h5>🟡 Lost Shipments</h5>
                <p>Full refund plus compensation up to ₹10,000 if shipment is lost and not found within 15 days.</p>
              </div>
              <div className="case-item">
                <h5>🟢 Delayed Delivery</h5>
                <p>Partial refund (25% of shipping charges) for delays exceeding 48 hours from promised delivery time.</p>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h4>6. Contact for Refunds</h4>
            <div className="contact-refund">
              <p><strong>Refund Department:</strong></p>
              <p>Email: refunds@transportonweb.com</p>
              <p>Phone: +91 92113 36188 (Ext. 2)</p>
              <p>Hours: Mon-Fri, 10 AM - 6 PM IST</p>
            </div>
          </section>
        </div>
      </PolicyModal>
    </>
  );
};

export default Footer;