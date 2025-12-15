// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import OrderCard from './OrderCard.jsx';
import './styles/OrderCard.css';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, delivered
  const [userPhone, setUserPhone] = useState('');

  // Get logged-in user's phone from localStorage or authentication context
  useEffect(() => {
    // Try to get user from localStorage (adjust based on your auth system)
    const loggedInUser = JSON.parse(localStorage.getItem('current_user') || 'null');
    const userPhoneFromStorage = loggedInUser?.phone || '';
    setUserPhone(userPhoneFromStorage);

    // If no user is logged in, try to get from URL or redirect
    if (!userPhoneFromStorage) {
      // Try to get from URL params or redirect to login
      const urlParams = new URLSearchParams(window.location.search);
      const phoneFromUrl = urlParams.get('phone');
      
      if (phoneFromUrl) {
        setUserPhone(phoneFromUrl);
      } else {
        // If no phone found, show all orders or redirect
        console.log('No user phone found. Showing all orders.');
      }
    }
  }, []);

  // Fetch orders based on user phone
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        // Get all orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('shippingOrders') || '[]');
        
        // Filter orders by user's phone number if available
        let userOrders = storedOrders;
        
        if (userPhone) {
          userOrders = storedOrders.filter(order => 
            order.phone === userPhone || 
            order.userPhone === userPhone // check both possible field names
          );
          console.log(`Found ${userOrders.length} orders for phone: ${userPhone}`);
        }
        
        // If no orders found and user is logged in, show empty state
        if (userOrders.length === 0 && userPhone) {
          console.log(`No orders found for phone: ${userPhone}`);
        }
        
        setOrders(userOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [userPhone]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return order.status !== 'DELIVERED';
    if (filter === 'delivered') return order.status === 'DELIVERED';
    return true;
  });

  const handleStartNewShipment = () => {
    // Pass user phone to shipping page if available
    if (userPhone) {
      navigate(`/shipping?phone=${userPhone}`);
    } else {
      navigate('/shipping');
    }
  };

  const handleTrackOrder = (trackingId) => {
    if (trackingId) {
      navigate(`/tracking?id=${trackingId}`);
    } else {
      alert('Tracking ID not available yet');
    }
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => 
      o.status !== 'DELIVERED' && o.status !== 'delivered'
    ).length;
    const deliveredOrders = orders.filter(o => 
      o.status === 'DELIVERED' || o.status === 'delivered'
    ).length;
    const totalSpent = orders.reduce((sum, order) => {
      let total = Number(order.totalAmount) || Number(order.estimatedPrice) || 0;
      
      // Add additional services if not already included in totalAmount
      if (order.totalAmount === 0 || order.totalAmount === undefined) {
        if (order.helperService) total += 150;
        if (order.insuranceService) total += 300;
        if (order.packagingService) total += 200;
        if (order.fastrackService) total += 500;
        if (order.weekendService) total += 250;
        if (order.nightService) total += 350;
      }
      
      return sum + total;
    }, 0);

    return { totalOrders, activeOrders, deliveredOrders, totalSpent };
  };

  const stats = getStats();

  const handleQuickTrack = () => {
    const trackInput = document.querySelector('.track-input');
    const trackingId = trackInput?.value.trim();
    
    if (!trackingId) {
      alert('Please enter a tracking ID');
      return;
    }
    
    // Check if tracking ID exists in user's orders
    const orderExists = orders.some(order => order.trackingId === trackingId);
    
    if (orderExists) {
      navigate(`/tracking?id=${trackingId}`);
    } else {
      alert('Invalid tracking ID or you do not have access to this order.');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUserPhone('');
    // Redirect to login or home page
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with user info */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="user-welcome">
            <h1 className="dashboard-title">My Shipments</h1>
            {userPhone && (
              <div className="user-info">
                <span className="user-phone">📱 {userPhone}</span>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <p className="dashboard-subtitle">
            {userPhone 
              ? `Manage and track all your shipments in one place` 
              : 'Viewing all shipments (Not logged in)'}
          </p>
        </div>
        <button 
          className="new-shipment-btn"
          onClick={handleStartNewShipment}
        >
          <span className="btn-icon">+</span>
          Start New Shipment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon total-orders">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon active-orders">🚚</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeOrders}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon delivered-orders">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.deliveredOrders}</div>
            <div className="stat-label">Delivered</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon total-spent">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{stats.totalSpent.toLocaleString('en-IN')}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({stats.activeOrders})
          </button>
          <button 
            className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({stats.deliveredOrders})
          </button>
        </div>
        
        {orders.length > 0 && (
          <div className="quick-actions">
            <button 
              className="quick-action-btn"
              onClick={() => {
                const trackingIds = orders.map(o => o.trackingId).filter(id => id).join('\n');
                if (trackingIds) {
                  navigator.clipboard.writeText(trackingIds);
                  alert('All tracking IDs copied to clipboard!');
                } else {
                  alert('No tracking IDs available');
                }
              }}
            >
              <span className="action-icon">📋</span>
              Copy All Tracking IDs
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <OrderCard key={order.id || index} order={order} />
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>
              {userPhone 
                ? `You haven't placed any shipments with phone: ${userPhone}`
                : 'No shipments found. Please log in to view your orders.'}
            </p>
            <button 
              className="empty-state-btn"
              onClick={handleStartNewShipment}
            >
              Start Your First Shipment
            </button>
          </div>
        )}
      </div>

      {/* Quick Track Section */}
      <div className="quick-track-section">
        <h3 className="section-title">Quick Track</h3>
        <div className="quick-track-form">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            className="track-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleQuickTrack();
            }}
          />
          <button 
            className="track-now-btn"
            onClick={handleQuickTrack}
          >
            Track Now
          </button>
        </div>
        {orders.length > 0 && (
          <div className="recent-tracking">
            <p className="recent-label">Recent Tracking IDs:</p>
            <div className="tracking-chips">
              {orders.slice(0, 3).map(order => (
                order.trackingId && (
                  <button
                    key={order.orderId || order.id}
                    className="tracking-chip"
                    onClick={() => handleTrackOrder(order.trackingId)}
                  >
                    {order.trackingId}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUser;