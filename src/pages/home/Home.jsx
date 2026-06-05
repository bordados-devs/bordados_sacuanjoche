import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/sections/hero/HeroSection';
import AboutSection from '../../components/sections/about/AboutSection';
import FeaturesSection from '../../components/sections/features/FeaturesSection';
import StatsSection from '../../components/sections/stats/StatsSection';
import styles from './Home.module.css';

const Home = () => {
  const [backgroundFlowers, setBackgroundFlowers] = useState([]);

  // Generate background flowers for the whole page
  useEffect(() => {
    const flowers = ['🌸', '🌼', '🌺', '🌻', '🌷', '🌸', '🌼', '🌺'];
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push({
        id: i,
        icon: flowers[Math.floor(Math.random() * flowers.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 10,
        size: 1 + Math.random() * 2
      });
    }
    setBackgroundFlowers(elements);
  }, []);

  return (
    <div className={styles.home}>
      {/* Background Floating Flowers */}
      <div className={styles.flowerBackground}>
        {backgroundFlowers.map((flower) => (
          <div
            key={flower.id}
            className={styles.backgroundFlower}
            style={{
              left: `${flower.left}%`,
              top: `${flower.top}%`,
              animationDuration: `${flower.duration}s`,
              animationDelay: `${flower.delay}s`,
              fontSize: `${flower.size}rem`
            }}
          >
            {flower.icon}
          </div>
        ))}
      </div>

      {/* Embroidery Thread Decoration */}
      <div className={styles.embroideryThread}>
        <svg viewBox="0 0 200 200" className={styles.threadSvg}>
          <path d="M20,20 Q60,10 80,40 T120,60 T160,30" stroke="#8B5E3C" fill="none" strokeWidth="3" strokeDasharray="6,4"/>
          <circle cx="20" cy="20" r="4" fill="#FFC107"/>
          <circle cx="160" cy="30" r="3" fill="#D32F2F"/>
        </svg>
      </div>

      <HeroSection />
      <AboutSection />
      <FeaturesSection />
    </div>
  );
};

export default Home;