import React from 'react';
import '../Components/styles/Hero.css';  // ✅ YOUR CSS PATH
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleStartShipping = () => {
    navigate('/shipping'); 
  };

  return (
    <div className="hero-main-container">
      <div className="hero-content-wrapper">
        
        <div className="hero-text-section">
          <h1 className="hero-main-heading">
            Ship <span className="highlight-text">Anything</span>, 
            <span className="highlight-text"> Anywhere</span>, 
            <span className="highlight-text"> Anytime</span>
          </h1>
          
          <p className="hero-description-text">
            From small packages to large cargo, we deliver with speed, safety, and reliability. 
            Your trusted partner for all transportation needs across cities and states.
          </p>
          
          <div className="hero-button-group">
            <button 
              className="hero-primary-btn"
              onClick={handleStartShipping}
            >
              🚚 Start Shipping Now
            </button>
            
            <button className="hero-secondary-btn">
              📞 Call for Quote: 1800-123-4567
            </button>
          </div>
          
          <div className="hero-stats-container">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Deliveries Done</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image-section">
          <img 
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Transport Services" 
            className="hero-main-image"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Hero;