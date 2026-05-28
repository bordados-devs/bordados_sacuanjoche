// components/sections/features/FeaturesSection.jsx
import React, { useState, useEffect } from 'react';
import { Star, Palette, Truck, Shield, Award, Clock, Heart, Sparkles } from 'lucide-react';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const [isVisible, setIsVisible] = useState({});

  const features = [
    {
      icon: <Star className={styles.featureIconSvg} />,
      title: "Calidad Premium",
      description: "Materiales de primera calidad y acabados impecables en cada bordado",
      color: "#FFC107"
    },
    {
      icon: <Palette className={styles.featureIconSvg} />,
      title: "Diseños Únicos",
      description: "Creaciones exclusivas que no encontrarás en ningún otro lugar",
      color: "#A67C52"
    },
    {
      icon: <Truck className={styles.featureIconSvg} />,
      title: "Envíos a Todo el País",
      description: "Entregamos tus pedidos en cualquier rincón de Nicaragua",
      color: "#25D366"
    },
    {
      icon: <Shield className={styles.featureIconSvg} />,
      title: "Garantía de Calidad",
      description: "Aseguramos la durabilidad y belleza de cada producto",
      color: "#0288D1"
    },
    {
      icon: <Clock className={styles.featureIconSvg} />,
      title: "Atención Rápida",
      description: "Respondemos tus mensajes en menos de 24 horas",
      color: "#8B5E3C"
    },
    {
      icon: <Heart className={styles.featureIconSvg} />,
      title: "Atención Personalizada",
      description: "Te acompañamos en todo el proceso de compra",
      color: "#E4405F"
    },
    {
      icon: <Sparkles className={styles.featureIconSvg} />,
      title: "Técnicas Tradicionales",
      description: "Preservamos el arte del bordado tradicional",
      color: "#FFD366"
    },
    {
      icon: <Award className={styles.featureIconSvg} />,
      title: "Artesanos Locales",
      description: "Apoyamos el talento y trabajo local",
      color: "#2E7D32"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.feature-card');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>¿Por qué elegirnos?</span>
          <h2 className={styles.sectionTitle}>
            Razones para <span className={styles.highlight}>confiar en nosotros</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Calidad, tradición y servicio excepcional nos respaldan
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${styles.featureCard} ${isVisible[`feature-${index}`] ? styles.visible : ''}`}
              id={`feature-${index}`}
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <div 
                className={styles.featureIconWrapper}
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <div style={{ color: feature.color }}>
                  {feature.icon}
                </div>
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
              
              <div className={styles.featureHoverEffect}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;