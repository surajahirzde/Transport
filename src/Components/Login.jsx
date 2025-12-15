import React, { useState, useEffect, useRef } from 'react';
import '../Components/styles/Login.css';

const LoginPage = () => {
  // State variables
  const [step, setStep] = useState(1); // 1: Phone, 2: PIN
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  
  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };
  
  // Handle PIN change
  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 4) {
      setPin(value);
      setError('');
      
      // Auto-submit when 4 digits entered
      if (value.length === 4) {
        handlePinSubmit(value);
      }
    }
  };
  
  // Generate random 4-digit PIN
  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };
  
  // Save user data to localStorage
  const saveUserToStorage = (phoneNumber, userPin) => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('quickship_users') || '[]');
      
      // Check if user already exists
      const userIndex = existingUsers.findIndex(user => user.phone === phoneNumber);
      
      if (userIndex !== -1) {
        // Update existing user
        existingUsers[userIndex] = {
          ...existingUsers[userIndex],
          phone: phoneNumber,
          pin: userPin,
          lastLogin: new Date().toISOString(),
          loginCount: (existingUsers[userIndex].loginCount || 0) + 1,
          rememberMe: rememberMe
        };
      } else {
        // Add new user
        const newUser = {
          id: Date.now().toString(),
          phone: phoneNumber,
          pin: userPin,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          rememberMe: rememberMe,
          profile: {
            name: '',
            email: '',
            address: ''
          },
          orders: [],
          shipments: []
        };
        
        existingUsers.push(newUser);
      }
      
      // Save to localStorage
      localStorage.setItem('quickship_users', JSON.stringify(existingUsers));
      
      // Also save current session
      const sessionUser = {
        phone: phoneNumber,
        loggedInAt: new Date().toISOString(),
        token: `qs-token-${Date.now()}`,
        rememberMe: rememberMe
      };
      
      localStorage.setItem('current_user', JSON.stringify(sessionUser));
      sessionStorage.setItem('user_session', JSON.stringify(sessionUser));
      
      console.log('User saved to storage:', phoneNumber);
      
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };
  
  // Handle phone submission
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate new PIN for each login
      const newPin = generateRandomPin();
      setGeneratedPin(newPin);
      
      // Save to storage immediately
      saveUserToStorage(phone, newPin);
      
      setStep(2);
      setLoading(false);
      
      // Start timer for PIN expiration (5 minutes)
      setTimer(300); // 5 minutes in seconds
      
      // Auto-focus PIN input
      setTimeout(() => {
        const pinInput = document.getElementById('pinInput');
        if (pinInput) {
          pinInput.focus();
        }
      }, 100);
      
    }, 1500);
  };
  
  // Handle PIN submission
  const handlePinSubmit = (submittedPin = null) => {
    setError('');
    
    const pinToVerify = submittedPin || pin;
    
    // Validation
    if (!pinToVerify || pinToVerify.length !== 4) {
      setError('Please enter the complete 4-digit PIN');
      return;
    }
    
    setLoading(true);
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('quickship_users') || '[]');
    const user = users.find(u => u.phone === phone);
    
    setTimeout(() => {
      if (user && user.pin === pinToVerify) {
        // Login successful
        const sessionUser = {
          phone: phone,
          loggedInAt: new Date().toISOString(),
          token: `qs-token-${Date.now()}`,
          rememberMe: rememberMe
        };
        
        localStorage.setItem('current_user', JSON.stringify(sessionUser));
        sessionStorage.setItem('user_session', JSON.stringify(sessionUser));
        
        // Redirect to dashboard
        window.location.href = user.phone === "9971230022" ? '/dashboard' : '/';
        
      } else {
        setError('Invalid PIN. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };
  
  // Handle back to phone step
  const handleBackToPhone = () => {
    setStep(1);
    setError('');
    setPin('');
    setTimer(0);
  };
  
  // Handle PIN resend
  const handleResendPin = () => {
    if (timer > 0) return;
    
    setLoading(true);
    setError('');
    
    // Generate new PIN
    const newPin = generateRandomPin();
    setGeneratedPin(newPin);
    
    // Update in storage
    const users = JSON.parse(localStorage.getItem('quickship_users') || '[]');
    const userIndex = users.findIndex(u => u.phone === phone);
    
    if (userIndex !== -1) {
      users[userIndex].pin = newPin;
      users[userIndex].lastPinUpdate = new Date().toISOString();
      localStorage.setItem('quickship_users', JSON.stringify(users));
    }
    
    setTimeout(() => {
      setLoading(false);
      setTimer(300); // Reset to 5 minutes
      setPin('');
      
      // Auto-focus PIN input
      const pinInput = document.getElementById('pinInput');
      if (pinInput) {
        pinInput.focus();
      }
    }, 1000);
  };
  
  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect for PIN expiration
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 2 && timer === 0) {
      // PIN expired
      setError('PIN has expired. Please generate a new one.');
    }
    return () => clearInterval(interval);
  }, [step, timer]);
  
  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.rememberMe) {
        window.location.href = '/dashboard';
      }
    }
  }, []);
  
  // Auto-focus PIN input when step changes
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        const pinInput = document.getElementById('pinInput');
        if (pinInput) {
          pinInput.focus();
        }
      }, 100);
    }
  }, [step]);

  return (
    <div className="login-container">
      {/* Left Section - Branding */}
      <div className="login-left">
        <div className="brand-section">
          <div className="brand-logo">
            <span className="logo-icon">🚚</span>
            <div className="logo-text">
              <h1>QuickShip</h1>
              <p>Express Delivery</p>
            </div>
          </div>
          
          <div className="brand-tagline">
            <h2>Fast & Reliable Shipping Solutions</h2>
            <p>Book shipments in minutes, track in real-time</p>
          </div>
          
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">📦</span>
              <div className="feature-text">
                <h4>Instant Booking</h4>
                <p>Book your shipment in just a few clicks</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">📍</span>
              <div className="feature-text">
                <h4>Real-time Tracking</h4>
                <p>Track your shipment live on map</p>
              </div>
            </div>
            
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <div className="feature-text">
                <h4>Secure & Insured</h4>
                <p>All shipments are insured up to ₹2,00,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Step 1: Phone Number */}
          {step === 1 && (
            <div className="login-step">
              <div className="step-header">
                <div className="step-number">1</div>
                <div>
                  <h2>Welcome Back</h2>
                  <p>Enter your phone number to continue</p>
                </div>
              </div>
              
              <form onSubmit={handlePhoneSubmit} className="phone-form">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-input-group">
                    <div className="country-code">+91</div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="Enter 10-digit number"
                      maxLength="10"
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <div className="input-hint">We'll generate a 4-digit PIN for you</div>
                </div>
                
                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || phone.length !== 10}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Generating PIN...
                    </>
                  ) : (
                    'Generate PIN'
                  )}
                </button>
                
                <div className="terms-note">
                  By continuing, you agree to our 
                  <a href="/terms"> Terms & Conditions</a> and 
                  <a href="/privacy"> Privacy Policy</a>
                </div>
              </form>
              
              <div className="support-info">
                <p>Need help? <a href="tel:18001234567">Call 1800-123-4567</a></p>
              </div>
            </div>
          )}

          {/* Step 2: PIN Verification */}
          {step === 2 && (
            <div className="login-step">
              <div className="step-header">
                <button 
                  type="button" 
                  className="back-btn"
                  onClick={handleBackToPhone}
                  disabled={loading}
                >
                  ←
                </button>
                <div>
                  <h2>Enter PIN</h2>
                  <p>Enter the 4-digit PIN for +91 {phone}</p>
                </div>
              </div>
              
              <form className="pin-form">
                <div className="form-group">
                  <label htmlFor="pinInput">4-Digit PIN</label>
                  <input
                    type="password"
                    id="pinInput"
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="Enter 4-digit PIN"
                    maxLength="4"
                    disabled={loading}
                    className="pin-input"
                  />
                  <div className="pin-hint">
                    <span>Generated PIN: </span>
                    <span className="generated-pin">{generatedPin || '----'}</span>
                    <span className="pin-note"> (Valid for 5 minutes)</span>
                  </div>
                </div>
                
                <div className="pin-timer">
                  {timer > 0 ? (
                    <p>
                      PIN expires in: 
                      <span className="timer-count"> {formatTimer(timer)}</span>
                    </p>
                  ) : (
                    <p className="timer-expired">PIN has expired</p>
                  )}
                  
                  <button 
                    type="button" 
                    className="resend-btn"
                    onClick={handleResendPin}
                    disabled={loading || timer > 0}
                  >
                    {loading ? 'Generating...' : 'Generate New PIN'}
                  </button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                  type="button" 
                  className="submit-btn"
                  onClick={() => handlePinSubmit()}
                  disabled={loading || pin.length !== 4 || timer === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
                
                <div className="pin-help">
                  <p>
                    Forgot PIN? 
                    <button 
                      type="button" 
                      className="text-btn"
                      onClick={handleResendPin}
                      disabled={timer > 0}
                    >
                      Generate new PIN
                    </button>
                  </p>
                </div>
              </form>
              
              <div className="security-note">
                <div className="security-icon">🔒</div>
                <div className="security-text">
                  <strong>PIN Security</strong>
                  <p>Each PIN is unique and valid for 5 minutes only</p>
                  <p>Never share your PIN with anyone</p>
                </div>
              </div>
              
              {/* Demo PIN Display */}
              <div className="demo-pin-box">
                <div className="demo-header">
                  <span className="demo-icon">🔑</span>
                  <span>Your Current PIN</span>
                </div>
                <div className="demo-content">
                  <div className="pin-display">{generatedPin || '----'}</div>
                  <p className="pin-instruction">Enter this 4-digit PIN above</p>
                </div>
              </div>
            </div>
          )}
          
          {/* User Statistics */}
          <div className="user-stats">
            <div className="stats-header">
              <span className="stats-icon">📊</span>
              <span>QuickShip Users</span>
            </div>
            <div className="stats-content">
              <p>Total Registered Users: 
                <strong> {JSON.parse(localStorage.getItem('quickship_users') || '[]').length}</strong>
              </p>
              <p>Your Login Count: 
                <strong> {
                  (() => {
                    const users = JSON.parse(localStorage.getItem('quickship_users') || '[]');
                    const user = users.find(u => u.phone === phone);
                    return user ? user.loginCount : '0';
                  })()
                }</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;