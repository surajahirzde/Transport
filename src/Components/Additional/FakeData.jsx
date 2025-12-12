// src/utils/fakeData.js

// Generate fake orders for demo
export const generateFakeOrders = (count = 6, phone = '9876543210') => {
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const statuses = ['ORDER_CONFIRMED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const vehicles = [
    { type: 'mini_van', name: 'Mini Van', price: 600 },
    { type: 'pickup_truck', name: 'Pickup Truck', price: 1200 },
    { type: 'container_truck', name: 'Container Truck', price: 2500 },
    { type: 'trailer_truck', name: 'Trailer Truck', price: 4000 },
    { type: 'refrigerated_truck', name: 'Refrigerated Truck', price: 2000 },
    { type: 'tipper_truck', name: 'Tipper Truck', price: 3000 }
  ];

  const orders = [];
  
  for (let i = 0; i < count; i++) {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    const toCity = cities.filter(city => city !== fromCity)[Math.floor(Math.random() * (cities.length - 1))];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    const last4 = phone.slice(-4);
    
    // Generate dates
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 10));
    
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + Math.floor(Math.random() * 5) + 2);
    
    // Generate progress based on status
    const progressMap = {
      'ORDER_CONFIRMED': 20,
      'PICKUP_SCHEDULED': 35,
      'PICKED_UP': 50,
      'IN_TRANSIT': 70,
      'OUT_FOR_DELIVERY': 90,
      'DELIVERED': 100
    };
    
    const order = {
      id: `order_${Date.now()}_${i}`,
      orderId: `ORD${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(Math.floor(1000 + Math.random() * 9000))}`,
      trackingId: `TRK${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}${last4}#`,
      status: status,
      progress: progressMap[status],
      fromCity: fromCity,
      toCity: toCity,
      vehicleType: vehicle.type,
      vehicleName: vehicle.name,
      totalAmount: vehicle.price + Math.floor(Math.random() * 500) + 100,
      orderDate: orderDate.toISOString(),
      createdAt: orderDate.toISOString(),
      estimatedDelivery: estimatedDelivery.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      }),
      weight: `${Math.floor(Math.random() * 50) + 1} kg`,
      distance: `${Math.floor(Math.random() * 500) + 50} km`,
      packageType: ['General', 'Fragile', 'Electronics', 'Documents'][Math.floor(Math.random() * 4)]
    };
    
    orders.push(order);
  }
  
  return orders;
};

// Generate fake executives
export const generateFakeExecutives = (count = 15) => {
  const firstNames = ['Rajesh', 'Amit', 'Sanjay', 'Vikram', 'Rohit', 'Ankit', 'Deepak', 'Manish', 'Suresh', 'Praveen'];
  const lastNames = ['Kumar', 'Singh', 'Verma', 'Sharma', 'Patel', 'Yadav', 'Gupta', 'Malhotra', 'Reddy', 'Nair'];
  const vehicles = ['Truck', 'Mini Truck', 'Pickup Van', 'Container Truck', 'Trailer', 'Refrigerated Van'];
  const areas = ['North Delhi', 'South Mumbai', 'East Bangalore', 'West Chennai', 'Central Kolkata'];
  
  const executives = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    const executive = {
      id: `exec_${i + 1}`,
      name: `${firstName} ${lastName}`,
      phone: `+91 9${Math.floor(10000000 + Math.random() * 90000000)}`,
      rating: (4 + Math.random()).toFixed(1),
      experience: `${Math.floor(Math.random() * 10) + 1} years`,
      vehicle: vehicle,
      area: area,
      completedDeliveries: Math.floor(Math.random() * 500) + 100,
      status: ['Available', 'On Delivery', 'On Break'][Math.floor(Math.random() * 3)],
      avatarColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
    };
    
    executives.push(executive);
  }
  
  return executives;
};

// Generate fake tracking locations
export const generateFakeLocations = () => {
  return [
    { id: 1, name: 'Warehouse', lat: 28.6139, lng: 77.2090, time: '10:00 AM', status: 'Picked Up' },
    { id: 2, name: 'Sorting Center', lat: 28.7041, lng: 77.1025, time: '12:30 PM', status: 'In Transit' },
    { id: 3, name: 'Transit Hub', lat: 28.4595, lng: 77.0266, time: '2:45 PM', status: 'In Transit' },
    { id: 4, name: 'Local Hub', lat: 28.5355, lng: 77.3910, time: '4:15 PM', status: 'Out for Delivery' },
    { id: 5, name: 'Destination', lat: 28.5272, lng: 77.0689, time: '6:00 PM', status: 'Delivered' }
  ];
};

// Generate fake status timeline
export const generateFakeTimeline = (orderId) => {
  const now = new Date();
  return [
    {
      id: 1,
      status: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed',
      time: new Date(now.getTime() - 5 * 60 * 60 * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      completed: true,
      icon: '✅'
    },
    {
      id: 2,
      status: 'PICKUP_SCHEDULED',
      title: 'Pickup Scheduled',
      description: 'Pickup scheduled for tomorrow',
      time: '9:00 AM - 12:00 PM',
      date: 'Tomorrow',
      completed: false,
      icon: '📅'
    },
    {
      id: 3,
      status: 'IN_TRANSIT',
      title: 'In Transit',
      description: 'Package is in transit',
      time: 'Estimated',
      date: 'Processing',
      completed: false,
      icon: '🚚'
    },
    {
      id: 4,
      status: 'OUT_FOR_DELIVERY',
      title: 'Out for Delivery',
      description: 'Package is out for delivery',
      time: 'Estimated',
      date: 'Soon',
      completed: false,
      icon: '🏍️'
    },
    {
      id: 5,
      status: 'DELIVERED',
      title: 'Delivered',
      description: 'Package delivered successfully',
      time: 'Estimated',
      date: 'Soon',
      completed: false,
      icon: '🏠'
    }
  ];
};

// Default export
export default {
  generateFakeOrders,
  generateFakeExecutives,
  generateFakeLocations,
  generateFakeTimeline
};