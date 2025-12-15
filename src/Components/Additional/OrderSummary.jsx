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
    <div className="summary-container-a2b">
      <div className="summary-header-a2b">
        <div className="step-indicator-a2b">
          <span className="step-badge-a2b">5</span>
          <div>
            <h1 className="summary-title-a2b">Order Summary</h1>
            <p className="summary-subtitle-a2b">Review all details before confirming your order</p>
          </div>
        </div>
      </div>

      <div className="summary-content-a2b">
        {/* Order ID Preview */}
        <div className="order-preview-a2b">
          <div className="preview-icon-a2b">📋</div>
          <div className="preview-content-a2b">
            <div className="preview-title-a2b">Ready to Confirm</div>
            <div className="preview-text-a2b">
              Your shipment from <strong>{data?.fromCity || 'City'}</strong> to <strong>{data?.toCity || 'City'}</strong> is ready to be scheduled.
            </div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="summary-section-a2b">
          <div className="section-header-a2b">
            <div className="section-icon-a2b">📍</div>
            <div>
              <h3 className="section-title-a2b">Shipment Details</h3>
              <p className="section-subtitle-a2b">Pickup and delivery locations</p>
            </div>
          </div>
          
          <div className="details-card-a2b">
            <div className="locations-grid-a2b">
              <div className="location-card-a2b pickup-a2b">
                <div className="location-header-a2b">
                  <div className="location-icon-a2b">📦</div>
                  <h4>Pickup Location</h4>
                </div>
                <div className="location-details-a2b">
                  <div className="detail-item-a2b">
                    <span className="detail-label-a2b">Address:</span>
                    <span className="detail-value-a2b">{data?.fromAddress || "Not specified"}</span>
                  </div>
                  <div className="detail-item-a2b">
                    <span className="detail-label-a2b">City/State:</span>
                    <span className="detail-value-a2b">{data?.fromCity || ""}, {data?.fromState || ""}</span>
                  </div>
                </div>
              </div>
              
              <div className="route-arrow-a2b">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path d="M15 10L25 20L15 30" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="route-distance-a2b">{data?.distance || "0"} km</div>
              </div>
              
              <div className="location-card-a2b delivery-a2b">
                <div className="location-header-a2b">
                  <div className="location-icon-a2b">🏠</div>
                  <h4>Delivery Location</h4>
                </div>
                <div className="location-details-a2b">
                  <div className="detail-item-a2b">
                    <span className="detail-label-a2b">Address:</span>
                    <span className="detail-value-a2b">{data?.toAddress || "Not specified"}</span>
                  </div>
                  <div className="detail-item-a2b">
                    <span className="detail-label-a2b">City/State:</span>
                    <span className="detail-value-a2b">{data?.toCity || ""}, {data?.toState || ""}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package & Schedule */}
        <div className="summary-section-a2b">
          <div className="section-header-a2b">
            <div className="section-icon-a2b">📦</div>
            <div>
              <h3 className="section-title-a2b">Package & Schedule</h3>
              <p className="section-subtitle-a2b">Package details and delivery timeline</p>
            </div>
          </div>
          
          <div className="details-card-a2b">
            <div className="package-grid-a2b">
              <div className="package-item-a2b">
                <div className="package-icon-a2b">⚖️</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Weight</div>
                  <div className="package-value-a2b">{data?.weight || "1"} kg</div>
                </div>
              </div>
              
              <div className="package-item-a2b">
                <div className="package-icon-a2b">📏</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Distance</div>
                  <div className="package-value-a2b">{data?.distance || "0"} km</div>
                </div>
              </div>
              
              <div className="package-item-a2b">
                <div className="package-icon-a2b">📅</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Delivery Date</div>
                  <div className="package-value-a2b">{formatDate(data?.selectedDate)}</div>
                </div>
              </div>
              
              <div className="package-item-a2b">
                <div className="package-icon-a2b">⏰</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Time Slot</div>
                  <div className="package-value-a2b">{data?.selectedTimeSlot || "Not selected"}</div>
                </div>
              </div>
              
              <div className="package-item-a2b">
                <div className="package-icon-a2b">🚀</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Delivery Speed</div>
                  <div className="package-value-a2b">{getDeliveryType()}</div>
                </div>
              </div>
              
              <div className="package-item-a2b">
                <div className="package-icon-a2b">🏷️</div>
                <div className="package-info-a2b">
                  <div className="package-label-a2b">Package Type</div>
                  <div className="package-value-a2b">{data?.packageType?.toUpperCase() || "GENERAL"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle & Services */}
        <div className="summary-section-a2b">
          <div className="section-header-a2b">
            <div className="section-icon-a2b">🚚</div>
            <div>
              <h3 className="section-title-a2b">Vehicle & Services</h3>
              <p className="section-subtitle-a2b">Selected transportation and add-ons</p>
            </div>
          </div>
          
          <div className="details-card-a2b">
            <div className="vehicle-summary-a2b">
              <div className="vehicle-header-a2b">
                <div className="vehicle-icon-a2b">🚛</div>
                <div className="vehicle-info-a2b">
                  <div className="vehicle-name-a2b">{data?.vehicleName || "Not selected"}</div>
                  <div className="vehicle-specs-a2b">Vehicle for your shipment</div>
                </div>
                <div className="vehicle-price-a2b">+₹{prices.vehiclePrice.toLocaleString('en-IN')}</div>
              </div>
            </div>
            
            {hasAdditionalServices && (
              <div className="services-summary-a2b">
                <div className="services-title-a2b">Additional Services:</div>
                <div className="services-list-a2b">
                  {prices.helperPrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">👷</div>
                        <div className="service-name-a2b">Loading Helper</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.helperPrice}</div>
                    </div>
                  )}
                  
                  {prices.insurancePrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">🛡️</div>
                        <div className="service-name-a2b">Premium Insurance</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.insurancePrice}</div>
                    </div>
                  )}
                  
                  {prices.packagingPrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">📦</div>
                        <div className="service-name-a2b">Professional Packaging</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.packagingPrice}</div>
                    </div>
                  )}
                  
                  {prices.fastrackPrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">⚡</div>
                        <div className="service-name-a2b">Fast-Track Delivery</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.fastrackPrice}</div>
                    </div>
                  )}
                  
                  {prices.weekendPrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">🗓️</div>
                        <div className="service-name-a2b">Weekend Delivery</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.weekendPrice}</div>
                    </div>
                  )}
                  
                  {prices.nightPrice > 0 && (
                    <div className="service-item-a2b">
                      <div className="service-info-a2b">
                        <div className="service-icon-a2b">🌙</div>
                        <div className="service-name-a2b">Night Delivery</div>
                      </div>
                      <div className="service-price-a2b">+₹{prices.nightPrice}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="summary-section-a2b">
          <div className="section-header-a2b">
            <div className="section-icon-a2b">💰</div>
            <div>
              <h3 className="section-title-a2b">Payment Summary</h3>
              <p className="section-subtitle-a2b">Breakdown of all charges</p>
            </div>
          </div>
          
          <div className="details-card-a2b payment-card-a2b">
            <div className="payment-breakdown-a2b">
              <div className="payment-item-a2b">
                <span>Base Fare:</span>
                <span>₹{prices.basePrice.toLocaleString('en-IN')}</span>
              </div>
              
              {prices.fastDeliveryCharge > 0 && (
                <div className="payment-item-a2b highlight-a2b">
                  <span>Express Delivery Charge:</span>
                  <span>+₹{prices.fastDeliveryCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="payment-item-a2b">
                <span>Vehicle Charges:</span>
                <span>+₹{prices.vehiclePrice.toLocaleString('en-IN')}</span>
              </div>
              
              {hasAdditionalServices && (
                <div className="payment-item-a2b">
                  <span>Additional Services:</span>
                  <span>+₹{prices.additionalServicesTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="payment-divider-a2b"></div>
              
              <div className="payment-total-a2b">
                <span>Total Amount:</span>
                <span className="total-amount-a2b">₹{prices.total.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="payment-method-a2b">
                <span>Payment Method:</span>
                <span className="method-badge-a2b">{data?.paymentName || "Not selected"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="summary-section-a2b">
          <div className="terms-card-a2b">
            <div className="terms-header-a2b">
              <input type="checkbox" id="termsCheckbox-a2b" className="terms-checkbox-a2b" required />
              <label htmlFor="termsCheckbox-a2b" className="terms-label-a2b">
                <span className="terms-icon-a2b">✅</span>
                <span className="terms-text-a2b">
                  I agree to the <strong>Terms & Conditions</strong> and confirm that all information provided is accurate.
                  I understand that any incorrect information may result in additional charges or delivery delays.
                </span>
              </label>
            </div>
            <div className="terms-note-a2b">
              By confirming this order, you agree to our shipping policies, cancellation terms, and privacy policy.
              A cancellation fee may apply if cancelled after 1 hour of confirmation.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="summary-navigation-a2b">
          <div className="navigation-buttons-a2b">
            <button 
              type="button" 
              className="btn-secondary-a2b"
              onClick={prevStep}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Payment
            </button>
            
            <button 
              type="button" 
              className="btn-primary-a2b"
              onClick={handleConfirmOrder}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="white" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Confirm & Place Order
            </button>
          </div>
          
          <div className="step-progress-a2b">
            <div className="progress-container-a2b">
              <div className="progress-bar-a2b">
                <div className="progress-fill-a2b" style={{ width: '83%' }}></div>
              </div>
              <div className="step-labels-a2b">
                <span className="step-label-a2b">Location</span>
                <span className="step-label-a2b">Date & Time</span>
                <span className="step-label-a2b">Vehicle</span>
                <span className="step-label-a2b">Payment</span>
                <span className="step-label-a2b active">Summary</span>
                <span className="step-label-a2b">Receipt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;