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
    packageType: data?.packageType || 'general',
    weight: data?.weight || '1',
    distance: data?.distance || '',
    estimatedPrice: data?.estimatedPrice || '',
    travelTime: data?.travelTime || '',
    loading: false,
  });

  const fromCityRef = useRef(null);
  const toCityRef = useRef(null);
  const fromAddressRef = useRef(null);
  const toAddressRef = useRef(null);
  const isAutocompleteInProgress = useRef(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // ✅ CORRECTED: Add your Client ID and API Key here
  const GOOGLE_MAPS_CONFIG = {
    apiKey: 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg', // Your API Key
    clientId: '625171614112-6lleq0sdfj2nh6qblrc7t5hmjo87g6nu.apps.googleusercontent.com', // Replace with your Client ID
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
      packageType: data?.packageType || 'general',
      weight: data?.weight || '1',
      distance: data?.distance || '',
      estimatedPrice: data?.estimatedPrice || '',
      travelTime: data?.travelTime || '',
      loading: false,
    });
  }, [data]);

  // ✅ FIXED: Google Maps API setup with proper parameters
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps?.places) {
        setGoogleLoaded(true);
        initializeAutocomplete();
        return;
      }

      // Create script with proper parameters
      const script = document.createElement('script');
      
      // ✅ Correct URL format with both client and key parameters
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.apiKey}&libraries=places&callback=initGoogleMaps`;
      
      script.async = true;
      script.defer = true;
      
      // Global callback function
      window.initGoogleMaps = () => {
        setGoogleLoaded(true);
        initializeAutocomplete();
      };

      // Error handling
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        alert('❌ Failed to load Google Maps. Please check your API key and try again.');
      };

      document.head.appendChild(script);

      // Cleanup
      return () => {
        if (window.initGoogleMaps) {
          window.initGoogleMaps = null;
        }
      };
    };

    loadGoogleMaps();
  }, []);

  const initializeAutocomplete = () => {
    if (!window.google?.maps?.places) {
      console.log('Google Places API not loaded yet');
      return;
    }

    // ✅ FIXED: Initialize autocomplete for From City
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
        setTimeout(() => {
          isAutocompleteInProgress.current = false;
        }, 100);
      });
    }

    // ✅ FIXED: Initialize autocomplete for To City
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
        setTimeout(() => {
          isAutocompleteInProgress.current = false;
        }, 100);
      });
    }

    // ✅ FIXED: Initialize autocomplete for From Address
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
          
          // ✅ Auto-extract city and state from address
          extractLocationFromAddress(place, 'from');
        }
        setTimeout(() => {
          isAutocompleteInProgress.current = false;
        }, 100);
      });
    }

    // ✅ FIXED: Initialize autocomplete for To Address
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
          
          // ✅ Auto-extract city and state from address
          extractLocationFromAddress(place, 'to');
        }
        setTimeout(() => {
          isAutocompleteInProgress.current = false;
        }, 100);
      });
    }
  };

  // ✅ NEW: Extract city and state from address
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
    setLocalData(updatedData);
    
    if (updateData) {
      updateData(name, value);
    }

    // ✅ Auto-calculate when both cities are entered
    if ((name === 'fromCity' || name === 'toCity') && 
        localData.fromCity && localData.toCity &&
        name === 'toCity' && value) {
      setTimeout(() => {
        calculateRealDistance();
      }, 1000);
    }
  };

  const calculateRealDistance = async () => {
    if (!localData.fromCity || !localData.toCity) {
      alert('⚠️ Please select both cities first!');
      return;
    }

    if (!window.google?.maps?.DistanceMatrixService) {
      alert('⚠️ Google Maps is still loading. Please try again in a moment.');
      return;
    }

    try {
      setLocalData(prev => ({ ...prev, loading: true }));
      
      const service = new window.google.maps.DistanceMatrixService();
      const origin = `${localData.fromCity}, ${localData.fromState}, India`;
      const destination = `${localData.toCity}, ${localData.toState}, India`;

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
                loading: false
              };
              
              setLocalData(updatedData);
              
              if (updateData) {
                updateData('distance', distanceInKm.toString());
                updateData('travelTime', travelTime);
              }
              
              // Auto calculate price
              calculatePriceWithDistance(distanceInKm, travelTime);
              
              alert(`✅ Distance calculated!\n📍 ${distanceInKm} km\n⏱️ ${travelTime}`);
            } else {
              alert('❌ Could not calculate distance between these cities.');
            }
          } else {
            alert('❌ Distance calculation failed. Please enter distance manually.');
          }
        }
      );
    } catch (error) {
      console.error('Distance calculation error:', error);
      setLocalData(prev => ({ ...prev, loading: false }));
      alert('❌ Error calculating distance. Please try manual entry.');
    }
  };

  const calculatePriceWithDistance = (distance, travelTime) => {
    const weight = parseFloat(localData.weight) || 1;
    
    if (distance < 1) {
      alert('❗ Distance must be at least 1 km');
      return;
    }
    
    if (distance > 5000) {
      alert('❗ Maximum distance allowed is 5000 km');
      return;
    }
    
    // ₹10 per km × distance + weight charge
    const basePrice = distance * 10;
    const weightCharge = (weight - 1) * 20;
    const total = Math.round(basePrice + weightCharge);
    
    const updatedData = {
      ...localData,
      estimatedPrice: total,
      distance: distance.toString(),
      travelTime: travelTime
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
      alert('❗ Please enter distance (minimum 1 km)');
      return;
    }
    
    if (distance > 5000) {
      alert('❗ Maximum distance allowed is 5000 km');
      return;
    }
    
    const basePrice = distance * 10;
    const weightCharge = (weight - 1) * 20;
    const total = Math.round(basePrice + weightCharge);
    
    const updatedData = { ...localData, estimatedPrice: total };
    setLocalData(updatedData);
    
    if (updateData) {
      updateData('estimatedPrice', total);
    }
    
    alert(`✅ Price calculated: ₹${total}`);
  };

  const handlePackageSelect = (type) => {
    const updatedData = { ...localData, packageType: type };
    setLocalData(updatedData);
    if (updateData) updateData('packageType', type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!localData.distance || !localData.estimatedPrice) {
      alert('❗ Please calculate price first.');
      return;
    }
    
    const requiredFields = [
      'fromState', 'fromCity', 'fromAddress',
      'toState', 'toCity', 'toAddress'
    ];
    
    for (const field of requiredFields) {
      if (!localData[field] || localData[field].trim() === '') {
        const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        alert(`❗ Please fill in ${fieldName}`);
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

  const packageTypes = [
    { id: 'general', name: 'General Goods', icon: '📦', description: 'Household items, books, etc.' },
    { id: 'documents', name: 'Documents', icon: '📄', description: 'Files, certificates, papers' },
    { id: 'electronics', name: 'Electronics', icon: '💻', description: 'Phones, laptops, gadgets' },
    { id: 'fragile', name: 'Fragile Items', icon: '🥚', description: 'Glass, ceramics, delicate items' },
    { id: 'clothing', name: 'Clothing', icon: '👕', description: 'Clothes, fabrics, textiles' },
    { id: 'furniture', name: 'Furniture', icon: '🪑', description: 'Furniture, large items' }
  ];

  return (
    <div className="location-form-container">
      <div className="form-header-section">
        <h2 className="form-main-title">📍 Step 1: Shipping Details</h2>
        <p className="form-subtitle">Fill in pickup and delivery locations to get started</p>
        {!googleLoaded && (
          <div className="google-loading">
            🔄 Loading Google Maps API...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="location-main-form">
        
        {/* FROM Location Section */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">🚚</span>
            <h3 className="section-title">Pickup Location</h3>
            <p className="section-hint">Select state first, then type city</p>
          </div>
          
          <div className="responsive-form-grid">
            <div className="form-group-responsive">
              <label className="form-label">State *</label>
              <select
                name="fromState"
                value={localData.fromState}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="input-hint">Select state to enable city field</div>
            </div>

            <div className="form-group-responsive">
              <label className="form-label">City *</label>
              <input
                ref={fromCityRef}
                type="text"
                name="fromCity"
                value={localData.fromCity}
                onChange={handleChange}
                className="form-input"
                placeholder={localData.fromState ? "Start typing city name..." : "Select state first"}
                required
                disabled={!localData.fromState}
                autoComplete="off"
              />
              <div className="autocomplete-note">
                {localData.fromState 
                  ? (googleLoaded ? "📍 Type for auto-suggestions" : "⏳ Loading suggestions...") 
                  : "⚠️ Please select state first"}
              </div>
            </div>

            <div className="form-group-responsive full-width">
              <label className="form-label">Complete Address *</label>
              <textarea
                ref={fromAddressRef}
                name="fromAddress"
                value={localData.fromAddress}
                onChange={handleChange}
                className="form-textarea"
                placeholder={localData.fromCity ? "Type address for suggestions..." : "Enter city first"}
                rows="3"
                required
                disabled={!localData.fromCity}
              />
              <div className="autocomplete-note">
                {localData.fromCity 
                  ? (googleLoaded ? "📍 Address suggestions available" : "⏳ Loading...") 
                  : "⚠️ Enter city first"}
              </div>
            </div>
          </div>
        </div>

        {/* TO Location Section */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">🏠</span>
            <h3 className="section-title">Delivery Location</h3>
            <p className="section-hint">Distance auto-calculates when both cities entered</p>
          </div>
          
          <div className="responsive-form-grid">
            <div className="form-group-responsive">
              <label className="form-label">State *</label>
              <select
                name="toState"
                value={localData.toState}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="input-hint">Select state to enable city field</div>
            </div>

            <div className="form-group-responsive">
              <label className="form-label">City *</label>
              <input
                ref={toCityRef}
                type="text"
                name="toCity"
                value={localData.toCity}
                onChange={handleChange}
                className="form-input"
                placeholder={localData.toState ? "Start typing city name..." : "Select state first"}
                required
                disabled={!localData.toState}
                autoComplete="off"
              />
              <div className="autocomplete-note">
                {localData.toState 
                  ? (googleLoaded ? "📍 Select city to auto-calculate distance" : "⏳ Loading...") 
                  : "⚠️ Please select state first"}
              </div>
            </div>

            <div className="form-group-responsive full-width">
              <label className="form-label">Complete Address *</label>
              <textarea
                ref={toAddressRef}
                name="toAddress"
                value={localData.toAddress}
                onChange={handleChange}
                className="form-textarea"
                placeholder={localData.toCity ? "Type address for suggestions..." : "Enter city first"}
                rows="3"
                required
                disabled={!localData.toCity}
              />
              <div className="autocomplete-note">
                {localData.toCity 
                  ? (googleLoaded ? "📍 Address suggestions available" : "⏳ Loading...") 
                  : "⚠️ Enter city first"}
              </div>
            </div>
          </div>
        </div>

        {/* Package Type Selection */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">📦</span>
            <h3 className="section-title">Select Goods Type</h3>
          </div>
          
          <div className="package-list-container">
            <div className="package-list">
              {packageTypes.map(pkg => (
                <div
                  key={pkg.id}
                  className={`package-list-item ${localData.packageType === pkg.id ? 'selected' : ''}`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <div className="package-list-icon">
                    {pkg.icon}
                  </div>
                  <div className="package-list-content">
                    <div className="package-list-name">{pkg.name}</div>
                    <div className="package-list-desc">{pkg.description}</div>
                  </div>
                  <div className="package-list-radio">
                    <div className={`radio-circle ${localData.packageType === pkg.id ? 'checked' : ''}`}>
                      {localData.packageType === pkg.id && <div className="radio-dot"></div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weight and Distance Section */}
        <div className="form-section-card">
          <div className="section-header">
            <span className="section-icon">💰</span>
            <h3 className="section-title">Calculate Fare</h3>
            <p className="section-subtitle">Price = Distance × ₹10 + Weight Charge</p>
            <div className="auto-note">
              ✅ Distance auto-calculates when both cities selected
            </div>
          </div>
          
          <div className="fare-container">
            <div className="fare-inputs">
              <div className="fare-input-group">
                <label className="fare-label">Package Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  value={localData.weight}
                  onChange={handleChange}
                  className="fare-input"
                  placeholder="e.g., 5"
                  min="0.1"
                  step="0.1"
                  required
                />
                <div className="fare-note">₹20 extra per kg over 1kg</div>
              </div>
              
              <div className="fare-input-group">
                <label className="fare-label">Distance (km) *</label>
                <div className="distance-input-wrapper">
                  <input
                    type="number"
                    name="distance"
                    value={localData.distance}
                    onChange={handleChange}
                    className="fare-input"
                    placeholder={localData.loading ? "Calculating..." : "Auto-calculated"}
                    min="1"
                    max="5000"
                    required
                    readOnly={!!localData.distance}
                  />
                  <button
                    type="button"
                    className={`auto-calculate-btn ${localData.loading ? 'calculating' : ''}`}
                    onClick={calculateRealDistance}
                    disabled={localData.loading || !localData.fromCity || !localData.toCity}
                    title="Calculate real distance between cities"
                  >
                    {localData.loading ? (
                      <>
                        <span className="spinner"></span>
                        Calculating...
                      </>
                    ) : (
                      '📍 Calculate Distance'
                    )}
                  </button>
                </div>
                <div className="fare-note">
                  {localData.travelTime ? (
                    <span className="travel-time-display">
                      ⏱️ {localData.travelTime} • 📍 {localData.distance} km
                    </span>
                  ) : (
                    'Auto-calculates when both cities selected'
                  )}
                </div>
              </div>
            </div>
            
            <div className="fare-buttons">
              <button
                type="button"
                className="calculate-btn"
                onClick={calculatePrice}
                disabled={!localData.distance}
              >
                🧮 Calculate Final Price
              </button>
            </div>
            
            {localData.estimatedPrice && (
              <div className="fare-result">
                <div className="fare-breakdown">
                  <div className="fare-row">
                    <span>From:</span>
                    <span>{localData.fromCity}, {localData.fromState}</span>
                  </div>
                  <div className="fare-row">
                    <span>To:</span>
                    <span>{localData.toCity}, {localData.toState}</span>
                  </div>
                  <div className="fare-row">
                    <span>Distance Fare:</span>
                    <span>{localData.distance} km × ₹10 = ₹{localData.distance * 10}</span>
                  </div>
                  {localData.travelTime && (
                    <div className="fare-row">
                      <span>Travel Time:</span>
                      <span className="time-estimate">{localData.travelTime} (Google Maps)</span>
                    </div>
                  )}
                  <div className="fare-row">
                    <span>Weight Charge:</span>
                    <span>{(localData.weight - 1) > 0 ? `₹${(localData.weight - 1) * 20} extra` : 'No extra charge'}</span>
                  </div>
                  <div className="fare-total">
                    <span>Total Estimated Price:</span>
                    <span className="total-amount">₹{localData.estimatedPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={!localData.estimatedPrice || localData.loading}
          >
            {localData.loading ? '⏳ Calculating...' : 'Continue to Date & Time →'}
          </button>
          <p className="form-note">
            * Select state → Type city (auto-suggestions) → Address → Auto distance calculation
          </p>
          {!googleLoaded && (
            <div className="api-warning">
              ⚠️ Google Maps loading... Auto-suggestions will appear soon
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationForm;