import React from 'react';
import Navigation from '../components/Layout/Navigation';
import HeroCarousel from '../components/Layout/HeroCarousel';

const Home = () => {
  return (
    <div className="home-page">
      <Navigation />
      <main className="main">
        <HeroCarousel />
      </main>
    </div>
  );
};

export default Home;