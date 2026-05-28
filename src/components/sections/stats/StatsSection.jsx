// components/sections/stats/StatsSection.jsx
import React, { useState, useEffect } from 'react';
import { Users, Truck, Palette, Heart } from 'lucide-react';
import styles from './StatsSection.module.css';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    clients: 0,
    products: 0,
    designs: 0,
    satisfaction: 0
  });

  const stats = [
    { id: 'clients', number: 500, label: "Clientes Satisfechos", icon: <Users size={32} />, suffix: "+" },
    { id: 'products', number: 1000, label: "Productos Entregados", icon: <Truck size={32} />, suffix: "+" },
    { id: 'designs', number: 50, label: "Diseños Exclusivos", icon: <Palette size={32} />, suffix: "+" },
    { id: 'satisfaction', number: 99, label: "Recomendación", icon: <Heart size={32} />, suffix: "%" }
  ];

  useEffect(() => {
    const animateNumbers = () => {
      stats.forEach(stat => {
        let start = 0;
        const end = stat.number;
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setCounts(prev => ({
            ...prev,
            [stat.id]: Math.floor(start)
          }));
        }, 16);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateNumbers();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const section = document.querySelector('.stats-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`stats-section ${styles.statsSection}`}>
      <div className={styles.container}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.id} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statNumber}>
                {counts[stat.id]}{stat.suffix}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;