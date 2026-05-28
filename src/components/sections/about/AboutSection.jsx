// components/sections/about/AboutSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Heart } from 'lucide-react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutContent}>
            <span className={styles.sectionTag}>Sobre Nosotros</span>
            <h2 className={styles.sectionTitle}>
              Arte Tradicional con <span className={styles.highlight}>Tecnología Moderna</span>
            </h2>
            <p className={styles.aboutDescription}>
              Bordados Sacuanjoche nace del amor por el arte tradicional del bordado y la cultura nicaragüense. 
              Nuestro nombre honra la flor nacional de Nicaragua, la <strong>Sacuanjoche</strong> (Plumeria), 
              símbolo de belleza, tradición y delicadeza.
            </p>
            <p className={styles.aboutDescription}>
              Desde nuestros inicios, nos hemos dedicado a preservar las técnicas tradicionales de bordado mientras 
              incorporamos tecnología moderna para crear piezas únicas que cuentan historias. Cada bordado es una obra 
              de arte que refleja la riqueza cultural de Nicaragua.
            </p>
            
            <div className={styles.aboutHighlights}>
              <div className={styles.highlightItem}>
                <Award size={28} className={styles.highlightIcon} />
                <div>
                  <h4>+10 años de experiencia</h4>
                  <p>Perfeccionando el arte del bordado</p>
                </div>
              </div>
              <div className={styles.highlightItem}>
                <Heart size={28} className={styles.highlightIcon} />
                <div>
                  <h4>Hecho con amor</h4>
                  <p>Artesanos locales comprometidos</p>
                </div>
              </div>
            </div>

            <button className={styles.aboutButton} onClick={() => navigate('/nosotros')}>
              Conoce más sobre nosotros
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className={styles.aboutImage}>
            <div className={styles.imageGrid}>
              <img 
                src="/assets/about1.jpg" 
                alt="Artesana bordando" 
                className={styles.gridImage1}
                loading="lazy"
              />
              <img 
                src="/assets/about2.jpg" 
                alt="Materiales de bordado" 
                className={styles.gridImage2}
                loading="lazy"
              />
              <img 
                src="/assets/about3.jpg" 
                alt="Producto terminado" 
                className={styles.gridImage3}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;