import  { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../tracking/styles/TrackingPage.css';

const TrackingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const trackingIdFromUrl = queryParams.get('id');
  
  // State
  const [trackingId, setTrackingId] = useState(trackingIdFromUrl || '');
  const [order, setOrder] = useState(null);
  const [executive, setExecutive] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 4, minutes: 30 });
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [progress, setProgress] = useState(25);
  const [isTracking, setIsTracking] = useState(false);
  const [liveLocation, setLiveLocation] = useState({ lat: 0, lng: 0 });
  const [timeline, setTimeline] = useState([]);


    useEffect(()=>{
      const currentUSer = JSON.parse(localStorage.getItem('current_user'));
      if(!currentUSer){
        navigate('/login');
      }
    },[])

  // Get REAL order data from localStorage/database
  const getRealOrderData = (id) => {
    if (!id) return null;
    
    // 1. First check localStorage (temporary storage)
    const savedOrders = JSON.parse(localStorage.getItem('shippingOrders') || '[]');
    const foundOrder = savedOrders.find(order => order.trackingId === id);
    
    if (foundOrder) {
      console.log('Found order in localStorage:', foundOrder);
      return foundOrder;
    }
    
    // 2. Check sessionStorage (current session)
    const sessionOrder = JSON.parse(sessionStorage.getItem('currentOrder') || '{}');
    if (sessionOrder.trackingId === id) {
      console.log('Found order in sessionStorage:', sessionOrder);
      return sessionOrder;
    }
    
    // 3. Check URL parameters from receipt page
    const receiptData = JSON.parse(localStorage.getItem('receiptData') || '{}');
    if (receiptData.trackingId === id) {
      console.log('Found order from receipt:', receiptData);
      return receiptData;
    }
    
    return null;
  };

  // Create timeline based on order status
  const createTimeline = (orderData) => {
    const now = new Date();
    const pickupDate = orderData.pickupDate ? new Date(orderData.pickupDate) : new Date();
    
    // Calculate delivery date based on travel time
    const deliveryDate = new Date(pickupDate);
    if (orderData.travelTime) {
      const hoursMatch = orderData.travelTime.match(/(\d+)\s*hours?/);
      const daysMatch = orderData.travelTime.match(/(\d+)\s*days?/);
      
      if (hoursMatch) {
        deliveryDate.setHours(deliveryDate.getHours() + parseInt(hoursMatch[1]));
      } else if (daysMatch) {
        deliveryDate.setDate(deliveryDate.getDate() + parseInt(daysMatch[1]));
      } else {
        deliveryDate.setDate(deliveryDate.getDate() + 2); // Default 2 days
      }
    } else {
      deliveryDate.setDate(deliveryDate.getDate() + 2);
    }

    const baseTimeline = [
      {
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed',
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        icon: '✅',
        timestamp: now
      },
      {
        status: 'pickup_scheduled',
        title: 'Pickup Scheduled',
        description: `Pickup scheduled for ${orderData.pickupDate || 'tomorrow'}`,
        time: orderData.pickupTime || '9 AM - 12 PM',
        completed: orderData.status === 'pickup_scheduled' || orderData.status === 'in_transit' || orderData.status === 'delivered',
        icon: '📦',
        timestamp: pickupDate
      },
      {
        status: 'in_transit',
        title: 'In Transit',
        description: 'Package is on the way',
        time: 'Currently in transit',
        completed: orderData.status === 'in_transit' || orderData.status === 'delivered',
        icon: '🚚',
        timestamp: new Date(pickupDate.getTime() + 3600000) // 1 hour after pickup
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Package delivered successfully',
        time: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        completed: orderData.status === 'delivered',
        icon: '🏠',
        timestamp: deliveryDate
      }
    ];

    return baseTimeline;
  };

  // Calculate time remaining based on delivery date
  const calculateTimeRemaining = (deliveryDate) => {
    const now = new Date();
    const delivery = new Date(deliveryDate);
    const diff = delivery - now;
    
    if (diff <= 0) return { hours: 0, minutes: 0, status: 'delivered' };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, status: hours < 2 ? 'urgent' : 'normal' };
  };

  // Assign executive based on order details
  const assignExecutive = (orderData) => {
    // Filter available executives
    const availableExecs = fakeExecutives.filter(exec => exec.status === 'available');
    
    if (availableExecs.length === 0) {
      // If no available, use first executive
      return fakeExecutives[0];
    }
    
    // Find executive with matching vehicle type
    const vehicleMatch = availableExecs.find(exec => 
      exec.vehicle.toLowerCase().includes(orderData.vehicleType?.toLowerCase() || '')
    );
    
    if (vehicleMatch) return vehicleMatch;
    
    // Otherwise, get random executive
    const randomIndex = Math.floor(Math.random() * availableExecs.length);
    return availableExecs[randomIndex];
  };

  // Handle search
  const handleSearch = () => {
    if (!trackingId.trim()) {
      alert('Please enter a Tracking ID');
      return;
    }
    
    const foundOrder = getRealOrderData(trackingId);
    
    if (foundOrder) {
      console.log('Tracking Order Data:', foundOrder);
      setOrder(foundOrder);
      
      // Create timeline
      const orderTimeline = createTimeline(foundOrder);
      setTimeline(orderTimeline);
      
      // Calculate progress
      const completedSteps = orderTimeline.filter(step => step.completed).length;
      setProgress(Math.round((completedSteps / orderTimeline.length) * 100));
      
      // Set current status
      setCurrentStatus(foundOrder.status || 'confirmed');
      
      // Assign executive (simulate 1-2 hour delay after order confirmation)
      setTimeout(() => {
        const assignedExecutive = assignExecutive(foundOrder);
        setExecutive(assignedExecutive);
        setLiveLocation(assignedExecutive.location);
        
        // Update executive status
        assignedExecutive.status = 'busy';
        assignedExecutive.currentOrder = foundOrder.trackingId;
      }, Math.random() * 3600000 + 1800000); // 30-90 minutes delay
      
      // Calculate time remaining
      const deliveryDate = orderTimeline[3].timestamp;
      const time = calculateTimeRemaining(deliveryDate);
      setTimeRemaining(time);
      
      // Start tracking
      setIsTracking(true);
      
    } else {
      // Try with # prefix
      const orderWithHash = getRealOrderData(`#${trackingId}`);
      if (orderWithHash) {
        setTrackingId(`#${trackingId}`);
        setTimeout(() => handleSearch(), 100);
      } else {
        alert(`Order with Tracking ID "${trackingId}" not found.\n\nYour order might still be processing. Please try again in a few minutes.`);
      }
    }
  };

  // Simulate live updates
  useEffect(() => {
    if (!isTracking || !order) return;
    
    const interval = setInterval(() => {
      // Update progress based on time elapsed
      const now = new Date();
      const orderTime = new Date(order.createdAt || Date.now());
      const timeElapsed = now - orderTime;
      const totalTime = 4 * 60 * 60 * 1000; // 4 hours total delivery time
      
      let newProgress = Math.min(100, Math.round((timeElapsed / totalTime) * 100));
      
      // Ensure minimum progress based on status
      if (currentStatus === 'confirmed' && newProgress < 25) newProgress = 25;
      if (currentStatus === 'pickup_scheduled' && newProgress < 50) newProgress = 50;
      if (currentStatus === 'in_transit' && newProgress < 75) newProgress = 75;
      if (currentStatus === 'delivered') newProgress = 100;
      
      setProgress(newProgress);
      
      // Update timeline completion
      const updatedTimeline = timeline.map((step, index) => {
        if (index <= Math.floor(newProgress / 25)) {
          return { ...step, completed: true };
        }
        return step;
      });
      setTimeline(updatedTimeline);
      
      // Update status based on progress
      if (newProgress >= 25 && currentStatus === 'confirmed') {
        setCurrentStatus('pickup_scheduled');
      } else if (newProgress >= 50 && currentStatus === 'pickup_scheduled') {
        setCurrentStatus('in_transit');
        // Assign executive if not already assigned
        if (!executive) {
          const assignedExecutive = assignExecutive(order);
          setExecutive(assignedExecutive);
        }
      } else if (newProgress >= 90 && currentStatus === 'in_transit') {
        setCurrentStatus('delivered');
      }
      
      // Update live location if in transit
      if (executive && currentStatus === 'in_transit') {
        setLiveLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
        
        // Update time remaining
        const completedSteps = updatedTimeline.filter(step => step.completed).length;
        const remainingSteps = 4 - completedSteps;
        const estimatedMinutes = remainingSteps * 60; // 60 minutes per step
        
        setTimeRemaining({
          hours: Math.floor(estimatedMinutes / 60),
          minutes: estimatedMinutes % 60,
          status: estimatedMinutes < 120 ? 'urgent' : 'normal'
        });
      }
      
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [isTracking, order, executive, currentStatus, timeline]);

  // Auto-search if ID in URL
  useEffect(() => {
    if (trackingIdFromUrl) {
      setTrackingId(trackingIdFromUrl);
      setTimeout(() => handleSearch(), 500);
    }
  }, [trackingIdFromUrl]);

  // Get status color
  const getStatusColor = (status) => {
    return  '#6b7280';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    return '⚙️';
  };

  // Format time
  const formatTime = (time) => {
    if (!time) return 'Calculating...';
    return `${time.hours}h ${time.minutes}m`;
  };

  // Handle call executive
  const handleCallExecutive = () => {
    if (executive?.phone) {
      window.location.href = `tel:${executive.phone}`;
    } else {
      alert('Executive will be assigned soon. Phone number will be available after assignment.');
    }
  };

  // Handle message executive
  const handleMessageExecutive = () => {
    if (executive?.phone) {
      const message = `Hi ${executive.name}, I have a query about my shipment ${order?.trackingId}`;
      window.location.href = `https://wa.me/${executive.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    } else {
      alert('Executive will be assigned soon. You can message after assignment.');
    }
  };

  // Handle share tracking
  const handleShareTracking = () => {
    const shareUrl = `${window.location.origin}/tracking?id=${order?.trackingId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Track My Shipment',
        text: `Track my shipment: ${order?.trackingId}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Tracking link copied to clipboard!');
    }
  };

  // Format pickup time display
  const formatPickupDisplay = () => {
    if (!order?.pickupDate || !order?.pickupTime) return 'Being scheduled...';
    
    const today = new Date();
    const pickupDate = new Date(order.pickupDate);
    
    if (pickupDate.toDateString() === today.toDateString()) {
      return `Today, ${order.pickupTime}`;
    } else if (pickupDate.toDateString() === new Date(today.getTime() + 86400000).toDateString()) {
      return `Tomorrow, ${order.pickupTime}`;
    } else {
      return `${pickupDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, ${order.pickupTime}`;
    }
  };

  if (!isTracking) {
    return (
      <div className="tracking-container-k5j">
        <div className="search-section-k5j">
          <div className="search-header-k5j">
            <h1>Track Your Shipment</h1>
            <p>Enter the Tracking ID from your order confirmation</p>
          </div>
          
          <div className="search-box-k5j">
            <div className="input-group-k5j">
              <div className="input-icon-k5j">🔍</div>
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g., #9876543210)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="tracking-input-k5j"
              />
              <button 
                onClick={handleSearch}
                className="search-btn-k5j"
              >
                Track Shipment
              </button>
            </div>
            <p className="input-hint-k5j">
              You received this ID in your order confirmation email and receipt
            </p>
          </div>

          <div className="info-box-k5j">
            <h3>📋 How Tracking Works:</h3>
            <div className="info-steps-k5j">
              <div className="step-k5j">
                <div className="step-number-k5j">1</div>
                <div className="step-content-k5j">
                  <strong>Order Confirmed</strong>
                  <p>Immediately after payment</p>
                </div>
              </div>
              <div className="step-k5j">
                <div className="step-number-k5j">2</div>
                <div className="step-content-k5j">
                  <strong>Pickup Scheduled</strong>
                  <p>Within 1-2 hours, executive assigned</p>
                </div>
              </div>
              <div className="step-k5j">
                <div className="step-number-k5j">3</div>
                <div className="step-content-k5j">
                  <strong>In Transit</strong>
                  <p>Live location tracking starts</p>
                </div>
              </div>
              <div className="step-k5j">
                <div className="step-number-k5j">4</div>
                <div className="step-content-k5j">
                  <strong>Delivered</strong>
                  <p>Package delivered to destination</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-container-k5j">
      {/* Header */}
      <div className="tracking-header-k5j">
        <button 
          className="back-btn-k5j"
          onClick={() => {
            setIsTracking(false);
            setTrackingId('');
          }}
        >
          ← Track Another
        </button>
        <div className="header-actions-k5j">
          <button 
            className="share-btn-k5j"
            onClick={handleShareTracking}
          >
            📤 Share Tracking
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="order-card-k5j">
        <div className="card-header-k5j">
          <div className="order-id-display-k5j">
            <h2>{order.trackingId || `#${order.phone?.slice(-10)}`}</h2>
            <p className="order-date-k5j">
              Ordered on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div 
            className="status-badge-k5j"
            style={{ 
              backgroundColor: getStatusColor(currentStatus) + '20',
              color: getStatusColor(currentStatus),
              border: `1.5px solid ${getStatusColor(currentStatus)}`
            }}
          >
            <span className="status-icon-k5j">{getStatusIcon(currentStatus)}</span>
            <span className="status-text-k5j">
              {currentStatus === 'confirmed' && 'Order Confirmed'}
              {currentStatus === 'pickup_scheduled' && 'Pickup Scheduled'}
              {currentStatus === 'in_transit' && 'In Transit'}
              {currentStatus === 'delivered' && 'Delivered'}
            </span>
          </div>
        </div>

        {/* Route Info - REAL DATA from Shipping Flow */}
        <div className="route-info-k5j">
          <div className="route-point-k5j pickup-k5j">
            <div className="point-icon-k5j">📦</div>
            <div className="point-details-k5j">
              <div className="point-label-k5j">Pickup From</div>
              <div className="point-address-k5j">
                {order.fromAddress?.split(',')[0] || order.fromAddress || 'Address loading...'}
              </div>
              <div className="point-location-k5j">
                {order.fromCity || 'City'}, {order.fromState || 'State'}
              </div>
            </div>
          </div>
          
          <div className="route-middle-k5j">
            <div className="distance-badge-k5j">
              <span className="distance-k5j">{order.distance || '0'}</span>
              <span className="unit-k5j">km</span>
            </div>
            <div className="route-line-k5j"></div>
            <div className="travel-time-k5j">
              ⏱️ {order.travelTime || 'Calculating route...'}
            </div>
          </div>
          
          <div className="route-point-k5j delivery-k5j">
            <div className="point-icon-k5j">🏠</div>
            <div className="point-details-k5j">
              <div className="point-label-k5j">Deliver To</div>
              <div className="point-address-k5j">
                {order.toAddress?.split(',')[0] || order.toAddress || 'Address loading...'}
              </div>
              <div className="point-location-k5j">
                {order.toCity || 'City'}, {order.toState || 'State'}
              </div>
            </div>
          </div>
        </div>

        {/* Package Details - REAL DATA */}
        <div className="package-details-k5j">
          <div className="detail-item-k5j">
            <span className="detail-label-k5j">Package Weight</span>
            <span className="detail-value-k5j">
              <span className="icon-k5j">⚖️</span>
              {order.weight || '1'} kg
            </span>
          </div>
          
          <div className="detail-item-k5j">
            <span className="detail-label-k5j">Vehicle</span>
            <span className="detail-value-k5j">
              <span className="icon-k5j">
                {order.vehicleType === 'mini_van' && '🚐'}
                {order.vehicleType === 'pickup_truck' && '🚚'}
                {order.vehicleType === 'container_truck' && '🚛'}
                {!order.vehicleType && '🚚'}
              </span>
              {order.vehicleName || order.vehicleType || 'Transport Vehicle'}
            </span>
          </div>
          
          <div className="detail-item-k5j">
            <span className="detail-label-k5j">Amount</span>
            <span className="detail-value-k5j amount-k5j">
              <span className="icon-k5j">₹</span>
           {
  (order?.estimatedPrice || 0) +
  (order?.fastDeliveryCharge || 0) +
  (order?.vehiclePrice || 0) +
  (order?.helperPrice || 0) +
  (order?.insurancePrice || 0) +
  (order?.packagingPrice || 0)
}
            </span>
          </div>
        </div>

        {/* Pickup Time */}
        <div className="pickup-time-k5j">
          <span className="pickup-label-k5j">📅 Pickup Scheduled:</span>
          <span className="pickup-value-k5j">{formatPickupDisplay()}</span>
        </div>
      </div>

      {/* Progress & Timer */}
      <div className="progress-section-k5j">
        <div className="progress-header-k5j">
          <h3>Delivery Progress</h3>
          <div className="timer-k5j">
            <span className="timer-icon-k5j">⏱️</span>
            <span className="timer-text-k5j">
              {timeRemaining.hours > 0 || timeRemaining.minutes > 0 
                ? `${formatTime(timeRemaining)} remaining`
                : 'Delivery in progress'}
            </span>
          </div>
        </div>
        
        <div className="progress-bar-container-k5j">
          <div className="progress-bar-k5j">
            <div 
              className="progress-fill-k5j"
              style={{ 
                width: `${progress}%`,
                backgroundColor: getStatusColor(currentStatus)
              }}
            ></div>
          </div>
          <div className="progress-percent-k5j">{progress}%</div>
        </div>
        
        {/* Timeline - REAL times */}
        <div className="progress-steps-k5j">
          {timeline.map((step, index) => (
            <div 
              key={index}
              className={`progress-step-k5j ${step.completed ? 'completed-k5j' : ''} ${currentStatus === step.status ? 'current-k5j' : ''}`}
            >
              <div className="step-icon-k5j">{step.icon}</div>
              <div className="step-info-k5j">
                <div className="step-title-k5j">{step.title}</div>
                <div className="step-time-k5j">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Info - Shows only after assignment */}
      {executive && currentStatus !== 'confirmed' && (
        <div className="executive-section-k5j">
          <h3>
            {currentStatus === 'pickup_scheduled' ? 'Assigned Executive' : 'Delivery Executive'}
          </h3>
          <div className="executive-card-k5j">
            <div className="executive-info-k5j">
              <img src={executive.photo} alt={executive.name} className="executive-avatar-k5j" />
              <div className="executive-details-k5j">
                <h4>{executive.name}</h4>
                <p className="executive-vehicle-k5j">
                  {executive.vehicle} • ⭐ {executive.rating} ({executive.completedDeliveries} deliveries)
                </p>
                <p className="executive-phone-k5j">{executive.phone}</p>
              </div>
            </div>
            <div className="executive-actions-k5j">
              <button 
                className="action-btn-k5j call-btn-k5j"
                onClick={handleCallExecutive}
              >
                📞 Call Now
              </button>
              <button 
                className="action-btn-k5j message-btn-k5j"
                onClick={handleMessageExecutive}
              >
                💬 WhatsApp
              </button>
            </div>
          </div>
          
          {/* Live Location - Only shows during transit */}
          {currentStatus === 'in_transit' && (
            <div className="live-location-k5j">
              <div className="location-header-k5j">
                <span className="live-badge-k5j">● LIVE</span>
                <span className="location-text-k5j">Current Location</span>
              </div>
              <div className="location-info-k5j">
                <p>Tracking vehicle movement in real-time</p>
                <div className="coordinates-k5j">
                  <span>Lat: {liveLocation.lat.toFixed(6)}</span>
                  <span>Lng: {liveLocation.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      <div className="status-messages-k5j">
        {currentStatus === 'confirmed' && (
          <div className="message-k5j info-k5j">
            <div className="message-icon-k5j">ℹ️</div>
            <div className="message-content-k5j">
              <strong>Executive Assignment In Progress</strong>
              <p>Your delivery executive will be assigned within 1-2 hours. You'll receive their contact details.</p>
            </div>
          </div>
        )}
        
        {currentStatus === 'pickup_scheduled' && executive && (
          <div className="message-k5j success-k5j">
            <div className="message-icon-k5j">✅</div>
            <div className="message-content-k5j">
              <strong>Executive Assigned Successfully</strong>
              <p>{executive.name} will arrive for pickup at the scheduled time. You can contact them if needed.</p>
            </div>
          </div>
        )}
        
        {currentStatus === 'in_transit' && (
          <div className="message-k5j warning-k5j">
            <div className="message-icon-k5j">🚚</div>
            <div className="message-content-k5j">
              <strong>Package In Transit</strong>
              <p>Your package is on the way. Expected delivery in {formatTime(timeRemaining)}.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-section-k5j">
        <button 
          className="primary-btn-k5j"
          onClick={() => navigate('/dashboard')}
        >
          🏠 View All Orders
        </button>
        <button 
          className="secondary-btn-k5j"
          onClick={() => navigate('/shipping')}
        >
          🚚 New Shipment
        </button>
      </div>

      {/* Support */}
      <div className="support-section-k5j">
        <p className="support-text-k5j">
          <strong>Need help?</strong> Call 1800-123-4567 (24x7) • Email support@transporter.com
        </p>
      </div>
    </div>
  );
};

export default TrackingPage;