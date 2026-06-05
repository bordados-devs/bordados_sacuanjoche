import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Clock, Palette, Users, Truck, Heart } from 'lucide-react';
import styles from './HeroSection.module.css';

// Extracted OptimizedImage component to avoid hooks inside callbacks
const OptimizedImage = ({ image, priority, onLoad }) => {
  const [imgError, setImgError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef(null);
  
  useEffect(() => {
    if (priority && imageRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.complete) {
                setLoaded(true);
                if (onLoad) onLoad(image.id);
              }
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      observer.observe(imageRef.current);
      return () => observer.disconnect();
    }
  }, [priority, image.id, onLoad]);
  
  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad(image.id);
  };
  
  return (
    <div className={`${styles.imageCard} ${styles[`${image.position}Image`]}`}>
      <img 
        ref={imageRef}
        src={image.src}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={() => setImgError(true)}
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
          transform: 'translateZ(0)'
        }}
        width="400"
        height="400"
      />
      {(!loaded || imgError) && <div className={styles.imagePlaceholder} aria-hidden="true" />}
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [currentSet, setCurrentSet] = useState(1); // Fixed: added equals sign
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [counts, setCounts] = useState({
    clients: 0,
    products: 0,
    satisfaction: 0
  });
  const rotationIntervalRef = useRef(null);
  const rotationTimeoutRef = useRef(null);

  // Imágenes en .avif - sin cambios
  const imageSet1 = useMemo(() => [
    { id: 1, src: '/assets/imagenes/secciones/hero/hero.avif', alt: 'Bordado tradicional - arte textil nicaragüense', position: 'top', priority: true },
    { id: 2, src: '/assets/imagenes/secciones/hero/hero2.avif', alt: 'Detalle de bordado artesanal', position: 'left', priority: false },
    { id: 3, src: '/assets/imagenes/secciones/hero/hero3.avif', alt: 'Arte en bordado tradicional', position: 'right', priority: false },
  ], []);

  const imageSet2 = useMemo(() => [
    { id: 4, src: '/assets/imagenes/secciones/hero/hero2.avif', alt: 'Bordado personalizado de alta calidad', position: 'top', priority: false },
    { id: 5, src: '/assets/imagenes/secciones/hero/hero3.avif', alt: 'Diseños exclusivos en bordado', position: 'left', priority: false },
    { id: 6, src: '/assets/imagenes/secciones/hero/hero.avif', alt: 'Artesanía nicaragüense moderna', position: 'right', priority: false },
  ], []);

  const statsData = [
    { id: 'clients', number: 500, label: "Clientes", suffix: "+", icon: <Users size={24} aria-hidden="true" /> },
    { id: 'products', number: 1000, label: "Productos", suffix: "+", icon: <Truck size={24} aria-hidden="true" /> },
    { id: 'satisfaction', number: 99, label: "Satisfacción", suffix: "%", icon: <Heart size={24} aria-hidden="true" /> }
  ];

  // Contador de stats optimizado
  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      if (start === end) return;
      const range = end - start;
      const startTime = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(start + (range * easeOutQuad));
        setter(current);
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      
      requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          statsData.forEach(stat => {
            animateValue(0, stat.number, 2000, (value) => {
              setCounts(prev => ({ ...prev, [stat.id]: value }));
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const statsElement = document.querySelector(`.${styles.statsWrapper}`);
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  // Rotación de imágenes optimizada
  useEffect(() => {
    let isActive = true;
    
    const rotateImages = () => {
      if (!isActive) return;
      
      setRotation(prev => prev + 90);
      
      rotationTimeoutRef.current = setTimeout(() => {
        if (isActive) {
          setCurrentSet(prev => prev === 1 ? 2 : 1);
          setTimeout(() => {
            if (isActive) {
              setRotation(0);
            }
          }, 350);
        }
      }, 200);
    };
    
    rotationIntervalRef.current = setInterval(rotateImages, 15000);
    
    return () => {
      isActive = false;
      if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
      if (rotationTimeoutRef.current) clearTimeout(rotationTimeoutRef.current);
    };
  }, []);

  const handleImageLoad = useCallback((imageId) => {
    setImagesLoaded(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const goToCatalog = useCallback(() => {
    navigate('/catalogo');
  }, [navigate]);

  const currentImages = currentSet === 1 ? imageSet1 : imageSet2;

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

          <div className={styles.statsWrapper}>
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
              transition: rotation !== 0 ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
            aria-label="Galería de bordados rotativa"
          >
            <div className={styles.pyramid}>
              {currentImages.map((image) => (
                <OptimizedImage 
                  key={image.id} 
                  image={image} 
                  priority={image.priority}
                  onLoad={handleImageLoad}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;