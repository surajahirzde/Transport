import React, { useState } from 'react';
import '../Additional/styles/VehicleSelector.css';

const VehicleSelector = ({ data = {}, updateData, nextStep, prevStep }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(data?.vehicleType || "");
  const [additionalServices, setAdditionalServices] = useState({
    helper: data?.helperService || false,
    insurance: data?.insuranceService || false,
    packaging: data?.packagingService || false,
    tracking: data?.trackingService || true,
  });

  const vehicles = [
    { 
      id: "bike", 
      name: "Bike Delivery", 
      icon: "🏍️", 
      capacity: "Up to 10 kg", 
      price: "+₹0",
      time: "1-2 hours",
      bestFor: "Documents, Small parcels",
      features: ["Fastest", "City only", "Instant tracking"]
    },
  
    { 
      id: "pickup", 
      name: "Pickup Van", 
      icon: "🚐", 
      capacity: "Up to 300 kg", 
      price: "+₹400",
      time: "3-6 hours",
      bestFor: "Furniture, Electronics",
      features: ["Spacious", "Cushioned", "Professional"]
    },
    { 
      id: "mini_truck", 
      name: "Mini Truck", 
      icon: "🚚", 
      capacity: "Up to 500 kg", 
      price: "+₹600",
      time: "4-8 hours",
      bestFor: "House shifting, Bulk items",
      features: ["Large capacity", "Loading help", "Secure"]
    },
    { 
      id: "truck", 
      name: "Heavy Truck", 
      icon: "🚛", 
      capacity: "Up to 2000 kg", 
      price: "+₹1200",
      time: "6-12 hours",
      bestFor: "Commercial goods, Machinery",
      features: ["Heavy duty", "Long distance", "Insurance"]
    },
    { 
      id: "refrigerated", 
      name: "Refrigerated Van", 
      icon: "🚚❄️", 
      capacity: "Up to 200 kg", 
      price: "+₹800",
      time: "3-6 hours",
      bestFor: "Food, Medicines, Chemicals",
      features: ["Temperature control", "Safe handling", "Priority"]
    }
  ];

  const additionalOptions = [
    { id: "helper", name: "Loading Helper", price: "+₹150", desc: "Help with loading/unloading" },
    { id: "insurance", name: "Premium Insurance", price: "+₹300", desc: "Coverage up to ₹50,000" },
    { id: "packaging", name: "Professional Packaging", price: "+₹200", desc: "Bubble wrap, carton box" },
    { id: "fastrack", name: "Fast-Track Delivery", price: "+₹500", desc: "Priority in queue" },
    { id: "weekend", name: "Weekend Delivery", price: "+₹250", desc: "Saturday/Sunday delivery" },
    { id: "night", name: "Night Delivery", price: "+₹350", desc: "Delivery after 8 PM" }
  ];

  const handleSelect = (id) => {
    setSelectedVehicle(id);
    if (updateData) {
      updateData("vehicleType", id);
      updateData("vehicleName", vehicles.find(v => v.id === id)?.name);
    }
  };

  const handleServiceToggle = (serviceId) => {
    setAdditionalServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
    
    if (updateData) {
      updateData(`${serviceId}Service`, !additionalServices[serviceId]);
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

  return (
    <div className="vs-container">
      <div className="vs-header">
        <div className="vs-step-indicator">
          <span className="vs-step-number">3</span>
          <div className="vs-step-info">
            <h1 className="vs-title">Select Vehicle Type</h1>
            <p className="vs-subtitle">Choose the best vehicle for your shipment</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="vs-form">
        {/* Vehicle Selection Section */}
        <div className="vs-section">
          <h3 className="vs-section-title">
            <span className="vs-section-icon">🚛</span> Available Vehicles
          </h3>
          <p className="vs-section-desc">Select one vehicle type based on your package size</p>
          
          <div className="vs-vehicle-grid">
            {vehicles.map(vehicle => (
              <div 
                key={vehicle.id}
                className={`vs-vehicle-card ${selectedVehicle === vehicle.id ? 'vs-active' : ''}`}
                onClick={() => handleSelect(vehicle.id)}
              >
                <div className="vs-vehicle-header">
                  <div className="vs-vehicle-icon">{vehicle.icon}</div>
                  <div className="vs-vehicle-title">
                    <h4>{vehicle.name}</h4>
                    <span className="vs-vehicle-price">{vehicle.price}</span>
                  </div>
                </div>
                
                <div className="vs-vehicle-details">
                  <div className="vs-detail-row">
                    <span className="vs-detail-label">Capacity:</span>
                    <span className="vs-detail-value">{vehicle.capacity}</span>
                  </div>
                  <div className="vs-detail-row">
                    <span className="vs-detail-label">Delivery Time:</span>
                    <span className="vs-detail-value">{vehicle.time}</span>
                  </div>
                  <div className="vs-detail-row">
                    <span className="vs-detail-label">Best For:</span>
                    <span className="vs-detail-value">{vehicle.bestFor}</span>
                  </div>
                </div>
                
                <div className="vs-vehicle-features">
                  {vehicle.features.map((feature, index) => (
                    <span key={index} className="vs-feature-tag">{feature}</span>
                  ))}
                </div>
                
                {selectedVehicle === vehicle.id && (
                  <div className="vs-selected-badge">Selected</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="vs-section">
          <h3 className="vs-section-title">
            <span className="vs-section-icon">⭐</span> Additional Services
          </h3>
          <p className="vs-section-desc">Add extra services for better experience</p>
          
          <div className="vs-services-grid">
            {additionalOptions.map(service => (
              <div 
                key={service.id}
                className={`vs-service-card ${additionalServices[service.id] ? 'vs-service-active' : ''}`}
                onClick={() => handleServiceToggle(service.id)}
              >
                <div className="vs-service-checkbox">
                  <div className="vs-checkbox">
                    {additionalServices[service.id] && <span>✓</span>}
                  </div>
                </div>
                <div className="vs-service-info">
                  <h4 className="vs-service-name">{service.name}</h4>
                  <p className="vs-service-desc">{service.desc}</p>
                </div>
                <div className="vs-service-price">{service.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Vehicle Summary */}
        {selectedVehicleData && (
          <div className="vs-summary">
            <h3 className="vs-summary-title">Selected Summary</h3>
            <div className="vs-summary-content">
              <div className="vs-summary-vehicle">
                <div className="vs-summary-icon">{selectedVehicleData.icon}</div>
                <div className="vs-summary-details">
                  <h4>{selectedVehicleData.name}</h4>
                  <p>{selectedVehicleData.capacity} • {selectedVehicleData.time}</p>
                </div>
                <div className="vs-summary-price">{selectedVehicleData.price}</div>
              </div>
              
              <div className="vs-summary-services">
                <h4>Added Services:</h4>
                <div className="vs-services-list">
                  {Object.entries(additionalServices)
                    .filter(([_, isSelected]) => isSelected)
                    .map(([serviceId]) => {
                      const service = additionalOptions.find(s => s.id === serviceId);
                      return service ? (
                        <div key={serviceId} className="vs-service-item">
                          <span>{service.name}</span>
                          <span>{service.price}</span>
                        </div>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="vs-navigation">
          <button type="button" className="vs-prev-btn" onClick={prevStep}>
            <span>←</span> Back to Date & Time
          </button>
          <button type="submit" className="vs-continue-btn" disabled={!selectedVehicle}>
            Continue to Payment 
            <span>→</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleSelector;