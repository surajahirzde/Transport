import React from 'react';
import '../Components/styles/Hero.css';  
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck,Globe, MapPin, Clock, Shield, Package, Users, Building, CheckCircle } from 'lucide-react';

const Hero = () => {
  const [activeService, setActiveService] = useState(0);
  
  const services = [
    { id: 1, name: 'Road Transport', icon: '🚛', vehicles: '500+ Trucks' },
    { id: 2, name: 'Express Delivery', icon: '⚡', vehicles: '150+ Vans' },
    { id: 3, name: 'Warehouse Storage', icon: '🏭', vehicles: '15+ Facilities' },
    { id: 4, name: 'Cold Chain', icon: '❄️', vehicles: 'Specialized Fleet' },
  ];

  const handleStartShipping = () => {
    navigate('/shipping'); 
  };

  const handleTrackShipment = () => {
    navigate('/track'); 
  };

  // Auto rotate services
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-main-container">
      {/* Hero Background with Transport Scene */}
      <div className="transport-scene">
        <div className="road-highway"></div>
        
        {/* Moving Vehicles */}
        <div className="moving-truck truck-1">
          <div className="truck-body">
            <div className="truck-cab">DT</div>
            <div className="truck-trailer">TRANSPORT</div>
          </div>
        </div>
        
        <div className="moving-van van-1">
          <div className="van-body">EXPRESS</div>
        </div>
        
        <div className="moving-truck truck-2">
          <div className="truck-body">
            <div className="truck-cab">LOGISTICS</div>
            <div className="truck-trailer">COLD CHAIN</div>
          </div>
        </div>
      </div>
      
      {/* Warehouse Background */}
      <div className="warehouse-bg">
        <div className="warehouse-container">
          <div className="warehouse-doors">
            <div className="door-left"></div>
            <div className="door-right"></div>
          </div>
          <div className="forklift">
            <div className="forklift-body">⚙️</div>
          </div>
          <div className="pallets">
            <div className="pallet"></div>
            <div className="pallet"></div>
            <div className="pallet"></div>
          </div>
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="hero-content-wrapper">
        <div className="hero-text-section">
          
          {/* Company Badge */}
          <div className="company-badge">
            <div className="badge-icon">
              <Shield size={20} />
            </div>
            <span>Trusted Logistics Partner Since 2005</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="hero-main-heading">
            <span className="heading-line-1">Move Your Goods</span>
            <span className="heading-line-2">With India's <span className="highlight">Most Trusted</span></span>
            <span className="heading-line-3">Transport & Logistics Company</span>
          </h1>
          
          {/* Description */}
          <p className="hero-description-text">
            From local deliveries to nationwide logistics, our fleet of <strong>650+ vehicles</strong>, 
            experienced <strong>250+ drivers</strong>, and <strong>15+ warehouses</strong> ensure your 
            goods reach safely and on time. We handle everything from parcels to full truckloads.
          </p>
          
          {/* Active Service Display */}
          <div className="active-service-display">
            <div className="service-icon-large">
              {services[activeService].icon}
            </div>
            <div className="service-details">
              <h3>{services[activeService].name}</h3>
              <p>{services[activeService].vehicles} • 24/7 Service</p>
            </div>
            <div className="service-indicators">
              {services.map((_, index) => (
                <div 
                  key={index}
                  className={`indicator ${index === activeService ? 'active' : ''}`}
                  onClick={() => setActiveService(index)}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Key Features */}
          <div className="key-features">
            <div className="feature">
              <CheckCircle size={20} className="feature-icon" />
              <span>Real-Time GPS Tracking</span>
            </div>
            <div className="feature">
              <CheckCircle size={20} className="feature-icon" />
              <span>Door-to-Door Delivery</span>
            </div>
            <div className="feature">
              <CheckCircle size={20} className="feature-icon" />
              <span>Fully Insured Shipments</span>
            </div>
            <div className="feature">
              <CheckCircle size={20} className="feature-icon" />
              <span>Temperature Controlled</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="hero-button-group">
            <button className="hero-primary-btn" onClick={handleStartShipping}>
              <Truck size={20} />
              <span>Book Your Shipment Now</span>
              <span className="btn-badge">Get Instant Quote</span>
            </button>
            
            <button className="hero-secondary-btn" onClick={handleTrackShipment}>
              <MapPin size={20} />
              <span>Track Your Consignment</span>
            </button>
          </div>
          
          {/* Driver & Warehouse Info */}
          <div className="operations-info">
            <div className="operations-card">
              <div className="operations-icon">
                <Users size={24} />
              </div>
              <div>
                <h4>250+ Professional Drivers</h4>
                <p>Experienced & Verified</p>
              </div>
            </div>
            
            <div className="operations-card">
              <div className="operations-icon">
                <Building size={24} />
              </div>
              <div>
                <h4>15+ Warehouses Nationwide</h4>
                <p>Secure Storage Facilities</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="hero-stats-container">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Monthly Shipments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.2%</div>
              <div className="stat-label">On-Time Delivery</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">650+</div>
              <div className="stat-label">Vehicle Fleet</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">28</div>
              <div className="stat-label">States Covered</div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="cta-section">
            <div className="cta-phone">
              <Clock size={16} />
              <span>24/7 Customer Support:</span>
              <a href="tel:18001234567" className="phone-number">📞 1800-123-4567</a>
            </div>
            <p className="cta-note">Get a free quote in 2 minutes</p>
          </div>
        </div>
        
        {/* Right Side - Visual Section */}
        <div className="hero-visual-section">
          {/* Driver Card */}
          <div className="driver-profile-card">
            <div className="driver-avatar">
              <div className="avatar-img">👨‍✈️</div>
            </div>
            <div className="driver-info">
              <h4>Ravi Kumar</h4>
              <p className="driver-title">Senior Transport Driver</p>
              <div className="driver-stats">
                <span className="stat">⭐ 4.9/5 Rating</span>
                <span className="stat">📦 5000+ Deliveries</span>
              </div>
              <p className="driver-quote">"Your goods are safe with us!"</p>
            </div>
          </div>
          
          {/* Live Shipment Card */}
          <div className="live-shipment-card">
            <div className="shipment-header">
              <div className="live-badge">
                <div className="pulse-dot"></div>
                LIVE TRACKING
              </div>
              <Clock size={16} />
            </div>
            
            <div className="shipment-route">
              <div className="route-point start">
                <MapPin size={16} />
                <div>
                  <p className="city">Delhi</p>
                  <p className="time">Pickup: 10:00 AM</p>
                </div>
              </div>
              
              <div className="route-line">
                <div className="route-truck">🚚</div>
              </div>
              
              <div className="route-point end">
                <MapPin size={16} />
                <div>
                  <p className="city">Mumbai</p>
                  <p className="time">ETA: 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="shipment-details">
              <div className="detail-item">
                <span>Consignment:</span>
                <strong>DT2024001234</strong>
              </div>
              <div className="detail-item">
                <span>Vehicle:</span>
                <strong>Container Truck • MH-01-AB-1234</strong>
              </div>
              <div className="detail-item">
                <span>Driver:</span>
                <strong>Vikram Singh</strong>
              </div>
            </div>
            
            <button className="track-shipment-btn" onClick={handleTrackShipment}>
              <MapPin size={16} />
              Track This Shipment
            </button>
          </div>
          
          {/* Warehouse Image */}
          <div className="warehouse-image-container">
            <div className="image-overlay">
              <h4>Our Mumbai Warehouse</h4>
              <p>50,000 sq.ft • 24/7 Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;