import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Hero.css';
import { Truck, MapPin, Shield, CheckCircle, Package, Users, Clock, Star, Award, Lock, Phone, HelpCircle, FileText } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Updated slides with WORKING Unsplash URLs
 // Best transport/porter specific images for slider
// Perfect Transport / Porter Slider Images
const slides = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Truck Loading",
    desc: "Goods being loaded into a truck"
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Truck on Highway",
    desc: "Transport truck running on highway"
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/5025667/pexels-photo-5025667.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Goods Packages",
    desc: "Packed goods ready for delivery"
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Warehouse Storage",
    desc: "Warehouse with stacked inventory"
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Porters at Work",
    desc: "Two workers lifting goods together"
  },
  {
    id: 6,
    image: "https://images.pexels.com/photos/7706455/pexels-photo-7706455.jpeg?auto=compress&cs=tinysrgb&w=1600",
    title: "Fast Delivery Service",
    desc: "Courier & porter fast delivery concept"
  }
];



  const policyCards = [
    { 
      id: 1, 
      icon: <Shield size={24} />, 
      title: 'Safe & Secure', 
      desc: '100% insured shipments with GPS tracking' 
    },
    { 
      id: 2, 
      icon: <FileText size={24} />, 
      title: 'Refund Policy', 
      desc: '100% refund for damaged goods' 
    },
    { 
      id: 3, 
      icon: <Lock size={24} />, 
      title: 'Privacy Policy', 
      desc: 'Your data is secure with us' 
    },
    { 
      id: 4, 
      icon: <HelpCircle size={24} />, 
      title: 'Help & Support', 
      desc: '24/7 customer support available' 
    },
  ];



 

  const stats = [
    { number: '10K+', label: 'Shipments Delivered' },
    { number: '500+', label: 'Happy Customers' },
    { number: '28', label: 'Cities Covered' },
    { number: '99%', label: 'On-time Rate' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleBookNow = () => {
    navigate('/shipping');
  };

  const handleTrack = () => {
    navigate('/tracking');
  };

  const handleContact = () => {
    navigate('/contact');
  };

  const handleHelp = () => {
    navigate('/help');
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Award size={16} />
            <span>Trusted Porter Service Since 2010</span>
          </div>

          <h1 className="hero-title">
            Professional Goods Transport
            <span className="highlight"> Services</span>
          </h1>

          <p className="hero-description">
            We provide reliable and safe transport solutions for all your goods. 
            From small parcels to large consignments, our experienced team ensures 
            timely and secure delivery across India.
          </p>

       

      
          <div className="policy-section">
            <h3>Safe & Transparent Services</h3>
            <div className="policy-cards">
              {policyCards.map((policy) => (
                <div key={policy.id} className="policy-card">
                  <div className="policy-icon">{policy.icon}</div>
                  <h4>{policy.title}</h4>
                  <p>{policy.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="gst-section">
            <div className="gst-badge">
              <Shield size={16} />
              <div>
                <strong>GSTIN:</strong>
                <span>06AAGCC6826R2Z0</span>
              </div>
            </div>
            <p className="gst-text">Fully GST Compliant Services</p>
          </div>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleBookNow}>
              <Truck size={20} />
              <span>Book Transport Now</span>
            </button>
            <button className="btn-secondary" onClick={handleTrack}>
              <MapPin size={20} />
              <span>Track Shipment</span>
            </button>
          </div>

       

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="support-info">
            <div className="support-item">
              <Clock size={18} />
              <div>
                <p>24/7 Customer Support</p>
                <a href="tel:+911800123456" className="support-number">
                  📞 1800-123-456
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          {/* Fixed Image Slider */}
          <div className="image-slider">
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ 
                  backgroundImage: `url(${slide.image})`
                }}
              >
                <div className="slide-overlay">
                  <h3>{slide.title}</h3>
                  <p>{slide.desc}</p>
                </div>
              </div>
            ))}
            
            <div className="slider-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="tracking-card">
            <div className="card-header">
              <div className="live-badge">
                <span className="pulse-dot"></span>
                LIVE TRACKING
              </div>
            </div>
            
            <div className="route-info">
              <div className="route-start">
                <MapPin size={16} />
                <div>
                  <p className="city">Delhi</p>
                  <p className="time">Pickup: 10 AM</p>
                </div>
              </div>
              
              <div className="route-line">
                <div className="moving-truck">🚚</div>
              </div>
              
              <div className="route-end">
                <MapPin size={16} />
                <div>
                  <p className="city">Mumbai</p>
                  <p className="time">ETA: 6 PM</p>
                </div>
              </div>
            </div>
            
            <div className="shipment-details">
              <div className="detail">
                <span>Consignment:</span>
                <strong>TRX2024001234</strong>
              </div>
              <div className="detail">
                <span>Driver:</span>
                <strong>Rajesh Kumar</strong>
              </div>
            </div>
            
            <button className="track-btn" onClick={handleTrack}>
              <MapPin size={16} />
              Track Your Shipment
            </button>
          </div>

          <div className="terms-card">
            <div className="card-header">
              <FileText size={20} />
              <h4>Terms & Conditions</h4>
            </div>
            <ul className="terms-list">
              <li>• Free insurance up to ₹50,000</li>
              <li>• 24/7 customer support</li>
              <li>• GPS tracking on all shipments</li>
              <li>• Transparent pricing</li>
            </ul>
            <button onClick={() => navigate('/terms')} className="read-more">
              Read Full T&C →
            </button>
          </div>

          <div className="driver-card">
            <div className="driver-avatar">
              <div className="avatar-icon">👨‍✈️</div>
              <div className="verified-badge">✓</div>
            </div>
            <div className="driver-info">
              <h4>Vikram Singh</h4>
              <p>Senior Transport Driver</p>
              <div className="driver-rating">
                <Star size={14} />
                <Star size={14} />
                <Star size={14} />
                <Star size={14} />
                <Star size={14} />
                <span>4.8/5</span>
              </div>
              <p className="driver-quote">"Your goods are safe with us!"</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;