import React, { useState, useEffect } from 'react';
import '../Additional/styles/Receipt.css';

const Receipt = ({ data = {}, prevStep }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [orderDetails, setOrderDetails] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);
  const [timer, setTimer] = useState(10);

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

  useEffect(() => {
    const prices = calculatePrices();
    
    // Generate tracking ID if not exists
    const generateTrackingId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let trackingId = 'TRK';
      for (let i = 0; i < 9; i++) {
        trackingId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return trackingId;
    };

    // Generate order ID
    const generateOrderId = () => {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(1000 + Math.random() * 9000);
      return `ORD${year}${month}${random}`;
    };

    // Calculate delivery date based on urgency
    const getDeliveryDate = () => {
      const today = new Date();
      let deliveryDate = new Date(today);
      
      switch(data?.deliveryUrgency) {
        case 'same-day':
          deliveryDate.setDate(today.getDate());
          break;
        case 'express':
          deliveryDate.setDate(today.getDate() + 2);
          break;
        default:
          deliveryDate.setDate(today.getDate() + 4);
      }
      
      return deliveryDate.toLocaleDateString('en-IN', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    };

    const trackingId = data?.trackingId || generateTrackingId();
    const orderId = data?.orderId || generateOrderId();
    const now = new Date();
    
    setOrderDetails({
      orderId,
      trackingId,
      orderDate: data?.orderDate || now.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      orderTime: data?.orderTime || now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      totalAmount: prices.total,
      deliveryDate: getDeliveryDate(),
      deliveryExecutive: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        vehicle: data?.vehicleName || "Transport Vehicle",
        rating: "4.8"
      },
      prices
    });

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 10000);

    return () => clearInterval(countdown);
  }, [data]);

  const handlePrint = () => {
    setIsPrinting(true);
    const originalTitle = document.title;
    document.title = `Receipt_${orderDetails.orderId}`;
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        setIsPrinting(false);
      }, 500);
    }, 500);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Shipping Receipt - QuickShip Express',
      text: `Your shipment #${orderDetails.orderId} is confirmed! Track using ID: ${orderDetails.trackingId}. Amount: ₹${orderDetails.totalAmount}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Receipt link copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const handleDownload = () => {
    const receiptText = `
QUICKSHIP EXPRESS - SHIPPING RECEIPT
========================================
ORDER ID: ${orderDetails.orderId}
TRACKING ID: ${orderDetails.trackingId}
ORDER DATE: ${orderDetails.orderDate}
ORDER TIME: ${orderDetails.orderTime}
----------------------------------------
SHIPMENT DETAILS:
From: ${data?.fromAddress || ''}
      ${data?.fromCity || ''}, ${data?.fromState || ''}
To:   ${data?.toAddress || ''}
      ${data?.toCity || ''}, ${data?.toState || ''}
----------------------------------------
PACKAGE INFO:
Weight: ${data?.weight || '1'} kg
Distance: ${data?.distance || '0'} km
Vehicle: ${data?.vehicleName || 'Not selected'}
Delivery Type: ${data?.deliveryUrgency || 'Standard'}
----------------------------------------
PAYMENT SUMMARY:
Base Fare: ₹${orderDetails.prices?.basePrice || 0}
${orderDetails.prices?.fastDeliveryCharge > 0 ? `Express Delivery: ₹${orderDetails.prices?.fastDeliveryCharge}\n` : ''}
Vehicle Charges: ₹${orderDetails.prices?.vehiclePrice || 0}
${orderDetails.prices?.additionalServicesTotal > 0 ? `Additional Services: ₹${orderDetails.prices?.additionalServicesTotal}\n` : ''}
TOTAL AMOUNT: ₹${orderDetails.totalAmount}
Payment Method: ${data?.paymentName || 'Not specified'}
----------------------------------------
DELIVERY EXECUTIVE:
Name: ${orderDetails.deliveryExecutive?.name}
Contact: ${orderDetails.deliveryExecutive?.phone}
Vehicle: ${orderDetails.deliveryExecutive?.vehicle}
Expected Delivery: ${orderDetails.deliveryDate}
----------------------------------------
SUPPORT:
Call: 1800-123-4567
Email: support@quickship.com
========================================
Thank you for choosing QuickShip Express!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${orderDetails.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleNewShipment = () => {
    window.location.href = '/';
  };

  if (!orderDetails.orderId) {
    return (
      <div className="receipt-loading">
        <div className="loading-spinner"></div>
        <p>Loading receipt...</p>
      </div>
    );
  }

  return (
    <div className="receipt-container">
      {/* Header */}
      <div className="receipt-header">
        <div className="step-indicator">
          <span className="step-badge">6</span>
          <div>
            <h1 className="receipt-title">Order Confirmed</h1>
            <p className="receipt-subtitle">Your shipment has been scheduled successfully</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="success-message">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#10B981"/>
            <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>Payment Successful!</h2>
        <p>Your order #{orderDetails.orderId} has been confirmed and is being processed.</p>
      </div>

      {/* Receipt Card */}
      <div className="receipt-card">
        {/* Company Header */}
        <div className="company-header">
          <div className="company-info">
            <div className="company-logo">🚚</div>
            <div>
              <h3>QuickShip Express</h3>
              <p>Fast & Reliable Delivery Services</p>
            </div>
          </div>
          <div className="receipt-status">
            <span className="status-badge">CONFIRMED</span>
            <div className="receipt-date">{orderDetails.orderDate}</div>
          </div>
        </div>

        {/* Order Info */}
        <div className="order-info-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value highlight">{orderDetails.orderId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tracking ID</span>
              <span className="info-value highlight">{orderDetails.trackingId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Time</span>
              <span className="info-value">{orderDetails.orderTime}</span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="route-section">
          <h4 className="section-title">Shipment Route</h4>
          <div className="route-display">
            <div className="route-point pickup">
              <div className="point-icon">📦</div>
              <div className="point-details">
                <div className="point-title">Pickup From</div>
                <div className="point-address">{data?.fromAddress || 'Address not specified'}</div>
                <div className="point-location">{data?.fromCity || ''}, {data?.fromState || ''}</div>
              </div>
            </div>
            
            <div className="route-connection">
              <div className="connection-line"></div>
              <div className="distance-badge">{data?.distance || '0'} km</div>
            </div>
            
            <div className="route-point delivery">
              <div className="point-icon">🏠</div>
              <div className="point-details">
                <div className="point-title">Deliver To</div>
                <div className="point-address">{data?.toAddress || 'Address not specified'}</div>
                <div className="point-location">{data?.toCity || ''}, {data?.toState || ''}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="details-section">
          <h4 className="section-title">Package Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Weight</span>
              <span className="detail-value">{data?.weight || '1'} kg</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vehicle</span>
              <span className="detail-value">{data?.vehicleName || 'Not selected'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery Type</span>
              <span className="detail-value">{data?.deliveryUrgency || 'Standard'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Package Type</span>
              <span className="detail-value">{data?.packageType || 'General'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Executive */}
        <div className="executive-section">
          <h4 className="section-title">Delivery Executive</h4>
          <div className="executive-card">
            <div className="executive-avatar">👨‍✈️</div>
            <div className="executive-info">
              <div className="executive-name">{orderDetails.deliveryExecutive.name}</div>
              <div className="executive-vehicle">{orderDetails.deliveryExecutive.vehicle}</div>
              <div className="executive-contact">{orderDetails.deliveryExecutive.phone}</div>
            </div>
            <div className="executive-status">
              <div className="status-tag">ASSIGNED</div>
              <div className="status-note">Will contact before pickup</div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="payment-section">
          <h4 className="section-title">Payment Summary</h4>
          <div className="payment-breakdown">
            <div className="payment-row">
              <span>Base Fare</span>
              <span>₹{orderDetails.prices?.basePrice.toLocaleString('en-IN')}</span>
            </div>
            
            {orderDetails.prices?.fastDeliveryCharge > 0 && (
              <div className="payment-row highlight">
                <span>Express Delivery</span>
                <span>+₹{orderDetails.prices?.fastDeliveryCharge.toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div className="payment-row">
              <span>Vehicle Charges</span>
              <span>+₹{orderDetails.prices?.vehiclePrice.toLocaleString('en-IN')}</span>
            </div>
            
            {orderDetails.prices?.additionalServicesTotal > 0 && (
              <div className="payment-row">
                <span>Additional Services</span>
                <span>+₹{orderDetails.prices?.additionalServicesTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            
            <div className="payment-divider"></div>
            
            <div className="payment-total">
              <span>Total Amount</span>
              <span className="total-amount">₹{orderDetails.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="payment-method">
              <span>Payment Method</span>
              <span className="method-badge">{data?.paymentName || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline-section">
          <h4 className="section-title">Delivery Timeline</h4>
          <div className="timeline">
            <div className="timeline-step active">
              <div className="step-marker"></div>
              <div className="step-content">
                <div className="step-title">Order Confirmed</div>
                <div className="step-time">Today, {orderDetails.orderTime}</div>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker"></div>
              <div className="step-content">
                <div className="step-title">Pickup Scheduled</div>
                <div className="step-time">Tomorrow, 9 AM - 12 PM</div>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker"></div>
              <div className="step-content">
                <div className="step-title">In Transit</div>
                <div className="step-time">Processing shipment</div>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-marker"></div>
              <div className="step-content">
                <div className="step-title">Delivery</div>
                <div className="step-time">{orderDetails.deliveryDate}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="notes-section">
          <h4 className="section-title">Important Notes</h4>
          <ul className="notes-list">
            <li>Keep this receipt for future reference and tracking</li>
            <li>Track your shipment using the Tracking ID provided above</li>
            <li>Delivery executive will call 30 minutes before arrival</li>
            <li>For queries, contact support: 1800-123-4567</li>
            <li>Download invoice from your account within 24 hours</li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-btn primary"
          onClick={() => window.location.href = `/tracking?id=${orderDetails.trackingId}`}
        >
          <span className="btn-icon">📍</span>
          Track Shipment
        </button>
        <button 
          className="action-btn"
          onClick={handlePrint}
          disabled={isPrinting}
        >
          <span className="btn-icon">{isPrinting ? '⏳' : '🖨️'}</span>
          {isPrinting ? 'Printing...' : 'Print Receipt'}
        </button>
        <button 
          className="action-btn"
          onClick={handleShare}
        >
          <span className="btn-icon">📤</span>
          Share
        </button>
        <button 
          className="action-btn"
          onClick={handleDownload}
        >
          <span className="btn-icon">⬇️</span>
          Download
        </button>
      </div>

      {/* Footer */}
      <div className="receipt-footer">
        <div className="countdown">
          <p>Redirecting to homepage in <span className="timer">{timer}</span> seconds...</p>
        </div>
        
        <div className="footer-buttons">
          <button 
            className="footer-btn secondary"
            onClick={prevStep}
          >
            ← Back to Summary
          </button>
          <button 
            className="footer-btn primary"
            onClick={handleNewShipment}
          >
            🚚 Create New Shipment
          </button>
        </div>
        
        <div className="support-info">
          <p>
            <strong>Need help?</strong> 
            <span className="support-contact"> Call: 1800-123-4567 </span>
            <span className="support-separator">|</span>
            <span className="support-contact"> Email: support@quickship.com</span>
          </p>
          <p className="thank-you">Thank you for choosing QuickShip Express! ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;