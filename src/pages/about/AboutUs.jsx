import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FiHeart, 
  FiUsers, 
  FiAward, 
  FiClock, 
  FiTrendingUp, 
  FiShield,
  FiMapPin,
  FiGlobe,
  FiThumbsUp,
  FiMessageCircle,
  FiStar
} from 'react-icons/fi';
import { GiSewingNeedle, GiThread, GiEmbroidery, GiSewingMachine, GiClothes, GiLeatherBoot, GiNeedle, GiNeedleJaws } from 'react-icons/gi';
import { FaMale, FaFemale, FaChild, FaHandsHelping, FaStar } from 'react-icons/fa';
import { IoMdHammer } from 'react-icons/io';
import styles from './AboutUs.module.css';

// Animated Section Component
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className={styles.animatedSection}
    >
      {children}
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <motion.div 
      className={styles.featureCard}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.featureIcon} style={{ background: color }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
};

// Team Member Card
const TeamMember = ({ name, role, description, icon, color }) => {
  return (
    <motion.div 
      className={styles.teamCard}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.teamIcon} style={{ background: color }}>
        {icon}
      </div>
      <h3>{name}</h3>
      <p className={styles.teamRole}>{role}</p>
      <p className={styles.teamDescription}>{description}</p>
    </motion.div>
  );
};

// Stat Counter Component
const StatCounter = ({ target, label, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className={styles.statCard}>
      <div className={styles.statNumber}>{prefix}{count}{suffix}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
};

const AboutUs = () => {
  const [backgroundElements, setBackgroundElements] = useState([]);

  // Generate mixed feminine and masculine background elements
  useEffect(() => {
    const elements = [
      { icon: '🌸', type: 'feminine' }, { icon: '🌼', type: 'feminine' },
      { icon: '🌺', type: 'feminine' }, { icon: '🌻', type: 'feminine' },
      { icon: '⚡', type: 'masculine' }, { icon: '🔨', type: 'masculine' },
      { icon: '🪡', type: 'neutral' }, { icon: '🧵', type: 'neutral' },
      { icon: '⭐', type: 'masculine' }, { icon: '💪', type: 'masculine' },
      { icon: '🌿', type: 'neutral' }, { icon: '🔥', type: 'masculine' },
      { icon: '✨', type: 'feminine' }, { icon: '🦋', type: 'feminine' }
    ];
    
    const generated = [];
    for (let i = 0; i < 30; i++) {
      const randomEl = elements[Math.floor(Math.random() * elements.length)];
      generated.push({
        id: i,
        icon: randomEl.icon,
        type: randomEl.type,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 10,
        size: 0.8 + Math.random() * 1.5,
        opacity: 0.08 + Math.random() * 0.1
      });
    }
    setBackgroundElements(generated);
  }, []);

  const features = [
    { icon: <FiHeart size={28} />, title: "Pasión por el Arte", description: "Cada bordado es creado con dedicación y amor por nuestras tradiciones.", color: "#E74C3C" },
    { icon: <GiSewingNeedle size={28} />, title: "Técnicas Ancestrales", description: "Preservamos métodos tradicionales de bordado transmitidos por generaciones.", color: "#8B5E3C" },
    { icon: <FiAward size={28} />, title: "Calidad Garantizada", description: "Materiales premium y acabados impecables en cada pieza.", color: "#F39C12" },
    { icon: <FiUsers size={28} />, title: "Atención Personalizada", description: "Nos adaptamos a tus gustos y necesidades específicas.", color: "#27AE60" },
    { icon: <GiClothes size={28} />, title: "Diseños Únicos", description: "Creamos piezas exclusivas que no encontrarás en ningún otro lugar.", color: "#3498DB" },
    { icon: <FiClock size={28} />, title: "Entrega Puntual", description: "Respetamos los tiempos acordados para tu satisfacción.", color: "#9B59B6" }
  ];

  const team = [
    { name: "María González", role: "Maestra Bordadora", description: "20 años de experiencia en bordado tradicional nicaragüense.", icon: <FaFemale size={32} />, color: "#E74C3C" },
    { name: "Carlos Rodríguez", role: "Diseñador", description: "Especialista en diseños contemporáneos y personalizados.", icon: <FaMale size={32} />, color: "#3498DB" },
    { name: "Ana Martínez", role: "Artesana Senior", description: "Experta en técnicas de bordado a mano y materiales.", icon: <FaFemale size={32} />, color: "#9B59B6" },
    { name: "José Pérez", role: "Control de Calidad", description: "Garantiza que cada producto cumpla los más altos estándares.", icon: <FaMale size={32} />, color: "#27AE60" }
  ];

  return (
    <div className={styles.aboutUs}>
      {/* Mixed Background Elements */}
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

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.heroTitle}>
              Arte en Bordados
              <span className={styles.heroAccent}>Para Todos</span>
            </h1>
            <p className={styles.heroSubtitle}>
              En Bordados Sacuanjoche, combinamos tradición y modernidad para crear piezas únicas 
              que reflejan la riqueza cultural de Nicaragua, adaptadas para mujeres, hombres y niños.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVision}>
        <div className={styles.container}>
          <AnimatedSection>
            <div className={styles.missionCard}>
              <div className={styles.missionIcon}>
                <FiGlobe size={48} />
              </div>
              <h2>Nuestra Misión</h2>
              <p>Preservar y difundir el arte del bordado tradicional nicaragüense, creando piezas de alta calidad que conecten a las personas con nuestras raíces culturales, adaptándonos a los gustos y necesidades de todos.</p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <div className={styles.visionCard}>
              <div className={styles.visionIcon}>
                <FiTrendingUp size={48} />
              </div>
              <h2>Nuestra Visión</h2>
              <p>Ser reconocidos como el principal referente en bordados artesanales de Nicaragua, expandiendo nuestro arte a nivel internacional y promoviendo el talento local.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values / Features */}
      <section className={styles.features}>
        <div className={styles.container}>
          <AnimatedSection>
            <h2 className={styles.sectionTitle}>¿Qué Nos Hace Únicos?</h2>
            <p className={styles.sectionSubtitle}>Descubre los valores que nos inspiran</p>
          </AnimatedSection>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <FeatureCard {...feature} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      
      {/* Why Choose Us */}
      <section className={styles.whyChoose}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <AnimatedSection>
              <div className={styles.whyContent}>
                <h2>¿Por Qué Elegirnos?</h2>
                <ul className={styles.whyList}>
                  <li><FiThumbsUp /> Calidad excepcional en cada pieza</li>
                  <li><FiShield /> Materiales premium y duraderos</li>
                  <li><FiMessageCircle /> Atención personalizada y cercana</li>
                  <li><FiClock /> Entregas puntuales y confiables</li>
                  <li><FaHandsHelping /> Apoyo a artesanos locales</li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className={styles.whySvg}>
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="180" fill="#F3EBE1" stroke="#8B5E3C" strokeWidth="3"/>
                  <path d="M200,50 Q260,100 280,180 Q300,260 250,320 Q200,350 150,320 Q100,260 120,180 Q140,100 200,50Z" fill="#FFF9E6" stroke="#FFC107" strokeWidth="3"/>
                  <path d="M200,80 L220,150 L290,160 L240,210 L260,280 L200,240 L140,280 L160,210 L110,160 L180,150 Z" fill="#8B5E3C" opacity="0.3"/>
                  <circle cx="200" cy="200" r="60" fill="none" stroke="#D32F2F" strokeWidth="2" strokeDasharray="5,5"/>
                  <path d="M170,200 L230,200 M200,170 L200,230" stroke="#D32F2F" strokeWidth="2"/>
                  <circle cx="200" cy="200" r="20" fill="#FFC107" opacity="0.5"/>
                </svg>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <AnimatedSection>
            <div className={styles.ctaContent}>
              <h2>¿Listo para una pieza única?</h2>
              <p>Contáctanos y comencemos a crear tu diseño personalizado</p>
              <button className={styles.ctaButton} onClick={() => window.location.href = '/personalizaciones'}>
                Solicita tu Producto Personalizado
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;