import React, { useState, useEffect } from 'react';
import '../Additional/styles/DateTimePicker.css';

const DateTimePicker = ({ data = {}, updateData, nextStep, prevStep }) => {
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
      price: '+₹0', 
      icon: '🐢',
      color: '#10B981'
    },
    { 
      id: 'express', 
      label: 'Express Delivery', 
      time: '1-2 days', 
      price: '+₹300', 
      icon: '🚀',
      color: '#3B82F6'
    },
    { 
      id: 'same-day', 
      label: 'Same Day Delivery', 
      time: 'Within 24 hours', 
      price: '+₹800', 
      icon: '⚡',
      color: '#F59E0B'
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

  const handleUrgencySelect = (urgency) => {
    const newData = { ...formData, deliveryUrgency: urgency };
    setFormData(newData);
    updateData?.('deliveryUrgency', urgency);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    updateData?.(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.selectedDate || !formData.selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }
    
    nextStep?.();
  };

  return (
    <div className="datetime-container">
      <div className="datetime-header">
        <h2 className="datetime-title">📅 Step 2: Select Date & Time</h2>
        <p className="datetime-subtitle">Choose your preferred delivery schedule</p>
      </div>

      <form onSubmit={handleSubmit} className="datetime-form">
        
        {/* Date Selection */}
        <div className="datetime-section">
          <h3 className="section-title">
            <span className="section-icon">📆</span> Select Date
          </h3>
          
          <div className="date-picker-container">
            <div className="date-grid">
              {days.map(day => (
                <div 
                  key={day.id}
                  className={`date-card ${formData.selectedDate === day.fullDate ? 'selected' : ''} ${day.isToday ? 'today' : ''} ${day.isTomorrow ? 'tomorrow' : ''}`}
                  onClick={() => handleDateSelect(day.fullDate)}
                >
                  <div className="date-dayname">{day.dayName}</div>
                  <div className="date-number">{day.dayNum}</div>
                  <div className="date-month">{day.month}</div>
                  {day.isToday && <div className="date-badge">Today</div>}
                  {day.isTomorrow && <div className="date-badge">Tomorrow</div>}
                </div>
              ))}
            </div>
            
            <div className="selected-date-display">
              <span className="selected-label">Selected Date:</span>
              <span className="selected-value">
                {formData.selectedDate ? 
                  new Date(formData.selectedDate).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 
                  'Not selected'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="datetime-section">
          <h3 className="section-title">
            <span className="section-icon">⏰</span> Preferred Time Slot
          </h3>
          
          <div className="time-slots-container">
            {timeSlots.map(slot => (
              <div 
                key={slot.id}
                className={`time-slot-card ${formData.selectedTimeSlot === slot.id ? 'selected' : ''}`}
                onClick={() => handleTimeSelect(slot.id)}
              >
                <div className="time-slot-icon">{slot.icon}</div>
                <div className="time-slot-info">
                  <div className="time-slot-label">{slot.label}</div>
                  <div className="time-slot-time">{slot.time}</div>
                </div>
                {formData.selectedTimeSlot === slot.id && (
                  <div className="time-slot-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Urgency */}
        <div className="datetime-section">
          <h3 className="section-title">
            <span className="section-icon">🚚</span> Delivery Speed
          </h3>
          
          <div className="urgency-container">
            {urgencyOptions.map(option => (
              <div 
                key={option.id}
                className={`urgency-card ${formData.deliveryUrgency === option.id ? 'selected' : ''}`}
                onClick={() => handleUrgencySelect(option.id)}
                style={{ '--urgency-color': option.color }}
              >
                <div className="urgency-icon" style={{ backgroundColor: `${option.color}20` }}>
                  {option.icon}
                </div>
                <div className="urgency-info">
                  <div className="urgency-label">{option.label}</div>
                  <div className="urgency-time">{option.time}</div>
                </div>
                <div className="urgency-price">{option.price}</div>
              </div>
            ))}
          </div>
          
          <div className="urgency-note">
            <small>
              <strong>Note:</strong> Express and Same-day deliveries have additional charges that will be added to your final bill.
            </small>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="datetime-section">
          <h3 className="section-title">
            <span className="section-icon">📝</span> Special Instructions (Optional)
          </h3>
          
          <textarea
            name="deliveryInstructions"
            className="instructions-textarea"
            placeholder="Any special delivery instructions? e.g., Call before delivery, Leave at security, Fragile handling..."
            value={formData.deliveryInstructions}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* Navigation */}
        <div className="datetime-navigation">
          <button 
            type="button" 
            className="nav-btn prev-btn"
            onClick={prevStep}
          >
            ← Back to Location
          </button>
          
          <button 
            type="submit" 
            className="nav-btn next-btn"
            disabled={!formData.selectedDate || !formData.selectedTimeSlot}
          >
            Continue to Vehicle Selection →
          </button>
          
          <div className="step-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '40%' }}></div>
            </div>
            <div className="step-indicators">
              <span className="step-done">1</span>
              <span className="step-active">2</span>
              <span className="step">3</span>
              <span className="step">4</span>
              <span className="step">5</span>
              <span className="step">6</span>
            </div>
            <p className="progress-text">Step 2 of 6 • Date & Time Selection</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateTimePicker;