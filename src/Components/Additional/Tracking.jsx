import React, { useState, useEffect } from 'react';
import '../Additional/styles/Tracking.css';

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fakeLocation, setFakeLocation] = useState('');
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [eta, setEta] = useState('');
  const [speed, setSpeed] = useState(40); // km/h
  const [driverInfo, setDriverInfo] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);

  // Mock tracking data based on distance
  const mockTrackingData = {
    'TRK123456': { totalDistance: 250, startCity: 'Mumbai', endCity: 'Pune', vehicle: 'Mini Truck' },
    'TRK789012': { totalDistance: 500, startCity: 'Delhi', endCity: 'Jaipur', vehicle: 'Truck' },
    'TRK345678': { totalDistance: 150, startCity: 'Bangalore', endCity: 'Chennai', vehicle: 'Pickup Van' },
    'TRK901234': { totalDistance: 800, startCity: 'Kolkata', endCity: 'Patna', vehicle: 'Heavy Truck' },
  };

  // Major cities on routes with distances
  const routeMilestones = [
    { city: 'Mumbai', distance: 0 },
    { city: 'Panvel', distance: 35 },
    { city: 'Lonavala', distance: 90 },
    { city: 'Pune', distance: 150 },
    { city: 'Satara', distance: 220 },
    { city: 'Kolhapur', distance: 300 },
  ];

  // Fake driver details
  const drivers = [
    { name: 'Rajesh Kumar', phone: '+91 98765 43210', rating: '4.8', experience: '5 years' },
    { name: 'Amit Sharma', phone: '+91 87654 32109', rating: '4.9', experience: '7 years' },
    { name: 'Suresh Patel', phone: '+91 76543 21098', rating: '4.7', experience: '4 years' },
    { name: 'Vijay Singh', phone: '+91 65432 10987', rating: '4.6', experience: '6 years' },
  ];

  useEffect(() => {
    let interval;
    if (isTracking && trackingId && mockTrackingData[trackingId]) {
      const totalDistance = mockTrackingData[trackingId].totalDistance;
      
      interval = setInterval(() => {
        setCurrentTime(new Date());
        
        // Calculate distance covered based on time (fake progress)
        const hoursPassed = (new Date() - startTime) / (1000 * 60 * 60);
        const newDistance = Math.min(Math.floor(hoursPassed * speed), totalDistance);
        setDistanceCovered(newDistance);
        
        // Update fake location based on distance
        updateFakeLocation(newDistance, totalDistance);
        
        // Calculate ETA
        const remainingDistance = totalDistance - newDistance;
        const remainingHours = remainingDistance / speed;
        const etaTime = new Date();
        etaTime.setHours(etaTime.getHours() + remainingHours);
        setEta(etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        
        // Update speed randomly (more realistic)
        setSpeed(prev => {
          const change = Math.random() * 10 - 5; // -5 to +5 km/h change
          return Math.max(30, Math.min(80, prev + change));
        });
        
      }, 5000); // Update every 5 seconds
    }
    
    return () => clearInterval(interval);
  }, [isTracking, trackingId]);

  const [startTime, setStartTime] = useState(null);

  const updateFakeLocation = (currentDist, totalDist) => {
    // Find current milestone
    let currentCity = 'Starting Point';
    let nextCity = 'Destination';
    let progress = 0;
    
    for (let i = 0; i < routeMilestones.length - 1; i++) {
      if (currentDist >= routeMilestones[i].distance && currentDist < routeMilestones[i + 1].distance) {
        currentCity = routeMilestones[i].city;
        nextCity = routeMilestones[i + 1].city;
        const segmentDist = routeMilestones[i + 1].distance - routeMilestones[i].distance;
        const distInSegment = currentDist - routeMilestones[i].distance;
        progress = Math.floor((distInSegment / segmentDist) * 100);
        break;
      }
    }
    
    if (currentDist >= routeMilestones[routeMilestones.length - 1].distance) {
      currentCity = 'Arrived at Destination';
      nextCity = '';
      progress = 100;
    }
    
    setFakeLocation(`${currentCity} → ${nextCity} (${progress}% completed)`);
  };

  const handleStartTracking = () => {
    if (!trackingId) {
      alert('Please enter a tracking ID');
      return;
    }
    
    if (!mockTrackingData[trackingId]) {
      alert('Invalid tracking ID. Try: TRK123456, TRK789012, TRK345678, TRK901234');
      return;
    }
    
    setIsTracking(true);
    setStartTime(new Date());
    setDistanceCovered(0);
    setSpeed(40);
    
    // Select random driver
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    setDriverInfo(randomDriver);
    
    // Set vehicle info
    const trackingData = mockTrackingData[trackingId];
    setVehicleInfo({
      type: trackingData.vehicle,
      number: `MH${Math.floor(10 + Math.random() * 90)}-AB-${Math.floor(1000 + Math.random() * 9000)}`,
      capacity: trackingData.vehicle.includes('Truck') ? '500 kg' : '200 kg'
    });
    
    // Initial location
    setFakeLocation(`${trackingData.startCity} → ${trackingData.endCity} (0% completed)`);
    
    // Initial ETA
    const etaTime = new Date();
    etaTime.setHours(etaTime.getHours() + (trackingData.totalDistance / 40));
    setEta(etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  const getProgressPercentage = () => {
    if (!trackingId || !mockTrackingData[trackingId]) return 0;
    const totalDistance = mockTrackingData[trackingId].totalDistance;
    return Math.floor((distanceCovered / totalDistance) * 100);
  };

  const getEstimatedDeliveryTime = () => {
    if (!trackingId || !mockTrackingData[trackingId]) return '';
    const totalDistance = mockTrackingData[trackingId].totalDistance;
    const remainingDistance = totalDistance - distanceCovered;
    const remainingHours = remainingDistance / speed;
    
    const deliveryTime = new Date();
    deliveryTime.setHours(deliveryTime.getHours() + remainingHours);
    
    return deliveryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentStatus = () => {
    const progress = getProgressPercentage();
    if (progress === 0) return 'Order Confirmed';
    if (progress < 30) return 'Picked Up';
    if (progress < 70) return 'In Transit';
    if (progress < 100) return 'Out for Delivery';
    return 'Delivered';
  };

  return (
    <div className="tk-container">
      <div className="tk-header">
        <h1 className="tk-title">🚚 Real-Time Shipment Tracking</h1>
        <p className="tk-subtitle">Track your package live with real-time updates</p>
      </div>

      {/* Tracking Input */}
      <div className="tk-input-section">
        <div className="tk-input-group">
          <input
            type="text"
            className="tk-input"
            placeholder="Enter Tracking ID (e.g., TRK123456)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            disabled={isTracking}
          />
          <button 
            className={`tk-track-btn ${isTracking ? 'tk-stop-btn' : ''}`}
            onClick={isTracking ? handleStopTracking : handleStartTracking}
          >
            {isTracking ? '🛑 Stop Tracking' : '📍 Start Tracking'}
          </button>
        </div>
        
        <div className="tk-sample-ids">
          <p>Try these sample IDs:</p>
          <div className="tk-id-tags">
            {Object.keys(mockTrackingData).map(id => (
              <span 
                key={id} 
                className="tk-id-tag"
                onClick={() => !isTracking && setTrackingId(id)}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Tracking Dashboard */}
      {isTracking && trackingId && mockTrackingData[trackingId] && (
        <div className="tk-dashboard">
          {/* Current Status Card */}
          <div className="tk-status-card">
            <div className="tk-status-header">
              <h3>📦 Current Status: <span className="tk-status-text">{getCurrentStatus()}</span></h3>
              <div className="tk-live-badge">LIVE</div>
            </div>
            
            <div className="tk-status-details">
              <div className="tk-status-item">
                <span className="tk-status-label">Tracking ID:</span>
                <span className="tk-status-value">{trackingId}</span>
              </div>
              <div className="tk-status-item">
                <span className="tk-status-label">Current Time:</span>
                <span className="tk-status-value">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
              <div className="tk-status-item">
                <span className="tk-status-label">Last Updated:</span>
                <span className="tk-status-value">Just now</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="tk-progress-section">
            <div className="tk-progress-header">
              <h4>Route Progress</h4>
              <span className="tk-progress-percent">{getProgressPercentage()}%</span>
            </div>
            
            <div className="tk-progress-bar">
              <div 
                className="tk-progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <div className="tk-progress-labels">
              <span>{mockTrackingData[trackingId].startCity}</span>
              <span>{mockTrackingData[trackingId].endCity}</span>
            </div>
            
            <div className="tk-progress-details">
              <div className="tk-progress-item">
                <span>Distance Covered:</span>
                <span className="tk-highlight">{distanceCovered} km / {mockTrackingData[trackingId].totalDistance} km</span>
              </div>
              <div className="tk-progress-item">
                <span>Current Speed:</span>
                <span className="tk-highlight">{speed.toFixed(1)} km/h</span>
              </div>
              <div className="tk-progress-item">
                <span>Current Location:</span>
                <span className="tk-highlight">{fakeLocation}</span>
              </div>
            </div>
          </div>

          {/* Driver & Vehicle Info */}
          <div className="tk-info-grid">
            <div className="tk-info-card">
              <h4>👨‍✈️ Driver Information</h4>
              {driverInfo && (
                <>
                  <div className="tk-driver-details">
                    <div className="tk-driver-name">{driverInfo.name}</div>
                    <div className="tk-driver-rating">⭐ {driverInfo.rating}/5</div>
                    <div className="tk-driver-exp">Experience: {driverInfo.experience}</div>
                    <div className="tk-driver-contact">📞 {driverInfo.phone}</div>
                  </div>
                  <button className="tk-call-btn">📞 Call Driver</button>
                </>
              )}
            </div>
            
            <div className="tk-info-card">
              <h4>🚚 Vehicle Information</h4>
              {vehicleInfo && (
                <>
                  <div className="tk-vehicle-details">
                    <div className="tk-vehicle-type">{vehicleInfo.type}</div>
                    <div className="tk-vehicle-number">{vehicleInfo.number}</div>
                    <div className="tk-vehicle-capacity">Capacity: {vehicleInfo.capacity}</div>
                    <div className="tk-vehicle-status">Status: <span className="tk-status-moving">Moving</span></div>
                  </div>
                  <div className="tk-speed-indicator">
                    <div className="tk-speed-gauge">
                      <div className="tk-speed-needle" style={{ transform: `rotate(${(speed / 100) * 180}deg)` }}></div>
                    </div>
                    <div className="tk-speed-value">{speed.toFixed(0)} km/h</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ETA & Next Steps */}
          <div className="tk-eta-section">
            <div className="tk-eta-card">
              <h4>⏰ Estimated Delivery</h4>
              <div className="tk-eta-time">{getEstimatedDeliveryTime()}</div>
              <p>Today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              
              <div className="tk-eta-details">
                <div className="tk-eta-item">
                  <span>Remaining Distance:</span>
                  <span>{mockTrackingData[trackingId].totalDistance - distanceCovered} km</span>
                </div>
                <div className="tk-eta-item">
                  <span>Time Remaining:</span>
                  <span>{Math.ceil((mockTrackingData[trackingId].totalDistance - distanceCovered) / speed)} hours</span>
                </div>
                <div className="tk-eta-item">
                  <span>Next Stop:</span>
                  <span>{fakeLocation.split('→')[1]?.split('(')[0]?.trim() || 'Destination'}</span>
                </div>
              </div>
            </div>
            
            <div className="tk-updates-card">
              <h4>📝 Live Updates</h4>
              <div className="tk-updates-list">
                <div className="tk-update-item tk-update-active">
                  <div className="tk-update-time">Now</div>
                  <div className="tk-update-text">Vehicle is moving at {speed.toFixed(1)} km/h</div>
                </div>
                <div className="tk-update-item">
                  <div className="tk-update-time">5 min ago</div>
                  <div className="tk-update-text">Passed through toll plaza</div>
                </div>
                <div className="tk-update-item">
                  <div className="tk-update-time">15 min ago</div>
                  <div className="tk-update-text">Driver took a short break</div>
                </div>
                <div className="tk-update-item">
                  <div className="tk-update-time">30 min ago</div>
                  <div className="tk-update-text">Entered highway, increased speed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Simulation */}
          <div className="tk-map-section">
            <h4>🗺️ Route Map</h4>
            <div className="tk-map-container">
              <div className="tk-map-route">
                <div className="tk-map-start">📍 {mockTrackingData[trackingId].startCity}</div>
                <div className="tk-map-line">
                  <div 
                    className="tk-map-progress" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  >
                    <div className="tk-map-truck">🚚</div>
                  </div>
                </div>
                <div className="tk-map-end">🏁 {mockTrackingData[trackingId].endCity}</div>
              </div>
              
              <div className="tk-map-milestones">
                {routeMilestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={`tk-milestone ${distanceCovered >= milestone.distance ? 'tk-milestone-passed' : ''}`}
                    style={{ left: `${(milestone.distance / mockTrackingData[trackingId].totalDistance) * 100}%` }}
                  >
                    <div className="tk-milestone-dot"></div>
                    <div className="tk-milestone-label">{milestone.city}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isTracking && (
        <div className="tk-instructions">
          <h3>How Tracking Works:</h3>
          <div className="tk-instructions-grid">
            <div className="tk-instruction">
              <div className="tk-instruction-icon">1</div>
              <h4>Enter Tracking ID</h4>
              <p>Use the tracking ID from your receipt or email</p>
            </div>
            <div className="tk-instruction">
              <div className="tk-instruction-icon">2</div>
              <h4>Start Tracking</h4>
              <p>Click "Start Tracking" to begin live monitoring</p>
            </div>
            <div className="tk-instruction">
              <div className="tk-instruction-icon">3</div>
              <h4>Real-time Updates</h4>
              <p>Watch your package move in real-time on the map</p>
            </div>
            <div className="tk-instruction">
              <div className="tk-instruction-icon">4</div>
              <h4>Get Notified</h4>
              <p>Receive updates on driver location and ETA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;