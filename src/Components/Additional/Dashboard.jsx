// src/Components/Additional/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import OrderCard from './DashboardUser';
import { fakeOrders, fakeExecutives, getOrderProgress, statusColors, getStatusText } from '../tracking/FakeData';
import './styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [isAdminLogin , setIsAdminLogin] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0,
    revenue: 0
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  useEffect(() => {
    // Load fake data
    setOrders(fakeOrders);
    setExecutives(fakeExecutives);
    
    // Calculate stats
    const total = fakeOrders.length;
    const inTransit = fakeOrders.filter(o => o.status === 'in_transit').length;
    const delivered = fakeOrders.filter(o => o.status === 'delivered').length;
    const pending = fakeOrders.filter(o => o.status === 'confirmed' || o.status === 'pickup_scheduled').length;
    const revenue = fakeOrders.reduce((sum, order) => sum + order.amount, 0);
    
    setStats({ total, inTransit, delivered, pending, revenue });
  }, []);
  useEffect(()=>{
  const users = JSON.parse(localStorage.getItem('current_user'));
  const isAdmin = users && users.role === '9971230022';
  setIsAdminLogin(isAdmin);
  if(!isAdmin){
    navigate('/login');
  }
  },[])
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status !== 'delivered' && order.status !== 'cancelled';
    if (activeTab === 'delivered') return order.status === 'delivered';
    if (activeTab === 'pending') return order.status === 'confirmed' || order.status === 'pickup_scheduled';
    return true;
  });

  const availableExecutives = executives.filter(exec => exec.status === 'available');

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Welcome back, User!</h1>
          <p>Manage and track all your shipments here</p>
        </div>
        <div className="header-actions">
          <button className="btn-new-shipment" onClick={() => window.location.href = '/shipping'}>
            🚚 New Shipment
          </button>
          <div className="user-profile">
            <img 
              src="https://randomuser.me/api/portraits/men/1.jpg" 
              alt="User" 
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-phone">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Orders</p>
            <span className="stat-change">+12% this month</span>
          </div>
        </div>
        
        <div className="stat-card stat-transit">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>{stats.inTransit}</h3>
            <p>In Transit</p>
            <span className="stat-change">Active shipments</span>
          </div>
        </div>
        
        <div className="stat-card stat-delivered">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.delivered}</h3>
            <p>Delivered</p>
            <span className="stat-change">100% success rate</span>
          </div>
        </div>
        
        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.revenue.toLocaleString('en-IN')}</h3>
            <p>Total Revenue</p>
            <span className="stat-change">All orders</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column - Recent Orders */}
        <div className="orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({stats.total})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveTab('active')}
              >
                Active ({stats.inTransit + stats.pending})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'delivered' ? 'active' : ''}`}
                onClick={() => setActiveTab('delivered')}
              >
                Delivered ({stats.delivered})
              </button>
            </div>
          </div>
          
          <div className="orders-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders found</h3>
                <p>You don't have any {activeTab !== 'all' ? activeTab : ''} orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Live Tracking & Executives */}
        <div className="side-section">
          {/* Live Tracking */}
          <div className="live-tracking-card">
            <div className="section-header">
              <h3>Live Tracking</h3>
              <span className="live-badge">● LIVE</span>
            </div>
            <div className="tracking-info">
              {orders.find(o => o.status === 'in_transit') ? (
                <>
                  <div className="active-tracking">
                    <div className="tracking-order">
                      <span className="tracking-id">
                        {orders.find(o => o.status === 'in_transit').trackingId}
                      </span>
                      <span className="tracking-status" style={{ 
                        color: statusColors.in_transit,
                        backgroundColor: statusColors.in_transit + '20'
                      }}>
                        {getStatusText('in_transit')}
                      </span>
                    </div>
                    <div className="tracking-route">
                      <span className="from">{orders.find(o => o.status === 'in_transit').from.city}</span>
                      <span className="arrow">→</span>
                      <span className="to">{orders.find(o => o.status === 'in_transit').to.city}</span>
                    </div>
                    <div className="tracking-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${getOrderProgress(orders.find(o => o.status === 'in_transit').timeline)}%`,
                            backgroundColor: statusColors.in_transit
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {getOrderProgress(orders.find(o => o.status === 'in_transit').timeline)}% Complete
                      </span>
                    </div>
                    <button 
                      className="btn-track-view"
                      onClick={() => window.location.href = `/tracking?id=${orders.find(o => o.status === 'in_transit').trackingId}`}
                    >
                      View Live Tracking →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="no-tracking">
                    <div className="no-tracking-icon">📍</div>
                    <h4>No Active Tracking</h4>
                    <p>Start tracking your shipment</p>
                    <button 
                      className="btn-track"
                      onClick={() => window.location.href = '/tracking'}
                    >
                      Track Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Available Executives */}
          <div className="executives-card">
            <div className="section-header">
              <h3>Available Executives</h3>
              <span className="count-badge">{availableExecutives.length} available</span>
            </div>
            <div className="executives-list">
              {availableExecutives.length > 0 ? (
                availableExecutives.slice(0, 4).map(exec => (
                  <div key={exec.id} className="executive-item">
                    <img src={exec.photo} alt={exec.name} className="executive-avatar" />
                    <div className="executive-info">
                      <h4>{exec.name}</h4>
                      <p className="executive-vehicle">{exec.vehicle}</p>
                      <div className="executive-rating">
                        <span className="stars">⭐⭐⭐⭐⭐</span>
                        <span className="rating">{exec.rating}/5</span>
                      </div>
                    </div>
                    <div className="executive-actions">
                      <button className="btn-call" title="Call">
                        📞
                      </button>
                      <button className="btn-message" title="Message">
                        💬
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-executives">
                  <p>No executives available at the moment</p>
                </div>
              )}
            </div>
            {availableExecutives.length > 0 && (
              <button className="btn-view-all-exec">
                View All Executives →
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="action-icon">📄</span>
                <span className="action-text">View Invoices</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">🔄</span>
                <span className="action-text">Track Order</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📞</span>
                <span className="action-text">Contact Support</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span className="action-text">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;