import React, { useState, useEffect } from 'react';
import HeroSection from '../../components/sections/hero/HeroSection';
import AboutSection from '../../components/sections/about/AboutSection';
import FeaturesSection from '../../components/sections/features/FeaturesSection';
import Direction from '../../components/sections/direction/Direccion';
import styles from './Home.module.css';

const Home = () => {
  const [backgroundElements, setBackgroundElements] = useState([]);

  // Generate mixed feminine and masculine background elements
  useEffect(() => {
    const elements = [
      // Feminine elements
      { icon: '🌸', type: 'feminine' }, { icon: '🌼', type: 'feminine' },
      { icon: '🌺', type: 'feminine' }, { icon: '🌻', type: 'feminine' },
      { icon: '🌷', type: 'feminine' }, { icon: '🪷', type: 'feminine' },
      { icon: '🦋', type: 'feminine' }, { icon: '✨', type: 'feminine' },
      // Masculine elements
      { icon: '⚡', type: 'masculine' }, { icon: '🔨', type: 'masculine' },
      { icon: '⭐', type: 'masculine' }, { icon: '💪', type: 'masculine' },
      { icon: '🔥', type: 'masculine' }, { icon: '⚙️', type: 'masculine' },
      { icon: '🎯', type: 'masculine' }, { icon: '🏆', type: 'masculine' },
      { icon: '🛡️', type: 'masculine' }, { icon: '⚔️', type: 'masculine' },
      // Neutral elements
      { icon: '🪡', type: 'neutral' }, { icon: '🧵', type: 'neutral' },
      { icon: '🌿', type: 'neutral' }, { icon: '🍃', type: 'neutral' }
    ];
    
    const generated = [];
    for (let i = 0; i < 35; i++) {
      const randomEl = elements[Math.floor(Math.random() * elements.length)];
      generated.push({
        id: i,
        icon: randomEl.icon,
        type: randomEl.type,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 12 + Math.random() * 20,
        delay: Math.random() * 12,
        size: 0.8 + Math.random() * 1.8,
        opacity: 0.06 + Math.random() * 0.1
      });
    }
    setBackgroundElements(generated);
  }, []);

  return (
    <div className={styles.home}>
      {/* Mixed Background Floating Elements */}
      <div className={styles.backgroundElements}>
        {backgroundElements.map((el) => (
          <div
            key={el.id}
            className={`${styles.backgroundElement} ${styles[el.type]}`}
            style={{
              left: `${el.left}%`,
              top: `${el.top}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              fontSize: `${el.size}rem`,
              opacity: el.opacity
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>

      {/* Embroidery Thread Decoration - Mixed colors */}
      <div className={styles.embroideryThread}>
        <svg viewBox="0 0 200 200" className={styles.threadSvg}>
          <path d="M20,20 Q60,10 80,40 T120,60 T160,30" stroke="#8B5E3C" fill="none" strokeWidth="3" strokeDasharray="6,4"/>
          <circle cx="20" cy="20" r="4" fill="#FFC107"/>
          <circle cx="160" cy="30" r="3" fill="#D32F2F"/>
          <path d="M30,170 Q70,180 90,150 T130,140 T170,160" stroke="#3498DB" fill="none" strokeWidth="2.5" strokeDasharray="4,4"/>
          <circle cx="170" cy="160" r="3" fill="#3498DB"/>
        </svg>
      </div>

      {/* Masculine Workshop Decoration */}
      <div className={styles.masculineDecoration}>
        <svg viewBox="0 0 100 100" className={styles.toolsSvg}>
          <path d="M30,70 L70,30" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round"/>
          <path d="M35,75 L75,35" stroke="#34495E" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="50" cy="50" r="8" stroke="#8B5E3C" strokeWidth="2" fill="none"/>
          <line x1="50" y1="42" x2="50" y2="30" stroke="#8B5E3C" strokeWidth="2"/>
          <line x1="50" y1="58" x2="50" y2="70" stroke="#8B5E3C" strokeWidth="2"/>
          <line x1="42" y1="50" x2="30" y2="50" stroke="#8B5E3C" strokeWidth="2"/>
          <line x1="58" y1="50" x2="70" y2="50" stroke="#8B5E3C" strokeWidth="2"/>
        </svg>
      </div>

      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Features Section */}
      <FeaturesSection />

      <Direction />

    </div>
  );
};

export default Home;