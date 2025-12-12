import React, { useEffect, useRef, useState } from 'react';
import '../Additional/styles/LocationForm.css';

const LocationForm = ({ data = {}, updateData, nextStep }) => {
  const [localData, setLocalData] = useState({
    fromState: data?.fromState || '',
    fromCity: data?.fromCity || '',
    fromAddress: data?.fromAddress || '',
    toState: data?.toState || '',
    toCity: data?.toCity || '',
    toAddress: data?.toAddress || '',

    weight: data?.weight || '1 ',
    distance: data?.distance || '',
    estimatedPrice: data?.estimatedPrice || '',
    travelTime: data?.travelTime || '',
    loading: false,
    isSameCity: false,
    distanceCalculated: false,
  });

  const fromCityRef = useRef(null);
  const toCityRef = useRef(null);
  const fromAddressRef = useRef(null);
  const toAddressRef = useRef(null);
  const isAutocompleteInProgress = useRef(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [showWeightInfo, setShowWeightInfo] = useState(false);

  const GOOGLE_MAPS_CONFIG = {
    apiKey: 'AIzaSyCyF2L-HcyPxgRqushbb5hXlLaB5Cmcyk4',
    libraries: ['places'],
  };

  // Sync localData with parent data
  useEffect(() => {
    setLocalData({
      fromState: data?.fromState || '',
      fromCity: data?.fromCity || '',
      fromAddress: data?.fromAddress || '',
      toState: data?.toState || '',
      toCity: data?.toCity || '',
      toAddress: data?.toAddress || '',
   
      weight: data?.weight || '1',
      distance: data?.distance || '',
      estimatedPrice: data?.estimatedPrice || '',
      travelTime: data?.travelTime || '',
      loading: false,
      isSameCity: (data?.fromCity && data?.toCity && 
                  data?.fromCity.toLowerCase() === data?.toCity.toLowerCase()) || false,
      distanceCalculated: !!data?.distance,
    });
  }, [data]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps?.places) {
        setGoogleLoaded(true);
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;
      
      window.initGoogleMaps = () => {
        setGoogleLoaded(true);
        initializeAutocomplete();
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };

      document.head.appendChild(script);

      return () => {
        if (window.initGoogleMaps) {
          window.initGoogleMaps = null;
        }
      };
    };

    loadGoogleMaps();
  }, []);

  // Check if cities are same
  useEffect(() => {
    if (localData.fromCity && localData.toCity) {
      const isSame = localData.fromCity.toLowerCase() === localData.toCity.toLowerCase();
      if (isSame !== localData.isSameCity) {
        setLocalData(prev => ({ 
          ...prev, 
          isSameCity: isSame,
          distanceCalculated: false,
          distance: '',
          estimatedPrice: '',
          travelTime: ''
        }));
      }
    }
  }, [localData.fromCity, localData.toCity]);

  // Reset distance calculation when address changes after calculation
  useEffect(() => {
    if (localData.distanceCalculated && (localData.fromAddress || localData.toAddress)) {
      setLocalData(prev => ({ 
        ...prev, 
        distanceCalculated: false,
        distance: '',
        estimatedPrice: '',
        travelTime: ''
      }));
    }
  }, [localData.fromAddress, localData.toAddress]);

  const initializeAutocomplete = () => {
    if (!window.google?.maps?.places) {
      console.log('Google Places API not loaded yet');
      return;
    }

    // From City Autocomplete
    if (fromCityRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        fromCityRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'formatted_address', 'geometry']
        }
      );

      autocomplete.addListener('place_changed', () => {
        isAutocompleteInProgress.current = true;
        const place = autocomplete.getPlace();
        if (place?.address_components) {
          handleCityPlaceSelect(place, 'from');
        }
        setTimeout(() => { isAutocompleteInProgress.current = false; }, 100);
      });
    }

    // To City Autocomplete
    if (toCityRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        toCityRef.current,
        {
          types: ['(cities)'],
          componentRestrictions: { country: 'in' },
          fields: ['address_components', 'formatted_address', 'geometry']
        }
      );

      autocomplete.addListener('place_changed', () => {
        isAutocompleteInProgress.current = true;
        const place = autocomplete.getPlace();
        if (place?.address_components) {
          handleCityPlaceSelect(place, 'to');
        }
        setTimeout(() => { isAutocompleteInProgress.current = false; }, 100);
      });
    }

    // From Address Autocomplete
    if (fromAddressRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        fromAddressRef.current,
        {
          componentRestrictions: { country: 'in' },
          fields: ['formatted_address', 'geometry', 'address_components', 'name']
        }
      );

      autocomplete.addListener('place_changed', () => {
        isAutocompleteInProgress.current = true;
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          const updatedData = { ...localData, fromAddress: place.formatted_address };
          setLocalData(updatedData);
          if (updateData) updateData('fromAddress', place.formatted_address);
          extractLocationFromAddress(place, 'from');
        }
        setTimeout(() => { isAutocompleteInProgress.current = false; }, 100);
      });
    }

    // To Address Autocomplete
    if (toAddressRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        toAddressRef.current,
        {
          componentRestrictions: { country: 'in' },
          fields: ['formatted_address', 'geometry', 'address_components', 'name']
        }
      );

      autocomplete.addListener('place_changed', () => {
        isAutocompleteInProgress.current = true;
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          const updatedData = { ...localData, toAddress: place.formatted_address };
          setLocalData(updatedData);
          if (updateData) updateData('toAddress', place.formatted_address);
          extractLocationFromAddress(place, 'to');
        }
        setTimeout(() => { isAutocompleteInProgress.current = false; }, 100);
      });
    }
  };

  const extractLocationFromAddress = (place, type) => {
    let city = '';
    let state = '';

    if (place.address_components) {
      place.address_components.forEach((component) => {
        if (component.types.includes('locality') || 
            component.types.includes('sublocality_level_1') ||
            component.types.includes('postal_town')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
      });

      if (city || state) {
        const updatedData = {
          ...localData,
          [`${type}City`]: city || localData[`${type}City`],
          [`${type}State`]: state || localData[`${type}State`]
        };
        
        setLocalData(updatedData);
        
        if (updateData) {
          if (city) updateData(`${type}City`, city);
          if (state) updateData(`${type}State`, state);
        }
      }
    }
  };

  const handleCityPlaceSelect = (place, type) => {
    let city = '';
    let state = '';

    if (place.address_components) {
      place.address_components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
      });
    }

    const updatedData = {
      ...localData,
      [`${type}City`]: city,
      [`${type}State`]: state || localData[`${type}State`]
    };

    setLocalData(updatedData);
    
    if (updateData) {
      updateData(`${type}City`, city);
      if (state) updateData(`${type}State`, state);
    }
  };

  const handleChange = (e) => {
    if (isAutocompleteInProgress.current) return;

    const { name, value } = e.target;
    const updatedData = { ...localData, [name]: value };
    
    // If distance already calculated and user changes address/city, reset distance
    if ((name.includes('Address') || name.includes('City')) && localData.distanceCalculated) {
      updatedData.distanceCalculated = false;
      updatedData.distance = '';
      updatedData.estimatedPrice = '';
      updatedData.travelTime = '';
    }
    
    setLocalData(updatedData);
    
    if (updateData) {
      updateData(name, value);
    }
  };

  const calculateRealDistance = async () => {
    if (!localData.fromCity || !localData.toCity) {
      alert('Please select both cities first!');
      return;
    }

    if (!window.google?.maps?.DistanceMatrixService) {
      alert('Google Maps is still loading. Please try again.');
      return;
    }

    try {
      setLocalData(prev => ({ ...prev, loading: true }));
      
      const service = new window.google.maps.DistanceMatrixService();
      
      let origin, destination;
      
      if (localData.isSameCity && localData.fromAddress && localData.toAddress) {
        origin = localData.fromAddress;
        destination = localData.toAddress;
      } else {
        origin = `${localData.fromCity}, ${localData.fromState}, India`;
        destination = `${localData.toCity}, ${localData.toState}, India`;
      }

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          setLocalData(prev => ({ ...prev, loading: false }));
          
          if (status === 'OK') {
            const element = response.rows[0].elements[0];
            
            if (element.status === 'OK') {
              const distanceInKm = Math.round(element.distance.value / 1000);
              const travelTime = element.duration.text;
              
              const updatedData = {
                ...localData,
                distance: distanceInKm.toString(),
                travelTime: travelTime,
                loading: false,
                distanceCalculated: true
              };
              
              setLocalData(updatedData);
              
              if (updateData) {
                updateData('distance', distanceInKm.toString());
                updateData('travelTime', travelTime);
              }
              
              calculatePriceWithDistance(distanceInKm, travelTime);
              
            } else {
              alert('Could not calculate distance. Please check addresses.');
            }
          } else {
            alert('Distance calculation failed. Please enter distance manually.');
          }
        }
      );
    } catch (error) {
      console.error('Distance calculation error:', error);
      setLocalData(prev => ({ ...prev, loading: false }));
      alert('Error calculating distance. Please try manual entry.');
    }
  };

  // Weight charge calculation
  const calculateWeightCharge = (weight) => {
    const weightNum = parseFloat(weight);
    
    if (weightNum <= 1) return 0;
    if (weightNum <= 10) return 100;
    if (weightNum <= 20) return 100 + (weightNum - 10) * 15;
    if (weightNum <= 30) return 250 + (weightNum - 20) * 20;
    if (weightNum <= 40) return 450 + (weightNum - 30) * 25;
    if (weightNum <= 50) return 700 + (weightNum - 40) * 30;
    return 1000 + (weightNum - 50) * 35;
  };

  const calculatePriceWithDistance = (distance, travelTime) => {
    const weight = parseFloat(localData.weight) || 1;
    
    if (distance < 1) {
      alert('Distance must be at least 1 km');
      return;
    }
    
    if (distance > 5000) {
      alert('Maximum distance allowed is 5000 km');
      return;
    }
    
    // Distance fare: ₹10 per km
    const distanceFare = distance * 10;
    
    // Weight charge
    const weightCharge = calculateWeightCharge(weight);
    console.log(weightCharge);  
    // Handling charge
    const handlingCharge = 50;
    
    // Total price
    const total = distanceFare + weightCharge + handlingCharge;
    
    const updatedData = {
      ...localData,
      estimatedPrice: total,
      distance: distance.toString(),
      travelTime: travelTime,
      distanceFare: distanceFare,
      weightCharge: weightCharge,
      handlingCharge: handlingCharge,
      total: total
    };
    
    setLocalData(updatedData);
    
    if (updateData) {
      updateData('estimatedPrice', total);
      updateData('distance', distance.toString());
      updateData('travelTime', travelTime);
    }
  };

  const calculatePrice = () => {
    const distance = parseFloat(localData.distance) || 0;
    const weight = parseFloat(localData.weight) || 1;
    
    if (distance < 1) {
      alert('Please enter distance (minimum 1 km)');
      return;
    }
    
    if (distance > 5000) {
      alert('Maximum distance allowed is 5000 km');
      return;
    }
    
    const distanceFare = distance * 10;
    const weightCharge = calculateWeightCharge(weight);
    const handlingCharge = 50;
    const total = distanceFare + weightCharge + handlingCharge;
    
    const updatedData = { 
      ...localData, 
      estimatedPrice: total,
      distanceFare: distanceFare,
      weightCharge: weightCharge,
      handlingCharge: handlingCharge,
      total: total
    };
    setLocalData(updatedData);
    
    if (updateData) {
      updateData('estimatedPrice', total);
    }
  };

  

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!localData.distance || !localData.estimatedPrice) {
      alert('Please calculate price first.');
      return;
    }
    
    const requiredFields = [
      'fromState', 'fromCity', 'fromAddress',
      'toState', 'toCity', 'toAddress'
    ];
    
    for (const field of requiredFields) {
      if (!localData[field] || localData[field].trim() === '') {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        alert(`Please fill in ${fieldName}`);
        return;
      }
    }

    if (nextStep) {
      nextStep();
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];

  
console.log(localData.weight);
  return (
    <div className="location-form">
      <div className="form-header">
        <h2>Shipping Details</h2>
        <p>Enter pickup and delivery information</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* FROM Location Section */}
        <div className="location-section">
          <h3 className="section-title">📍 Pickup Location</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>State *</label>
              <select
                name="fromState"
                value={localData.fromState}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                ref={fromCityRef}
                type="text"
                name="fromCity"
                value={localData.fromCity}
                onChange={handleChange}
                placeholder="Type city name"
                required
                disabled={!localData.fromState}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complete Address with Phone & Pincode *</label>
            <textarea
              ref={fromAddressRef}
              name="fromAddress"
              value={localData.fromAddress}
              onChange={handleChange}
              placeholder="Full address, phone number (10 digits), and pincode (6 digits)"
              rows="3"
              required
              disabled={!localData.fromCity}
            />
            <small>Example: 123 Main Street, Mumbai - 400001, Phone: 9876543210</small>
          </div>
        </div>

        {/* TO Location Section */}
        <div className="location-section">
          <h3 className="section-title">🏠 Delivery Location</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>State *</label>
              <select
                name="toState"
                value={localData.toState}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                ref={toCityRef}
                type="text"
                name="toCity"
                value={localData.toCity}
                onChange={handleChange}
                placeholder="Type city name"
                required
                disabled={!localData.toState}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complete Address with Phone & Pincode *</label>
            <textarea
              ref={toAddressRef}
              name="toAddress"
              value={localData.toAddress}
              onChange={handleChange}
              placeholder="Full address, phone number (10 digits), and pincode (6 digits)"
              rows="3"
              required
              disabled={!localData.toCity}
            />
            <small>Example: 456 Park Avenue, Delhi - 110001, Phone: 9876543210</small>
          </div>
        </div>

       

        {/* Weight and Distance */}
        <div className="location-section">
          <h3 className="section-title">💰 Calculate Fare</h3>
          
          <div className="fare-calculator">
            <div className="form-row">
              <div className="form-group">
                <label>Package Weight (Approx) *</label>
                <div className="weight-input">
                  <input
                    type="number"
                    name="weight"
                    value={localData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    min="0.1"
                    step="0.1"
                    required
                  />
                  <button 
                    type="button" 
                    className="info-btn"
                    onClick={() => setShowWeightInfo(!showWeightInfo)}
                    title="Weight charges"
                  >
                    ℹ️
                  </button>
                </div>
                {showWeightInfo && (
                  <div className="weight-info-box">
                    <strong>Weight Charges:</strong>
                    <div>• 1-10 kg: ₹100 flat</div>
                    <div>• 10-20 kg: ₹100 + ₹15/kg extra</div>
                    <div>• 20-30 kg: ₹250 + ₹20/kg extra</div>
                    <div>• 30-40 kg: ₹450 + ₹25/kg extra</div>
                    <div>• 40-50 kg: ₹700 + ₹30/kg extra</div>
                    <div>• Above 50 kg: ₹1000 + ₹35/kg extra</div>
                  </div>
                )}
              </div>  
              
              <div className="form-group">
                <label>Distance Approx (km) *</label>
                <div className="distance-input">
                  <input
                    type="number"
                    name="distance"
                    value={localData.distance}
                    onChange={handleChange}
                    placeholder="Fetch Distance"
                    min="1"
                    max="5000"
                    required
                  />
                  <button
                    type="button"
                    className="calc-btn"
                    onClick={calculateRealDistance}
                    disabled={localData.loading || !localData.fromCity || !localData.toCity}
                  >
                    {localData.loading ? 'Calculating...' : '📍 Auto'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="calculate-btn"
              onClick={calculatePrice}
              disabled={!localData.distance}
            >
              Calculate Price
            </button>
          </div>

          {/* Travel Time */}
          {localData.travelTime && (
            <div className="travel-time">
              ⏱️ Travel Time: {localData.travelTime}
            </div>
          )}
        </div>

        {/* Price Breakdown - SIMPLE */}
        {localData.estimatedPrice && (
          <div className="price-breakdown">
            <h3 className="section-title">🧾 Price Details</h3>
            
            <div className="price-row">
              <span>Distance Fare ({localData.distance} km × ₹10):</span>
              <span>₹{localData.distance * 10}</span>
            </div>
            
            <div className="price-row">
              <span>Weight Charge ({localData.weight} kg):</span>
              <span>₹{ calculateWeightCharge(localData.weight)}</span>
            </div>
            
            <div className="price-row">
              <span>Handling Fee:</span>
              <span>₹{localData.handlingCharge || 50}</span>
            </div>
            
            <div className="price-total">
              <span>Total Price:</span>
              <span className="total-amount">₹{localData.estimatedPrice}</span>
            </div>
            
            <div className="price-note">
              <small>📍 Distance: {localData.distance} km | ⚖️ Weight: {localData.weight} kg</small>
            
 

            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={!localData.estimatedPrice || localData.loading}
          >
            {localData.loading ? 'Calculating...' : 'Next Step →'}
          </button>
        </div>
      </form>
    </div>
  );
};
  
export default LocationForm; 