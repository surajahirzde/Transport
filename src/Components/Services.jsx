import React, { useState } from 'react';
import '../Components/styles/Services.css';

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  // Service Categories
  const categories = [
    { id: 'all', name: 'All Services', icon: '📦' },
    { id: 'domestic', name: 'Domestic', icon: '🏠' },
    { id: 'commercial', name: 'Commercial', icon: '🏢' },
    { id: 'special', name: 'Special', icon: '⭐' },
    { id: 'international', name: 'International', icon: '🌎' }
  ];

  // Main Services Data
  const services = [
    {
      id: 1,
      category: 'domestic',
      icon: '🚚',
      title: 'Home Relocation',
      description: 'Complete home shifting with packing, loading, transportation, and unpacking services.',
      features: ['Full packing service', 'Furniture disassembly', 'Insurance coverage', 'Unpacking service'],
      pricing: 'Starting from ₹8,000',
      deliveryTime: '2-5 days',
      popular: true,
      stats: { customers: '15,000+', rating: '4.8/5' }
    },
    {
      id: 2,
      category: 'commercial',
      icon: '🏢',
      title: 'Office Relocation',
      description: 'Professional office shifting with minimal downtime and IT equipment handling.',
      features: ['IT equipment handling', 'Minimal downtime', 'Secure document transfer', 'Post-move support'],
      pricing: 'Custom quote',
      deliveryTime: '1-3 days',
      popular: true,
      stats: { customers: '5,000+', rating: '4.9/5' }
    },
    {
      id: 3,
      category: 'commercial',
      icon: '🛒',
      title: 'E-commerce Logistics',
      description: 'End-to-end logistics solutions for online businesses and retail stores.',
      features: ['Same-day delivery', 'Cash on delivery', 'Reverse logistics', 'Real-time tracking'],
      pricing: '₹25/kg',
      deliveryTime: 'Same-day/Next-day',
      popular: true,
      stats: { customers: '25,000+', rating: '4.7/5' }
    },
    {
      id: 4,
      category: 'special',
      icon: '❄️',
      title: 'Cold Chain Logistics',
      description: 'Temperature-controlled transportation for perishable goods and pharmaceuticals.',
      features: ['Temperature monitoring', '24/7 tracking', 'Hygiene compliance', 'Quick delivery'],
      pricing: '₹35/kg',
      deliveryTime: '1-2 days',
      popular: false,
      stats: { customers: '3,000+', rating: '4.9/5' }
    },
    {
      id: 5,
      category: 'special',
      icon: '🎨',
      title: 'Art & Antiques',
      description: 'White-glove service for valuable art, antiques, and delicate items.',
      features: ['White-glove handling', 'Climate control', 'Security escort', 'Custom packaging'],
      pricing: 'Custom quote',
      deliveryTime: '3-7 days',
      popular: false,
      stats: { customers: '1,200+', rating: '4.9/5' }
    },
    {
      id: 6,
      category: 'international',
      icon: '🌍',
      title: 'International Shipping',
      description: 'Global logistics with customs clearance and door-to-door delivery.',
      features: ['Customs clearance', 'Door-to-door', 'Documentation', 'Tracking'],
      pricing: '₹500/kg',
      deliveryTime: '7-15 days',
      popular: true,
      stats: { customers: '8,000+', rating: '4.6/5' }
    },
    {
      id: 7,
      category: 'domestic',
      icon: '📦',
      title: 'Parcel Delivery',
      description: 'Fast and reliable parcel delivery across 285+ cities in India.',
      features: ['Door pickup', 'Online tracking', 'Secure packaging', 'Insurance'],
      pricing: '₹20/kg',
      deliveryTime: '1-3 days',
      popular: true,
      stats: { customers: '50,000+', rating: '4.5/5' }
    },
    {
      id: 8,
      category: 'commercial',
      icon: '🏭',
      title: 'Industrial Transport',
      description: 'Heavy machinery and industrial equipment transportation.',
      features: ['Heavy lift cranes', 'Custom rigging', 'Route surveys', 'Installation support'],
      pricing: 'Custom quote',
      deliveryTime: '5-10 days',
      popular: false,
      stats: { customers: '2,500+', rating: '4.8/5' }
    }
  ];

  // Filter services based on category
  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <div className="services-hero-badge">
            <span>🚀 99.7% On-time Delivery</span>
          </div>
          <h1 className="services-hero-title">
            Premium Logistics
            <span className="services-hero-title-highlight"> Solutions</span>
          </h1>
          <p className="services-hero-subtitle">
            From small parcels to industrial machinery, we provide end-to-end logistics 
            solutions across India and beyond.
          </p>
          <div className="services-hero-stats">
            <div className="services-hero-stat">
              <div className="services-hero-stat-number">50+</div>
              <div className="services-hero-stat-label">Services</div>
            </div>
            <div className="services-hero-stat">
              <div className="services-hero-stat-number">285+</div>
              <div className="services-hero-stat-label">Cities</div>
            </div>
            <div className="services-hero-stat">
              <div className="services-hero-stat-number">15K+</div>
              <div className="services-hero-stat-label">Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="services-categories">
        <div className="services-categories-container">
          <h2 className="services-categories-title">Our Service Categories</h2>
          <p className="services-categories-subtitle">Choose from our specialized logistics solutions</p>
          
          <div className="services-categories-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`services-category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="services-category-icon">{category.icon}</div>
                <div className="services-category-name">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-grid-section">
        <div className="services-grid-container">
          <div className="services-grid-header">
            <h2 className="services-grid-title">
              {activeCategory === 'all' ? 'All Services' : 
               categories.find(c => c.id === activeCategory)?.name}
              <span className="services-count"> ({filteredServices.length} services)</span>
            </h2>
            <div className="services-view-toggle">
              <button className="view-toggle-btn active">Grid View</button>
              <button className="view-toggle-btn">List View</button>
            </div>
          </div>

          <div className="services-grid">
            {filteredServices.map(service => (
              <div 
                key={service.id} 
                className={`service-card ${service.popular ? 'popular' : ''}`}
                onClick={() => setActiveService(service.id - 1)}
              >
                {service.popular && (
                  <div className="service-badge">Most Popular</div>
                )}
                
                <div className="service-card-header">
                  <div className="service-icon">{service.icon}</div>
                  <div className="service-category-tag">{service.category}</div>
                </div>

                <div className="service-card-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-features">
                    {service.features.map((feature, index) => (
                      <div key={index} className="service-feature">
                        <span className="feature-check">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="service-card-footer">
                  <div className="service-pricing">
                    <div className="service-price">{service.pricing}</div>
                    <div className="service-delivery">Delivery: {service.deliveryTime}</div>
                  </div>
                  
                  <div className="service-stats">
                    <div className="service-stat">
                      <div className="stat-value">{service.stats.customers}</div>
                      <div className="stat-label">Customers</div>
                    </div>
                    <div className="service-stat">
                      <div className="stat-value">{service.stats.rating}</div>
                      <div className="stat-label">Rating</div>
                    </div>
                  </div>

                  <button className="service-book-btn">
                    Book Now
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {filteredServices[activeService] && (
        <div className="service-modal-overlay">
          <div className="service-modal">
            <button 
              className="service-modal-close"
              onClick={() => setActiveService(null)}
            >
              ×
            </button>

            <div className="service-modal-content">
              <div className="service-modal-header">
                <div className="service-modal-icon">{filteredServices[activeService].icon}</div>
                <div className="service-modal-title-section">
                  <h2>{filteredServices[activeService].title}</h2>
                  <div className="service-modal-category">{filteredServices[activeService].category}</div>
                </div>
              </div>

              <div className="service-modal-body">
                <div className="service-modal-description">
                  <p>{filteredServices[activeService].description}</p>
                </div>

                <div className="service-modal-features">
                  <h3>Key Features</h3>
                  <div className="features-grid">
                    {filteredServices[activeService].features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <div className="feature-icon">✓</div>
                        <div className="feature-text">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="service-modal-pricing">
                  <div className="pricing-card">
                    <h3>Pricing Details</h3>
                    <div className="pricing-info">
                      <div className="pricing-row">
                        <span>Base Price:</span>
                        <span className="price-value">{filteredServices[activeService].pricing}</span>
                      </div>
                      <div className="pricing-row">
                        <span>Delivery Time:</span>
                        <span className="time-value">{filteredServices[activeService].deliveryTime}</span>
                      </div>
                      <div className="pricing-row">
                        <span>Insurance:</span>
                        <span className="included">Included</span>
                      </div>
                      <div className="pricing-row">
                        <span>Tracking:</span>
                        <span className="included">Real-time</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="service-modal-cta">
                  <button className="modal-book-btn">
                    <span>Book This Service</span>
                    <span className="modal-btn-icon">→</span>
                  </button>
                  <button className="modal-contact-btn">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us */}
      <section className="services-why-us">
        <div className="services-why-container">
          <h2 className="why-us-title">Why Choose Our Services?</h2>
          
          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="why-us-icon">🚚</div>
              <h3>Modern Fleet</h3>
              <p>850+ GPS-enabled vehicles with 24/7 monitoring</p>
            </div>
            
            <div className="why-us-card">
              <div className="why-us-icon">🛡️</div>
              <h3>100% Insurance</h3>
              <p>Complete value insurance on all shipments</p>
            </div>
            
            <div className="why-us-card">
              <div className="why-us-icon">⏱️</div>
              <h3>On-time Delivery</h3>
              <p>99.7% on-time delivery record across India</p>
            </div>
            
            <div className="why-us-card">
              <div className="why-us-icon">📱</div>
              <h3>Live Tracking</h3>
              <p>Real-time tracking with 15-minute updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta">
        <div className="services-cta-container">
          <div className="services-cta-content">
            <h2 className="services-cta-title">Need Custom Logistics Solution?</h2>
            <p className="services-cta-text">
              Our experts will design a tailored logistics plan for your specific needs
            </p>
            <div className="services-cta-buttons">
              <button className="cta-btn primary">
                Get Free Consultation
              </button>
              <button className="cta-btn secondary">
                Call: 1800-123-4567
              </button>
            </div>
          </div>
          
          <div className="services-cta-features">
            <div className="cta-feature">
              <div className="cta-feature-icon">✓</div>
              <div className="cta-feature-text">24/7 Customer Support</div>
            </div>
            <div className="cta-feature">
              <div className="cta-feature-icon">✓</div>
              <div className="cta-feature-text">Instant Quotation</div>
            </div>
            <div className="cta-feature">
              <div className="cta-feature-icon">✓</div>
              <div className="cta-feature-text">No Hidden Charges</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;