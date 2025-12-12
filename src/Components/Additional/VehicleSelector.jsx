import React, { useState, useEffect } from 'react';
import '../Additional/styles/VehicleSelector.css';

const VehicleSelector = ({ data = {}, updateData, nextStep, prevStep }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [selectedVehicle, setSelectedVehicle] = useState(data?.vehicleType || "");
  const [additionalServices, setAdditionalServices] = useState({
    helper: data?.helperService || false,
    insurance: data?.insuranceService || false,
    packaging: data?.packagingService || false,
    fastrack: data?.fastrackService || false,
    weekend: data?.weekendService || false,
    night: data?.nightService || false,
  });

  const vehicles = [
    { 
      id: "mini_van", 
      name: "Mini Van", 
      icon: "🚐", 
      capacity: "Up to 500 kg", 
      price: 600,
      displayPrice: "+₹600",
      time: "4-8 hours",
      bestFor: "House shifting, Small furniture",
      features: ["City delivery", "Loading help", "Secure"],
      dimensions: "8×5×5 ft",
      fuel: "Diesel",
      color: "#3B82F6"
    },
    { 
      id: "pickup_truck", 
      name: "Pickup Truck", 
      icon: "🚚", 
      capacity: "Up to 1500 kg", 
      price: 1200,
      displayPrice: "+₹1200",
      time: "6-12 hours",
      bestFor: "Construction materials, Bulk items",
      features: ["Open body", "Heavy duty", "Long distance"],
      dimensions: "12×6×5 ft",
      fuel: "Diesel",
      color: "#10B981"
    },
    { 
      id: "container_truck", 
      name: "Container Truck", 
      icon: "🚛", 
      capacity: "Up to 5000 kg", 
      price: 2500,
      displayPrice: "+₹2500",
      time: "1-2 days",
      bestFor: "Commercial goods, Factory items",
      features: ["Closed container", "Weather proof", "Insurance"],
      dimensions: "20×8×8 ft",
      fuel: "Diesel",
      color: "#8B5CF6"
    },
    { 
      id: "trailer_truck", 
      name: "Trailer Truck", 
      icon: "🚛📦", 
      capacity: "Up to 10000 kg", 
      price: 4000,
      displayPrice: "+₹4000",
      time: "2-4 days",
      bestFor: "Heavy machinery, Industrial goods",
      features: ["Flatbed trailer", "Crane loading", "Long haul"],
      dimensions: "40×8×8 ft",
      fuel: "Diesel",
      color: "#F59E0B"
    },
    { 
      id: "refrigerated_truck", 
      name: "Refrigerated Truck", 
      icon: "🚚❄️", 
      capacity: "Up to 3000 kg", 
      price: 2000,
      displayPrice: "+₹2000",
      time: "1-2 days",
      bestFor: "Food, Medicines, Chemicals",
      features: ["Temperature control", "Safe handling", "Priority"],
      dimensions: "16×7×7 ft",
      fuel: "Diesel",
      color: "#06B6D4"
    },
    { 
      id: "tipper_truck", 
      name: "Tipper Truck", 
      icon: "🚛⛏️", 
      capacity: "Up to 8000 kg", 
      price: 3000,
      displayPrice: "+₹3000",
      time: "1-3 days",
      bestFor: "Construction, Sand, Gravel",
      features: ["Hydraulic lift", "Dump body", "Heavy load"],
      dimensions: "18×7×6 ft",
      fuel: "Diesel",
      color: "#EF4444"
    }
  ];

  const additionalOptions = [
    { 
      id: "helper", 
      name: "Loading Helper", 
      price: 150, 
      displayPrice: "+₹150", 
      desc: "2 helpers for loading/unloading",
      icon: "👷"
    },
    { 
      id: "insurance", 
      name: "Premium Insurance", 
      price: 300, 
      displayPrice: "+₹300", 
      desc: "Coverage up to ₹2,00,000",
      icon: "🛡️"
    },
    { 
      id: "packaging", 
      name: "Professional Packaging", 
      price: 200, 
      displayPrice: "+₹200", 
      desc: "Bubble wrap, wooden crate",
      icon: "📦"
    },
    { 
      id: "fastrack", 
      name: "Fast-Track Delivery", 
      price: 500, 
      displayPrice: "+₹500", 
      desc: "Priority in loading queue",
      icon: "⚡"
    },
    { 
      id: "weekend", 
      name: "Weekend Delivery", 
      price: 250, 
      displayPrice: "+₹250", 
      desc: "Saturday/Sunday delivery",
      icon: "🗓️"
    },
    { 
      id: "night", 
      name: "Night Delivery", 
      price: 350, 
      displayPrice: "+₹350", 
      desc: "Delivery after 8 PM",
      icon: "🌙"
    }
  ];

  const handleSelect = (id) => {
    const selectedVeh = vehicles.find(v => v.id === id);
    setSelectedVehicle(id);
    
    if (updateData && selectedVeh) {
      updateData("vehicleType", id);
      updateData("vehicleName", selectedVeh.name);
      updateData("vehiclePrice", selectedVeh.price);
      updateData("vehicleDisplayPrice", selectedVeh.displayPrice);
    }
  };

  const handleServiceToggle = (serviceId) => {
    const newValue = !additionalServices[serviceId];
    const updatedServices = {
      ...additionalServices,
      [serviceId]: newValue
    };
    
    setAdditionalServices(updatedServices);
    
    if (updateData) {
      updateData(`${serviceId}Service`, newValue);
      
      const service = additionalOptions.find(s => s.id === serviceId);
      if (service) {
        updateData(`${serviceId}Price`, newValue ? service.price : 0);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      alert("Please select a vehicle type");
      return;
    }
    nextStep();
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
  const selectedServicesCount = Object.values(additionalServices).filter(Boolean).length;
  const selectedServicesTotal = additionalOptions.reduce((total, service) => {
    return additionalServices[service.id] ? total + service.price : total;
  }, 0);

  return (
    <div className="vs-main-container">
      {/* Header */}
      <div className="vs-header-section">
        <div className="vs-step-indicator">
          <span className="vs-step-badge">3</span>
          <div>
            <h1 className="vs-title-main">Select Transport Vehicle</h1>
            <p className="vs-subtitle-main">Choose the right vehicle for your shipment</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="vs-content-wrapper">
        <form onSubmit={handleSubmit} className="vs-form-container">
          
          {/* Vehicle Selection */}
          <div className="vs-section-card">
            <div className="vs-section-header">
              <div className="vs-section-icon">🚚</div>
              <div>
                <h3 className="vs-section-title">Available Vehicles</h3>
                <p className="vs-section-subtitle">Select one vehicle based on your cargo size</p>
              </div>
            </div>
            
            <div className="vs-vehicle-grid">
              {vehicles.map(vehicle => (
                <button
                  type="button"
                  key={vehicle.id}
                  className={`vs-vehicle-card ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(vehicle.id)}
                  style={{ 
                    borderColor: selectedVehicle === vehicle.id ? vehicle.color : '#E5E7EB',
                    backgroundColor: selectedVehicle === vehicle.id ? `${vehicle.color}10` : 'white'
                  }}
                >
                  <div className="vs-vehicle-card-header">
                    <div 
                      className="vs-vehicle-icon" 
                      style={{ 
                        backgroundColor: `${vehicle.color}20`, 
                        color: vehicle.color 
                      }}
                    >
                      <span style={{ fontSize: '32px' }}>{vehicle.icon}</span>
                    </div>
                    <div className="vs-vehicle-name-container">
                      <div className="vs-vehicle-name">{vehicle.name}</div>
                      <div 
                        className="vs-vehicle-price" 
                        style={{ color: vehicle.color }}
                      >
                        {vehicle.displayPrice}
                      </div>
                    </div>
                  </div>
                  
                  <div className="vs-vehicle-specs">
                    <div className="vs-spec-row">
                      <div className="vs-spec-label">Capacity:</div>
                      <div className="vs-spec-value">{vehicle.capacity}</div>
                    </div>
                    <div className="vs-spec-row">
                      <div className="vs-spec-label">Dimensions:</div>
                      <div className="vs-spec-value">{vehicle.dimensions}</div>
                    </div>
                    <div className="vs-spec-row">
                      <div className="vs-spec-label">Delivery Time:</div>
                      <div className="vs-spec-value">{vehicle.time}</div>
                    </div>
                    <div className="vs-spec-row">
                      <div className="vs-spec-label">Best For:</div>
                      <div className="vs-spec-value">{vehicle.bestFor}</div>
                    </div>
                  </div>
                  
                  <div className="vs-vehicle-features">
                    {vehicle.features.map((feature, index) => (
                      <span 
                        key={index} 
                        className="vs-feature-tag" 
                        style={{ 
                          backgroundColor: `${vehicle.color}15`, 
                          color: vehicle.color 
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {selectedVehicle === vehicle.id && (
                    <div 
                      className="vs-vehicle-selected-indicator" 
                      style={{ backgroundColor: vehicle.color }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 12L3 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Services */}
          <div className="vs-section-card">
            <div className="vs-section-header">
              <div className="vs-section-icon">⭐</div>
              <div>
                <h3 className="vs-section-title">Additional Services</h3>
                <p className="vs-section-subtitle">Add extra services for better experience</p>
              </div>
            </div>
            
            <div className="vs-services-container">
              <div className="vs-services-grid">
                {additionalOptions.map(service => (
                  <button
                    type="button"
                    key={service.id}
                    className={`vs-service-card ${additionalServices[service.id] ? 'selected' : ''}`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <div className="vs-service-checkbox">
                      <div className={`vs-checkbox ${additionalServices[service.id] ? 'checked' : ''}`}>
                        {additionalServices[service.id] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="vs-service-icon">
                      <span style={{ fontSize: '22px' }}>{service.icon}</span>
                    </div>
                    
                    <div className="vs-service-details">
                      <div className="vs-service-name">{service.name}</div>
                      <div className="vs-service-desc">{service.desc}</div>
                    </div>
                    
                    <div className="vs-service-price">{service.displayPrice}</div>
                  </button>
                ))}
              </div>
              
              <div className="vs-services-summary">
                <div className="vs-summary-item">
                  <span>Selected Services:</span>
                  <span className="vs-summary-count">{selectedServicesCount} services</span>
                </div>
                <div className="vs-summary-item">
                  <span>Additional Charges:</span>
                  <span className="vs-summary-price">+₹{selectedServicesTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedVehicleData && (
            <div className="vs-section-card vs-summary-section">
              <div className="vs-section-header">
                <div className="vs-section-icon">📋</div>
                <div>
                  <h3 className="vs-section-title">Selection Summary</h3>
                  <p className="vs-section-subtitle">Review your vehicle and services</p>
                </div>
              </div>
              
              <div className="vs-summary-card">
                <div className="vs-selected-vehicle-summary">
                  <div 
                    className="vs-summary-vehicle-icon" 
                    style={{ 
                      backgroundColor: `${selectedVehicleData.color}20`, 
                      color: selectedVehicleData.color 
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{selectedVehicleData.icon}</span>
                  </div>
                  <div className="vs-summary-vehicle-details">
                    <div className="vs-summary-vehicle-name">{selectedVehicleData.name}</div>
                    <div className="vs-summary-vehicle-specs">
                      <span>{selectedVehicleData.capacity}</span>
                      <span>•</span>
                      <span>{selectedVehicleData.dimensions}</span>
                      <span>•</span>
                      <span>{selectedVehicleData.time}</span>
                    </div>
                  </div>
                  <div 
                    className="vs-summary-vehicle-price" 
                    style={{ color: selectedVehicleData.color }}
                  >
                    {selectedVehicleData.displayPrice}
                  </div>
                </div>
                
                {selectedServicesCount > 0 && (
                  <div className="vs-selected-services-list">
                    <div className="vs-services-list-title">Selected Services:</div>
                    {additionalOptions
                      .filter(service => additionalServices[service.id])
                      .map(service => (
                        <div key={service.id} className="vs-service-summary-item">
                          <div className="vs-service-summary-name">
                            <span className="vs-service-icon-small">{service.icon}</span>
                            {service.name}
                          </div>
                          <div className="vs-service-summary-price">{service.displayPrice}</div>
                        </div>
                      ))}
                  </div>
                )}
                
                <div className="vs-summary-total">
                  <div className="vs-total-label">Vehicle & Services Total:</div>
                  <div className="vs-total-amount">
                    ₹{selectedVehicleData.price + selectedServicesTotal}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="vs-navigation-section">
            <div className="vs-navigation-buttons">
              <button 
                type="button" 
                className="vs-btn-secondary"
                onClick={prevStep}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Date & Time
              </button>
              
              <button 
                type="submit" 
                className="vs-btn-primary"
                disabled={!selectedVehicle}
              >
                Continue to Payment
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="vs-step-progress-container">
              <div className="vs-progress-container">
                <div className="vs-progress-fill" style={{ width: '50%' }}></div>
              </div>
              <div className="vs-step-labels">
                <span className="vs-step-label">Location</span>
                <span className="vs-step-label">Date & Time</span>
                <span className="vs-step-label active">Vehicle</span>
                <span className="vs-step-label">Payment</span>
                <span className="vs-step-label">Summary</span>
                <span className="vs-step-label">Receipt</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleSelector;