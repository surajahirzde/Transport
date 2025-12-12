import React, { useState, useEffect } from 'react';
import '../Additional/styles/DateTimePicker.css';

const DateTimePicker = ({ data = {}, updateData, nextStep, prevStep }) => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    selectedDate: data?.selectedDate || '',
    selectedTimeSlot: data?.selectedTimeSlot || '',
    deliveryUrgency: data?.deliveryUrgency || 'normal',
    deliveryInstructions: data?.deliveryInstructions || ''
  });

  // Generate next 7 days
  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('en-IN', { month: 'short' });
      const fullDate = date.toISOString().split('T')[0];
      
      days.push({
        id: i,
        dayName,
        dayNum,
        month,
        fullDate,
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    
    return days;
  };

  // Time slots
  const timeSlots = [
    { id: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 3:00 PM', icon: '☀️' },
    { id: 'evening', label: 'Evening', time: '3:00 PM - 6:00 PM', icon: '🌇' },
    { id: 'night', label: 'Night', time: '6:00 PM - 9:00 PM', icon: '🌙' }
  ];

  // Urgency options
  const urgencyOptions = [
    { 
      id: 'normal', 
      label: 'Normal Delivery', 
      time: '3-5 days', 
      price: 0, 
      displayPrice: '+₹0',
      icon: '📦',
      color: '#6B7280'
    },
    { 
      id: 'express', 
      label: 'Express Delivery', 
      time: '1-2 days', 
      price: 300, 
      displayPrice: '+₹300',
      icon: '🚚',
      color: '#3B82F6'
    },
    { 
      id: 'same-day', 
      label: 'Same Day Delivery', 
      time: 'Within 24 hours', 
      price: 800, 
      displayPrice: '+₹800',
      icon: '⚡',
      color: '#EF4444'
    }
  ];

  const days = getNextSevenDays();

  useEffect(() => {
    // Auto-select today's date if not selected
    if (!formData.selectedDate && days.length > 0) {
      const todayDate = days[0].fullDate;
      handleDateSelect(todayDate);
    }
  }, []);

  const handleDateSelect = (date) => {
    const newData = { ...formData, selectedDate: date };
    setFormData(newData);
    updateData?.('selectedDate', date);
  };

  const handleTimeSelect = (timeSlot) => {
    const newData = { ...formData, selectedTimeSlot: timeSlot };
    setFormData(newData);
    updateData?.('selectedTimeSlot', timeSlot);
  };

  const handleUrgencySelect = (urgencyId) => {
    const selectedOption = urgencyOptions.find(option => option.id === urgencyId);
    const newData = { ...formData, deliveryUrgency: urgencyId };
    setFormData(newData);
    
    if (updateData) {
      updateData('deliveryUrgency', urgencyId);
      updateData('fastDeliveryCharge', selectedOption?.price || 0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    updateData?.(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.selectedDate) {
      alert('Please select a delivery date');
      return;
    }
    
    if (!formData.selectedTimeSlot) {
      alert('Please select a preferred time slot');
      return;
    }
    
    nextStep?.();
  };

  return (
    <div className="datetime-container">
      <div className="datetime-header">
        <div className="step-indicator">
          <span className="step-badge">2</span>
          <div>
            <h1 className="datetime-title">Select Date & Time</h1>
            <p className="datetime-subtitle">Choose your preferred delivery schedule</p>
          </div>
        </div>
      </div>

      <div className="datetime-content">
        <form onSubmit={handleSubmit} className="datetime-form">
          
          {/* Date Selection */}
          <div className="datetime-section">
            <div className="section-header">
              <div className="section-icon">📅</div>
              <div>
                <h3 className="section-title">Delivery Date</h3>
                <p className="section-subtitle">Select when you want your package delivered</p>
              </div>
            </div>
            
            <div className="date-picker-container">
              <div className="date-grid">
                {days.map(day => (
                  <button
                    type="button"
                    key={day.id}
                    className={`date-card ${formData.selectedDate === day.fullDate ? 'selected' : ''} ${day.isToday ? 'today' : ''}`}
                    onClick={() => handleDateSelect(day.fullDate)}
                  >
                    <div className="date-dayname">{day.dayName}</div>
                    <div className="date-number">{day.dayNum}</div>
                    <div className="date-month">{day.month}</div>
                    {day.isToday && <div className="date-badge">Today</div>}
                    {day.isTomorrow && <div className="date-badge">Tomorrow</div>}
                  </button>
                ))}
              </div>
              
              <div className="selected-date-display">
                <div className="selected-label">Selected Date:</div>
                <div className="selected-value">
                  {formData.selectedDate ? 
                    new Date(formData.selectedDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 
                    'No date selected'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="datetime-section">
            <div className="section-header">
              <div className="section-icon">⏰</div>
              <div>
                <h3 className="section-title">Preferred Time</h3>
                <p className="section-subtitle">Choose a time slot for delivery</p>
              </div>
            </div>
            
            <div className="time-slots-container">
              {timeSlots.map(slot => (
                <button
                  type="button"
                  key={slot.id}
                  className={`time-slot-card ${formData.selectedTimeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => handleTimeSelect(slot.id)}
                >
                  <div className="time-slot-icon">{slot.icon}</div>
                  <div className="time-slot-content">
                    <div className="time-slot-label">{slot.label}</div>
                    <div className="time-slot-time">{slot.time}</div>
                  </div>
                  {formData.selectedTimeSlot === slot.id && (
                    <div className="time-slot-check">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#10B981"/>
                        <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Speed */}
          <div className="datetime-section">
            <div className="section-header">
              <div className="section-icon">🚀</div>
              <div>
                <h3 className="section-title">Delivery Speed</h3>
                <p className="section-subtitle">Choose how fast you need your delivery</p>
              </div>
            </div>
            
            <div className="urgency-container">
              {urgencyOptions.map(option => (
                <button
                  type="button"
                  key={option.id}
                  className={`urgency-card ${formData.deliveryUrgency === option.id ? 'selected' : ''}`}
                  onClick={() => handleUrgencySelect(option.id)}
                  style={{ borderColor: formData.deliveryUrgency === option.id ? option.color : '#E5E7EB' }}
                >
                  <div className="urgency-icon" style={{ backgroundColor: `${option.color}15` }}>
                    <span style={{ color: option.color, fontSize: '20px' }}>{option.icon}</span>
                  </div>
                  <div className="urgency-content">
                    <div className="urgency-main">
                      <div className="urgency-label">{option.label}</div>
                      <div className="urgency-time">{option.time}</div>
                    </div>
                    <div className="urgency-price" style={{ color: option.price > 0 ? option.color : '#6B7280' }}>
                      {option.displayPrice}
                    </div>
                  </div>
                  {formData.deliveryUrgency === option.id && (
                    <div className="urgency-selected-indicator" style={{ backgroundColor: option.color }}></div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="urgency-note">
              <div className="note-icon">ℹ️</div>
              <div className="note-text">
                <strong>Note:</strong> Express and Same-day delivery charges will be added to your final bill.
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="datetime-section">
            <div className="section-header">
              <div className="section-icon">📝</div>
              <div>
                <h3 className="section-title">Special Instructions</h3>
                <p className="section-subtitle">Any special delivery requests? (Optional)</p>
              </div>
            </div>
            
            <div className="instructions-container">
              <textarea
                name="deliveryInstructions"
                className="instructions-textarea"
                placeholder="E.g., Call before delivery, Leave at security, Fragile items, Delivery to 3rd floor, etc."
                value={formData.deliveryInstructions}
                onChange={handleChange}
                rows="3"
              />
              <div className="instructions-hint">Max 200 characters</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="datetime-navigation">
            <div className="navigation-buttons">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={prevStep}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Location
              </button>
              
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!formData.selectedDate || !formData.selectedTimeSlot}
              >
                Continue to Vehicle Selection
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="step-progress">
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '33%' }}></div>
                </div>
                <div className="step-labels">
                  <span className="step-label">Location</span>
                  <span className="step-label active">Date & Time</span>
                  <span className="step-label">Vehicle</span>
                  <span className="step-label">Payment</span>
                  <span className="step-label">Summary</span>
                  <span className="step-label">Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateTimePicker;