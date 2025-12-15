import React, { useEffect, useState } from 'react';
import '../Additional/styles/Receipt.css';
import { useNavigate } from 'react-router-dom';

const Receipt = ({ data = {} }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('confirmed');
  const [trackingId, setTrackingId] = useState('');
  
  // Generate tracking ID based on phone number
  const generateTrackingId = () => {
      // If no phone number, generate random 10-digit number
      const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
      return `#${randomNum}`;
  };






  
  // Save order to localStorage for tracking
  const saveOrderToStorage = () => {
    try {
      // Get existing orders
      const existingOrders = JSON.parse(localStorage.getItem('shippingOrders') || '[]');
    
      // Create order object
      const order = {
        id: Date.now().toString(),
        trackingId: generateTrackingId(),
        phone: JSON.parse(localStorage.getItem('current_user'))?.phone || 'UNKNOWN',
        fromCity: data.fromCity || '',
        toCity: data.toCity || '',
        fromState: data.fromState || '',
        toState: data.toState || '',
        fromAddress: data.fromAddress || '',
        toAddress: data.toAddress || '',
        weight: data.weight || '1',
        distance: data.distance || '0',
        travelTime: data.travelTime || '',
        vehicleName: data.vehicleName || '',
        vehicleType: data.vehicleType || '',
        estimatedPrice: data.estimatedPrice || 0,
        totalAmount: data.total || 0,
        paymentName: data.paymentName || 'UPI',
        selectedDate: data.selectedDate || '',
        selectedTimeSlot: data.selectedTimeSlot || '',
        deliveryUrgency: data.deliveryUrgency || 'standard',
        packageType: data.packageType || 'general',
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        pickupDate: data.selectedDate || '',
        pickupTime: data.selectedTimeSlot || '',
        
        // Additional services
        helperService: data.helperService || false,
        insuranceService: data.insuranceService || false,
        packagingService: data.packagingService || false,
        fastrackService: data.fastrackService || false,
        weekendService: data.weekendService || false,
        nightService: data.nightService || false
      };
      
      // Add to existing orders
      existingOrders.unshift(order);
      
      // Save to localStorage
      localStorage.setItem('shippingOrders', JSON.stringify(existingOrders));
      
      // Also save to sessionStorage for current session
      sessionStorage.setItem('currentOrder', JSON.stringify(order));
      
      // Save to receiptData for immediate access
      localStorage.setItem('receiptData', JSON.stringify(order));
      
      console.log('Order saved to storage:', order);
      
    } catch (error) {
      console.error('Error saving order to storage:', error);
    }
  };

  // Initialize tracking ID and save order
  useEffect(() => {
    // Generate tracking ID from phone number
    const generatedId = generateTrackingId();
    setTrackingId(generatedId);
    
    // Save order to localStorage
    if (generatedId) {
      setTimeout(() => {
        saveOrderToStorage(data);
      }, 100);
    }
  }, [data]);

  // Simulate status progression
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus('scheduled');
    }, 3000);
    
    const timer2 = setTimeout(() => {
      setStatus('ontheway');
    }, 6000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const statusSteps = [
    { 
      id: 'confirmed', 
      label: 'Order Confirmed', 
      icon: '✅', 
      description: 'Your order has been confirmed successfully',
      time: 'Just now',
      active: status === 'confirmed' || status === 'scheduled' || status === 'ontheway'
    },
    { 
      id: 'scheduled', 
      label: 'Pickup Scheduled', 
      icon: '📅', 
      description: 'Pickup scheduled with our team',
      time: 'In progress',
      active: status === 'scheduled' || status === 'ontheway'
    },
    { 
      id: 'ontheway', 
      label: 'On The Way', 
      icon: '🚚', 
      description: 'Your package is on the way to delivery',
      time: 'Upcoming',
      active: status === 'ontheway'
    },
    { 
      id: 'delivered', 
      label: 'Delivered', 
      icon: '🏠', 
      description: 'Package delivered successfully',
      time: 'Estimated 3-5 hours',
      active: false
    }
  ];

  // Function to handle live tracking
  const handleLiveTracking = () => {
    if (trackingId) {
      navigate(`/tracking?id=${trackingId.replace('', '')}`);
    } else {
      navigate('/tracking');
    }
  };

  // Function to share order details
  const handleShareOrder = () => {
    const shareText = `Track my shipment: ${trackingId}\nFrom: ${data.fromCity || ''} to ${data.toCity || ''}\nAmount: ₹${data.total || 0}\n\nTrack here: ${window.location.origin}/tracking?id=${trackingId.replace('#', '')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Shipment Details',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Tracking details copied to clipboard!');
    }
  };

  // Function to download receipt
  const handleDownloadReceipt = () => {
    const receiptText = `
SHIPMENT RECEIPT
================
Tracking ID: ${trackingId}
Order Date: ${data.orderDate || new Date().toLocaleDateString('en-IN')}
Order Time: ${data.orderTime || new Date().toLocaleTimeString('en-IN')}
----------------
FROM:
${data.fromAddress || ''}
${data.fromCity || ''}, ${data.fromState || ''}
----------------
TO:
${data.toAddress || ''}
${data.toCity || ''}, ${data.toState || ''}
----------------
PACKAGE DETAILS:
Weight: ${data.weight || '1'} kg
Distance: ${data.distance || '0'} km
Vehicle: ${data.vehicleName || ''}
Travel Time: ${data.travelTime || ''}
----------------
PAYMENT:
Amount: ₹${data.total || 0}
Method: ${data.paymentName || 'UPI'}
----------------
STATUS: ${status.toUpperCase()}
================
Thank you for choosing our service!
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${trackingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="receipt-container-z8x">
      {/* Header */}
      <div className="receipt-header-z8x">
        <div className="success-badge-z8x">
          <span className="success-icon-z8x">🎉</span>
          <h1 className="success-title-z8x">Order Confirmed!</h1>
          <p className="success-subtitle-z8x">Your shipment has been scheduled successfully</p>
        </div>
      </div>

      {/* Tracking ID & Details */}
      <div className="receipt-section-z8x">
        <div className="tracking-card-z8x">
          <div className="tracking-header-z8x">
            <div className="tracking-icon-z8x">📦</div>
            <div>
              <h3>Tracking ID: <span className="tracking-id-z8x">{trackingId || '#8810300724'}</span></h3>
              <p className="tracking-note-z8x">Use this ID to track your shipment</p>
            </div>
          </div>
          
          <div className="order-details-grid-z8x">
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">Order Date:</span>
              <span className="detail-value-z8x">{data.orderDate || new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">Order Time:</span>
              <span className="detail-value-z8x">{data.orderTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">From:</span>
              <span className="detail-value-z8x">{data.fromCity || 'City'}</span>
            </div>
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">To:</span>
              <span className="detail-value-z8x">{data.toCity || 'City'}</span>
            </div>
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">Amount Paid:</span>
              <span className="detail-value-z8x highlight-z8x">₹{data.total?.toLocaleString('en-IN') || '0'}</span>
            </div>
            <div className="order-detail-z8x">
              <span className="detail-label-z8x">Payment Method:</span>
              <span className="detail-value-z8x">{data.paymentName || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Status */}
      <div className="receipt-section-z8x">
        <h2 className="section-title-z8x">Delivery Status</h2>
        <div className="status-timeline-z8x">
          {statusSteps.map((step, index) => (
            <div key={step.id} className="status-step-z8x">
              <div className={`step-indicator-z8x ${step.active ? 'active-z8x' : ''}`}>
                <span className="step-icon-z8x">{step.icon}</span>
              </div>
              <div className="step-content-z8x">
                <div className="step-header-z8x">
                  <h4 className={`step-title-z8x ${step.active ? 'active-z8x' : ''}`}>
                    {step.label}
                  </h4>
                  <span className="step-time-z8x">{step.time}</span>
                </div>
                <p className="step-description-z8x">{step.description}</p>
              </div>
              {index < statusSteps.length - 1 && (
                <div className={`step-connector-z8x ${step.active ? 'active-z8x' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Show this message when status is "on the way" */}
        {status === 'ontheway' && (
          <div className="driver-assignment-message-z8x">
            <div className="message-icon-z8x">⏳</div>
            <div className="message-content-z8x">
              <h4>Delivery Executive Assignment</h4>
              <p>
                Your delivery executive will be assigned within <strong>1-2 hours</strong>. 
                Once assigned, you can view their details and contact information on the 
                tracking page. You'll receive an SMS when the executive is on the way.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="receipt-section-z8x">
        <div className="action-buttons-z8x">
          <button 
            className="btn-primary-z8x"
            onClick={handleLiveTracking}
          >
            <span className="btn-icon-z8x">📍</span>
            Live Tracking
          </button>
          
          <button 
            className="btn-secondary-z8x"
            onClick={handleShareOrder}
          >
            <span className="btn-icon-z8x">📤</span>
            Share Order
          </button>
          
          <button 
            className="btn-outline-z8x"
            onClick={handleDownloadReceipt}
          >
            <span className="btn-icon-z8x">⬇️</span>
            Download Receipt
          </button>
        </div>
      </div>

      {/* Important Notes */}
      <div className="receipt-section-z8x">
        <div className="notes-card-z8x">
          <h3 className="notes-title-z8x">📝 Important Information</h3>
          <ul className="notes-list-z8x">
            <li>Keep your Tracking ID <strong>{trackingId}</strong> safe for future reference</li>
            <li>Delivery executive details will appear on tracking page once assigned</li>
            <li>Contact customer support for any changes or queries: 1800-123-4567</li>
            <li>Expected delivery: {data.selectedDate || '3-5 business days'}</li>
            <li>You'll receive real-time SMS updates on {data.fromPhone || data.toPhone || 'your registered number'}</li>
            <li>Track your shipment at: {window.location.origin}/tracking?id={trackingId.replace('#', '')}</li>
          </ul>
        </div>
      </div>

      {/* Store Info */}
      <div className="receipt-section-z8x">
        <div className="store-info-z8x">
          <p className="thank-you-z8x">Thank you for choosing our service! ❤️</p>
          <p className="contact-info-z8x">
            For support: 📞 1800-123-4567 | ✉️ support@transporter.com
          </p>
          <p className="auto-redirect-z8x">
            You'll be redirected to tracking page in 10 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;