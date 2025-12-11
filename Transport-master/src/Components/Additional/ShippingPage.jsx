import React, { useState } from 'react';
import LocationForm from './LocationForm';
import DateTimePicker from './DateTimePicker';
import VehicleSelector from './VehicleSelector';
import PaymentPage from './PaymentPage';
import OrderSummary from './OrderSummary';
import Receipt from './Receipt';
import '../Additional/styles/ShippingPage.css';

const ShippingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // FIX: formData ko blank object na rakho — 
  // warna child re-render par overwrite ho jata hai.
  const [formData, setFormData] = useState({
    fromState: "",
    fromCity: "",
    fromAddress: "",
    toState: "",
    toCity: "",
    toAddress: "",
    pickupDate: "",
    pickupTime: "",
    vehicle: "",
    paymentMethod: "",
    price: "",
    distance: "",
  });

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="shipping-page-container">
      <h1>🚚 Ship Your Package</h1>

      {/* Stepper */}
      <div className="stepper-container">
        <div className="stepper">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`step ${
                step === currentStep ? 'active' :
                step < currentStep ? 'completed' : ''
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="step-content">
        <div className="step-content-container">

          {currentStep === 1 && (
            <LocationForm
              data={formData}
              updateData={updateFormData}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <DateTimePicker
              data={formData}
              updateData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 3 && (
            <VehicleSelector
              data={formData}
              updateData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 4 && (
            <PaymentPage
              data={formData}
              updateData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 5 && (
            <OrderSummary
              data={formData}
              updateData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}

          {currentStep === 6 && (
            <Receipt
              data={formData}
              prevStep={prevStep}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
