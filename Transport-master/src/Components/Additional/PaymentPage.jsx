import React, { useState } from 'react';
import '../Additional/styles/PaymentPage.css';

const PaymentPage = ({ data = {}, updateData, nextStep, prevStep }) => {
  const [paymentMethod, setPaymentMethod] = useState(data?.paymentMethod || "");
  const [qrCode, setQrCode] = useState(data?.qrCode || "");
  const [transactionId, setTransactionId] = useState(data?.transactionId || "");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const qrCodes = [
    { id: "paytm", name: "Paytm", qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Paytm:1234567890" },
    { id: "phonepe", name: "PhonePe", qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PhonePe:1234567890" },
    { id: "googlepay", name: "Google Pay", qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GooglePay:1234567890" },
    { id: "bhim", name: "BHIM UPI", qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPI:1234567890" },
  ];

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
    const value = e.target.value;
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
      // COD doesn't need transaction ID
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
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      nextStep();
    }, 1500);
  };

  const selectedPayment = paymentOptions.find(p => p.id === paymentMethod);
  const selectedQr = qrCodes.find(q => q.id === qrCode);

  return (
    <div className="pp-container">
      <div className="pp-header">
        <div className="pp-step-indicator">
          <span className="pp-step-number">4</span>
          <div className="pp-step-info">
            <h1 className="pp-title">Payment Details</h1>
            <p className="pp-subtitle">Complete payment to confirm your shipment</p>
          </div>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="pp-form">
        {/* Payment Method Selection */}
        <div className="pp-section">
          <div className="pp-section-header">
            <h3 className="pp-section-title">
              <span className="pp-section-icon">💳</span> Select Payment Method
            </h3>
            <p className="pp-section-desc">Choose your preferred payment option</p>
          </div>
          
          <div className="pp-methods-grid">
            {paymentOptions.map(method => (
              <div 
                key={method.id}
                className={`pp-method-card ${paymentMethod === method.id ? 'pp-method-active' : ''} ${method.popular ? 'pp-popular' : ''}`}
                onClick={() => handlePaymentSelect(method.id)}
                style={{ '--method-color': method.color }}
              >
                {method.popular && <div className="pp-popular-badge">Most Popular</div>}
                
                <div className="pp-method-icon" style={{ backgroundColor: `${method.color}20` }}>
                  {method.icon}
                </div>
                
                <div className="pp-method-info">
                  <h4 className="pp-method-name">{method.name}</h4>
                  <p className="pp-method-desc">{method.description}</p>
                </div>
                
                <div className="pp-method-radio">
                  <div className={`pp-radio-circle ${paymentMethod === method.id ? 'pp-radio-checked' : ''}`}>
                    {paymentMethod === method.id && <div className="pp-radio-dot"></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Sections */}
        {paymentMethod === "upi" && (
          <div className="pp-section">
            <div className="pp-section-header">
              <h3 className="pp-section-title">
                <span className="pp-section-icon">📱</span> Scan QR Code
              </h3>
              <p className="pp-section-desc">Select your UPI app and scan the QR code</p>
            </div>
            
            <div className="pp-qr-container">
              <div className="pp-qr-grid">
                {qrCodes.map(qr => (
                  <div 
                    key={qr.id}
                    className={`pp-qr-option ${qrCode === qr.id ? 'pp-qr-active' : ''}`}
                    onClick={() => handleQrSelect(qr.id)}
                  >
                    <div className="pp-qr-img">
                      <img src={qr.qr} alt={`${qr.name} QR Code`} />
                    </div>
                    <div className="pp-qr-name">{qr.name}</div>
                    {qrCode === qr.id && <div className="pp-qr-check">✓</div>}
                  </div>
                ))}
              </div>
              
              {selectedQr && (
                <div className="pp-qr-instructions">
                  <h4>How to Pay:</h4>
                  <ol className="pp-instructions-list">
                    <li>Open {selectedQr.name} app on your phone</li>
                    <li>Tap on 'Scan QR Code'</li>
                    <li>Scan the QR code shown above</li>
                    <li>Enter amount: <strong>₹{(data?.estimatedPrice || 0) + (data?.vehiclePrice || 0)}</strong></li>
                    <li>Complete the payment</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {paymentMethod && paymentMethod !== "cod" && paymentMethod !== "upi" && (
          <div className="pp-section">
            <div className="pp-section-header">
              <h3 className="pp-section-title">
                <span className="pp-section-icon">🔢</span> Transaction Details
              </h3>
              <p className="pp-section-desc">Enter your transaction ID after payment</p>
            </div>
            
            <div className="pp-transaction-input">
              <label className="pp-input-label">Transaction ID *</label>
              <input
                type="text"
                className="pp-text-input"
                placeholder="Enter transaction ID (e.g., TXN123456789)"
                value={transactionId}
                onChange={handleTransactionId}
                required={paymentMethod !== "cod"}
              />
              <p className="pp-input-note">
                You'll receive transaction ID after successful payment
              </p>
            </div>
          </div>
        )}

        {paymentMethod === "cod" && (
          <div className="pp-section pp-cod-section">
            <div className="pp-cod-info">
              <div className="pp-cod-icon">💵</div>
              <div className="pp-cod-content">
                <h4>Cash on Delivery Selected</h4>
                <p>You'll pay ₹{(data?.estimatedPrice || 0) + (data?.vehiclePrice || 0)} when our delivery executive arrives with your package.</p>
                <ul className="pp-cod-points">
                  <li>No advance payment required</li>
                  <li>Pay via cash, UPI, or card at doorstep</li>
                  <li>Get digital receipt instantly</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="pp-section pp-summary-section">
          <h3 className="pp-section-title">
            <span className="pp-section-icon">📋</span> Order Summary
          </h3>
          
          <div className="pp-summary-grid">
            <div className="pp-summary-item">
              <span className="pp-summary-label">Base Fare:</span>
              <span className="pp-summary-value">₹{data?.estimatedPrice || 0}</span>
            </div>
            <div className="pp-summary-item">
              <span className="pp-summary-label">Vehicle Charges:</span>
              <span className="pp-summary-value">{data?.vehiclePrice || "+₹0"}</span>
            </div>
            <div className="pp-summary-item">
              <span className="pp-summary-label">Additional Services:</span>
              <span className="pp-summary-value">+₹{(data?.helperService ? 150 : 0) + (data?.insuranceService ? 300 : 0) + (data?.packagingService ? 200 : 0)}</span>
            </div>
            <div className="pp-summary-divider"></div>
            <div className="pp-summary-total">
              <span className="pp-total-label">Total Amount:</span>
              <span className="pp-total-amount">
                ₹{(data?.estimatedPrice || 0) + 
                   (parseInt(data?.vehiclePrice?.replace('+₹', '') || 0)) + 
                   (data?.helperService ? 150 : 0) + 
                   (data?.insuranceService ? 300 : 0) + 
                   (data?.packagingService ? 200 : 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pp-navigation">
          <button 
            type="button" 
            className="pp-prev-btn"
            onClick={prevStep}
            disabled={isProcessing}
          >
            <span>←</span> Back to Vehicle
          </button>
          
          <button 
            type="submit" 
            className="pp-pay-btn"
            disabled={!paymentMethod || isProcessing || (paymentMethod !== "cod" && !transactionId && paymentMethod !== "upi") || (paymentMethod === "upi" && !qrCode)}
          >
            {isProcessing ? (
              <>
                <span className="pp-spinner"></span>
                Processing...
              </>
            ) : paymentMethod === "cod" ? (
              "Confirm COD Order"
            ) : (
              "Complete Payment & Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;