import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiHeart,
  FiBookmark,
  FiStar,
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiLogOut,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useUserLibrary } from '../../context/UserLibraryContext';
import { useCart } from '../../context/CartContext';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import ProductCard from '../catalogo/ProductCard';
import ProductModal from '../catalogo/ProductModal';
import StarRating from '../../components/product/StarRating';
import styles from './Account.module.css';

const formatDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('es-NI', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return '';
  }
};

const Account = ({ initialMode = 'login' }) => {
  const { user, loading, isOwner, displayName, signIn, signUp, resendConfirmation, signOut } =
    useAuth();
  const { likedIds, savedIds, setupError, userReviews } = useUserLibrary();
  const { addToCart } = useCart();
  const { products, loading: catalogLoading } = useCatalogProducts();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectParam = searchParams.get('redirect');
  const redirectTo =
    redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
      ? redirectParam
      : '/cuenta';

  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(null);
  const [activeTab, setActiveTab] = useState('saved');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    setMode(initialMode === 'register' ? 'register' : 'login');
  }, [initialMode]);

  const savedProducts = useMemo(
    () => products.filter((product) => savedIds.has(String(product.id))),
    [products, savedIds]
  );

  const likedProducts = useMemo(
    () => products.filter((product) => likedIds.has(String(product.id))),
    [products, likedIds]
  );

  const ownReviews = useMemo(
    () =>
      [...userReviews].sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at || 0) -
          new Date(a.updated_at || a.created_at || 0)
      ),
    [userReviews]
  );

  const productsById = useMemo(() => {
    const map = {};
    products.forEach((product) => {
      map[String(product.id)] = product;
    });
    return map;
  }, [products]);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Completa tu correo y contraseña.');
      return;
    }

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (fullName.trim().length < 2) {
      toast.error('Escribe tu nombre completo.');
      return;
    }
    if (!email) {
      toast.error('Escribe tu correo electrónico.');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    const result = await signUp({ email, password, fullName });
    setSubmitting(false);

    if (!result.success) return;

    if (result.needsConfirmation) {
      setConfirmationSent(email.trim().toLowerCase());
      setPassword('');
      setConfirmPassword('');
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  const handleResend = async () => {
    if (!confirmationSent) return;
    setSubmitting(true);
    await resendConfirmation(confirmationSent);
    setSubmitting(false);
  };

  const handleQuickAdd = (product, size, color, quantity) => {
    addToCart(product, size, color, quantity);
    toast.success(`Agregado al carrito: ${product.title}`);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setConfirmationSent(null);
    setPassword('');
    setConfirmPassword('');
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.spinner} />
        <p>Cargando tu cuenta...</p>
      </div>
    );
  }

  /* ----------------------------- Dashboard ----------------------------- */
  if (user) {
    const initial = (displayName || user.email || 'C').charAt(0).toUpperCase();

    const tabs = [
      {
        id: 'saved',
        label: 'Guardados',
        icon: <FiBookmark size={16} />,
        count: savedProducts.length,
      },
      {
        id: 'liked',
        label: 'Me gusta',
        icon: <FiHeart size={16} />,
        count: likedProducts.length,
      },
      {
        id: 'reviews',
        label: 'Mis reseñas',
        icon: <FiStar size={16} />,
        count: ownReviews.length,
      },
    ];

    const activeProducts = activeTab === 'saved' ? savedProducts : likedProducts;

    return (
      <div className={styles.accountPage}>
        <Toaster position="top-right" />
        <div className={styles.dashboardContainer}>
          <header className={styles.profileCard}>
            <div className={styles.avatarLarge}>{initial}</div>
            <div className={styles.profileInfo}>
              <span className={styles.eyebrow}>Mi cuenta</span>
              <h1>{displayName}</h1>
              <p>{user.email}</p>
            </div>
            <div className={styles.profileActions}>
              {isOwner && (
                <Link to="/admin/inventario" className={styles.adminLink}>
                  Panel de administración
                </Link>
              )}
              <button
                type="button"
                className={styles.logoutButton}
                onClick={signOut}
              >
                <FiLogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </header>

          {setupError && (
            <div className={styles.setupNotice}>
              <FiAlertTriangle size={18} />
              <p>
                Las funciones de guardados, me gusta y reseñas aún no están
                activas. Aplica la migración SQL en Supabase para habilitarlas.
              </p>
            </div>
          )}

          <nav className={styles.tabs} aria-label="Secciones de mi cuenta">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.tab} ${
                  activeTab === tab.id ? styles.activeTab : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
                <span className={styles.tabCount}>{tab.count}</span>
              </button>
            ))}
          </nav>

          {activeTab === 'reviews' ? (
            <section className={styles.panel} aria-label="Mis reseñas">
              {ownReviews.length === 0 ? (
                <div className={styles.emptyState}>
                  <FiStar size={40} />
                  <h2>Todavía no has dejado reseñas</h2>
                  <p>
                    Califica los productos que ya conoces y ayuda a otros
                    clientes a elegir su próximo bordado.
                  </p>
                  <Link to="/catalogo" className={styles.primaryLink}>
                    Explorar catálogo
                  </Link>
                </div>
              ) : (
                <div className={styles.reviewList}>
                  {ownReviews.map((review) => {
                    const product = productsById[String(review.product_id)];
                    return (
                      <article key={review.id} className={styles.reviewRow}>
                        <div className={styles.reviewThumb}>
                          {product?.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} />
                          ) : (
                            <FiStar size={22} />
                          )}
                        </div>
                        <div className={styles.reviewBody}>
                          <div className={styles.reviewTop}>
                            <h3>{product?.title || 'Producto'}</h3>
                            <span className={styles.reviewDate}>
                              {formatDate(review.updated_at || review.created_at)}
                            </span>
                          </div>
                          <StarRating
                            value={Number(review.rating)}
                            readOnly
                            size={16}
                          />
                          {review.comment && (
                            <p className={styles.reviewComment}>{review.comment}</p>
                          )}
                          <div className={styles.reviewActions}>
                            {product && (
                              <button
                                type="button"
                                className={styles.textButton}
                                onClick={() => setSelectedProduct(product)}
                              >
                                Ver producto y editar
                              </button>
                            )}
                            <Link to="/catalogo" className={styles.textLink}>
                              Catálogo
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : (
            <section className={styles.panel} aria-label="Productos de mi cuenta">
              {catalogLoading ? (
                <div className={styles.loadingInline}>
                  <div className={styles.spinner} />
                  <p>Cargando productos...</p>
                </div>
              ) : activeProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  {activeTab === 'saved' ? (
                    <FiBookmark size={40} />
                  ) : (
                    <FiHeart size={40} />
                  )}
                  <h2>
                    {activeTab === 'saved'
                      ? 'No tienes productos guardados'
                      : 'Todavía no te gusta ningún producto'}
                  </h2>
                  <p>
                    {activeTab === 'saved'
                      ? 'Guarda tus bordados favoritos para encontrarlos fácilmente aquí.'
                      : 'Toca el corazón de los productos que más te gusten.'}
                  </p>
                  <Link to="/catalogo" className={styles.primaryLink}>
                    Explorar catálogo
                  </Link>
                </div>
              ) : (
                <div className={styles.productsGrid}>
                  {activeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onImageClick={() => setSelectedProduct(product)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleQuickAdd}
          />
        )}
      </div>
    );
  }

  /* --------------------------- Auth (login/register) --------------------------- */
  const isRegister = mode === 'register';

  return (
    <div className={styles.accountPage}>
      <Toaster position="top-right" />
      <div className={styles.authLayout}>
        <aside className={styles.authAside}>
          <img src="/assets/logo.avif" alt="Bordados Sacuanjoche" />
          <h2>Bordados con alma nicaragüense</h2>
          <p>
            Crea tu cuenta para guardar tus diseños favoritos, dar me gusta y
            compartir reseñas con otros clientes.
          </p>
          <ul className={styles.benefits}>
            <li>
              <FiHeart size={18} />
              Guarda y marca tus bordados favoritos
            </li>
            <li>
              <FiStar size={18} />
              Deja reseñas con estrellas
            </li>
            <li>
              <FiCheckCircle size={18} />
              Encuentra tus productos en un solo lugar
            </li>
          </ul>
        </aside>

        <div className={styles.authCard}>
          {confirmationSent ? (
            <div className={styles.confirmationBox}>
              <FiMail size={46} />
              <h1>Confirma tu correo</h1>
              <p>
                Te enviamos un enlace de confirmación a{' '}
                <strong>{confirmationSent}</strong>. Ábrelo para activar tu
                cuenta y luego inicia sesión.
              </p>
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleResend}
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Reenviar correo'}
              </button>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => {
                  setConfirmationSent(null);
                  setMode('login');
                }}
              >
                Ya confirmé mi correo, iniciar sesión
              </button>
            </div>
          ) : (
            <>
              <div className={styles.authHeader}>
                <span className={styles.eyebrow}>
                  {isRegister ? 'Crear cuenta' : 'Bienvenido de nuevo'}
                </span>
                <h1>{isRegister ? 'Únete a Sacuanjoche' : 'Inicia sesión'}</h1>
                <p>
                  {isRegister
                    ? 'Regístrate para guardar productos y dejar tus reseñas.'
                    : 'Accede a tus productos guardados, me gusta y reseñas.'}
                </p>
              </div>

              <div className={styles.modeSwitch}>
                <button
                  type="button"
                  className={!isRegister ? styles.activeMode : ''}
                  onClick={() => switchMode('login')}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className={isRegister ? styles.activeMode : ''}
                  onClick={() => switchMode('register')}
                >
                  Crear cuenta
                </button>
              </div>

              <form
                className={styles.form}
                onSubmit={isRegister ? handleRegister : handleLogin}
              >
                {isRegister && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="fullName">Nombre completo</label>
                    <div className={styles.inputWrapper}>
                      <FiUser className={styles.inputIcon} />
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="María López"
                        autoComplete="name"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label htmlFor="accountEmail">Correo electrónico</label>
                  <div className={styles.inputWrapper}>
                    <FiMail className={styles.inputIcon} />
                    <input
                      id="accountEmail"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="tu@correo.com"
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="accountPassword">Contraseña</label>
                  <div className={styles.inputWrapper}>
                    <FiLock className={styles.inputIcon} />
                    <input
                      id="accountPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {isRegister && (
                  <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <div className={styles.inputWrapper}>
                      <FiLock className={styles.inputIcon} />
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting
                    ? 'Procesando...'
                    : isRegister
                    ? 'Crear mi cuenta'
                    : 'Iniciar sesión'}
                </button>
              </form>

              <p className={styles.authFooter}>
                ¿Eres el administrador?{' '}
                <Link to="/login">Ir al panel de administración</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
