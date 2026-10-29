import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const OWNER_EMAIL = 'sacuanjochepeleteria@gmail.com';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const getDisplayName = (currentUser) => {
  if (!currentUser) return '';
  const metaName =
    currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
  if (metaName && metaName.trim()) return metaName.trim();
  return currentUser.email?.split('@')[0] || 'Cliente';
};

const isEmailNotConfirmed = (error) =>
  error?.code === 'email_not_confirmed' ||
  /email not confirmed/i.test(error?.message || '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const applyUser = (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      setIsOwner(currentUser?.email === OWNER_EMAIL);
      setLoading(false);
    };

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      applyUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applyUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password, { adminOnly = false } = {}) => {
    const normalizedEmail = email.trim().toLowerCase();

    // El panel de administración sigue siendo exclusivo del dueño.
    if (adminOnly && normalizedEmail !== OWNER_EMAIL) {
      toast.error('Acceso no autorizado. Solo el administrador puede iniciar sesión.');
      return { success: false, error: 'Unauthorized access' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) throw error;

      toast.success(
        adminOnly
          ? 'Bienvenido, Administrador'
          : `Bienvenido de nuevo, ${getDisplayName(data.user)}`
      );
      return { success: true, data, user: data.user };
    } catch (error) {
      console.error('Login error:', error.message);

      if (isEmailNotConfirmed(error)) {
        toast.error('Debes confirmar tu correo electrónico antes de iniciar sesión.');
        return {
          success: false,
          error: error.message,
          needsConfirmation: true,
        };
      }

      toast.error(
        adminOnly
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : 'Correo o contraseña incorrectos.'
      );
      return { success: false, error: error.message };
    }
  };

  const signUp = async ({ email, password, fullName }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });

      if (error) throw error;

      // Supabase no devuelve error cuando el correo ya existe por seguridad,
      // pero sí deja el arreglo de identidades vacío.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        toast.error('Ya existe una cuenta con este correo. Inicia sesión.');
        return { success: false, error: 'already registered' };
      }

      const needsConfirmation = !data.session;

      toast.success(
        needsConfirmation
          ? '¡Cuenta creada! Revisa tu correo para confirmarla.'
          : '¡Bienvenido a Bordados Sacuanjoche!'
      );

      return { success: true, needsConfirmation, data };
    } catch (error) {
      console.error('Sign up error:', error.message);

      if (/already registered|already been registered/i.test(error.message || '')) {
        toast.error('Ya existe una cuenta con este correo. Inicia sesión.');
      } else if (/password/i.test(error.message || '')) {
        toast.error('La contraseña debe tener al menos 6 caracteres.');
      } else {
        toast.error('No se pudo crear la cuenta. Inténtalo de nuevo.');
      }

      return { success: false, error: error.message };
    }
  };

  const resendConfirmation = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });

      if (error) throw error;

      toast.success('Te reenviamos el correo de confirmación.');
      return { success: true };
    } catch (error) {
      toast.error('No se pudo reenviar el correo. Inténtalo más tarde.');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsOwner(false);
      toast.success('Sesión cerrada');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isOwner,
    isAuthenticated: Boolean(user),
    displayName: getDisplayName(user),
    signIn,
    signUp,
    resendConfirmation,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
