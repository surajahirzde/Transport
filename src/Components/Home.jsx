import React from 'react';
import Navbar from '../Helper/Navbar';
import Hero from '../Components/Hero'; 
import './styles/Home.css';
import Features from '../Components/Additional/Feature'; 

const Home = () => {
  return (
    <div className="homepage-container">
      {/* Only Hero for now */}
      <Hero />
      <Features />
      
  
    </div>
  );
};

export default Home;