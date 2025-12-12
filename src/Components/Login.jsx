import React, { useState, useEffect, useRef } from 'react';
import '../Components/styles/Login.css';

const LoginPage = () => {
  // State variables
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Refs for OTP input boxes
  const otpRefs = useRef([]);
  
  // Generate fake OTP (always 123456 for demo)
  const generateFakeOTP = () => {
    return '123456';
  };
  
  // Handle phone number change
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 10) {
      setPhone(value);
      setError('');
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
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setOtpSent(true);
      setStep(2);
      setLoading(false);
      
      // Pre-fill OTP with 123456 for demo
      const fakeOtp = generateFakeOTP();
      const otpArray = fakeOtp.split('');
      setOtp(otpArray);
      
      // Auto-focus first OTP box
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
      
      // Start resend timer
      setTimer(30);
    }, 1500);
  };
  
  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    const numValue = value.replace(/\D/g, '');
    
    if (numValue === '' || (numValue.length === 1 && !isNaN(numValue))) {
      const newOtp = [...otp];
      newOtp[index] = numValue;
      setOtp(newOtp);
      setError('');
      
      // Auto-focus next input
      if (numValue !== '' && index < 5 && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    }
  };
  
  // Handle OTP key events
  const handleOtpKeyDown = (index, e) => {
    // Backspace handling
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move to previous input
        otpRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else if (otp[index] !== '') {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
    
    // Arrow keys navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1].focus();
    }
    
    // Paste handling
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      setTimeout(() => {
        const pastedData = e.target.value;
        if (pastedData.length === 6 && !isNaN(pastedData)) {
          const otpArray = pastedData.split('');
          setOtp(otpArray);
          
          // Focus last box
          if (otpRefs.current[5]) {
            otpRefs.current[5].focus();
          }
        }
      }, 10);
    }
  };
  
  // Handle OTP submission
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const enteredOtp = otp.join('');
    
    // Validation
    if (enteredOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      // For demo, any 6-digit OTP is accepted
      // But we'll show success message for 123456
      if (enteredOtp === '123456') {
        // Save user to localStorage
        const userData = {
          phone: phone,
          token: `fake-jwt-${Date.now()}`,
          loggedInAt: new Date().toISOString(),
          rememberMe: rememberMe
        };
        
        localStorage.setItem('quickship_user', JSON.stringify(userData));
        
        // Redirect to dashboard or homepage
        window.location.href = '/dashboard';
      } else {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };
  
  // Handle OTP resend
  const handleResendOTP = () => {
    if (timer > 0) return;
    
    setLoading(true);
    setError('');
    
    // Simulate resend OTP
    setTimeout(() => {
      const fakeOtp = generateFakeOTP();
      const otpArray = fakeOtp.split('');
      setOtp(otpArray);
      setLoading(false);
      setTimer(30);
      
      // Focus first OTP box
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    }, 1000);
  };
  
  // Handle back to phone step
  const handleBackToPhone = () => {
    setStep(1);
    setError('');
    setOtp(['', '', '', '', '', '']);
  };
  
  // Timer effect for OTP resend
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);
  
  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('quickship_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.rememberMe) {
        window.location.href = '/dashboard';
      }
    }
  }, []);
  
  // Auto-focus first OTP box when step changes
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
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
                  <div className="input-hint">We'll send an OTP to this number</div>
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
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
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

          {/* Step 2: OTP Verification */}
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
                  <h2>Verify OTP</h2>
                  <p>Enter the 6-digit code sent to +91 {phone}</p>
                </div>
              </div>
              
              <form onSubmit={handleOtpSubmit} className="otp-form">
                <div className="form-group">
                  <label>Enter OTP</label>
                  <div className="otp-input-group">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="tel"
                        maxLength="1"
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        disabled={loading}
                        className="otp-input"
                      />
                    ))}
                  </div>
                  <div className="otp-hint">
                    <span>Demo OTP: </span>
                    <span className="demo-otp">123456</span>
                  </div>
                </div>
                
                <div className="otp-timer">
                  {timer > 0 ? (
                    <p>Resend OTP in <span className="timer-count">{timer}s</span></p>
                  ) : (
                    <button 
                      type="button" 
                      className="resend-btn"
                      onClick={handleResendOTP}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading || otp.join('').length !== 6}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>
                
                <div className="otp-help">
                  <p>Didn't receive OTP? Check your SMS or 
                    <button 
                      type="button" 
                      className="text-btn"
                      onClick={handleBackToPhone}
                    >
                      change phone number
                    </button>
                  </p>
                </div>
              </form>
              
              <div className="security-note">
                <div className="security-icon">🔒</div>
                <div className="security-text">
                  <strong>Your security is important to us</strong>
                  <p>We never share your phone number with third parties</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Demo Credentials */}
          <div className="demo-credentials">
            <div className="demo-header">
              <span className="demo-icon">ℹ️</span>
              <span>Demo Information</span>
            </div>
            <div className="demo-content">
              <p>Use any 10-digit phone number</p>
              <p>OTP for demo: <strong>123456</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;