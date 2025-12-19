import React, { useState, useEffect } from 'react';
import '../Components/styles/Login.css';

const LoginPage = () => {
  // State variables
  const [step, setStep] = useState(1); // 1: Phone, 2: Email, 3: OTP
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };
  
  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value.trim();
    setEmail(value);
    setError('');
  };
  
  // Handle OTP change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 6) {
      setOtp(value);
      setError('');
      
      // Auto-submit when 6 digits entered
      if (value.length === 6) {
        handleOtpSubmit(value);
      }
    }
  };
  
  // Generate random 6-digit OTP
  const generateRandomOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Save user data to localStorage
  const saveUserToStorage = (phoneNumber, userEmail) => {
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
          email: userEmail,
          lastLogin: new Date().toISOString(),
          loginCount: (existingUsers[userIndex].loginCount || 0) + 1,
          rememberMe: rememberMe
        };
      } else {
        // Add new user
        const newUser = {
          id: Date.now().toString(),
          phone: phoneNumber,
          email: userEmail,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          loginCount: 1,
          rememberMe: rememberMe,
          profile: {
            name: '',
            address: ''
          },
          orders: [],
          shipments: []
        };
        
        existingUsers.push(newUser);
      }
      
      // Save to localStorage
      localStorage.setItem('quickship_users', JSON.stringify(existingUsers));
      
      console.log('User saved to storage:', phoneNumber);
      
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };
  
  // API Call: Send OTP to email
  const sendOtpToEmail = async (emailAddress, otpCode) => {
    try {
      // API endpoint for sending OTP
      const response = await fetch('https://chagans.com/website/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          otp: otpCode
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };
  
  // API Call: Verify OTP
  const verifyEmailOtp = async (emailAddress, otpCode) => {
    try {
      // API endpoint for verifying OTP
      const response = await fetch('https://chagans.com/website/verifyEmailOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          otp: otpCode
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };
  
  // Step 1: Handle phone submission
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
      setStep(2); // Move to email step
      setLoading(false);
      
      // Auto-focus email input
      setTimeout(() => {
        const emailInput = document.getElementById('emailInput');
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
      
    }, 500);
  };
  
  // Step 2: Handle email submission and send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate OTP
      const newOtp = generateRandomOtp();
      setGeneratedOtp(newOtp);
      
      // Step 1: Save user data to localStorage
      saveUserToStorage(phone, email);
      
      // Step 2: Send OTP via API
      const apiResponse = await sendOtpToEmail(email, newOtp);
      
      // Check API response (adjust based on your API's response structure)
      if (apiResponse.success || apiResponse.status === 'success') { 
        setStep(3); // Move to OTP verification step
        setEmailSent(true);
        setLoading(false);
        
        // Start timer for OTP expiration (10 minutes)
        setTimer(300); // 10 minutes in seconds
        
        // Auto-focus OTP input
        setTimeout(() => {
          const otpInput = document.getElementById('otpInput');
          if (otpInput) {
            otpInput.focus();
          }
        }, 100);
      } else {
        throw new Error(apiResponse.message || 'Failed to send OTP');
      }
      
    } catch (error) {
      console.error('OTP sending failed:', error);
      setError(error.message || 'Failed to send OTP. Please try again.');
      setLoading(false);
    }
  };
  
  // Step 3: Handle OTP verification
  const handleOtpSubmit = async (submittedOtp = null) => {
    setError('');
    
    const otpToVerify = submittedOtp || otp;
    
    // Validation
    if (!otpToVerify || otpToVerify.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    if (timer === 0) {
      setError('OTP has expired. Please generate a new one.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verify OTP via API
      const verificationResult = await verifyEmailOtp(email, otpToVerify);
      
      // Check API response (adjust based on your API's response structure)
      if (verificationResult.success || verificationResult.verified) {
        // OTP verification successful
        
        // Save session
        const sessionUser = {
          phone: phone,
          email: email,
          loggedInAt: new Date().toISOString(),
          token: `qs-token-${Date.now()}`,
          rememberMe: rememberMe
        };
        
        localStorage.setItem('current_user', JSON.stringify(sessionUser));
        sessionStorage.setItem('user_session', JSON.stringify(sessionUser));
        
        // Redirect to homepage
        window.location.href = '/';
        
      } else {
        throw new Error(verificationResult.message || 'Invalid OTP');
      }
      
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(error.message || 'Invalid OTP. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setEmail('');
    } else if (step === 3) {
      setStep(2);
      setOtp('');
      setTimer(0);
    }
    setError('');
  };
  
  // Handle OTP resend
  const handleResendOtp = async () => {
    if (timer > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Generate new OTP
      const newOtp = generateRandomOtp();
      setGeneratedOtp(newOtp);
      
      // Send new OTP via API
      const apiResponse = await sendOtpToEmail(email, newOtp);
      
      if (apiResponse.success || apiResponse.status === 'success') {
        setLoading(false);
        setTimer(600); // Reset to 10 minutes
        setOtp('');
        
        // Auto-focus OTP input
        const otpInput = document.getElementById('otpInput');
        if (otpInput) {
          otpInput.focus();
        }
      } else {
        throw new Error(apiResponse.message || 'Failed to resend OTP');
      }
      
    } catch (error) {
      console.error('Resend OTP failed:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
      setLoading(false);
    }
  };
  
  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect for OTP expiration
  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 3 && timer === 0) {
      // OTP expired
      setError('OTP has expired. Please generate a new one.');
    }
    return () => clearInterval(interval);
  }, [step, timer]);
  
  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.rememberMe) {
        window.location.href = '/';
      }
    }
  }, []);
  
  // Auto-focus input when step changes
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        const emailInput = document.getElementById('emailInput');
        if (emailInput) {
          emailInput.focus();
        }
      }, 100);
    } else if (step === 3) {
      setTimeout(() => {
        const otpInput = document.getElementById('otpInput');
        if (otpInput) {
          otpInput.focus();
        }
      }, 100);
    }
  }, [step]);

  return (
    <div className="qs-login-container">
      {/* Left Section - Branding */}
      <div className="qs-login-left">
        <div className="qs-brand-section">
          <div className="qs-brand-logo">
            <span className="qs-logo-icon">🚚</span>
            <div className="qs-logo-text">
              <h1>QuickShip</h1>
              <p>Express Delivery</p>
            </div>
          </div>
          
          <div className="qs-brand-tagline">
            <h2>Fast & Reliable Shipping Solutions</h2>
            <p>Book shipments in minutes, track in real-time</p>
          </div>
          
          <div className="qs-features-list">
            <div className="qs-feature-item">
              <span className="qs-feature-icon">📦</span>
              <div className="qs-feature-text">
                <h4>Instant Booking</h4>
                <p>Book your shipment in just a few clicks</p>
              </div>
            </div>
            
            <div className="qs-feature-item">
              <span className="qs-feature-icon">📍</span>
              <div className="qs-feature-text">
                <h4>Real-time Tracking</h4>
                <p>Track your shipment live on map</p>
              </div>
            </div>
            
            <div className="qs-feature-item">
              <span className="qs-feature-icon">📧</span>
              <div className="qs-feature-text">
                <h4>Email Verification</h4>
                <p>Secure login with email OTP verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="qs-login-right">
        <div className="qs-login-form-container">
          {/* Step 1: Phone Number */}
          {step === 1 && (
            <div className="qs-login-step">
              <div className="qs-step-header">
                <div className="qs-step-number">1</div>
                <div>
                  <h2>Welcome Back</h2>
                  <p>Enter your phone number to continue</p>
                </div>
              </div>
              
              <form onSubmit={handlePhoneSubmit} className="qs-phone-form">
                <div className="qs-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="qs-phone-input-group">
                    <div className="qs-country-code">+91</div>
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
                  <div className="qs-input-hint">We'll ask for your email in the next step</div>
                </div>
                
                <div className="qs-form-options">
                  <label className="qs-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>
                
                {error && <div className="qs-error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="qs-submit-btn"
                  disabled={loading || phone.length !== 10}
                >
                  {loading ? (
                    <>
                      <span className="qs-spinner"></span>
                      Processing...
                    </>
                  ) : (
                    'Continue with Phone'
                  )}
                </button>
                
                <div className="qs-terms-note">
                  By continuing, you agree to our 
                  <a href="/terms"> Terms & Conditions</a> and 
                  <a href="/privacy"> Privacy Policy</a>
                </div>
              </form>
              
              <div className="qs-support-info">
                <p>Need help? <a href="tel:18001234567">Call 1800-123-4567</a></p>
              </div>
            </div>
          )}

          {/* Step 2: Email Address */}
          {step === 2 && (
            <div className="qs-login-step">
              <div className="qs-step-header">
                <button 
                  type="button" 
                  className="qs-back-btn"
                  onClick={handleBack}
                  disabled={loading}
                >
                  ←
                </button>
                <div>
                  <h2>Enter Email</h2>
                  <p>Please enter your email address for verification</p>
                </div>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="qs-email-form">
                <div className="qs-form-group">
                  <label htmlFor="emailInput">Email Address</label>
                  <input
                    type="email"
                    id="emailInput"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    disabled={loading}
                    className="qs-email-input"
                  />
                  <div className="qs-input-hint">We'll send a 6-digit OTP to this email</div>
                </div>
                
                {error && <div className="qs-error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="qs-submit-btn"
                  disabled={loading || !email.includes('@')}
                >
                  {loading ? (
                    <>
                      <span className="qs-spinner"></span>
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
                
                <div className="qs-phone-note">
                  <p>Phone number: <strong>+91 {phone}</strong></p>
                  <button 
                    type="button" 
                    className="qs-text-btn"
                    onClick={handleBack}
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <div className="qs-login-step">
              <div className="qs-step-header">
                <button 
                  type="button" 
                  className="qs-back-btn"
                  onClick={handleBack}
                  disabled={loading}
                >
                  ←
                </button>
                <div>
                  <h2>Verify Email</h2>
                  <p>Enter the 6-digit OTP sent to {email}</p>
                </div>
              </div>
              
              <form className="qs-otp-form">
                <div className="qs-form-group">
                  <label htmlFor="otpInput">6-Digit OTP</label>
                  <input
                    type="password"
                    id="otpInput"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    disabled={loading}
                    className="qs-otp-input"
                  />
                  <div className="qs-otp-hint">
                    <span>OTP sent to: </span>
                    <span className="qs-sent-email">{email}</span>
                  </div>
                </div>
                
                <div className="qs-otp-timer">
                  {timer > 0 ? (
                    <p>
                      OTP expires in: 
                      <span className="qs-timer-count"> {formatTimer(timer)}</span>
                    </p>
                  ) : (
                    <p className="qs-timer-expired">OTP has expired</p>
                  )}
                  
                  <button 
                    type="button" 
                    className="qs-resend-btn"
                    onClick={handleResendOtp}
                    disabled={loading || timer > 0}
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
                
                {error && <div className="qs-error-message">{error}</div>}
                
                <button 
                  type="button" 
                  className="qs-submit-btn"
                  onClick={() => handleOtpSubmit()}
                  disabled={loading || otp.length !== 6 || timer === 0}
                >
                  {loading ? (
                    <>
                      <span className="qs-spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
                
                <div className="qs-otp-help">
                  <p>
                    Didn't receive OTP? 
                    <button 
                      type="button" 
                      className="qs-text-btn"
                      onClick={handleResendOtp}
                      disabled={timer > 0}
                    >
                      Resend OTP
                    </button>
                  </p>
                  <p>
                    Wrong email? 
                    <button 
                      type="button" 
                      className="qs-text-btn"
                      onClick={handleBack}
                    >
                      Change email
                    </button>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;