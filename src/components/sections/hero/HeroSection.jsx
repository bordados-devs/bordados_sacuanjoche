import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Clock, Palette, Users, Truck, Heart } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [counts, setCounts] = useState({
    clients: 0,
    products: 0,
    satisfaction: 0
  });
  const animationRef = useRef(null);
  const timeoutRef = useRef(null);
  const [floatingElements, setFloatingElements] = useState([]);

  // Generate floating flowers and embroidery elements
  useEffect(() => {
    const elements = [
      { id: 1, icon: '🌸', left: '10%', top: '20%', duration: '12s', delay: '0s', size: '1.5rem' },
      { id: 2, icon: '🌼', left: '85%', top: '15%', duration: '15s', delay: '2s', size: '1.8rem' },
      { id: 3, icon: '🌺', left: '20%', top: '70%', duration: '18s', delay: '1s', size: '1.3rem' },
      { id: 4, icon: '🌻', left: '75%', top: '80%', duration: '14s', delay: '3s', size: '1.6rem' },
      { id: 5, icon: '🪡', left: '5%', top: '40%', duration: '20s', delay: '5s', size: '2rem' },
      { id: 6, icon: '🧵', left: '92%', top: '50%', duration: '17s', delay: '1.5s', size: '1.8rem' },
      { id: 7, icon: '🌸', left: '30%', top: '10%', duration: '13s', delay: '4s', size: '1.2rem' },
      { id: 8, icon: '🌷', left: '60%', top: '85%', duration: '16s', delay: '2.5s', size: '1.4rem' },
      { id: 9, icon: '🪡', left: '15%', top: '60%', duration: '19s', delay: '6s', size: '1.5rem' },
      { id: 10, icon: '🌼', left: '88%', top: '30%', duration: '11s', delay: '3.5s', size: '1.7rem' },
    ];
    setFloatingElements(elements);
  }, []);

  // Imágenes optimizadas
  const imageSet1 = useMemo(() => [
    { id: 1, src: '/assets/imagenes/secciones/hero/hero-principal.avif', alt: 'Bordado tradicional - arte textil nicaragüense', position: 'top', priority: true },
    { id: 2, src: '/assets/imagenes/secciones/hero/hero2.avif', alt: 'Detalle de bordado artesanal', position: 'left', priority: false },
    { id: 3, src: '/assets/imagenes/secciones/hero/hero3.avif', alt: 'Arte en bordado tradicional', position: 'right', priority: false },
  ], []);

  const imageSet2 = useMemo(() => [
    { id: 4, src: '/assets/imagenes/secciones/hero/hero.avif', alt: 'Bordado personalizado de alta calidad', position: 'top', priority: false },
    { id: 5, src: '/assets/imagenes/secciones/hero/hero3.avif', alt: 'Diseños exclusivos en bordado', position: 'left', priority: false },
    { id: 6, src: '/assets/imagenes/secciones/hero/hero2.avif', alt: 'Artesanía nicaragüense moderna', position: 'right', priority: false },
  ], []);

  const statsData = [
    { id: 'clients', number: 500, label: "Clientes", suffix: "+", icon: <Users size={24} aria-hidden="true" /> },
    { id: 'products', number: 1000, label: "Productos", suffix: "+", icon: <Truck size={24} aria-hidden="true" /> },
    { id: 'satisfaction', number: 99, label: "Satisfacción", suffix: "%", icon: <Heart size={24} aria-hidden="true" /> }
  ];

  // Contador de stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statsData.forEach(stat => {
            let start = 0;
            const end = stat.number;
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = end / steps;
            
            let currentStep = 0;
            const timer = setInterval(() => {
              currentStep++;
              start += increment;
              if (currentStep >= steps) {
                start = end;
                clearInterval(timer);
              }
              setCounts(prev => ({
                ...prev,
                [stat.id]: Math.floor(start)
              }));
            }, stepTime);
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

  // Rotación de imágenes
  useEffect(() => {
    let isActive = true;
    
    const rotateImages = () => {
      if (!isActive) return;
      
      setIsAnimating(true);
      setRotation(prev => prev + 90);
      
      timeoutRef.current = setTimeout(() => {
        if (isActive) {
          setCurrentSet(prev => prev === 1 ? 2 : 1);
          
          setTimeout(() => {
            if (isActive) {
              setRotation(0);
              setIsAnimating(false);
            }
          }, 350);
        }
      }, 200);
      
      animationRef.current = setTimeout(rotateImages, 15000);
    };
    
    animationRef.current = setTimeout(rotateImages, 15000);
    
    return () => {
      isActive = false;
      if (animationRef.current) clearTimeout(animationRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const goToCatalog = useCallback(() => {
    navigate('/catalogo');
  }, [navigate]);

  const currentImages = currentSet === 1 ? imageSet1 : imageSet2;

  const handleImageLoad = useCallback((imageId) => {
    setImagesLoaded(prev => ({ ...prev, [imageId]: true }));
  }, []);

  return (
    <section className={styles.hero}>
      {/* Floating Elements */}
      <div className={styles.floatingContainer}>
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className={styles.floatingItem}
            style={{
              left: el.left,
              top: el.top,
              animationDuration: el.duration,
              animationDelay: el.delay,
              fontSize: el.size
            }}
          >
            {el.icon}
          </div>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Bordados que <span className={styles.highlight}>hacen la diferencia</span>
          </h1>
          <p className={styles.subtitle}>
            Explora nuestros productos de alta calidad ideales para cada ocasión
          </p>
          <button 
            className={styles.ctaButton} 
            onClick={goToCatalog}
            aria-label="Explorar catálogo de productos"
          >
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

          <div className={`hero-stats ${styles.statsWrapper}`}>
            <div className={styles.statsContainer}>
              {statsData.map((stat) => (
                <div key={stat.id} className={styles.statItem}>
                  <div className={styles.statIcon} aria-hidden="true">
                    {stat.icon}
                  </div>
                  <div 
                    className={styles.statNumber}
                    aria-label={`${stat.label}: ${counts[stat.id]}${stat.suffix}`}
                  >
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
            aria-label="Galería de bordados rotativa"
          >
            <div className={styles.pyramid}>
              {currentImages.map((image) => (
                <div 
                  key={image.id}
                  className={`${styles.imageCard} ${styles[`${image.position}Image`]}`}
                >
                  <img 
                    src={image.src}
                    alt={image.alt}
                    loading={image.priority ? "eager" : "lazy"}
                    fetchPriority={image.priority ? "high" : "auto"}
                    decoding="async"
                    onLoad={() => handleImageLoad(image.id)}
                    onError={(e) => {
                      e.target.style.opacity = '0.5';
                      e.target.style.backgroundColor = '#E1D2C1';
                    }}
                    style={{
                      opacity: imagesLoaded[image.id] ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out'
                    }}
                  />
                  {!imagesLoaded[image.id] && (
                    <div className={styles.imagePlaceholder} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;