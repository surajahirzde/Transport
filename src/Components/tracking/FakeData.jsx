// src/Components/TrackingSystem/fakeData.jsx
import React from 'react';
import "../../Components/tracking/styles/FakeData.css";

// 10-15 Delivery Executives ka Fake Data
export const fakeExecutives = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 9876543210",
    vehicle: "Mini Van",
    vehicleNumber: "DL01AB1234",
    rating: 4.8,
    status: "available",
    location: { lat: 28.6139, lng: 77.2090 },
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    completedDeliveries: 124,
    experience: "3 years",
    languages: ["Hindi", "English"],
    currentOrder: null
  },
  {
    id: 2,
    name: "Sunita Sharma",
    phone: "+91 9876543211",
    vehicle: "Pickup Truck",
    vehicleNumber: "MH02CD5678",
    rating: 4.9,
    status: "available",
    location: { lat: 19.0760, lng: 72.8777 },
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    completedDeliveries: 189,
    experience: "5 years",
    languages: ["Hindi", "Marathi", "English"],
    currentOrder: null
  },
  {
    id: 3,
    name: "Amit Patel",
    phone: "+91 9876543212",
    vehicle: "Container Truck",
    vehicleNumber: "GJ03EF9012",
    rating: 4.5,
    status: "busy",
    location: { lat: 23.0225, lng: 72.5714 },
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
    completedDeliveries: 95,
    experience: "2 years",
    languages: ["Hindi", "Gujarati"],
    currentOrder: "ORD20231215001"
  },
  {
    id: 4,
    name: "Priya Singh",
    phone: "+91 9876543213",
    vehicle: "Refrigerated Truck",
    vehicleNumber: "KA04GH3456",
    rating: 4.7,
    status: "available",
    location: { lat: 12.9716, lng: 77.5946 },
    photo: "https://randomuser.me/api/portraits/women/22.jpg",
    completedDeliveries: 156,
    experience: "4 years",
    languages: ["Hindi", "Kannada", "English"],
    currentOrder: null
  },
  {
    id: 5,
    name: "Vikram Reddy",
    phone: "+91 9876543214",
    vehicle: "Trailer Truck",
    vehicleNumber: "TN05IJ7890",
    rating: 4.6,
    status: "offline",
    location: { lat: 13.0827, lng: 80.2707 },
    photo: "https://randomuser.me/api/portraits/men/45.jpg",
    completedDeliveries: 210,
    experience: "6 years",
    languages: ["Hindi", "Tamil", "English"],
    currentOrder: null
  },
  {
    id: 6,
    name: "Anjali Gupta",
    phone: "+91 9876543215",
    vehicle: "Tipper Truck",
    vehicleNumber: "UP06KL1234",
    rating: 4.8,
    status: "available",
    location: { lat: 26.8467, lng: 80.9462 },
    photo: "https://randomuser.me/api/portraits/women/33.jpg",
    completedDeliveries: 178,
    experience: "5 years",
    languages: ["Hindi", "English"],
    currentOrder: null
  },
  {
    id: 7,
    name: "Rahul Verma",
    phone: "+91 9876543216",
    vehicle: "Mini Van",
    vehicleNumber: "PB07MN5678",
    rating: 4.4,
    status: "busy",
    location: { lat: 30.7333, lng: 76.7794 },
    photo: "https://randomuser.me/api/portraits/men/28.jpg",
    completedDeliveries: 89,
    experience: "2 years",
    languages: ["Hindi", "Punjabi"],
    currentOrder: "ORD20231215002"
  },
  {
    id: 8,
    name: "Sneha Desai",
    phone: "+91 9876543217",
    vehicle: "Pickup Truck",
    vehicleNumber: "GJ08OP9012",
    rating: 4.9,
    status: "available",
    location: { lat: 21.1702, lng: 72.8311 },
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    completedDeliveries: 195,
    experience: "4 years",
    languages: ["Hindi", "Gujarati", "English"],
    currentOrder: null
  },
  {
    id: 9,
    name: "Karan Malhotra",
    phone: "+91 9876543218",
    vehicle: "Container Truck",
    vehicleNumber: "HR09QR3456",
    rating: 4.7,
    status: "available",
    location: { lat: 28.4595, lng: 77.0266 },
    photo: "https://randomuser.me/api/portraits/men/51.jpg",
    completedDeliveries: 132,
    experience: "3 years",
    languages: ["Hindi", "English"],
    currentOrder: null
  },
  {
    id: 10,
    name: "Meena Yadav",
    phone: "+91 9876543219",
    vehicle: "Refrigerated Truck",
    vehicleNumber: "RJ10ST7890",
    rating: 4.6,
    status: "available",
    location: { lat: 26.9124, lng: 75.7873 },
    photo: "https://randomuser.me/api/portraits/women/66.jpg",
    completedDeliveries: 167,
    experience: "4 years",
    languages: ["Hindi", "Rajasthani"],
    currentOrder: null
  }
];

// Sample Orders Data
export const fakeOrders = [
  {
    id: "ORD20231215001",
    trackingId: "#9876543210",
    customerName: "Vikram Singh",
    customerPhone: "+91 9876500001",
    from: {
      address: "123 MG Road, Connaught Place",
      city: "New Delhi",
      state: "Delhi",
      lat: 28.6292,
      lng: 77.2191
    },
    to: {
      address: "456 Park Street, Salt Lake",
      city: "Kolkata",
      state: "West Bengal",
      lat: 22.5726,
      lng: 88.3639
    },
    package: {
      weight: "15 kg",
      type: "Furniture",
      dimensions: "3x2x2 ft",
      description: "Wooden sofa set"
    },
    vehicle: "Mini Van",
    amount: 2450,
    status: "confirmed",
    timeline: [
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        time: "Today, 11:43 AM",
        completed: true,
        icon: "✅"
      },
      {
        status: "pickup_scheduled",
        title: "Pickup Scheduled",
        description: "Pickup scheduled for tomorrow",
        time: "Tomorrow, 9 AM - 12 PM",
        completed: false,
        icon: "📦"
      },
      {
        status: "in_transit",
        title: "In Transit",
        description: "Package is on the way",
        time: "Processing",
        completed: false,
        icon: "🚚"
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Package delivered successfully",
        time: "Estimated: Tue, 16 Dec",
        completed: false,
        icon: "🏠"
      }
    ],
    executiveId: 3,
    createdAt: "2023-12-15T11:43:00",
    estimatedDelivery: "2023-12-16T18:00:00",
    payment: {
      method: "UPI",
      status: "paid",
      transactionId: "TXN123456789"
    },
    distance: "1450 km",
    travelTime: "28 hours"
  },
  {
    id: "ORD20231214002",
    trackingId: "#9876500002",
    customerName: "Anita Rao",
    customerPhone: "+91 9876500002",
    from: {
      address: "789 Linking Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      lat: 19.0760,
      lng: 72.8777
    },
    to: {
      address: "321 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      lat: 12.9716,
      lng: 77.5946
    },
    package: {
      weight: "8 kg",
      type: "Electronics",
      dimensions: "2x1x1 ft",
      description: "Laptop and accessories"
    },
    vehicle: "Pickup Truck",
    amount: 1850,
    status: "in_transit",
    timeline: [
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        time: "Yesterday, 10:30 AM",
        completed: true,
        icon: "✅"
      },
      {
        status: "pickup_scheduled",
        title: "Pickup Scheduled",
        description: "Pickup completed successfully",
        time: "Yesterday, 2:00 PM",
        completed: true,
        icon: "📦"
      },
      {
        status: "in_transit",
        title: "In Transit",
        description: "Package is on the way",
        time: "Currently in Pune",
        completed: true,
        icon: "🚚"
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Expected delivery today",
        time: "Today, 4:00 PM",
        completed: false,
        icon: "🏠"
      }
    ],
    executiveId: 7,
    createdAt: "2023-12-14T10:30:00",
    estimatedDelivery: "2023-12-15T16:00:00",
    payment: {
      method: "Credit Card",
      status: "paid",
      transactionId: "TXN987654321"
    },
    distance: "980 km",
    travelTime: "18 hours"
  },
  {
    id: "ORD20231213003",
    trackingId: "#9876500003",
    customerName: "Ravi Shastri",
    customerPhone: "+91 9876500003",
    from: {
      address: "555 Anna Salai",
      city: "Chennai",
      state: "Tamil Nadu",
      lat: 13.0827,
      lng: 80.2707
    },
    to: {
      address: "777 Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      lat: 17.3850,
      lng: 78.4867
    },
    package: {
      weight: "25 kg",
      type: "Household",
      dimensions: "4x3x2 ft",
      description: "Kitchen appliances"
    },
    vehicle: "Container Truck",
    amount: 3200,
    status: "delivered",
    timeline: [
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        time: "13 Dec, 9:15 AM",
        completed: true,
        icon: "✅"
      },
      {
        status: "pickup_scheduled",
        title: "Pickup Scheduled",
        description: "Pickup completed",
        time: "13 Dec, 11:30 AM",
        completed: true,
        icon: "📦"
      },
      {
        status: "in_transit",
        title: "In Transit",
        description: "Package delivered to Hyderabad",
        time: "14 Dec, 3:45 PM",
        completed: true,
        icon: "🚚"
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Package delivered successfully",
        time: "14 Dec, 5:20 PM",
        completed: true,
        icon: "🏠"
      }
    ],
    executiveId: 5,
    createdAt: "2023-12-13T09:15:00",
    deliveredAt: "2023-12-14T17:20:00",
    payment: {
      method: "Cash on Delivery",
      status: "paid",
      transactionId: "TXN456789123"
    },
    distance: "625 km",
    travelTime: "12 hours",
    rating: 5
  },
  {
    id: "ORD20231215004",
    trackingId: "#9876500004",
    customerName: "Priya Menon",
    customerPhone: "+91 9876500004",
    from: {
      address: "222 JLN Marg",
      city: "Jaipur",
      state: "Rajasthan",
      lat: 26.9124,
      lng: 75.7873
    },
    to: {
      address: "444 Sector 18",
      city: "Noida",
      state: "Uttar Pradesh",
      lat: 28.5355,
      lng: 77.3910
    },
    package: {
      weight: "12 kg",
      type: "Documents",
      dimensions: "1x1x0.5 ft",
      description: "Important office files"
    },
    vehicle: "Mini Van",
    amount: 1650,
    status: "pickup_scheduled",
    timeline: [
      {
        status: "confirmed",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        time: "Today, 2:15 PM",
        completed: true,
        icon: "✅"
      },
      {
        status: "pickup_scheduled",
        title: "Pickup Scheduled",
        description: "Pickup scheduled for today",
        time: "Today, 5:00 PM - 7:00 PM",
        completed: false,
        icon: "📦"
      },
      {
        status: "in_transit",
        title: "In Transit",
        description: "Package will be dispatched tonight",
        time: "Tomorrow morning",
        completed: false,
        icon: "🚚"
      },
      {
        status: "delivered",
        title: "Delivered",
        description: "Expected delivery tomorrow",
        time: "Estimated: 16 Dec, 2:00 PM",
        completed: false,
        icon: "🏠"
      }
    ],
    executiveId: null,
    createdAt: "2023-12-15T14:15:00",
    estimatedDelivery: "2023-12-16T14:00:00",
    payment: {
      method: "UPI",
      status: "paid",
      transactionId: "TXN789123456"
    },
    distance: "250 km",
    travelTime: "6 hours"
  }
];

// Indian Cities Coordinates
export const indianCities = {
  delhi: { lat: 28.6139, lng: 77.2090, name: "Delhi" },
  mumbai: { lat: 19.0760, lng: 72.8777, name: "Mumbai" },
  chennai: { lat: 13.0827, lng: 80.2707, name: "Chennai" },
  bangalore: { lat: 12.9716, lng: 77.5946, name: "Bangalore" },
  kolkata: { lat: 22.5726, lng: 88.3639, name: "Kolkata" },
  hyderabad: { lat: 17.3850, lng: 78.4867, name: "Hyderabad" },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: "Ahmedabad" },
  pune: { lat: 18.5204, lng: 73.8567, name: "Pune" },
  jaipur: { lat: 26.9124, lng: 75.7873, name: "Jaipur" },
  lucknow: { lat: 26.8467, lng: 80.9462, name: "Lucknow" }
};

// Status Colors
export const statusColors = {
  confirmed: "#3B82F6",    // Blue
  pickup_scheduled: "#F59E0B", // Orange
  in_transit: "#8B5CF6",   // Purple
  delivered: "#10B981",    // Green
  cancelled: "#EF4444"     // Red
};

// Status Icons
export const statusIcons = {
  confirmed: "✅",
  pickup_scheduled: "📦",
  in_transit: "🚚",
  delivered: "🏠",
  cancelled: "❌"
};

// Generate Tracking ID from phone number
export const generateTrackingId = (phoneNumber) => {
  if (!phoneNumber) return "#" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
  return `#${cleanPhone}`;
};

// Get random executive
export const getRandomExecutive = () => {
  const availableExecs = fakeExecutives.filter(exec => exec.status === "available");
  if (availableExecs.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableExecs.length);
  return availableExecs[randomIndex];
};

// Find executive by ID
export const getExecutiveById = (id) => {
  return fakeExecutives.find(exec => exec.id === id);
};

// Calculate time difference
export const calculateTimeRemaining = (deliveryTime) => {
  const now = new Date();
  const delivery = new Date(deliveryTime);
  const diff = delivery - now;
  
  if (diff <= 0) return { hours: 0, minutes: 0, status: 'delayed' };
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { hours, minutes, status: hours < 2 ? 'urgent' : 'normal' };
};

// Get status text
export const getStatusText = (status) => {
  const statusMap = {
    confirmed: "Order Confirmed",
    pickup_scheduled: "Pickup Scheduled",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };
  return statusMap[status] || status;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get order progress percentage
export const getOrderProgress = (timeline) => {
  if (!timeline || !Array.isArray(timeline)) return 0;
  const completedSteps = timeline.filter(step => step.completed).length;
  return Math.round((completedSteps / timeline.length) * 100);
};

// Export everything
const FakeData = () => null; // React component for JSX file
export default FakeData;