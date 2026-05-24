import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, Clock, Palette } from 'lucide-react';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);

  const imageSet1 = [
    { id: 1, src: '/assets/hero.jpg', alt: 'Bordado tradicional 1', position: 'top' },
    { id: 2, src: '/assets/hero.jpg', alt: 'Bordado tradicional 2', position: 'left' },
    { id: 3, src: '/assets/hero.jpg', alt: 'Bordado tradicional 3', position: 'right' },
  ];

  const imageSet2 = [
    { id: 4, src: '/assets/hero2.jpg', alt: 'Bordado tradicional 4', position: 'top' },
    { id: 5, src: '/assets/hero2.jpg', alt: 'Bordado tradicional 5', position: 'left' },
    { id: 6, src: '/assets/hero2.jpg', alt: 'Bordado tradicional 6', position: 'right' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 90);
      
    
      setTimeout(() => {
        setCurrentSet(prev => prev === 1 ? 2 : 1);
      
        setTimeout(() => {
          setRotation(0);
        }, 400);
      }, 200);
      
    }, 15000); // 15 segundos

    return () => clearInterval(interval);
  }, []);

  const goToCatalog = () => {
    navigate('/catalogo');
  };

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
          <button className={styles.ctaButton} onClick={goToCatalog}>
            Explorar Catálogo
            <ChevronRight size={20} />
          </button>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3>Calidad Garantizada</h3>
                <p>Bordados duraderos y de alta calidad</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Clock size={24} />
              </div>
              <div>
                <h3>Atención Rápida</h3>
                <p>Respondemos tus mensajes lo antes posible</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <Palette size={24} />
              </div>
              <div>
                <h3>Personalizaciones</h3>
                <p>Solicita estilos únicos a tu medida</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.carouselContainer}>
          <div 
            className={styles.pyramidWrapper}
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            <div className={styles.pyramid}>

              <div className={`${styles.imageCard} ${styles.topImage}`}>
                <img 
                  src={currentImages.find(img => img.position === 'top')?.src}
                  alt={currentImages.find(img => img.position === 'top')?.alt}
                />
              </div>
              
          
              <div className={`${styles.imageCard} ${styles.leftImage}`}>
                <img 
                  src={currentImages.find(img => img.position === 'left')?.src}
                  alt={currentImages.find(img => img.position === 'left')?.alt}
                />
              </div>
              
     
              <div className={`${styles.imageCard} ${styles.rightImage}`}>
                <img 
                  src={currentImages.find(img => img.position === 'right')?.src}
                  alt={currentImages.find(img => img.position === 'right')?.alt}
                />
              </div>
            </div>
          </div>
          
       
          <div className={styles.timerIndicator}>
            <div className={styles.timerBar}>
              <div className={styles.timerProgress}></div>
            </div>
            <p className={styles.timerText}>Cambiando en 15 segundos</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;