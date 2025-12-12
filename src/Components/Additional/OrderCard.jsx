// src/components/dashboard/OrderCard.jsx
import React from 'react';
import '../Additional/styles/OrderCard.css';

const OrderCard = ({ order = {} }) => {
  // REAL DATA from Shipping flow - no hardcoded values
  const {
    // From LocationForm.jsx
    fromCity = '',
    fromState = '',
    fromAddress = '',
    toCity = '',
    toState = '',
    toAddress = '',
    distance = '',
    weight = '',
    estimatedPrice = 0,
    travelTime = '',
    
    // From DateTimePicker.jsx
    pickupDate = '',
    pickupTime = '',
    
    // From VehicleSelector.jsx
    vehicle = '',
    vehicleName = '',
    vehicleType = '',
    
    // From PaymentPage.jsx
    paymentMethod = '',
    
    // Generated data
    orderId = `ORD${Date.now().toString().slice(-8)}`,
    trackingId = '',
    status = 'ORDER_CONFIRMED',
    createdAt = new Date().toISOString(),
    
    // Additional services
    helperService = false,
    insuranceService = false,
    packagingService = false,
    fastrackService = false,
    weekendService = false,
    nightService = false
  } = order;

  // Calculate final amount with services
  const calculateTotalAmount = () => {
    let total = Number(estimatedPrice) || 0;
    
    // Vehicle price from VehicleSelector
    const vehiclePrices = {
      'mini_van': 600,
      'pickup_truck': 1200,
      'container_truck': 2500,
      'trailer_truck': 4000,
      'refrigerated_truck': 2000,
      'tipper_truck': 3000
    };
    
    if (vehicle && vehiclePrices[vehicle]) {
      total += vehiclePrices[vehicle];
    }
    
    // Additional services
    if (helperService) total += 150;
    if (insuranceService) total += 300;
    if (packagingService) total += 200;
    if (fastrackService) total += 500;
    if (weekendService) total += 250;
    if (nightService) total += 350;
    
    return total;
  };

  const totalAmount = calculateTotalAmount();

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'ORDER_CONFIRMED':
        return { color: '#3b82f6', text: 'Order Confirmed', icon: '✅', bgColor: '#eff6ff' };
      case 'PICKUP_SCHEDULED':
        return { color: '#f59e0b', text: 'Pickup Scheduled', icon: '📦', bgColor: '#fffbeb' };
      case 'IN_TRANSIT':
        return { color: '#8b5cf6', text: 'In Transit', icon: '🚚', bgColor: '#f5f3ff' };
      case 'DELIVERED':
        return { color: '#10b981', text: 'Delivered', icon: '🏠', bgColor: '#ecfdf5' };
      default:
        return { color: '#6b7280', text: 'Processing', icon: '⚙️', bgColor: '#f9fafb' };
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    
    try {
      // Handle "Tomorrow" format from DateTimePicker
      if (dateString.toLowerCase().includes('tomorrow')) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Handle time slots like "9 AM - 12 PM"
    if (timeString.includes('-')) return timeString;
    
    // Handle simple time
    return timeString;
  };

  // Get vehicle icon
  const getVehicleIcon = (vehicleType) => {
    const icons = {
      'mini_van': '🚐',
      'pickup_truck': '🚚',
      'container_truck': '🚛',
      'trailer_truck': '🚛📦',
      'refrigerated_truck': '🚚❄️',
      'tipper_truck': '🚛⛏️'
    };
    return icons[vehicleType] || '🚚';
  };

  // Get payment icon
  const getPaymentIcon = (method) => {
    const icons = {
      'upi': '📱',
      'card': '💳',
      'netbanking': '🏦',
      'wallet': '💰',
      'cod': '💵'
    };
    return icons[method] || '💳';
  };

  const statusInfo = getStatusColor(status);
  const vehicleIcon = getVehicleIcon(vehicleType || vehicle);
  const paymentIcon = getPaymentIcon(paymentMethod);
  const formattedPickupDate = formatDate(pickupDate);
  const formattedPickupTime = formatTime(pickupTime);

  // Handle track
  const handleTrack = () => {
    if (trackingId) {
      window.location.href = `/tracking?id=${trackingId}`;
    } else {
      alert('Tracking ID will be generated soon');
    }
  };

  // Handle view details
  const handleViewDetails = () => {
    // Save order data to localStorage for receipt page
    const orderData = {
      fromCity,
      toCity,
      distance,
      weight,
      totalAmount,
      vehicle: vehicleName || vehicle,
      pickupDate: formattedPickupDate,
      pickupTime: formattedPickupTime,
      trackingId,
      orderId
    };
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    window.location.href = '/receipt';
  };

  return (
    <div className="order-card">
      {/* Header - Order ID & Status */}
      <div className="order-header">
        <div className="order-id-section">
          <h3 className="order-id">Order #{orderId}</h3>
          <span className="order-date">
            {new Date(createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        <div 
          className="order-status"
          style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
            border: `1px solid ${statusInfo.color}30`
          }}
        >
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>

      {/* Route Information */}
      <div className="route-section">
        <div className="route-from">
          <div className="city-badge from-badge">
            <span className="badge-icon">📦</span>
            <div className="city-info">
              <div className="city-name">{fromCity || 'Select city'}</div>
              <div className="city-state">{fromState || ''}</div>
            </div>
          </div>
          
          <div className="route-middle">
            <div className="distance-display">
              <span className="distance-value">{distance || '0'}</span>
              <span className="distance-unit">km</span>
            </div>
            <div className="route-arrow">→</div>
            {travelTime && (
              <div className="travel-time">
                <span className="time-icon">⏱️</span>
                <span className="time-value">{travelTime}</span>
              </div>
            )}
          </div>
          
          <div className="route-to">
            <div className="city-badge to-badge">
              <span className="badge-icon">🏠</span>
              <div className="city-info">
                <div className="city-name">{toCity || 'Select city'}</div>
                <div className="city-state">{toState || ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="order-details-grid">
        <div className="detail-item">
          <span className="detail-label">Package:</span>
          <span className="detail-value">
            <span className="weight-icon">⚖️</span>
            {weight || '1'} kg
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Vehicle:</span>
          <span className="detail-value">
            <span className="vehicle-icon">{vehicleIcon}</span>
            {vehicleName || vehicle || 'Select vehicle'}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Pickup:</span>
          <span className="detail-value">
            <span className="date-icon">📅</span>
            {formattedPickupDate} {formattedPickupTime && `• ${formattedPickupTime}`}
          </span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Amount:</span>
          <span className="detail-value amount-value">
            <span className="amount-icon">₹</span>
            {totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Additional Services (if any) */}
      {(helperService || insuranceService || packagingService || fastrackService || weekendService || nightService) && (
        <div className="services-section">
          <div className="services-label">Additional Services:</div>
          <div className="services-list">
            {helperService && <span className="service-tag">👷 Helper</span>}
            {insuranceService && <span className="service-tag">🛡️ Insurance</span>}
            {packagingService && <span className="service-tag">📦 Packaging</span>}
            {fastrackService && <span className="service-tag">⚡ Fast Track</span>}
            {weekendService && <span className="service-tag">🗓️ Weekend</span>}
            {nightService && <span className="service-tag">🌙 Night</span>}
          </div>
        </div>
      )}

      {/* Payment Info */}
      {paymentMethod && (
        <div className="payment-section">
          <span className="payment-label">Payment:</span>
          <span className="payment-method">
            <span className="payment-icon">{paymentIcon}</span>
            {paymentMethod === 'upi' && 'UPI'}
            {paymentMethod === 'card' && 'Card'}
            {paymentMethod === 'netbanking' && 'Net Banking'}
            {paymentMethod === 'wallet' && 'Wallet'}
            {paymentMethod === 'cod' && 'Cash on Delivery'}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="order-actions">
        <button 
          className="action-btn track-btn"
          onClick={handleTrack}
          disabled={status === 'ORDER_CONFIRMED'}
        >
          <span className="btn-icon">📍</span>
          Track Order
        </button>
        
        <button 
          className="action-btn details-btn"
          onClick={handleViewDetails}
        >
          <span className="btn-icon">📋</span>
          View Details
        </button>
      </div>

      {/* Tracking ID */}
      {trackingId && (
        <div className="tracking-section">
          <span className="tracking-label">Tracking ID:</span>
          <span className="tracking-id-value" onClick={() => navigator.clipboard.writeText(trackingId)}>
            {trackingId}
            <span className="copy-hint">(Click to copy)</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;