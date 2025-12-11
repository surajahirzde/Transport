import React, { useState, useEffect } from 'react';
import '../Additional/styles/Receipt.css';

const Receipt = ({ data = {}, prevStep }) => {
  const [orderDetails, setOrderDetails] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);
  const [timer, setTimer] = useState(10); // Countdown timer

  useEffect(() => {
    // Calculate total
    const calculateTotal = () => {
      const basePrice = parseInt(data?.estimatedPrice || 0);
      const vehiclePrice = parseInt(data?.vehiclePrice?.replace('+₹', '') || 0);
      const helperService = data?.helperService ? 150 : 0;
      const insuranceService = data?.insuranceService ? 300 : 0;
      const packagingService = data?.packagingService ? 200 : 0;
      
      return basePrice + vehiclePrice + helperService + insuranceService + packagingService;
    };

    // Generate tracking ID if not exists
    const trackingId = data?.trackingId || `TRK${Math.floor(100000 + Math.random() * 900000)}IND`;
    
    // Generate order ID
    const orderId = `ORD${Math.floor(10000 + Math.random() * 90000)}${new Date().getFullYear()}`;
    
    // Expected delivery date (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    
    setOrderDetails({
      orderId,
      trackingId,
      orderDate: data?.orderDate || new Date().toLocaleDateString('en-IN'),
      orderTime: data?.orderTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      totalAmount: calculateTotal(),
      deliveryDate: deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      deliveryExecutive: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        vehicle: data?.vehicleName || "Mini Truck"
      }
    });

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [data]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shipping Receipt',
        text: `Your shipping order #${orderDetails.orderId} is confirmed. Track using ID: ${orderDetails.trackingId}`,
        url: window.location.href
      });
    } else {
      alert('Sharing not supported on this browser');
    }
  };

  const handleDownload = () => {
    // Create a simple text receipt for download
    const receiptText = `
SHIPPING RECEIPT
================================
Order ID: ${orderDetails.orderId}
Tracking ID: ${orderDetails.trackingId}
Order Date: ${orderDetails.orderDate} ${orderDetails.orderTime}
--------------------------------
PICKUP: ${data?.fromAddress || ''}
${data?.fromCity || ''}, ${data?.fromState || ''}

DELIVERY: ${data?.toAddress || ''}
${data?.toCity || ''}, ${data?.toState || ''}
--------------------------------
Package: ${data?.packageType || 'General'}
Weight: ${data?.weight || '1'} kg
Distance: ${data?.distance || '0'} km
Vehicle: ${data?.vehicleName || 'Not selected'}
--------------------------------
TOTAL AMOUNT: ₹${orderDetails.totalAmount}
Payment: ${data?.paymentName || 'Not specified'}
--------------------------------
Delivery Executive: ${orderDetails.deliveryExecutive?.name}
Contact: ${orderDetails.deliveryExecutive?.phone}
Expected Delivery: ${orderDetails.deliveryDate}
================================
Thank you for choosing our service!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shipping_Receipt_${orderDetails.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewShipment = () => {
    window.location.href = '/shipping'; // Reload for new shipment
  };

  return (
    <div className="rc-container">
      <div className="rc-header">
        <div className="rc-step-indicator">
          <span className="rc-step-number">6</span>
          <div className="rc-step-info">
            <h1 className="rc-title">Order Confirmed! 🎉</h1>
            <p className="rc-subtitle">Your shipment has been scheduled successfully</p>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <div className="rc-success-animation">
        <div className="rc-checkmark">✓</div>
        <h2 className="rc-success-title">Payment Successful!</h2>
        <p className="rc-success-message">Your order has been confirmed and is being processed</p>
      </div>

      {/* Receipt Card */}
      <div className="rc-receipt-card">
        <div className="rc-receipt-header">
          <div className="rc-company-info">
            <h3 className="rc-company-name">🚚 QuickShip Express</h3>
            <p className="rc-company-tag">Fast & Reliable Delivery</p>
          </div>
          <div className="rc-receipt-badge">PAID</div>
        </div>

        {/* Order Info */}
        <div className="rc-order-info">
          <div className="rc-order-id">
            <span className="rc-info-label">Order ID:</span>
            <span className="rc-info-value rc-highlight">{orderDetails.orderId}</span>
          </div>
          <div className="rc-tracking-id">
            <span className="rc-info-label">Tracking ID:</span>
            <span className="rc-info-value rc-highlight">{orderDetails.trackingId}</span>
          </div>
          <div className="rc-order-date">
            <span className="rc-info-label">Order Date:</span>
            <span className="rc-info-value">{orderDetails.orderDate} at {orderDetails.orderTime}</span>
          </div>
        </div>

        {/* Route Display */}
        <div className="rc-route-display">
          <div className="rc-route-point rc-pickup">
            <div className="rc-point-icon">📦</div>
            <div className="rc-point-details">
              <h4>Pickup Point</h4>
              <p>{data?.fromCity || 'City'}, {data?.fromState || 'State'}</p>
              <small>{data?.fromAddress || 'Address'}</small>
            </div>
          </div>
          
          <div className="rc-route-line">
            <div className="rc-route-distance">{data?.distance || '0'} km</div>
          </div>
          
          <div className="rc-route-point rc-delivery">
            <div className="rc-point-icon">🏠</div>
            <div className="rc-point-details">
              <h4>Delivery Point</h4>
              <p>{data?.toCity || 'City'}, {data?.toState || 'State'}</p>
              <small>{data?.toAddress || 'Address'}</small>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="rc-package-details">
          <h4 className="rc-section-heading">Package Details</h4>
          <div className="rc-package-grid">
            <div className="rc-package-item">
              <span className="rc-package-label">Type:</span>
              <span className="rc-package-value">{data?.packageType || 'General'}</span>
            </div>
            <div className="rc-package-item">
              <span className="rc-package-label">Weight:</span>
              <span className="rc-package-value">{data?.weight || '1'} kg</span>
            </div>
            <div className="rc-package-item">
              <span className="rc-package-label">Delivery Type:</span>
              <span className="rc-package-value">{data?.deliveryUrgency || 'Normal'}</span>
            </div>
            <div className="rc-package-item">
              <span className="rc-package-label">Vehicle:</span>
              <span className="rc-package-value">{data?.vehicleName || 'Not selected'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Executive */}
        <div className="rc-delivery-executive">
          <h4 className="rc-section-heading">Delivery Executive</h4>
          <div className="rc-executive-card">
            <div className="rc-executive-avatar">
              <span className="rc-avatar-icon">👨‍✈️</span>
            </div>
            <div className="rc-executive-details">
              <h5>{orderDetails.deliveryExecutive?.name}</h5>
              <p>{orderDetails.deliveryExecutive?.vehicle}</p>
              <p className="rc-executive-phone">{orderDetails.deliveryExecutive?.phone}</p>
            </div>
            <div className="rc-executive-status">
              <span className="rc-status-badge">ASSIGNED</span>
              <small>Will contact before pickup</small>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rc-timeline">
          <h4 className="rc-section-heading">Delivery Timeline</h4>
          <div className="rc-timeline-steps">
            <div className="rc-timeline-step rc-step-active">
              <div className="rc-step-dot"></div>
              <div className="rc-step-content">
                <h5>Order Confirmed</h5>
                <p>Today, {orderDetails.orderTime}</p>
              </div>
            </div>
            <div className="rc-timeline-step">
              <div className="rc-step-dot"></div>
              <div className="rc-step-content">
                <h5>Pickup Scheduled</h5>
                <p>Tomorrow, 9:00 AM - 12:00 PM</p>
              </div>
            </div>
            <div className="rc-timeline-step">
              <div className="rc-step-dot"></div>
              <div className="rc-step-content">
                <h5>In Transit</h5>
                <p>Processing your shipment</p>
              </div>
            </div>
            <div className="rc-timeline-step">
              <div className="rc-step-dot"></div>
              <div className="rc-step-content">
                <h5>Delivery</h5>
                <p>{orderDetails.deliveryDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="rc-payment-summary">
          <h4 className="rc-section-heading">Payment Summary</h4>
          <div className="rc-payment-breakdown">
            <div className="rc-payment-row">
              <span>Base Fare:</span>
              <span>₹{data?.estimatedPrice || 0}</span>
            </div>
            <div className="rc-payment-row">
              <span>Vehicle Charges:</span>
              <span>{data?.vehiclePrice || '+₹0'}</span>
            </div>
            <div className="rc-payment-row">
              <span>Additional Services:</span>
              <span>
                +₹{(data?.helperService ? 150 : 0) + 
                    (data?.insuranceService ? 300 : 0) + 
                    (data?.packagingService ? 200 : 0)}
              </span>
            </div>
            <div className="rc-payment-divider"></div>
            <div className="rc-payment-total">
              <span>Total Paid:</span>
              <span className="rc-total-amount">₹{orderDetails.totalAmount}</span>
            </div>
            <div className="rc-payment-method">
              <span>Payment Method:</span>
              <span className="rc-method-badge">{data?.paymentName || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="rc-notes">
          <h4 className="rc-section-heading">Important Notes</h4>
          <ul className="rc-notes-list">
            <li>Keep this receipt for future reference</li>
            <li>Track your shipment using the Tracking ID</li>
            <li>Delivery executive will call 30 minutes before arrival</li>
            <li>For any queries, call our support: 1800-123-4567</li>
            <li>Download invoice from your account within 24 hours</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rc-action-buttons">
        <button 
          className="rc-action-btn rc-track-btn"
          onClick={() => window.location.href = `/tracking?id=${orderDetails.trackingId}`}
        >
          📍 Track Shipment
        </button>
        <button 
          className="rc-action-btn rc-print-btn"
          onClick={handlePrint}
          disabled={isPrinting}
        >
          {isPrinting ? 'Printing...' : '🖨️ Print Receipt'}
        </button>
        <button 
          className="rc-action-btn rc-share-btn"
          onClick={handleShare}
        >
          📤 Share
        </button>
        <button 
          className="rc-action-btn rc-download-btn"
          onClick={handleDownload}
        >
          ⬇️ Download
        </button>
      </div>

      {/* Countdown & New Shipment */}
      <div className="rc-footer">
        <div className="rc-countdown">
          <p>Redirecting to home in <span className="rc-timer">{timer}</span> seconds...</p>
        </div>
        
        <div className="rc-new-shipment">
          <button 
            className="rc-new-btn"
            onClick={handleNewShipment}
          >
            🚚 Create New Shipment
          </button>
          <button 
            className="rc-back-btn"
            onClick={prevStep}
          >
            ← Back to Summary
          </button>
        </div>

        <div className="rc-support">
          <p>Need help? <strong>Call: 1800-123-4567</strong> | <strong>Email: support@quickship.com</strong></p>
          <p className="rc-thank-you">Thank you for choosing QuickShip Express! ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;