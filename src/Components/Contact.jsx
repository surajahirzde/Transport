import React, { useState } from 'react';
import '../Components/styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: '📞',
      title: 'Call Us',
      details: [ ' 8826272702'],
      timing: 'Mon-Sat: 9:00 AM - 8:00 PM',
      color: '#3B82F6'
    },
    {
      icon: '📧',
      title: 'Email Us',
      details: ['transportonweb188@gmail.com'],
      timing: 'Response within 2 hours',
      color: '#10B981'
    },
    {
      icon: '🏢',
      title: 'Visit Us',
      details: ['Plot No. SCO-4, First floor ,Dayal Bagh Market, Sector-39, Surajkund, Faridabad - 121009 Haryana, India'],
      timing: 'Mon-Fri: 10:00 AM - 6:00 PM',
      color: '#8B5CF6'
    },
    {
      icon: '🕒',
      title: '24/7 Support',
      details: ['Live Chat Support', 'Emergency Shipments'],
      timing: 'Round the clock assistance',
      color: '#F59E0B'
    }
  ];

  const faqs = [
    {
      question: 'How can I track my shipment?',
      answer: 'You can track your shipment using the tracking ID provided in your receipt. Visit the Tracking page or use our mobile app for real-time updates.'
    },
    {
      question: 'What are your delivery hours?',
      answer: 'We deliver from 9:00 AM to 9:00 PM, 7 days a week. Special time slots are available for express deliveries.'
    },
    {
      question: 'How do I change delivery address?',
      answer: 'Address changes can be made through your dashboard up to 2 hours before scheduled delivery. Contact support for urgent changes.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets, and Cash on Delivery.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch With Us</h1>
          <p className="contact-hero-subtitle">
            Have questions about shipping? Need support? Our team is here to help you 24/7.
          </p>
          <div className="contact-hero-stats">
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Customer Satisfaction</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15min</span>
              <span className="stat-label">Avg Response Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-content">
        {/* Contact Information Cards */}
        <div className="contact-info-section">
          <h2 className="section-title">Ways to Reach Us</h2>
          <p className="section-subtitle">Choose your preferred method to get in touch</p>
          
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className="contact-info-card"
                style={{ '--card-color': info.color }}
              >
                <div className="contact-info-icon" style={{ backgroundColor: `${info.color}20` }}>
                  {info.icon}
                </div>
                <h3 className="contact-info-title">{info.title}</h3>
                <div className="contact-info-details">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="contact-info-text">{detail}</p>
                  ))}
                </div>
                <div className="contact-info-timing">
                  <span className="timing-icon">⏰</span>
                  <span>{info.timing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="contact-form-section">
          <div className="contact-form-wrapper">
            <div className="contact-form-header">
              <h2 className="section-title">Send us a Message</h2>
              <p className="section-subtitle">Fill out the form below and we'll get back to you soon</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              {submitStatus === 'success' && (
                <div className="form-success">
                  ✅ Thank you! Your message has been sent. We'll contact you shortly.
                </div>
              )}
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Full Name *
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your full name"
                      required
                    />
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Email Address *
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Phone Number
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Subject *
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="shipment">Shipment Inquiry</option>
                      <option value="tracking">Tracking Help</option>
                      <option value="pricing">Pricing & Quotes</option>
                      <option value="support">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Your Message *
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Please describe your inquiry in detail..."
                    rows="5"
                    required
                  />
                </label>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
                <p className="form-note">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </div>
            </form>
          </div>
          
          {/* Map & Location */}
          <div className="contact-map-section">
            <div className="map-container">
              <div className="map-placeholder">
                <div className="map-marker">
                  <div className="marker-pin">📍</div>
                  <div className="marker-info">
                    <h4>QuickShip Headquarters</h4>
                    <p>123 Business Street, Mumbai</p>
                    <p>Maharashtra - 400001</p>
                  </div>
                </div>
                <div className="map-overlay">
                  <button className="view-map-btn">
                    <span>🗺️</span> View on Google Maps
                  </button>
                </div>
              </div>
            </div>
            
            <div className="office-hours">
              <h3>Office Hours</h3>
              <div className="hours-grid">
                <div className="hours-day">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="hours-day">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-day">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-day highlight">
                  <span>24/7 Emergency Support</span>
                  <span>Always Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Quick answers to common questions</p>
          
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <div className="faq-question">
                  <span className="faq-icon">❓</span>
                  <h4>{faq.question}</h4>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="faq-cta">
            <p>Didn't find your answer?</p>
            <button className="faq-contact-btn">
              Contact Support Team →
            </button>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="social-section">
          <div className="social-content">
            <h3>Stay Connected</h3>
            <p>Follow us on social media for updates and shipping tips</p>
            
            <div className="social-links">
              <a href="#" className="social-link facebook">📘 Facebook</a>
              <a href="#" className="social-link twitter">🐦 Twitter</a>
              <a href="#" className="social-link instagram">📸 Instagram</a>
              <a href="#" className="social-link linkedin">💼 LinkedIn</a>
              <a href="#" className="social-link whatsapp">💬 WhatsApp</a>
            </div>
          </div>
          
          <div className="newsletter-section">
            <h3>Subscribe to Newsletter</h3>
            <p>Get shipping tips, offers, and updates directly in your inbox</p>
            
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
            <p className="newsletter-note">No spam, unsubscribe anytime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;