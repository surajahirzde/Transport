import React from 'react';
import '../Components/styles/About.css';
import { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const targetStats = [50000, 500, 150, 10000];

  // Image slideshow data
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&auto=format&fit=crop&q=80",
      title: "Modern Fleet",
      desc: "State-of-the-art vehicles equipped with GPS and safety features"
    },
    {
      image: "https://images.unsplash.com/photo-1562887189-e5d078343de4?w=1600&auto=format&fit=crop&q=80",
      title: "Warehouse Network",
      desc: "50+ strategically located warehouses across India"
    },
    {
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w-1600&auto=format&fit=crop&q=80",
      title: "Expert Team",
      desc: "500+ trained professionals ensuring smooth operations"
    },
    {
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80",
      title: "24/7 Operations",
      desc: "Round-the-clock monitoring and support"
    }
  ];

  // Animated counter for stats
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
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

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Team data with real photos
  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      experience: "25+ years",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
      bio: "Ex-Army logistics officer turned entrepreneur"
    },
    {
      name: "Priya Sharma",
      role: "Operations Director",
      experience: "18 years",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bio: "Supply chain management expert from IIM Ahmedabad"
    },
    {
      name: "Amit Patel",
      role: "Technology Head",
      experience: "15 years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
      bio: "Former Google engineer driving digital transformation"
    },
    {
      name: "Neha Gupta",
      role: "Customer Success",
      experience: "12 years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&auto=format&fit=crop&q=80",
      bio: "Passionate about delivering exceptional service"
    }
  ];

  // Features with icons
  const features = [
    { icon: "🚀", title: "Fast Delivery", desc: "Guanteed delivery within promised timeline", value: "98%" },
    { icon: "🎯", title: "Accuracy", desc: "Error-free handling and documentation", value: "99.9%" },
    { icon: "🔒", title: "Security", desc: "GPS tracked vehicles with tamper-proof seals", value: "100%" },
    { icon: "💰", title: "Cost Saving", desc: "Optimized routes reduce costs by", value: "30%" }
  ];

  return (
    <div className="about-premium">
      {/* Hero Section with Parallax */}
      <section className="about-hero-premium">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content-premium">
          <div className="about-hero-text-premium">
            <h1 className="about-hero-title-premium">
              <span className="about-hero-title-line">Redefining</span>
              <span className="about-hero-title-line">Indian Logistics</span>
            </h1>
            <p className="about-hero-subtitle-premium">
              Premium transportation solutions powered by technology and expertise
            </p>
            <button 
              className="about-hero-btn-premium"
              onClick={() => window.location.href = '/booking'}
            >
              <span>Explore Services</span>
              <svg className="about-btn-arrow" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="about-hero-trucks">
          <div className="about-truck about-truck-1">🚚</div>
          <div className="about-truck about-truck-2">🚛</div>
          <div className="about-truck about-truck-3">📦</div>
        </div>
      </section>

      {/* Slideshow Gallery */}
      <section className="about-gallery-premium">
        <div className="about-gallery-container">
          <div className="about-gallery-main">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title}
              className="about-gallery-image"
            />
            <div className="about-gallery-caption">
              <h3>{slides[currentSlide].title}</h3>
              <p>{slides[currentSlide].desc}</p>
            </div>
          </div>
          
          <div className="about-gallery-thumbnails">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`about-thumbnail ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              >
                <img src={slide.image} alt={slide.title} />
                <div className="about-thumbnail-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="about-stats-premium">
        <div className="about-stats-container">
          <div className="about-stats-grid-premium">
            {[
              { label: "Deliveries", suffix: "K+", value: stats[0] },
              { label: "Fleet Size", suffix: "+", value: stats[1] },
              { label: "Cities", suffix: "+", value: stats[2] },
              { label: "Clients", suffix: "+", value: stats[3] }
            ].map((stat, index) => (
              <div key={index} className="about-stat-premium">
                <div className="about-stat-number-premium">
                  {Math.floor(stat.value).toLocaleString()}
                  <span className="about-stat-suffix">{stat.suffix}</span>
                </div>
                <div className="about-stat-label-premium">{stat.label}</div>
                <div className="about-stat-bar">
                  <div 
                    className="about-stat-progress"
                    style={{ width: `${(stat.value / targetStats[index]) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Animation */}
      <section className="about-features-premium">
        <div className="about-features-container">
          <div className="about-features-header">
            <h2 className="about-features-title">Why We Excel</h2>
            <p className="about-features-subtitle">Industry-leading metrics that set us apart</p>
          </div>
          
          <div className="about-features-grid-premium">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="about-feature-premium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="about-feature-icon-premium">{feature.icon}</div>
                <div className="about-feature-content-premium">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                  <div className="about-feature-value">{feature.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Hover Effects */}
      <section className="about-team-premium">
        <div className="about-team-container">
          <div className="about-team-header">
            <h2 className="about-team-title">Meet Our Leadership</h2>
            <p className="about-team-subtitle">Experts driving innovation in logistics</p>
          </div>
          
          <div className="about-team-grid-premium">
            {team.map((member, index) => (
              <div key={index} className="about-team-member-premium">
                <div className="about-member-image-container">
                  <img src={member.image} alt={member.name} className="about-member-image" />
                  <div className="about-member-overlay">
                    <div className="about-member-social">
                      <span>📧</span>
                      <span>💼</span>
                      <span>📱</span>
                    </div>
                  </div>
                </div>
                <div className="about-member-info">
                  <h3>{member.name}</h3>
                  <div className="about-member-role-premium">{member.role}</div>
                  <div className="about-member-exp">Experience: {member.experience}</div>
                  <p className="about-member-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="about-map-premium">
        <div className="about-map-container">
          <h2 className="about-map-title">Pan-India Network</h2>
          <p className="about-map-subtitle">Serving 150+ cities with 24/7 operations</p>
          
          <div className="about-map-visual">
            <div className="about-map-india">
              {/* Simplified India map with dots */}
              <div className="about-map-dot about-dot-delhi" data-city="Delhi"></div>
              <div className="about-map-dot about-dot-mumbai" data-city="Mumbai"></div>
              <div className="about-map-dot about-dot-bangalore" data-city="Bangalore"></div>
              <div className="about-map-dot about-dot-chennai" data-city="Chennai"></div>
              <div className="about-map-dot about-dot-kolkata" data-city="Kolkata"></div>
              <div className="about-map-dot about-dot-hyderabad" data-city="Hyderabad"></div>
              
              {/* Connecting lines */}
              <div className="about-map-line about-line-1"></div>
              <div className="about-map-line about-line-2"></div>
              <div className="about-map-line about-line-3"></div>
              <div className="about-map-line about-line-4"></div>
            </div>
          </div>
          
          <div className="about-map-cities">
            <div className="about-city">Delhi Hub</div>
            <div className="about-city">Mumbai Hub</div>
            <div className="about-city">Bangalore Hub</div>
            <div className="about-city">Chennai Hub</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;