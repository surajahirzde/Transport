import React, { useState, useEffect } from 'react';
import '../Additional/styles/PaymentPage.css';
import AmountForm from './Payment';

const PaymentPage = ({ data = {}, updateData, nextStep, prevStep }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [paymentMethod, setPaymentMethod] = useState(data?.paymentMethod || "");
  const [qrCode, setQrCode] = useState(data?.qrCode || "");
  const [transactionId, setTransactionId] = useState(data?.transactionId || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAmountForm, setShowAmountForm] = useState(false);
  const [upiAmount, setUpiAmount] = useState(0);

  // QR codes for UPI payments
  const qrCodes = [
    { 
      id: "phonepe", 
      name: "PhonePe", 
      qr: "https://upload.wikimedia.org/wikipedia/commons/0/0b/PhonePe_Logo.svg"
    },
    { 
      id: "googlepay", 
      name: "Google Pay", 
      qr: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Pay_Logo.svg"
    },
    { 
      id: "paytm", 
      name: "Paytm", 
      qr: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png"
    },
    { 
      id: "bhim", 
      name: "BHIM UPI", 
      qr: "https://upload.wikimedia.org/wikipedia/commons/8/80/BHIM_Logo.png"
    }
  ];

  // Payment options
  const paymentOptions = [
    { 
      id: "upi", 
      name: "UPI Payment", 
      icon: "📱", 
      color: "#3B82F6",
      description: "Pay instantly via UPI",
      popular: true
    },
    { 
      id: "cod", 
      name: "Cash on Delivery", 
      icon: "💵", 
      color: "#EF4444",
      description: "Pay when package arrives"
    },
  ];

  // Calculate all prices with GST
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
    
    // Calculate GST (18% on subtotal)
    const gstAmount = subtotal * 0.18;
    
    // Final total including GST and fast delivery charge
    const finalTotal = subtotal + gstAmount + fastDeliveryCharge;
    
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
      gstAmount,
      finalTotal
    };
  };

  const prices = calculatePrices();

  useEffect(() => {
    // Set UPI amount when prices are calculated
    setUpiAmount(prices.finalTotal);
  }, [prices.finalTotal]);

  const handlePaymentSelect = (methodId) => {
    setPaymentMethod(methodId);
    if (updateData) {
      updateData("paymentMethod", methodId);
      updateData("paymentName", paymentOptions.find(p => p.id === methodId)?.name);
    }
    
    // Show AmountForm for UPI payments
    if (methodId === "upi") {
      setShowAmountForm(true);
    } else {
      setShowAmountForm(false);
    }
  };

  const handleQrSelect = (qrId) => {
    setQrCode(qrId);
    if (updateData) {
      updateData("qrCode", qrId);
      updateData("qrName", qrCodes.find(q => q.id === qrId)?.name);
    }
  };

  const handleTransactionId = (e) => {
    const value = e.target.value.trim();
    setTransactionId(value);
    if (updateData) {
      updateData("transactionId", value);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === "upi") {
      // For UPI, we use AmountForm which auto-submits
      return;
    }
    
    if (paymentMethod === "cod") {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        nextStep();
      }, 1500);
      return;
    }
    
    if (!transactionId) {
      alert("Please enter transaction ID");
      return;
    }
    
    if (transactionId.length < 8) {
      alert("Please enter a valid transaction ID (minimum 8 characters)");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 1500);
  };

  // Handle successful UPI payment
  const handleUpiSuccess = () => {
    if (updateData) {
      updateData("paymentStatus", "completed");
      updateData("transactionId", "UPI_TXN_" + Date.now().toString().slice(-8));
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 2000);
  };

  const selectedPayment = paymentOptions.find(p => p.id === paymentMethod);
  const selectedVehicleName = data?.vehicleName || "Vehicle";

  return (
    <div className="payment-container-x7y">
      <div className="payment-header-x7y">
        <div className="step-indicator-x7y">
          <span className="step-badge-x7y">4</span>
          <div>
            <h1 className="payment-title-x7y">Payment Details</h1>
            <p className="payment-subtitle-x7y">Complete payment to confirm your shipment</p>
          </div>
        </div>
      </div>

      <div className="payment-content-x7y">
        <form onSubmit={handlePaymentSubmit} className="payment-form-x7y">
          
          {/* Order Summary - Top Section */}
          <div className="payment-section-x7y summary-section-x7y">
            <div className="section-header-x7y">
              <div className="section-icon-x7y">💰</div>
              <div>
                <h3 className="section-title-x7y">Order Summary</h3>
                <p className="section-subtitle-x7y">Review your order details and amount</p>
              </div>
            </div>
            
            <div className="summary-card-x7y">
              <div className="summary-items-x7y">
                <div className="summary-item-x7y">
                  <span>Base Fare:</span>
                  <span>₹{prices.basePrice.toLocaleString('en-IN')}</span>
                </div>
                
                {prices.fastDeliveryCharge > 0 && (
                  <div className="summary-item-x7y">
                    <span>Express Delivery:</span>
                    <span className="highlight-x7y">+₹{prices.fastDeliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="summary-item-x7y">
                  <span>Vehicle ({selectedVehicleName}):</span>
                  <span>+₹{prices.vehiclePrice.toLocaleString('en-IN')}</span>
                </div>
                
                {prices.additionalServicesTotal > 0 && (
                  <div className="summary-services-x7y">
                    <div className="services-title-x7y">Additional Services:</div>
                    {prices.helperPrice > 0 && <div className="service-item-x7y">Loading Helper: +₹{prices.helperPrice}</div>}
                    {prices.insurancePrice > 0 && <div className="service-item-x7y">Premium Insurance: +₹{prices.insurancePrice}</div>}
                    {prices.packagingPrice > 0 && <div className="service-item-x7y">Professional Packaging: +₹{prices.packagingPrice}</div>}
                    {prices.fastrackPrice > 0 && <div className="service-item-x7y">Fast-Track Delivery: +₹{prices.fastrackPrice}</div>}
                    {prices.weekendPrice > 0 && <div className="service-item-x7y">Weekend Delivery: +₹{prices.weekendPrice}</div>}
                    {prices.nightPrice > 0 && <div className="service-item-x7y">Night Delivery: +₹{prices.nightPrice}</div>}
                  </div>
                )}
                
                <div className="summary-divider-x7y"></div>
                
                {/* Subtotal Row */}
                <div className="summary-item-x7y subtotal-item-x7y">
                  <span>Subtotal:</span>
                  <span className="subtotal-amount-x7y">₹{prices.subtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {/* GST Row */}
                <div className="summary-item-x7y gst-item-x7y">
                  <span>GST (18%):</span>
                  <span className="gst-amount-x7y">+₹{prices.gstAmount.toFixed(0).toLocaleString('en-IN')}</span>
                </div>
                
                {/* Total Amount Row */}
                <div className="summary-total-x7y">
                  <div className="total-left-x7y">
                    <span className="total-label-x7y">Final Total Amount:</span>
                    <span className="gst-note-x7y">(Including 18% GST)</span>
                  </div>
                  <div className="total-right-x7y">
                    <span className="final-total-amount-x7y">₹{prices.finalTotal.toFixed(0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-section-x7y">
            <div className="section-header-x7y">
              <div className="section-icon-x7y">💳</div>
              <div>
                <h3 className="section-title-x7y">Payment Method</h3>
                <p className="section-subtitle-x7y">Choose how you want to pay</p>
              </div>
            </div>
            
            <div className="payment-methods-x7y">
              {paymentOptions.map(method => (
                <button
                  type="button"
                  key={method.id}
                  className={`payment-method-card-x7y ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(method.id)}
                  style={{ 
                    borderColor: paymentMethod === method.id ? method.color : '#E5E7EB',
                    backgroundColor: paymentMethod === method.id ? `${method.color}10` : 'white'
                  }}
                >
                  {method.popular && (
                    <div className="popular-badge-x7y" style={{ backgroundColor: method.color }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className="method-icon-x7y" style={{ backgroundColor: `${method.color}20`, color: method.color }}>
                    <span style={{ fontSize: '24px' }}>{method.icon}</span>
                  </div>
                  
                  <div className="method-details-x7y">
                    <div className="method-name-x7y">{method.name}</div>
                    <div className="method-desc-x7y">{method.description}</div>
                  </div>
                  
                  <div className="method-radio-x7y">
                    <div className={`radio-circle-x7y ${paymentMethod === method.id ? 'checked' : ''}`}>
                      {paymentMethod === method.id && (
                        <div className="radio-dot-x7y" style={{ backgroundColor: method.color }}></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* UPI Payment Section with AmountForm */}
          {paymentMethod === "upi" && showAmountForm && (
            <div className="payment-section-x7y upi-amount-section">
              <div className="section-header-x7y">
                <div className="section-icon-x7y">📱</div>
                <div>
                  <h3 className="section-title-x7y">UPI Payment</h3>
                  <p className="section-subtitle-x7y">Complete payment using UPI</p>
                </div>
              </div>
              
              <div className="upi-amount-container">
                <AmountForm amount={upiAmount} onSuccess={handleUpiSuccess} />
                
                <div className="payment-status-info">
                  <div className="status-card">
                    <div className="status-icon">💡</div>
                    <div className="status-content">
                      <h4>Important Notes:</h4>
                      <ul className="status-list">
                        <li>Payment will be processed instantly via UPI</li>
                        <li>You will be redirected to your UPI app</li>
                        <li>Complete the payment in your UPI app</li>
                        <li>You'll receive confirmation on WhatsApp/Email</li>
                        <li>Keep the transaction ID for future reference</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash on Delivery Section */}
          {paymentMethod === "cod" && (
            <div className="payment-section-x7y cod-section-x7y">
              <div className="section-header-x7y">
                <div className="section-icon-x7y">💵</div>
                <div>
                  <h3 className="section-title-x7y">Cash on Delivery</h3>
                  <p className="section-subtitle-x7y">Pay when your package arrives</p>
                </div>
              </div>
              
              <div className="cod-card-x7y">
                <div className="cod-icon-x7y">💵</div>
                <div className="cod-content-x7y">
                  <h4>Cash on Delivery Selected</h4>
                  <p className="cod-amount-x7y">
                    Pay <strong>₹{prices.finalTotal.toFixed(0).toLocaleString('en-IN')}</strong> when our delivery executive arrives with your package.
                    <span className="gst-info-cod"> (Includes 18% GST)</span>
                  </p>
                  <ul className="cod-features-x7y">
                    <li>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#10B98120" stroke="#10B981" strokeWidth="2"/>
                        <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      No advance payment required
                    </li>
                    <li>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#10B98120" stroke="#10B981" strokeWidth="2"/>
                        <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Pay via cash, UPI, or card at doorstep
                    </li>
                    <li>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#10B98120" stroke="#10B981" strokeWidth="2"/>
                        <path d="M6 10L9 13L14 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Get digital receipt instantly on WhatsApp/Email
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="payment-navigation-x7y">
            <div className="navigation-buttons-x7y">
              <button 
                type="button" 
                className="btn-secondary-x7y"
                onClick={prevStep}
                disabled={isProcessing}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Vehicle
              </button>
              
              {paymentMethod !== "upi" && (
                <button 
                  type="submit" 
                  className="btn-primary-x7y"
                  disabled={!paymentMethod || isProcessing || 
                    (paymentMethod !== "cod" && !transactionId)}
                  style={{ 
                    backgroundColor: paymentMethod === "cod" ? "#EF4444" : "#10B981"
                  }}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-x7y"></span>
                      Processing...
                    </>
                  ) : paymentMethod === "cod" ? (
                    `Confirm COD (₹${prices.finalTotal.toFixed(0).toLocaleString('en-IN')})`
                  ) : (
                    `Pay ₹${prices.finalTotal.toFixed(0).toLocaleString('en-IN')}`
                  )}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="step-progress-x7y">
              <div className="progress-container-x7y">
                <div className="progress-bar-x7y">
                  <div className="progress-fill-x7y" style={{ width: '66%' }}></div>
                </div>
                <div className="step-labels-x7y">
                  <span className="step-label-x7y">Location</span>
                  <span className="step-label-x7y">Date & Time</span>
                  <span className="step-label-x7y">Vehicle</span>
                  <span className="step-label-x7y active">Payment</span>
                  <span className="step-label-x7y">Summary</span>
                  <span className="step-label-x7y">Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;