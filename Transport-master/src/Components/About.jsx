import React from 'react';
import '../Components/styles/About.css';
import { useState, useEffect , useRef} from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
const About = () => {
  const [activeProcess, setActiveProcess] = useState(0);
  const [stats, setStats] = useState([0, 0, 0, 0, 0, 0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewedSections, setViewedSections] = useState([]);
  const sectionRefs = useRef([]);

  const targetStats = [85000, 850, 285, 15000, 120, 99.7];

  // Animated counter
  useEffect(() => {
    const duration = 3000;
    const steps = 100;
    const increment = targetStats.map(stat => stat / steps);
    
    const interval = setInterval(() => {
      setStats(prev => prev.map((value, index) => {
        if (value < targetStats[index]) {
          return Math.min(value + increment[index], targetStats[index]);
        }
        return value;
      }));
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      setScrollProgress(scrolled);
      
      // Check which sections are in view
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < winHeight * 0.8 && rect.bottom > 0) {
            if (!viewedSections.includes(index)) {
              setViewedSections(prev => [...prev, index]);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewedSections]);

  // Auto cycle through processes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % transportProcess.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Transport Process Steps
  const transportProcess = [
    {
      title: "1. Booking & Planning",
      icon: "📱",
      description: "Customer books through app/website, we plan optimal route",
      details: ["Online booking", "Route optimization", "Schedule planning", "Resource allocation"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "2. Pickup & Inspection",
      icon: "📦",
      description: "Professional team picks up goods with thorough inspection",
      details: ["Safe packing", "Weight verification", "Damage check", "Documentation"],
      image: "https://images.unsplash.com/photo-1562887189-e5d078343de4?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "3. Loading & Security",
      icon: "🚚",
      description: "Careful loading with security seals and GPS installation",
      details: ["Secure loading", "GPS tracking", "Temperature control", "Safety seals"],
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "4. Transportation",
      icon: "🛣️",
      description: "Real-time monitored journey with regular updates",
      details: ["24/7 monitoring", "Route updates", "Fuel management", "Driver communication"],
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "5. Delivery & Unloading",
      icon: "🏠",
      description: "Safe unloading and delivery confirmation",
      details: ["Careful unloading", "Recipient verification", "Delivery proof", "Customer feedback"],
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Types of Goods We Transport
  const goodsTypes = [
    { 
      name: "Electronics & Gadgets", 
      icon: "💻", 
      examples: ["Laptops", "Smartphones", "TVs", "Servers"],
      specialCare: "ESD protection, Shockproof packaging"
    },
    { 
      name: "Furniture & Home", 
      icon: "🛋️", 
      examples: ["Sofas", "Beds", "Wardrobes", "Dining sets"],
      specialCare: "Wrap & pad, Disassembly/Assembly"
    },
    { 
      name: "Industrial Machinery", 
      icon: "🏭", 
      examples: ["CNC machines", "Generators", "Heavy equipment", "Production lines"],
      specialCare: "Crane lifting, Custom rigging"
    },
    { 
      name: "Perishable Goods", 
      icon: "❄️", 
      examples: ["Food items", "Pharmaceuticals", "Flowers", "Biologics"],
      specialCare: "Refrigerated trucks, Temperature logging"
    },
    { 
      name: "Automotive Parts", 
      icon: "🚗", 
      examples: ["Engines", "Transmissions", "Body parts", "Accessories"],
      specialCare: "Anti-rust coating, Custom crating"
    },
    { 
      name: "Art & Antiques", 
      icon: "🖼️", 
      examples: ["Paintings", "Sculptures", "Vintage items", "Collectibles"],
      specialCare: "White glove handling, Climate control"
    },
    { 
      name: "Documents & Parcels", 
      icon: "📄", 
      examples: ["Legal documents", "Medical reports", "Courier parcels", "Confidential files"],
      specialCare: "Tamper-proof bags, Priority handling"
    },
    { 
      name: "Retail Merchandise", 
      icon: "🛍️", 
      examples: ["Clothing", "Footwear", "Accessories", "Store inventory"],
      specialCare: "Hanging racks, Plastic wrapping"
    }
  ];

  // Safety Features
  const safetyFeatures = [
    { icon: "🎯", title: "GPS Tracking", desc: "Real-time location tracking every 15 minutes" },
    { icon: "📹", title: "CCTV Surveillance", desc: "24/7 camera monitoring in all vehicles" },
    { icon: "🛡️", title: "Insurance Coverage", desc: "Full value insurance on all shipments" },
    { icon: "🔐", title: "Tamper-proof Seals", desc: "Security seals that show if opened" },
    { icon: "📞", title: "24/7 Support", desc: "Round-the-clock customer service team" },
    { icon: "👮", title: "Trained Staff", desc: "Background-verified professional drivers" },
    { icon: "📊", title: "Digital Documentation", desc: "Paperless tracking and documentation" },
    { icon: "🚨", title: "Emergency Response", desc: "Quick response team for emergencies" }
  ];

  // Fleet Types
  const fleetTypes = [
    { name: "Mini Trucks", capacity: "750 kg", image: "🚚", count: 250 },
    { name: "Pickup Trucks", capacity: "1.5 Ton", image: "🛻", count: 180 },
    { name: "Medium Trucks", capacity: "3-5 Ton", image: "🚛", count: 150 },
    { name: "Heavy Trucks", capacity: "10-20 Ton", image: "🚚", count: 80 },
    { name: "Container Trucks", capacity: "20-40 ft", image: "📦", count: 60 },
    { name: "Refrigerated Vans", capacity: "2-5 Ton", image: "❄️", count: 40 },
    { name: "Car Carriers", capacity: "6-8 Cars", image: "🚗", count: 30 },
    { name: "Special Carriers", capacity: "Custom", image: "⚙️", count: 20 }
  ];

  // Warehouse Locations
  const warehouses = [
    { city: "Delhi NCR", size: "50,000 sq ft", capacity: "5000 MT" },
    { city: "Mumbai", size: "45,000 sq ft", capacity: "4500 MT" },
    { city: "Bangalore", size: "40,000 sq ft", capacity: "4000 MT" },
    { city: "Kolkata", size: "35,000 sq ft", capacity: "3500 MT" },
    { city: "Chennai", size: "30,000 sq ft", capacity: "3000 MT" },
    { city: "Hyderabad", size: "25,000 sq ft", capacity: "2500 MT" },
    { city: "Ahmedabad", size: "20,000 sq ft", capacity: "2000 MT" },
    { city: "Pune", size: "18,000 sq ft", capacity: "1800 MT" }
  ];

  return (
    <div className="about-ultimate">
      {/* Scroll Progress Bar */}
      <div className="about-scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

 
  {/* Hero Section with Premium Design */}
<section className="about-hero-premium">
  
  
  <div className="about-hero-content-wrapper">
    <div className="about-hero-main-content">
      {/* Badge */}
      <div className="about-hero-badge">
        <span className="about-hero-badge-text">🚀 Trusted by 15,000+ Businesses</span>
      </div>
      
      {/* Main Title */}
      <h1 className="about-hero-main-title">
        <span className="about-hero-title-line about-hero-title-line-1">
          Revolutionizing
        </span>
        <span className="about-hero-title-line about-hero-title-line-2">
          Indian Logistics
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="about-hero-description">
        From e-commerce parcels to industrial machinery, we deliver with 
        <span className="about-hero-highlight"> precision</span>, 
        <span className="about-hero-highlight"> security</span>, and 
        <span className="about-hero-highlight"> speed</span> across 285+ cities.
      </p>
      
      {/* CTA Buttons */}
      <div className="about-hero-action-buttons">
        <button 
          className="about-hero-action-btn about-hero-action-primary"
          onClick={() => window.location.href = '/booking'}
        >
          <span className="about-hero-btn-text">Book Your Shipment</span>
          <span className="about-hero-btn-icon">→</span>
        </button>
        <button 
          className="about-hero-action-btn about-hero-action-secondary"
          onClick={() => window.location.href = '/tracking'}
        >
          <span className="about-hero-btn-text">Track Shipment</span>
          <span className="about-hero-btn-icon">📍</span>
        </button>
      </div>
      
      {/* Quick Stats */}
      <div className="about-hero-quick-stats">
        <div className="about-hero-stat-item">
          <div className="about-hero-stat-icon">📦</div>
          <div className="about-hero-stat-details">
            <div className="about-hero-stat-value">{Math.floor(stats[0]).toLocaleString()}+</div>
            <div className="about-hero-stat-label">Deliveries</div>
          </div>
        </div>
        
        <div className="about-hero-stat-divider"></div>
        
        <div className="about-hero-stat-item">
          <div className="about-hero-stat-icon">🚚</div>
          <div className="about-hero-stat-details">
            <div className="about-hero-stat-value">{Math.floor(stats[1])}+</div>
            <div className="about-hero-stat-label">Vehicles</div>
          </div>
        </div>
        
        <div className="about-hero-stat-divider"></div>
        
        <div className="about-hero-stat-item">
          <div className="about-hero-stat-icon">🏙️</div>
          <div className="about-hero-stat-details">
            <div className="about-hero-stat-value">{Math.floor(stats[2])}+</div>
            <div className="about-hero-stat-label">Cities</div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Hero Visual */}
    <div className="about-hero-visual">
      <div className="about-hero-truck-visual">
        <div className="about-hero-truck-main">🚛</div>
        <div className="about-hero-truck-glow"></div>
        <div className="about-hero-truck-shadow"></div>
      </div>
      <div className="about-hero-package-visual">📦</div>
      <div className="about-hero-location-visual">📍</div>
    </div>
  </div>
  
  {/* Scroll Indicator */}
  <div 
    className="about-hero-scroll-indicator"
    onClick={() => document.getElementById('process-section').scrollIntoView({ behavior: 'smooth' })}
  >
    <div className="about-hero-scroll-text">Explore Our Services</div>
    <div className="about-hero-scroll-arrow">↓</div>
  </div>
</section>

      {/* Animated Stats Section */}
      <section 
        className={`about-stats-ultimate ${viewedSections.includes(0) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[0] = el}
      >
        <div className="about-stats-container-ultimate">
          <h2 className="about-stats-title">Numbers That Define Excellence</h2>
          
          <div className="about-stats-grid-ultimate">
            {[
              { label: "Successful Deliveries", value: stats[0], suffix: "K+" },
              { label: "Fleet Vehicles", value: stats[1], suffix: "+" },
              { label: "Cities Served", value: stats[2], suffix: "+" },
              { label: "Happy Customers", value: stats[3], suffix: "+" },
              { label: "Warehouses", value: stats[4], suffix: "+" },
              { label: "On-time Delivery", value: stats[5], suffix: "%" }
            ].map((stat, index) => (
              <div key={index} className="about-stat-card-ultimate">
                <div className="about-stat-number-ultimate">
                  {stat.value.toFixed(stat.value > 100 ? 0 : 1)}
                  <span className="about-stat-suffix-ultimate">{stat.suffix}</span>
                </div>
                <div className="about-stat-label-ultimate">{stat.label}</div>
                <div className="about-stat-progress-bar">
                  <div 
                    className="about-stat-progress-fill"
                    style={{ width: `${(stat.value / targetStats[index]) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transport Process Flow */}
      <section 
        id="process-section"
        className={`about-process-ultimate ${viewedSections.includes(1) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[1] = el}
      >
        <div className="about-process-container">
          <div className="about-process-header">
            <h2 className="about-process-title">Our 5-Step Delivery Process</h2>
            <p className="about-process-subtitle">End-to-end transparency and reliability</p>
          </div>
          
          <div className="about-process-flow">
            <div className="about-process-timeline">
              {transportProcess.map((step, index) => (
                <div 
                  key={index}
                  className={`about-process-step ${index === activeProcess ? 'active' : ''}`}
                  onClick={() => setActiveProcess(index)}
                >
                  <div className="about-process-step-icon">{step.icon}</div>
                  <div className="about-process-step-number">{index + 1}</div>
                  <div className="about-process-step-title">{step.title}</div>
                </div>
              ))}
            </div>
            
            <div className="about-process-details">
              <div className="about-process-detail-image">
                <img src={transportProcess[activeProcess].image} alt={transportProcess[activeProcess].title} />
              </div>
              <div className="about-process-detail-content">
                <h3>{transportProcess[activeProcess].title}</h3>
                <p>{transportProcess[activeProcess].description}</p>
                <div className="about-process-detail-list">
                  {transportProcess[activeProcess].details.map((detail, idx) => (
                    <div key={idx} className="about-process-detail-item">
                      <span className="about-process-detail-check">✓</span>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Goods We Transport */}
      <section 
        className={`about-goods-ultimate ${viewedSections.includes(2) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[2] = el}
      >
        <div className="about-goods-container">
          <div className="about-goods-header">
            <h2 className="about-goods-title">What We Transport Safely</h2>
            <p className="about-goods-subtitle">Specialized handling for every type of goods</p>
          </div>
          
          <div className="about-goods-grid">
            {goodsTypes.map((goods, index) => (
              <div key={index} className="about-goods-card">
                <div className="about-goods-icon">{goods.icon}</div>
                <h3 className="about-goods-name">{goods.name}</h3>
                <div className="about-goods-examples">
                  {goods.examples.map((example, idx) => (
                    <span key={idx} className="about-goods-example">{example}</span>
                  ))}
                </div>
                <div className="about-goods-care">
                  <strong>Special Care:</strong> {goods.specialCare}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Security */}
      <section 
        className={`about-safety-ultimate ${viewedSections.includes(3) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[3] = el}
      >
        <div className="about-safety-container">
          <div className="about-safety-header">
            <h2 className="about-safety-title">Safety & Security First</h2>
            <p className="about-safety-subtitle">Multiple layers of protection for your goods</p>
          </div>
          
          <div className="about-safety-features">
            {safetyFeatures.map((feature, index) => (
              <div key={index} className="about-safety-feature">
                <div className="about-safety-feature-icon">{feature.icon}</div>
                <div className="about-safety-feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="about-safety-visual">
            <div className="about-safety-truck">
              <div className="about-truck-body">🚚</div>
              <div className="about-truck-features">
                <div className="about-truck-feature about-feature-gps" title="GPS Tracker">📍</div>
                <div className="about-truck-feature about-feature-camera" title="CCTV Camera">📹</div>
                <div className="about-truck-feature about-feature-alarm" title="Security Alarm">🚨</div>
                <div className="about-truck-feature about-feature-seal" title="Tamper Seal">🔐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Fleet */}
      <section 
        className={`about-fleet-ultimate ${viewedSections.includes(4) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[4] = el}
      >
        <div className="about-fleet-container">
          <div className="about-fleet-header">
            <h2 className="about-fleet-title">Our Modern Fleet</h2>
            <p className="about-fleet-subtitle">Right vehicle for every need</p>
          </div>
          
          <div className="about-fleet-showcase">
            {fleetTypes.map((vehicle, index) => (
              <div key={index} className="about-fleet-vehicle">
                <div className="about-vehicle-icon">{vehicle.image}</div>
                <div className="about-vehicle-info">
                  <h3>{vehicle.name}</h3>
                  <p>Capacity: {vehicle.capacity}</p>
                  <div className="about-vehicle-count">{vehicle.count} vehicles</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="about-fleet-stats">
            <div className="about-fleet-stat">
              <div className="about-fleet-stat-number">810</div>
              <div className="about-fleet-stat-label">Total Vehicles</div>
            </div>
            <div className="about-fleet-stat">
              <div className="about-fleet-stat-number">98.5%</div>
              <div className="about-fleet-stat-label">Fleet Availability</div>
            </div>
            <div className="about-fleet-stat">
              <div className="about-fleet-stat-number">24/7</div>
              <div className="about-fleet-stat-label">Maintenance Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Warehouse Network */}
      <section 
        className={`about-warehouse-ultimate ${viewedSections.includes(5) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[5] = el}
      >
        <div className="about-warehouse-container">
          <div className="about-warehouse-header">
            <h2 className="about-warehouse-title">Strategic Warehouse Network</h2>
            <p className="about-warehouse-subtitle">Pan-India storage and distribution hubs</p>
          </div>
          
          <div className="about-warehouse-grid">
            {warehouses.map((warehouse, index) => (
              <div key={index} className="about-warehouse-card">
                <div className="about-warehouse-city">{warehouse.city}</div>
                <div className="about-warehouse-size">
                  <span className="about-warehouse-label">Size:</span>
                  <span className="about-warehouse-value">{warehouse.size}</span>
                </div>
                <div className="about-warehouse-capacity">
                  <span className="about-warehouse-label">Capacity:</span>
                  <span className="about-warehouse-value">{warehouse.capacity}</span>
                </div>
                <div className="about-warehouse-facilities">
                  <span className="about-warehouse-facility">📦 Storage</span>
                  <span className="about-warehouse-facility">🔒 Security</span>
                  <span className="about-warehouse-facility">📊 Inventory</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className={`about-cta-ultimate ${viewedSections.includes(6) ? 'visible' : ''}`}
        ref={el => sectionRefs.current[6] = el}
      >
        <div className="about-cta-container-ultimate">
          <div className="about-cta-content">
            <h2 className="about-cta-title-ultimate">Ready to Experience Premium Logistics?</h2>
            <p className="about-cta-text-ultimate">
              Join 15,000+ businesses and individuals who trust us with their shipments
            </p>
            <div className="about-cta-buttons">
              <button 
                className="about-cta-btn about-cta-btn-primary"
                onClick={() => window.location.href = '/booking'}
              >
                Get Instant Quote
              </button>
              <button 
                className="about-cta-btn about-cta-btn-secondary"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Sales
              </button>
            </div>
          </div>
          
          <div className="about-cta-features">
            <div className="about-cta-feature">
              <div className="about-cta-feature-icon">🚚</div>
              <div className="about-cta-feature-text">Same Day Dispatch</div>
            </div>
            <div className="about-cta-feature">
              <div className="about-cta-feature-icon">🛡️</div>
              <div className="about-cta-feature-text">100% Insurance</div>
            </div>
            <div className="about-cta-feature">
              <div className="about-cta-feature-icon">📱</div>
              <div className="about-cta-feature-text">Live Tracking</div>
            </div>
            <div className="about-cta-feature">
              <div className="about-cta-feature-icon">⭐</div>
              <div className="about-cta-feature-text">5-Star Service</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;