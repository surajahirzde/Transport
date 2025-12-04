import React from 'react';
import '../Additional/styles/OrderSummary.css';

const OrderSummary = ({ data = {}, updateData, nextStep, prevStep }) => {
  
  const calculateTotal = () => {
    const basePrice = parseInt(data?.estimatedPrice || 0);
    const vehiclePrice = parseInt(data?.vehiclePrice?.replace('+₹', '') || 0);
    const helperService = data?.helperService ? 150 : 0;
    const insuranceService = data?.insuranceService ? 300 : 0;
    const packagingService = data?.packagingService ? 200 : 0;
    
    return basePrice + vehiclePrice + helperService + insuranceService + packagingService;
  };

  const generateTrackingId = () => {
    return `TRK${Math.floor(100000 + Math.random() * 900000)}IND`;
  };

  const handleConfirmOrder = () => {
    // Generate tracking ID
    const trackingId = generateTrackingId();
    if (updateData) {
      updateData("trackingId", trackingId);
      updateData("orderDate", new Date().toLocaleDateString('en-IN'));
      updateData("orderTime", new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }
    
    // Move to next step (Receipt)
    nextStep();
  };

  return (
    <div className="os-container">
      <div className="os-header">
        <div className="os-step-indicator">
          <span className="os-step-number">5</span>
          <div className="os-step-info">
            <h1 className="os-title">Order Summary</h1>
            <p className="os-subtitle">Review your order details before confirmation</p>
          </div>
        </div>
      </div>

      <div className="os-content">
        {/* Order Details Card */}
        <div className="os-details-card">
          <h3 className="os-section-title">
            <span className="os-section-icon">📦</span> Shipment Details
          </h3>
          
          <div className="os-details-grid">
            <div className="os-detail-group">
              <h4 className="os-group-title">Pickup Location</h4>
              <div className="os-detail-item">
                <span className="os-detail-label">Address:</span>
                <span className="os-detail-value">{data?.fromAddress || "Not specified"}</span>
              </div>
              <div className="os-detail-item">
                <span className="os-detail-label">City/State:</span>
                <span className="os-detail-value">{data?.fromCity || ""}, {data?.fromState || ""}</span>
              </div>
            </div>
            
            <div className="os-detail-group">
              <h4 className="os-group-title">Delivery Location</h4>
              <div className="os-detail-item">
                <span className="os-detail-label">Address:</span>
                <span className="os-detail-value">{data?.toAddress || "Not specified"}</span>
              </div>
              <div className="os-detail-item">
                <span className="os-detail-label">City/State:</span>
                <span className="os-detail-value">{data?.toCity || ""}, {data?.toState || ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Package & Delivery Details */}
        <div className="os-details-card">
          <h3 className="os-section-title">
            <span className="os-section-icon">📋</span> Package & Delivery Info
          </h3>
          
          <div className="os-info-grid">
            <div className="os-info-item">
              <span className="os-info-label">Package Type:</span>
              <span className="os-info-value">{data?.packageType?.toUpperCase() || "General"}</span>
            </div>
            <div className="os-info-item">
              <span className="os-info-label">Weight:</span>
              <span className="os-info-value">{data?.weight || "1"} kg</span>
            </div>
            <div className="os-info-item">
              <span className="os-info-label">Distance:</span>
              <span className="os-info-value">{data?.distance || "0"} km</span>
            </div>
            <div className="os-info-item">
              <span className="os-info-label">Delivery Date:</span>
              <span className="os-info-value">
                {data?.selectedDate ? new Date(data.selectedDate).toLocaleDateString('en-IN') : "Not selected"}
              </span>
            </div>
            <div className="os-info-item">
              <span className="os-info-label">Time Slot:</span>
              <span className="os-info-value">{data?.selectedTimeSlot || "Not selected"}</span>
            </div>
            <div className="os-info-item">
              <span className="os-info-label">Delivery Type:</span>
              <span className="os-info-value">{data?.deliveryUrgency?.toUpperCase() || "Normal"}</span>
            </div>
          </div>
        </div>

        {/* Vehicle & Services */}
        <div className="os-details-card">
          <h3 className="os-section-title">
            <span className="os-section-icon">🚚</span> Vehicle & Services
          </h3>
          
          <div className="os-services-grid">
            <div className="os-service-item">
              <div className="os-service-name">Selected Vehicle:</div>
              <div className="os-service-value">{data?.vehicleName || "Not selected"}</div>
              <div className="os-service-price">{data?.vehiclePrice || "+₹0"}</div>
            </div>
            
            {data?.helperService && (
              <div className="os-service-item">
                <div className="os-service-name">Loading Helper:</div>
                <div className="os-service-value">Included</div>
                <div className="os-service-price">+₹150</div>
              </div>
            )}
            
            {data?.insuranceService && (
              <div className="os-service-item">
                <div className="os-service-name">Package Insurance:</div>
                <div className="os-service-value">Coverage ₹50,000</div>
                <div className="os-service-price">+₹300</div>
              </div>
            )}
            
            {data?.packagingService && (
              <div className="os-service-item">
                <div className="os-service-name">Professional Packaging:</div>
                <div className="os-service-value">Bubble wrap, carton</div>
                <div className="os-service-price">+₹200</div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="os-details-card os-payment-card">
          <h3 className="os-section-title">
            <span className="os-section-icon">💰</span> Payment Summary
          </h3>
          
          <div className="os-payment-summary">
            <div className="os-payment-row">
              <span>Base Fare:</span>
              <span>₹{data?.estimatedPrice || 0}</span>
            </div>
            <div className="os-payment-row">
              <span>Vehicle Charges:</span>
              <span>{data?.vehiclePrice || "+₹0"}</span>
            </div>
            <div className="os-payment-row">
              <span>Additional Services:</span>
              <span>
                +₹{(data?.helperService ? 150 : 0) + 
                    (data?.insuranceService ? 300 : 0) + 
                    (data?.packagingService ? 200 : 0)}
              </span>
            </div>
            <div className="os-payment-divider"></div>
            <div className="os-payment-total">
              <span>Total Amount:</span>
              <span className="os-total-amount">₹{calculateTotal()}</span>
            </div>
            <div className="os-payment-method">
              <span>Payment Method:</span>
              <span className="os-method">{data?.paymentName || "Not selected"}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="os-terms-card">
          <div className="os-terms-header">
            <input type="checkbox" id="termsCheckbox" className="os-terms-checkbox" required />
            <label htmlFor="termsCheckbox" className="os-terms-label">
              I agree to the Terms & Conditions and confirm that all information provided is accurate.
            </label>
          </div>
          <div className="os-terms-note">
            By confirming, you agree to our shipping policies, cancellation policy, and privacy terms.
          </div>
        </div>

        {/* Navigation */}
        <div className="os-navigation">
          <button 
            type="button" 
            className="os-prev-btn"
            onClick={prevStep}
          >
            <span>←</span> Back to Payment
          </button>
          
          <button 
            type="button" 
            className="os-confirm-btn"
            onClick={handleConfirmOrder}
          >
            ✅ Confirm & Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;