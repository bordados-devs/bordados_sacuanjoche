// pages/home/Home.jsx
import React from 'react';
import HeroSection from '../../components/sections/hero/HeroSection';
import AboutSection from '../../components/sections/about/AboutSection';
import FeaturesSection from '../../components/sections/features/FeaturesSection';
import StatsSection from '../../components/sections/stats/StatsSection';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;