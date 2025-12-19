
import { useNavigate } from 'react-router-dom';
const OrderCard = ({ order = {} }) => {
  const navigate = useNavigate();
  // Extract all order data with defaults
  const {
    id = '',
    orderId = '',
    trackingId = '',
    phone = '',
    
    // Location details
    fromCity = '',
    fromState = '',
    fromAddress = '',
    toCity = '',
    toState = '',
    toAddress = '',
    
    // Package details
    distance = '0',
    weight = '1',
    packageType = 'general',
    deliveryUrgency = 'standard',
    
    // Pricing
    estimatedPrice = 0,
    totalAmount = 0,
    
    // Timing
    travelTime = '',
    pickupDate = '',
    pickupTime = '',
    selectedDate = '',
    selectedTimeSlot = '',
    createdAt = new Date().toISOString(),
    
    // Vehicle details
    vehicleType = '',
    vehicleName = '',
    
    // Payment
    paymentMethod = '',
    paymentName = '',
    
    // Status
    status = 'confirmed',
    
    // Services
    helperService = false,
    insuranceService = false,
    packagingService = false,
    fastrackService = false,
    weekendService = false,
    nightService = false
  } = order;

  // Calculate display amount
  const displayAmount =  (order?.estimatedPrice || 0) +
  (order?.fastDeliveryCharge || 0) +
  (order?.vehiclePrice || 0) +
  (order?.helperPrice || 0) +
  (order?.insurancePrice || 0) +
  (order?.packagingPrice || 0)


  // Get status details
  const getStatusInfo = () => {
    const statusMap = {
      'confirmed': { 
        text: 'Order Confirmed', 
        icon: '✅', 
        color: '#3b82f6', 
        bgColor: '#eff6ff',
        nextStep: 'Scheduled for pickup'
      },
      'ORDER_CONFIRMED': { 
        text: 'Order Confirmed', 
        icon: '✅', 
        color: '#3b82f6', 
        bgColor: '#eff6ff',
        nextStep: 'Scheduled for pickup'
      },
      'pending': { 
        text: 'Pending', 
        icon: '⏳', 
        color: '#f59e0b', 
        bgColor: '#fffbeb',
        nextStep: 'Awaiting confirmation'
      },
      'scheduled': { 
        text: 'Pickup Scheduled', 
        icon: '📅', 
        color: '#8b5cf6', 
        bgColor: '#f5f3ff',
        nextStep: 'Driver assigned soon'
      },
      'PICKUP_SCHEDULED': { 
        text: 'Pickup Scheduled', 
        icon: '📅', 
        color: '#8b5cf6', 
        bgColor: '#f5f3ff',
        nextStep: 'Driver assigned soon'
      },
      'picked_up': { 
        text: 'Picked Up', 
        icon: '📦', 
        color: '#06b6d4', 
        bgColor: '#ecfeff',
        nextStep: 'In transit to destination'
      },
      'in_transit': { 
        text: 'In Transit', 
        icon: '🚚', 
        color: '#f97316', 
        bgColor: '#fff7ed',
        nextStep: 'Estimated delivery soon'
      },
      'IN_TRANSIT': { 
        text: 'In Transit', 
        icon: '🚚', 
        color: '#f97316', 
        bgColor: '#fff7ed',
        nextStep: 'Estimated delivery soon'
      },
      'out_for_delivery': { 
        text: 'Out for Delivery', 
        icon: '🏍️', 
        color: '#10b981', 
        bgColor: '#ecfdf5',
        nextStep: 'Will be delivered today'
      },
      'delivered': { 
        text: 'Delivered', 
        icon: '🏠', 
        color: '#10b981', 
        bgColor: '#ecfdf5',
        nextStep: 'Successfully delivered'
      },
      'DELIVERED': { 
        text: 'Delivered', 
        icon: '🏠', 
        color: '#10b981', 
        bgColor: '#ecfdf5',
        nextStep: 'Successfully delivered'
      },
      'cancelled': { 
        text: 'Cancelled', 
        icon: '❌', 
        color: '#ef4444', 
        bgColor: '#fef2f2',
        nextStep: 'Order cancelled'
      }
    };

    return statusMap[status?.toLowerCase()] || { 
      text: 'Processing', 
      icon: '⚙️', 
      color: '#6b7280', 
      bgColor: '#f9fafb',
      nextStep: 'Processing your order'
    };
  };

  const statusInfo = getStatusInfo();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    
    try {
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

  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    const timeMap = {
      'morning': '9 AM - 12 PM',
      'afternoon': '12 PM - 3 PM',
      'evening': '3 PM - 6 PM',
      'night': '6 PM - 9 PM',
      'custom': 'Custom Time'
    };
    
    return timeMap[timeSlot] || timeSlot || 'Flexible';
  };

  // Get vehicle icon
  const getVehicleIcon = () => {
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

  // Get package icon
  const getPackageIcon = () => {
    const icons = {
      'general': '📦',
      'fragile': '⚠️',
      'documents': '📄',
      'electronics': '💻',
      'furniture': '🪑',
      'perishable': '❄️'
    };
    return icons[packageType] || '📦';
  };

  // Get urgency badge
  const getUrgencyBadge = () => {
    const badges = {
      'standard': { text: 'Standard', color: '#6b7280', bg: '#f3f4f6' },
      'express': { text: 'Express', color: '#dc2626', bg: '#fee2e2' },
      'same_day': { text: 'Same Day', color: '#7c3aed', bg: '#ede9fe' },
      'next_day': { text: 'Next Day', color: '#059669', bg: '#d1fae5' }
    };
    return badges[deliveryUrgency] || badges.standard;
  };

  // Get payment icon
  const getPaymentIcon = () => {
    const icons = {
      'upi': '📱',
      'card': '💳',
      'netbanking': '🏦',
      'wallet': '💰',
      'cod': '💵',
      'Cash on Delivery': '💵'
    };
    return icons[paymentMethod || paymentName] || '💳';
  };

  // Get payment text
  const getPaymentText = () => {
    const texts = {
      'upi': 'UPI',
      'card': 'Card',
      'netbanking': 'Net Banking',
      'wallet': 'Wallet',
      'cod': 'Cash on Delivery',
      'Cash on Delivery': 'Cash on Delivery'
    };
    return texts[paymentMethod || paymentName] || paymentMethod || paymentName || 'Payment';
  };

  // Calculate total services
  const getTotalServices = () => {
    let count = 0;
    if (helperService) count++;
    if (insuranceService) count++;
    if (packagingService) count++;
    if (fastrackService) count++;
    if (weekendService) count++;
    if (nightService) count++;
    return count;
  };

  const vehicleIcon = getVehicleIcon();
  const packageIcon = getPackageIcon();
  const paymentIcon = getPaymentIcon();
  const paymentText = getPaymentText();
  const urgencyBadge = getUrgencyBadge();
  const totalServices = getTotalServices();
  
  const displayOrderId = orderId || id?.slice(-8) || `ORD${Date.now().toString().slice(-8)}`;
  const displayTrackingId = trackingId;
  const formattedPickupDate = formatDate(pickupDate || selectedDate);
  const formattedPickupTime = formatTimeSlot(pickupTime || selectedTimeSlot);
  const displayFromCity = fromCity || 'Select city';
  const displayToCity = toCity || 'Select city';
  const displayVehicle = vehicleName || vehicleType || 'Select vehicle';

  // Handle track order
  const handleTrackOrder = () => {
    if (displayTrackingId) {
      navigate(`/tracking?id=${displayTrackingId}`);
    } else {
      alert('Tracking ID will be generated soon');
    }
  };


  // Handle copy tracking ID
  const handleCopyTrackingId = () => {
    navigator.clipboard.writeText(displayTrackingId)
      .then(() => {
        alert('Tracking ID copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy tracking ID');
      });
  };

  return (
    <div className="order-card">
      {/* Card Header */}
      <div className="order-card-header">
        <div className="order-id-section">
          <div className="order-id-container">
            <span className="order-id-label">Order ID:</span>
            <span className="order-id-value">#{displayOrderId}</span>
          </div>
          <span className="order-date">
            {new Date(createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        <div 
          className="order-status-badge"
          style={{ 
            backgroundColor: statusInfo.bgColor,
            color: statusInfo.color,
            borderColor: statusInfo.color
          }}
        >
          <span className="status-icon">{statusInfo.icon}</span>
          <span className="status-text">{statusInfo.text}</span>
        </div>
      </div>

      {/* Route Information */}
      <div className="route-info">
        <div className="route-locations">
          <div className="location from-location">
            <div className="location-icon pickup-icon">📦</div>
            <div className="location-details">
              <div className="city-name">{displayFromCity}</div>
              <div className="city-state">{fromState}</div>
              {fromAddress && (
                <div className="address-truncated">{fromAddress.substring(0, 30)}...</div>
              )}
            </div>
          </div>

          <div className="route-middle">
            <div className="distance-badge">
              <span className="distance-value">{distance}</span>
              <span className="distance-unit">km</span>
            </div>
            <div className="route-arrow">→</div>
            {travelTime && (
              <div className="travel-time-badge">
                <span className="time-icon">⏱️</span>
                <span className="time-value">{travelTime}</span>
              </div>
            )}
          </div>

          <div className="location to-location">
            <div className="location-icon delivery-icon">🏠</div>
            <div className="location-details">
              <div className="city-name">{displayToCity}</div>
              <div className="city-state">{toState}</div>
              {toAddress && (
                <div className="address-truncated">{toAddress.substring(0, 30)}...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="package-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">Package:</span>
            <span className="detail-value">
              <span className="detail-icon">{packageIcon}</span>
              {weight} kg • {packageType}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Urgency:</span>
            <span 
              className="urgency-badge"
              style={{
                backgroundColor: urgencyBadge.bg,
                color: urgencyBadge.color
              }}
            >
              {urgencyBadge.text}
            </span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">Vehicle:</span>
            <span className="detail-value">
              <span className="detail-icon">{vehicleIcon}</span>
              {displayVehicle}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Pickup:</span>
            <span className="detail-value">
              <span className="detail-icon">📅</span>
              {formattedPickupDate} • {formattedPickupTime}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      {totalServices > 0 && (
        <div className="services-section">
          <div className="services-header">
            <span className="services-label">Additional Services ({totalServices}):</span>
          </div>
          <div className="services-tags">
            {helperService && <span className="service-tag">👷 Helper</span>}
            {insuranceService && <span className="service-tag">🛡️ Insurance</span>}
            {packagingService && <span className="service-tag">📦 Packaging</span>}
            {fastrackService && <span className="service-tag">⚡ Fast Track</span>}
            {weekendService && <span className="service-tag">🗓️ Weekend</span>}
            {nightService && <span className="service-tag">🌙 Night</span>}
          </div>
        </div>
      )}

      {/* Payment and Amount */}
      <div className="payment-amount-section">
        <div className="payment-info">
          <span className="payment-label">Payment:</span>
          <span className="payment-method">
            <span className="payment-icon">{paymentIcon}</span>
            {paymentText}
          </span>
        </div>
        <div className="amount-info">
          <span className="amount-label">Total Amount:</span>
          <span className="amount-value">
            <span className="currency">₹</span>
            {displayAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Tracking Info */}
      <div className="tracking-section">
        <div className="tracking-info">
          <span className="tracking-label">Tracking ID:</span>
          <span 
            className="tracking-id"
            onClick={handleCopyTrackingId}
            title="Click to copy"
          >
            {displayTrackingId}
            <span className="copy-icon">📋</span>
          </span>
        </div>
        <div className="next-step">
          <span className="next-step-label">Next:</span>
          <span className="next-step-text">{statusInfo.nextStep}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-btn track-btn"
          onClick={handleTrackOrder}
          disabled={!displayTrackingId}
        >
          <span className="btn-icon">📍</span>
          Track Order
        </button>
      </div>
    </div>
  );
};

export default OrderCard;