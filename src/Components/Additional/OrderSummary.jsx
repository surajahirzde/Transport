import React, { useEffect } from 'react';
import '../Additional/styles/OrderSummary.css';

const OrderSummary = ({ data = {}, updateData, nextStep, prevStep }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Calculate all prices
  const calculatePrices = () => {
    const basePrice = Number(data?.estimatedPrice) || 0;
    const fastDeliveryCharge = Number(data?.fastDeliveryCharge) || 0;
    const vehiclePrice = Number(data?.vehiclePrice) || 0;
    
    // All 6 additional services
    const helperPrice = data?.helperService ? 150 : 0;
    const insurancePrice = data?.insuranceService ? 300 : 0;
    const packagingPrice = data?.packagingService ? 200 : 0;
    const fastrackPrice = data?.fastrackService ? 500 : 0;
    const weekendPrice = data?.weekendService ? 250 : 0;
    const nightPrice = data?.nightService ? 350 : 0;
    
    const additionalServicesTotal = helperPrice + insurancePrice + packagingPrice + fastrackPrice + weekendPrice + nightPrice;
    
    const subtotal = basePrice + vehiclePrice + additionalServicesTotal;
    const total = subtotal + fastDeliveryCharge;
    
    return {
      basePrice,
      fastDeliveryCharge,
      vehiclePrice,
      helperPrice,
      insurancePrice,
      packagingPrice,
      fastrackPrice,
      weekendPrice,
      nightPrice,
      additionalServicesTotal,
      subtotal,
      total
    };
  };

  const prices = calculatePrices();

  const generateTrackingId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let trackingId = 'TRK';
    for (let i = 0; i < 9; i++) {
      trackingId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return trackingId;
  };

  const handleConfirmOrder = () => {
    // Generate tracking ID
    const trackingId = generateTrackingId();
    const now = new Date();
    
    if (updateData) {
      updateData("trackingId", trackingId);
      updateData("orderDate", now.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }));
      updateData("orderTime", now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
    }
    
    // Move to next step (Receipt)
    nextStep();
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Get delivery urgency display name
  const getDeliveryType = () => {
    switch(data?.deliveryUrgency) {
      case 'express': return 'Express (1-2 days)';
      case 'same-day': return 'Same Day Delivery';
      default: return 'Standard (3-5 days)';
    }
  };

  // Check if any service is selected
  const hasAdditionalServices = prices.additionalServicesTotal > 0;

  return (
    <div className="summary-container">
      <div className="summary-header">
        <div className="step-indicator">
          <span className="step-badge">5</span>
          <div>
            <h1 className="summary-title">Order Summary</h1>
            <p className="summary-subtitle">Review all details before confirming your order</p>
          </div>
        </div>
      </div>

      <div className="summary-content">
        {/* Order ID Preview */}
        <div className="order-preview">
          <div className="preview-icon">📋</div>
          <div className="preview-content">
            <div className="preview-title">Ready to Confirm</div>
            <div className="preview-text">
              Your shipment from <strong>{data?.fromCity || 'City'}</strong> to <strong>{data?.toCity || 'City'}</strong> is ready to be scheduled.
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="summary-section">
          <div className="section-header">
            <div className="section-icon">📍</div>
            <div>
              <h3 className="section-title">Shipment Details</h3>
              <p className="section-subtitle">Pickup and delivery locations</p>
            </div>
          </div>
          
          <div className="details-card">
            <div className="locations-grid">
              <div className="location-card pickup">
                <div className="location-header">
                  <div className="location-icon">📦</div>
                  <h4>Pickup Location</h4>
                </div>
                <div className="location-details">
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{data?.fromAddress || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City/State:</span>
                    <span className="detail-value">{data?.fromCity || ""}, {data?.fromState || ""}</span>
                  </div>
                </div>
              </div>
              
              <div className="route-arrow">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M15 10L25 20L15 30" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="route-distance">{data?.distance || "0"} km</div>
              </div>
              
              <div className="location-card delivery">
                <div className="location-header">
                  <div className="location-icon">🏠</div>
                  <h4>Delivery Location</h4>
                </div>
                <div className="location-details">
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{data?.toAddress || "Not specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City/State:</span>
                    <span className="detail-value">{data?.toCity || ""}, {data?.toState || ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package & Schedule */}
        <div className="summary-section">
          <div className="section-header">
            <div className="section-icon">📦</div>
            <div>
              <h3 className="section-title">Package & Schedule</h3>
              <p className="section-subtitle">Package details and delivery timeline</p>
            </div>
          </div>
          
          <div className="details-card">
            <div className="package-grid">
              <div className="package-item">
                <div className="package-icon">⚖️</div>
                <div className="package-info">
                  <div className="package-label">Weight</div>
                  <div className="package-value">{data?.weight || "1"} kg</div>
                </div>
              </div>
              
              <div className="package-item">
                <div className="package-icon">📏</div>
                <div className="package-info">
                  <div className="package-label">Distance</div>
                  <div className="package-value">{data?.distance || "0"} km</div>
                </div>
              </div>
              
              <div className="package-item">
                <div className="package-icon">📅</div>
                <div className="package-info">
                  <div className="package-label">Delivery Date</div>
                  <div className="package-value">{formatDate(data?.selectedDate)}</div>
                </div>
              </div>
              
              <div className="package-item">
                <div className="package-icon">⏰</div>
                <div className="package-info">
                  <div className="package-label">Time Slot</div>
                  <div className="package-value">{data?.selectedTimeSlot || "Not selected"}</div>
                </div>
              </div>
              
              <div className="package-item">
                <div className="package-icon">🚀</div>
                <div className="package-info">
                  <div className="package-label">Delivery Speed</div>
                  <div className="package-value">{getDeliveryType()}</div>
                </div>
              </div>
              
              <div className="package-item">
                <div className="package-icon">🏷️</div>
                <div className="package-info">
                  <div className="package-label">Package Type</div>
                  <div className="package-value">{data?.packageType?.toUpperCase() || "GENERAL"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Services */}
        <div className="summary-section">
          <div className="section-header">
            <div className="section-icon">🚚</div>
            <div>
              <h3 className="section-title">Vehicle & Services</h3>
              <p className="section-subtitle">Selected transportation and add-ons</p>
            </div>
          </div>
          
          <div className="details-card">
            <div className="vehicle-summary">
              <div className="vehicle-header">
                <div className="vehicle-icon">🚛</div>
                <div className="vehicle-info">
                  <div className="vehicle-name">{data?.vehicleName || "Not selected"}</div>
                  <div className="vehicle-specs">Vehicle for your shipment</div>
                </div>
                <div className="vehicle-price">+₹{prices.vehiclePrice.toLocaleString('en-IN')}</div>
              </div>
            </div>
            
            {hasAdditionalServices && (
              <div className="services-summary">
                <div className="services-title">Additional Services:</div>
                <div className="services-list">
                  {prices.helperPrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">👷</div>
                        <div className="service-name">Loading Helper</div>
                      </div>
                      <div className="service-price">+₹{prices.helperPrice}</div>
                    </div>
                  )}
                  
                  {prices.insurancePrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">🛡️</div>
                        <div className="service-name">Premium Insurance</div>
                      </div>
                      <div className="service-price">+₹{prices.insurancePrice}</div>
                    </div>
                  )}
                  
                  {prices.packagingPrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">📦</div>
                        <div className="service-name">Professional Packaging</div>
                      </div>
                      <div className="service-price">+₹{prices.packagingPrice}</div>
                    </div>
                  )}
                  
                  {prices.fastrackPrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">⚡</div>
                        <div className="service-name">Fast-Track Delivery</div>
                      </div>
                      <div className="service-price">+₹{prices.fastrackPrice}</div>
                    </div>
                  )}
                  
                  {prices.weekendPrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">🗓️</div>
                        <div className="service-name">Weekend Delivery</div>
                      </div>
                      <div className="service-price">+₹{prices.weekendPrice}</div>
                    </div>
                  )}
                  
                  {prices.nightPrice > 0 && (
                    <div className="service-item">
                      <div className="service-info">
                        <div className="service-icon">🌙</div>
                        <div className="service-name">Night Delivery</div>
                      </div>
                      <div className="service-price">+₹{prices.nightPrice}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="summary-section">
          <div className="section-header">
            <div className="section-icon">💰</div>
            <div>
              <h3 className="section-title">Payment Summary</h3>
              <p className="section-subtitle">Breakdown of all charges</p>
            </div>
          </div>
          
          <div className="details-card payment-card">
            <div className="payment-breakdown">
              <div className="payment-item">
                <span>Base Fare:</span>
                <span>₹{prices.basePrice.toLocaleString('en-IN')}</span>
              </div>
              
              {prices.fastDeliveryCharge > 0 && (
                <div className="payment-item highlight">
                  <span>Express Delivery Charge:</span>
                  <span>+₹{prices.fastDeliveryCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="payment-item">
                <span>Vehicle Charges:</span>
                <span>+₹{prices.vehiclePrice.toLocaleString('en-IN')}</span>
              </div>
              
              {hasAdditionalServices && (
                <div className="payment-item">
                  <span>Additional Services:</span>
                  <span>+₹{prices.additionalServicesTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="payment-divider"></div>
              
              <div className="payment-total">
                <span>Total Amount:</span>
                <span className="total-amount">₹{prices.total.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="payment-method">
                <span>Payment Method:</span>
                <span className="method-badge">{data?.paymentName || "Not selected"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="summary-section">
          <div className="terms-card">
            <div className="terms-header">
              <input type="checkbox" id="termsCheckbox" className="terms-checkbox" required />
              <label htmlFor="termsCheckbox" className="terms-label">
                <span className="terms-icon">✅</span>
                <span className="terms-text">
                  I agree to the <strong>Terms & Conditions</strong> and confirm that all information provided is accurate.
                  I understand that any incorrect information may result in additional charges or delivery delays.
                </span>
              </label>
            </div>
            <div className="terms-note">
              By confirming this order, you agree to our shipping policies, cancellation terms, and privacy policy.
              A cancellation fee may apply if cancelled after 1 hour of confirmation.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="summary-navigation">
          <div className="navigation-buttons">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={prevStep}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Payment
            </button>
            
            <button 
              type="button" 
              className="btn-primary"
              onClick={handleConfirmOrder}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="white" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirm & Place Order
            </button>
          </div>
          
          <div className="step-progress">
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '83%' }}></div>
              </div>
              <div className="step-labels">
                <span className="step-label">Location</span>
                <span className="step-label">Date & Time</span>
                <span className="step-label">Vehicle</span>
                <span className="step-label">Payment</span>
                <span className="step-label active">Summary</span>
                <span className="step-label">Receipt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;