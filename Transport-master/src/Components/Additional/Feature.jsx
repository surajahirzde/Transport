import React from 'react';
import '../Additional/styles/Feature.css';
import { useNavigate } from 'react-router-dom';

const Features = () => {

  const navigate = useNavigate();

  const featuresList = [
    {
      id: 1,
      icon: "🚚",
      title: "Door-to-Door Delivery",
      description: "We pick up from your location and deliver directly to the destination. No extra stops.",
      color: "#1a237e"
    },
    {
      id: 2,
      icon: "📱",
      title: "Real-Time Tracking",
      description: "Track your shipment live on map. Get live updates and estimated delivery time.",
      color: "#00b4d8"
    },
    {
      id: 3,
      icon: "💰",
      title: "Transparent Pricing",
      description: "No hidden charges. Price calculated based on distance, vehicle type, and weight.",
      color: "#00e676"
    },
    {
      id: 4,
      icon: "🛡️",
      title: "Secure & Insured",
      description: "All shipments are insured. Your goods are protected against damage or loss.",
      color: "#ff6d00"
    },
    {
      id: 5,
      icon: "⏰",
      title: "24/7 Availability",
      description: "Book anytime, day or night. Our support team is always available.",
      color: "#7b1fa2"
    },
    {
      id: 6,
      icon: "📦",
      title: "All Size Packages",
      description: "From documents to large cargo. We handle packages of all sizes.",
      color: "#283593"
    }
  ];

  return (
    <section className="features-main-section">
      <div className="features-header">
        <h2 className="features-title">Why Choose SwiftMove?</h2>
        <p className="features-subtitle">
          We make shipping simple, fast, and reliable with our comprehensive services
        </p>
      </div>
 
      <div className="features-grid-container">
        {featuresList.map((feature) => (
          <div 
            key={feature.id} 
            className="feature-card-item"
            style={{ borderTop: `4px solid ${feature.color}` }}
          >
            <div className="feature-icon-box" style={{ backgroundColor: `${feature.color}15` }}>
              <span className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </span>
            </div>
            
            <h3 className="feature-card-title">{feature.title}</h3>
            <p className="feature-card-desc">{feature.description}</p>
          </div>
        ))}
      </div>
<div className="features-cta-section">
  <p className="cta-text">
    Ready to ship? Get instant price estimate for your delivery.
  </p> 
  <button 
    className="features-cta-button"
    onClick={() => navigate('/shipping')}  // ✅ ADD THIS LINE
  >
    Calculate Shipping Cost
  </button>
</div>
    </section>
  );
};

export default Features;