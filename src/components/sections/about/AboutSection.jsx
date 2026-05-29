// components/sections/about/AboutSection.jsx (Corregido - Pausa funciona)
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Heart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false); // Para saber si el usuario interactuó

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        // No actualizamos isPlaying aquí porque onPause lo hará
      } else {
        videoRef.current.play();
        // No actualizamos isPlaying aquí porque onPlay lo hará
      }
      setUserInteracted(true); // Marcamos que el usuario interactuó
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setUserInteracted(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  // Auto-play solo cuando el video es visible y el usuario NO ha interactuado
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Solo auto-play si el usuario no ha interactuado manualmente
          if (entry.isIntersecting && videoRef.current && !userInteracted && !isPlaying) {
            videoRef.current.play().catch(error => {
              console.log('Auto-play prevented:', error);
            });
          } 
          // No pausamos automáticamente cuando sale de vista si el usuario interactuó
          else if (!entry.isIntersecting && videoRef.current && isPlaying && !userInteracted) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, [userInteracted, isPlaying]);

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
          
          <div className={styles.aboutVideo}>
            <div className={styles.videoWrapper}>
              <video
                ref={videoRef}
                className={styles.video}
                onTimeUpdate={handleTimeUpdate}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleVideoEnd}
                loop={false}
                muted={isMuted}
                playsInline
                preload="metadata"
              >
                <source src="/assets/videos/marketing.mp4" type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>

              <div className={styles.videoControls}>
                <button
                  className={styles.controlButton}
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                    onClick={(e) => {
                      // Permitir saltar a cualquier parte del video
                      if (videoRef.current && videoRef.current.duration) {
                        const bar = e.currentTarget.parentElement;
                        const rect = bar.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        videoRef.current.currentTime = pos * videoRef.current.duration;
                      }
                    }}
                  />
                </div>
                
                <button
                  className={styles.controlButton}
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              {!isPlaying && (
                <button 
                  className={styles.playOverlay}
                  onClick={togglePlay}
                  aria-label="Reproducir video"
                >
                  <Play size={48} />
                </button>
              )}
            </div>
            
            <p className={styles.videoCaption}>
              Descubre el arte detrás de cada bordado - Proceso creativo de Bordados Sacuanjoche
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;