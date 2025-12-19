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
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Get logged-in user's phone from localStorage
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('current_user') || 'null');
    const userPhoneFromStorage = loggedInUser?.phone || '';
    setUserPhone(userPhoneFromStorage);

    if (!userPhoneFromStorage) {
      const urlParams = new URLSearchParams(window.location.search);
      const phoneFromUrl = urlParams.get('phone');
      if (phoneFromUrl) {
        setUserPhone(phoneFromUrl);
      }
    }
  }, []);

  // Fetch orders based on date filter
  const fetchOrders = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await fetch('https://chagans.com/user/qrPayments', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzBmM2U1ZWEwNzViNWNjZTA3OTg4YWEiLCJwaG9uZU51bWJlciI6Nzk4MzkyMDk2MiwiZW1haWwiOiJ2aXJhdHNpbmdoa2FoYXJ3YXI4OTIzQGdtYWlsLmNvbSIsInJvbGUiOiJjaGFnYW5zRW1wbG95ZWUyIiwibG9naW5JZCI6IjExYjVhOWYwLTgzZmMtNGYzZi1hZjU5LWM5N2MzOGUwMDkyNyIsImlhdCI6MTc2NTgwMDUxMSwiZXhwIjoxNzczNTc2NTExfQ.Aa_3nMNl6xsEKnB94Pc1dBsSbwE8YDuUkW2JvpcQQMg`
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate
        })
      });
      const data = await response.json();
      const storedOrders = data.data || [];
      // saved data into local storage = shippingOrders
      const filteredData = storedOrders.filter(order => order.location.transportData).map(order => {
        return order.location.transportData;
      });
      localStorage.setItem('shippingOrders', JSON.stringify(filteredData));
      setOrders(storedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(dateFilter.startDate, dateFilter.endDate);
  }, [userPhone, dateFilter]);

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyDateFilter = () => {
    fetchOrders(dateFilter.startDate, dateFilter.endDate);
  };

  const resetDateFilter = () => {
    setDateFilter({
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10)
    });
  };

  // Print receipt function
  const handlePrintReceipt = (order) => {
    setSelectedOrder(order);
    setShowReceipt(true);

    // Delay print to ensure content is rendered
    setTimeout(() => {
      // window.print();
      // setShowReceipt(false);
    }, 100);
  };

  // Print order summary function
  const handlePrintOrderSummary = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Summary - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .summary-table th, .summary-table td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
          }
          .summary-table th { background-color: #f5f5f5; }
          .stats { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .stat-box { background: #f9f9f9; padding: 15px; border-radius: 5px; flex: 1; margin: 0 10px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Order Summary Report</h1>
          <p>Date Range: ${dateFilter.startDate} to ${dateFilter.endDate}</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="stats">
          <div class="stat-box">
            <h3>Total Orders</h3>
            <p>${filteredOrders.length}</p>
          </div>
          <div class="stat-box">
            <h3>Total Amount</h3>
            <p>₹${getStats().totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div class="stat-box">
            <h3>Pending Orders</h3>
            <p>${getStats().activeOrders}</p>
          </div>
        </div>
        
        <table class="summary-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            ${filteredOrders.map(order => `
              <tr>
                <td>${order._id?.substring(0, 10)}...</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.paymentPayload?.CUST_NAME || 'N/A'}</td>
                <td>${(order.amount || 0).toFixed(2)}</td>
                <td>${order.status || 'pending'}</td>
                <td>${order.location?.transportData?.fromCity || 'N/A'}</td>
                <td>${order.location?.transportData?.toCity || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.close()">Close</button>
          <button onclick="window.print()">Print</button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return order.status?.toLowerCase() !== 'delivered';
    if (filter === 'delivered') return order.status?.toLowerCase() === 'delivered';
    return true;
  });

  const handleStartNewShipment = () => {
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
      o.status?.toLowerCase() !== 'delivered'
    ).length;
    const deliveredOrders = orders.filter(o =>
      o.status?.toLowerCase() === 'delivered'
    ).length;
    const totalSpent = orders.reduce((sum, order) => {
      return sum + (order.amount || 0);
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

    const orderExists = orders.some(order => order.location?.transportData?.trackingId === trackingId);

    if (orderExists) {
      navigate(`/tracking?id=${trackingId}`);
    } else {
      alert('Invalid tracking ID or you do not have access to this order.');
    }
  };

  const gstAmount = (selectedOrder?.amount * 0.18);

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setUserPhone('');
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
        <div className="header-right">
          <button
            className="new-shipment-btn"
            onClick={handleStartNewShipment}
          >
            <span className="btn-icon">+</span>
            Start New Shipment
          </button>
          {orders.length > 0 && (
            <button
              className="print-summary-btn"
              onClick={handlePrintOrderSummary}
            >
              📄 Print Order Summary
            </button>
          )}
        </div>
      </div>

      {/* Date Filter */}
      <div className="date-filter-section">
        <h3>Filter by Date Range</h3>
        <div className="date-filter-controls">
          <div className="date-input-group">
            <label>From:</label>
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleDateFilterChange}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>To:</label>
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleDateFilterChange}
              className="date-input"
            />
          </div>
          <button
            className="apply-filter-btn"
            onClick={applyDateFilter}
          >
            Apply Filter
          </button>
          <button
            className="reset-filter-btn"
            onClick={resetDateFilter}
          >
            Reset
          </button>
        </div>
        <p className="filter-info">
          Showing orders from {dateFilter.startDate} to {dateFilter.endDate}
        </p>
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
                const orderData = JSON.stringify(orders, null, 2);
                navigator.clipboard.writeText(orderData);
                alert('Order data copied to clipboard!');
              }}
            >
              <span className="action-icon">📋</span>
              Copy Order Data
            </button>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={order._id || index} className="order-card-container">
              <OrderCard order={order.location.transportData} />
              <button
                className="print-receipt-btn"
                onClick={() => handlePrintReceipt(order)}
              >
                🖨️ Print Receipt
              </button>
            </div>
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
            placeholder="Enter Order ID"
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
            <p className="recent-label">Recent Order IDs:</p>
            <div className="tracking-chips">
              {orders.slice(0, 3).map(order => (
                <button
                  key={order._id}
                  className="tracking-chip"
                  onClick={() => handleTrackOrder(order.location.transportData.trackingId)}
                >
                  {order.location.transportData.trackingId?.substring(0, 12)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Receipt Print Modal */}
      {showReceipt && selectedOrder && (
        <div className="receipt-modal">
          <div className="receipt-content">
            <div className="receipt-header">
              <h2>Payment Receipt</h2>
              <p>Transport On Web</p>
            </div>

            <div className="receipt-details">
              <div className="receipt-row">
                <span>Receipt No:</span>
                <span>{selectedOrder._id}</span>
              </div>
              <div className="receipt-row">
                <span>Date:</span>
                <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="receipt-row">
                <span>Customer:</span>
                <span>{selectedOrder.paymentPayload?.CUST_NAME}</span>
              </div>
              <div className="receipt-row">
                <span>Phone:</span>
                <span>{selectedOrder.paymentPayload?.mobile}</span>
              </div>
              <div className="receipt-row">
                <span>Order ID:</span>
                <span>{selectedOrder.paymentPayload?.ORDER_ID}</span>
              </div>
              <div className="receipt-row">
                <span>Payment ID:</span>
                <span>{selectedOrder.paymentPayload?.PAY_ID}</span>
              </div>
              <div className="receipt-row">
                <span>Status:</span>
                <span className={`status-${selectedOrder.status}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div className="receipt-amount">
              <h3>Amount Details</h3>
              <div className="amount-row">
                <span>Total Amount (Excluding GST):</span>
                <span>₹{(selectedOrder.amount - gstAmount || 0).toFixed(2)}</span>
              </div>
              {selectedOrder.location?.transportData && (
                <>
                  <div>
                    <span>GST (18%):</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>

                  <div className="amount-row">
                    <span>Total Amount (Including GST):</span>
                    <span>₹{selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>


            <div className="receipt-location">
              <h3>Delivery Details</h3>
              <div className="location-row">
                <div className="location-from">
                  <strong>From:</strong>
                  <p>{selectedOrder.location?.transportData?.fromAddress}</p>
                </div>
                <div className="location-to">
                  <strong>To:</strong>
                  <p>{selectedOrder.location?.transportData?.toAddress}</p>
                </div>
              </div>
              <div className="delivery-info">
                <p><strong>Distance:</strong> {selectedOrder.location?.transportData?.distance} km</p>
                <p><strong>Estimated Time:</strong> {selectedOrder.location?.transportData?.travelTime}</p>
                <p><strong>Delivery Date:</strong> {selectedOrder.location?.transportData?.selectedDate}</p>
              </div>
            </div>

            <div className="receipt-footer">
              <p>Thank you for your business!</p>
              <p>This is a computer-generated receipt</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUser;