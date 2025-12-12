import React, { useState, useEffect } from 'react';
import '../Additional/styles/PaymentPage.css';

const PaymentPage = ({ data = {}, updateData, nextStep, prevStep }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [paymentMethod, setPaymentMethod] = useState(data?.paymentMethod || "");
  const [qrCode, setQrCode] = useState(data?.qrCode || "");
  const [transactionId, setTransactionId] = useState(data?.transactionId || "");
  const [isProcessing, setIsProcessing] = useState(false);

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
      id: "card", 
      name: "Credit/Debit Card", 
      icon: "💳", 
      color: "#10B981",
      description: "Visa, MasterCard, RuPay"
    },
    { 
      id: "netbanking", 
      name: "Net Banking", 
      icon: "🏦", 
      color: "#F59E0B",
      description: "All major banks"
    },
    { 
      id: "wallet", 
      name: "Wallet", 
      icon: "💰", 
      color: "#8B5CF6",
      description: "Paytm, PhonePe, Google Pay"
    },
    { 
      id: "cod", 
      name: "Cash on Delivery", 
      icon: "💵", 
      color: "#EF4444",
      description: "Pay when package arrives"
    },
  ];

  // QR Code options for UPI
  const qrCodes = [
    { id: "paytm", name: "Paytm", qr: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PaytmUPI:9876543210@paytm" },
    { id: "phonepe", name: "PhonePe", qr: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPIID:9876543210@ybl" },
    { id: "googlepay", name: "Google Pay", qr: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI:9876543210@okhdfcbank" },
    { id: "bhim", name: "BHIM UPI", qr: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=UPI:9876543210@axisbank" },
  ];

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

  const handlePaymentSelect = (methodId) => {
    setPaymentMethod(methodId);
    if (updateData) {
      updateData("paymentMethod", methodId);
      updateData("paymentName", paymentOptions.find(p => p.id === methodId)?.name);
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
    
    if (paymentMethod === "upi" && !qrCode) {
      alert("Please select a UPI app for QR code payment");
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

  const selectedPayment = paymentOptions.find(p => p.id === paymentMethod);
  const selectedQr = qrCodes.find(q => q.id === qrCode);
  const selectedVehicleName = data?.vehicleName || "Vehicle";

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <div className="step-indicator">
          <span className="step-badge">4</span>
          <div>
            <h1 className="payment-title">Payment Details</h1>
            <p className="payment-subtitle">Complete payment to confirm your shipment</p>
          </div>
        </div>
      </div>

      <div className="payment-content">
        <form onSubmit={handlePaymentSubmit} className="payment-form">
          
          {/* Order Summary - Top Section */}
          <div className="payment-section summary-section">
            <div className="section-header">
              <div className="section-icon">💰</div>
              <div>
                <h3 className="section-title">Order Summary</h3>
                <p className="section-subtitle">Review your order details and amount</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-items">
                <div className="summary-item">
                  <span>Base Fare:</span>
                  <span>₹{prices.basePrice.toLocaleString('en-IN')}</span>
                </div>
                
                {prices.fastDeliveryCharge > 0 && (
                  <div className="summary-item">
                    <span>Express Delivery:</span>
                    <span className="highlight">+₹{prices.fastDeliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="summary-item">
                  <span>Vehicle ({selectedVehicleName}):</span>
                  <span>+₹{prices.vehiclePrice.toLocaleString('en-IN')}</span>
                </div>
                
                {prices.additionalServicesTotal > 0 && (
                  <div className="summary-services">
                    <div className="services-title">Additional Services:</div>
                    {prices.helperPrice > 0 && <div className="service-item">Loading Helper: +₹{prices.helperPrice}</div>}
                    {prices.insurancePrice > 0 && <div className="service-item">Premium Insurance: +₹{prices.insurancePrice}</div>}
                    {prices.packagingPrice > 0 && <div className="service-item">Professional Packaging: +₹{prices.packagingPrice}</div>}
                    {prices.fastrackPrice > 0 && <div className="service-item">Fast-Track Delivery: +₹{prices.fastrackPrice}</div>}
                    {prices.weekendPrice > 0 && <div className="service-item">Weekend Delivery: +₹{prices.weekendPrice}</div>}
                    {prices.nightPrice > 0 && <div className="service-item">Night Delivery: +₹{prices.nightPrice}</div>}
                  </div>
                )}
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>Total Amount:</span>
                  <span className="total-amount">₹{prices.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-section">
            <div className="section-header">
              <div className="section-icon">💳</div>
              <div>
                <h3 className="section-title">Payment Method</h3>
                <p className="section-subtitle">Choose how you want to pay</p>
              </div>
            </div>
            
            <div className="payment-methods">
              {paymentOptions.map(method => (
                <button
                  type="button"
                  key={method.id}
                  className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(method.id)}
                  style={{ 
                    borderColor: paymentMethod === method.id ? method.color : '#E5E7EB',
                    backgroundColor: paymentMethod === method.id ? `${method.color}10` : 'white'
                  }}
                >
                  {method.popular && (
                    <div className="popular-badge" style={{ backgroundColor: method.color }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className="method-icon" style={{ backgroundColor: `${method.color}20`, color: method.color }}>
                    <span style={{ fontSize: '24px' }}>{method.icon}</span>
                  </div>
                  
                  <div className="method-details">
                    <div className="method-name">{method.name}</div>
                    <div className="method-desc">{method.description}</div>
                  </div>
                  
                  <div className="method-radio">
                    <div className={`radio-circle ${paymentMethod === method.id ? 'checked' : ''}`}>
                      {paymentMethod === method.id && (
                        <div className="radio-dot" style={{ backgroundColor: method.color }}></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* UPI QR Code Section */}
          {paymentMethod === "upi" && (
            <div className="payment-section">
              <div className="section-header">
                <div className="section-icon">📱</div>
                <div>
                  <h3 className="section-title">UPI Payment</h3>
                  <p className="section-subtitle">Scan QR code with your UPI app</p>
                </div>
              </div>
              
              <div className="upi-container">
                <div className="qr-options">
                  {qrCodes.map(qr => (
                    <button
                      type="button"
                      key={qr.id}
                      className={`qr-option ${qrCode === qr.id ? 'selected' : ''}`}
                      onClick={() => handleQrSelect(qr.id)}
                    >
                      <div className="qr-image">
                        <img src={qr.qr} alt={`${qr.name} QR Code`} loading="lazy" />
                      </div>
                      <div className="qr-name">{qr.name}</div>
                      {qrCode === qr.id && (
                        <div className="qr-check">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="8" fill="#10B981"/>
                            <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {selectedQr && (
                  <div className="upi-instructions">
                    <div className="instructions-card">
                      <h4>How to Pay with {selectedQr.name}:</h4>
                      <ol className="steps-list">
                        <li>Open <strong>{selectedQr.name}</strong> app on your phone</li>
                        <li>Tap on <strong>"Scan QR Code"</strong></li>
                        <li>Point your camera at the QR code above</li>
                        <li>Enter amount: <strong className="amount-highlight">₹{prices.total.toLocaleString('en-IN')}</strong></li>
                        <li>Verify details and complete payment</li>
                        <li>Save the transaction ID for reference</li>
                      </ol>
                      
                      <div className="upi-note">
                        <div className="note-icon">ℹ️</div>
                        <div className="note-text">
                          <strong>Note:</strong> Payment will be confirmed within 2-3 minutes. Keep this window open.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="transaction-input">
                  <label className="input-label">Transaction ID (After Payment)</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Enter UPI transaction ID (e.g., UPIR1234567890)"
                    value={transactionId}
                    onChange={handleTransactionId}
                    required
                  />
                  <div className="input-note">
                    You'll find Transaction ID in your UPI app after successful payment
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Payment Methods Details */}
          {paymentMethod && paymentMethod !== "cod" && paymentMethod !== "upi" && (
            <div className="payment-section">
              <div className="section-header">
                <div className="section-icon">🔢</div>
                <div>
                  <h3 className="section-title">Payment Details</h3>
                  <p className="section-subtitle">Enter transaction details after payment</p>
                </div>
              </div>
              
              <div className="transaction-container">
                <div className="transaction-input">
                  <label className="input-label">Transaction ID *</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder={`Enter ${selectedPayment?.name} transaction ID`}
                    value={transactionId}
                    onChange={handleTransactionId}
                    required
                  />
                  <div className="input-note">
                    You'll receive transaction ID after successful payment. Keep it for future reference.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cash on Delivery Section */}
          {paymentMethod === "cod" && (
            <div className="payment-section cod-section">
              <div className="section-header">
                <div className="section-icon">💵</div>
                <div>
                  <h3 className="section-title">Cash on Delivery</h3>
                  <p className="section-subtitle">Pay when your package arrives</p>
                </div>
              </div>
              
              <div className="cod-card">
                <div className="cod-icon">💵</div>
                <div className="cod-content">
                  <h4>Cash on Delivery Selected</h4>
                  <p className="cod-amount">
                    Pay <strong>₹{prices.total.toLocaleString('en-IN')}</strong> when our delivery executive arrives with your package.
                  </p>
                  <ul className="cod-features">
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
          <div className="payment-navigation">
            <div className="navigation-buttons">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={prevStep}
                disabled={isProcessing}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Vehicle
              </button>
              
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!paymentMethod || isProcessing || 
                  (paymentMethod !== "cod" && !transactionId && paymentMethod !== "upi") || 
                  (paymentMethod === "upi" && !qrCode)}
                style={{ 
                  backgroundColor: paymentMethod === "cod" ? "#EF4444" : 
                                 paymentMethod === "upi" ? "#3B82F6" : "#10B981" 
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : paymentMethod === "cod" ? (
                  "Confirm COD Order"
                ) : (
                  "Complete Payment"
                )}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="step-progress">
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '66%' }}></div>
                </div>
                <div className="step-labels">
                  <span className="step-label">Location</span>
                  <span className="step-label">Date & Time</span>
                  <span className="step-label">Vehicle</span>
                  <span className="step-label active">Payment</span>
                  <span className="step-label">Summary</span>
                  <span className="step-label">Receipt</span>
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