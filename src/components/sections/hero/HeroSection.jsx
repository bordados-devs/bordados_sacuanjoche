// components/sections/hero/HeroSection.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Clock, Palette, Users, Truck, Heart } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [imageErrors, setImageErrors] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [counts, setCounts] = useState({
    clients: 0,
    products: 0,
    satisfaction: 0
  });

  // Optimized image sets with WebP format and better quality
  const imageSet1 = useMemo(() => [
    { id: 1, src: '/assets/hero.webp', fallback: '/assets/hero.jpg', alt: 'Bordado tradicional - arte textil nicaragüense', position: 'top', priority: true },
    { id: 2, src: '/assets/hero-left.webp', fallback: '/assets/hero2.jpg', alt: 'Detalle de bordado artesanal', position: 'left', priority: false },
    { id: 3, src: '/assets/hero-right.webp', fallback: '/assets/hero2.jpg', alt: 'Arte en bordado tradicional', position: 'right', priority: false },
  ], []);

  const imageSet2 = useMemo(() => [
    { id: 4, src: '/assets/hero2.webp', fallback: '/assets/hero2.jpg', alt: 'Bordado personalizado de alta calidad', position: 'top', priority: false },
    { id: 5, src: '/assets/hero2-left.webp', fallback: '/assets/hero.jpg', alt: 'Diseños exclusivos en bordado', position: 'left', priority: false },
    { id: 6, src: '/assets/hero2-right.webp', fallback: '/assets/hero.jpg', alt: 'Artesanía nicaragüense moderna', position: 'right', priority: false },
  ], []);

  // Stats data for hero section
  const statsData = [
    { id: 'clients', number: 500, label: "Clientes", suffix: "+", icon: <Users size={24} /> },
    { id: 'products', number: 1000, label: "Productos", suffix: "+", icon: <Truck size={24} /> },
    { id: 'satisfaction', number: 99, label: "Satisfacción", suffix: "%", icon: <Heart size={24} /> }
  ];

  // Animate stats counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statsData.forEach(stat => {
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
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const statsElement = document.querySelector('.hero-stats');
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  // Optimized rotation animation with requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 15000; // 15 seconds
    const rotationDuration = 400; // 0.4 seconds for rotation

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Start rotation animation
        setIsAnimating(true);
        setRotation(prev => prev + 90);
        
        setTimeout(() => {
          setCurrentSet(prev => prev === 1 ? 2 : 1);
          setTimeout(() => {
            setRotation(0);
            setIsAnimating(false);
          }, rotationDuration - 50);
        }, 200);
        
        startTime = timestamp;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const goToCatalog = useCallback(() => {
    navigate('/catalogo');
  }, [navigate]);

  const currentImages = currentSet === 1 ? imageSet1 : imageSet2;

  const handleImageError = useCallback((imageId) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const getImageSrc = useCallback((image) => {
    if (imageErrors[image.id]) return image.fallback;
    return image.src;
  }, [imageErrors]);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Bordados que <span className={styles.highlight}>hacen la diferencia</span>
          </h1>
          <p className={styles.subtitle}>
            Explora nuestros productos de alta calidad ideales para cada ocasión
          </p>
          <button className={styles.ctaButton} onClick={goToCatalog}>
            Explorar Catálogo
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <Sparkles size={24} />
              </div>
              <div>
                <h3>Calidad Garantizada</h3>
                <p>Bordados duraderos y de alta calidad</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <Clock size={24} />
              </div>
              <div>
                <h3>Atención Rápida</h3>
                <p>Respondemos tus mensajes lo antes posible</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon} aria-hidden="true">
                <Palette size={24} />
              </div>
              <div>
                <h3>Personalizaciones</h3>
                <p>Solicita estilos únicos a tu medida</p>
              </div>
            </div>
          </div>

          {/* Stats Section Integrated */}
          <div className={`hero-stats ${styles.statsWrapper}`}>
            <div className={styles.statsContainer}>
              {statsData.map((stat) => (
                <div key={stat.id} className={styles.statItem}>
                  <div className={styles.statIcon} aria-hidden="true">
                    {stat.icon}
                  </div>
                  <div className={styles.statNumber}>
                    {counts[stat.id]}{stat.suffix}
                  </div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.carouselContainer}>
          <div 
            className={styles.pyramidWrapper}
            style={{ 
              transform: `rotateY(${rotation}deg)`,
              willChange: 'transform',
              transition: isAnimating ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          >
            <div className={styles.pyramid}>
              {currentImages.map((image) => (
                <div 
                  key={image.id}
                  className={`${styles.imageCard} ${styles[`${image.position}Image`]}`}
                >
                  <picture>
                    <source 
                      srcSet={getImageSrc(image)} 
                      type="image/webp"
                    />
                    <img 
                      src={image.fallback}
                      alt={image.alt}
                      loading={image.priority ? "eager" : "lazy"}
                      fetchPriority={image.priority ? "high" : "low"}
                      decoding="async"
                      onError={() => handleImageError(image.id)}
                      width="400"
                      height="400"
                    />
                  </picture>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timer indicator optimized */}
          <div className={styles.timerIndicator}>
            <div className={styles.timerBar}>
              <div className={styles.timerProgress} aria-label="Tiempo para próximo cambio de imagen"></div>
            </div>
            <p className={styles.timerText}>Inspiración rotando</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;