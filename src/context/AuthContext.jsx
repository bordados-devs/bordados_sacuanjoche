import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      // Check if the authenticated user is the owner
      checkIfOwner(currentUser?.email);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      checkIfOwner(currentUser?.email);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfOwner = (email) => {
    // Set the owner email - must match exactly what you created in Supabase
    const ownerEmail = 'sacuanjochepeleteria@gmail.com';
    const isOwnerUser = email === ownerEmail;
    setIsOwner(isOwnerUser);
    
    if (isOwnerUser) {
      console.log('Owner authenticated successfully');
    }
  };

  const signIn = async (email, password) => {
    // Only allow the specific owner email to login
    if (email !== 'sacuanjochepeleteria@gmail.com') {
      toast.error('Acceso no autorizado. Solo el administrador puede iniciar sesión.');
      return { success: false, error: 'Unauthorized access' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Bienvenido, Administrador');
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error.message);
      toast.error('Credenciales incorrectas. Verifica tu email y contraseña.');
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
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};