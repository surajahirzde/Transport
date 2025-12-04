import React, { useState } from 'react';
import '../Additional/styles/LocationForm.css';

const LocationForm = ({ data = {}, updateData, nextStep }) => {
  const [formData, setFormData] = useState({
    fromState: data?.fromState || "",
    fromCity: data?.fromCity || "",
    fromAddress: data?.fromAddress || "",
    toState: data?.toState || "",
    toCity: data?.toCity || "",
    toAddress: data?.toAddress || "",
    packageType: data?.packageType || "general",
    weight: data?.weight || "1",
    distance: data?.distance || "",
    estimatedPrice: data?.estimatedPrice || "",
  });

  const indianStates = [
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
    "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];

  const packageTypes = [
    { id: "general", name: "General Goods", icon: "📦", description: "Household items, books, etc." },
    { id: "documents", name: "Documents", icon: "📄", description: "Files, certificates, papers" },
    { id: "electronics", name: "Electronics", icon: "💻", description: "Phones, laptops, gadgets" },
    { id: "fragile", name: "Fragile Items", icon: "🥚", description: "Glass, ceramics, delicate items" },
    { id: "clothing", name: "Clothing", icon: "👕", description: "Clothes, fabrics, textiles" },
    { id: "furniture", name: "Furniture", icon: "🪑", description: "Furniture, large items" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    if (updateData) updateData(name, value);
  };

  const handlePackageSelect = (type) => {
    const updatedData = { ...formData, packageType: type };
    setFormData(updatedData);
    if (updateData) updateData("packageType", type);
  };

  const calculatePrice = () => {
    const distance = parseFloat(formData.distance) || 0;
    const weight = parseFloat(formData.weight) || 1;
    
    if (distance < 1) {
      alert("❗ Please enter distance (minimum 1 km)");
      return;
    }
    
    if (distance > 5000) {
      alert("❗ Maximum distance allowed is 5000 km");
      return;
    }
    
    // ₹10 per km × distance + weight charge
    const basePrice = distance * 10;
    const weightCharge = (weight - 1) * 20; // ₹20 extra per kg over 1kg
    const total = Math.round(basePrice + weightCharge);
    
    const updatedData = { 
      ...formData, 
      estimatedPrice: total 
    };
    
    setFormData(updatedData);
    
    if (updateData) {
      updateData("estimatedPrice", total);
    }
    
    alert(`✅ Price calculated: ₹${total} (₹${distance} × 10 + ₹${weightCharge} weight charge)`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.distance || !formData.estimatedPrice) {
      alert("❗ Please calculate price first.");
      return;
    }
    
    const requiredFields = ['fromState', 'fromCity', 'fromAddress', 'toState', 'toCity', 'toAddress', 'packageType'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`❗ Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    if (nextStep) {
      nextStep();
    }
  };

  return (
    <div className="location-form-container">
      <div className="form-header-section">
        <h2 className="form-main-title">📍 Step 1: Shipping Details</h2>
        <p className="form-subtitle">Fill in pickup and delivery locations to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="location-main-form">
        
        {/* FROM Location Section */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">🚚</span>
            <h3 className="section-title">Pickup Location</h3>
          </div>
          
          <div className="responsive-form-grid">
            <div className="form-group-responsive">
              <label className="form-label">State *</label>
              <select 
                name="fromState" 
                value={formData.fromState}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group-responsive">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="fromCity"
                value={formData.fromCity}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
                required
              />
            </div>

            <div className="form-group-responsive full-width">
              <label className="form-label">Complete Address *</label>
              <textarea
                name="fromAddress"
                value={formData.fromAddress}
                onChange={handleChange}
                className="form-textarea"
                placeholder="House no, Street, Area, Landmark..."
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        {/* TO Location Section */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">🏠</span>
            <h3 className="section-title">Delivery Location</h3>
          </div>
          
          <div className="responsive-form-grid">
            <div className="form-group-responsive">
              <label className="form-label">State *</label>
              <select 
                name="toState" 
                value={formData.toState}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group-responsive">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="toCity"
                value={formData.toCity}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter city"
                required
              />
            </div>

            <div className="form-group-responsive full-width">
              <label className="form-label">Complete Address *</label>
              <textarea
                name="toAddress"
                value={formData.toAddress}
                onChange={handleChange}
                className="form-textarea"
                placeholder="House no, Street, Area, Landmark..."
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        {/* Package Type Selection - LIST FORMAT */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">📦</span>
            <h3 className="section-title">Select Goods Type</h3>
          </div>
          
          <div className="package-list-container">
            <div className="package-list">
              {packageTypes.map(pkg => (
                <div 
                  key={pkg.id}
                  className={`package-list-item ${formData.packageType === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <div className="package-list-icon">
                    {pkg.icon}
                  </div>
                  <div className="package-list-content">
                    <div className="package-list-name">{pkg.name}</div>
                    <div className="package-list-desc">{pkg.description}</div>
                  </div>
                  <div className="package-list-radio">
                    <div className={`radio-circle ${formData.packageType === pkg.id ? 'checked' : ''}`}>
                      {formData.packageType === pkg.id && <div className="radio-dot"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weight and Distance Section - PROPER RESPONSIVE */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">💰</span>
            <h3 className="section-title">Calculate Fare</h3>
            <p className="section-subtitle">Price = Distance × ₹10 + Weight Charge</p>
          </div>
          
          <div className="fare-container">
            <div className="fare-inputs">
              <div className="fare-input-group">
                <label className="fare-label">Package Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="fare-input"
                  placeholder="e.g., 5"
                  min="0.1"
                  step="0.1"
                  required
                />
                <div className="fare-note">₹20 extra per kg over 1kg</div>
              </div>
              
              <div className="fare-input-group">
                <label className="fare-label">Approx. Distance (km) *</label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  className="fare-input"
                  placeholder="Enter distance"
                  min="1"
                  max="5000"
                  required
                />
                <div className="fare-note">₹10 per km fare</div>
              </div>
            </div>
            
            <button 
              type="button" 
              className="calculate-btn"
              onClick={calculatePrice}
            >
              🧮 Calculate Price
            </button>
            
            {formData.estimatedPrice && (
              <div className="fare-result">
                <div className="fare-breakdown">
                  <div className="fare-row">
                    <span>Distance Fare:</span>
                    <span>{formData.distance} km × ₹10 = ₹{formData.distance * 10}</span>
                  </div>
                  <div className="fare-row">
                    <span>Weight Charge:</span>
                    <span>{(formData.weight - 1) > 0 ? `₹${(formData.weight - 1) * 20} extra` : 'No extra charge'}</span>
                  </div>
                  <div className="fare-total">
                    <span>Total Estimated Price:</span>
                    <span className="total-amount">₹{formData.estimatedPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={!formData.estimatedPrice}
          >
            Continue to Date & Time →
          </button>
          <p className="form-note">
            * All fields are required. Fill weight and distance to calculate price.
          </p>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;