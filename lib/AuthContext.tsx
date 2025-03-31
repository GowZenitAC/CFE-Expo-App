import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Generador de emails ficticios
  const generateFakeEmail = (username: string) => {
    return `${username.toLowerCase()}@cfe.com.mx`;
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem('session');
      if (session) {
        const parsedSession = JSON.parse(session);
        setUser(parsedSession.user);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const signUp = async (username: string, password: string, fullname: string) => {
    try {
      const fakeEmail = generateFakeEmail(username);
      
      // Paso 1: Registrar en auth.users
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password,
      });

      if (error) throw error;

      // Paso 2: Guardar username en profiles
      if (data.user?.id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username,
            full_name: fullname,
          });

        if (profileError) throw profileError;

        const userData = { id: data.user.id, username, email: fakeEmail };
        await AsyncStorage.setItem('session', JSON.stringify({ user: userData }));
        setUser(userData);
      }
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const fakeEmail = generateFakeEmail(username);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userData = { id: data.user.id, username, email: fakeEmail };
        await AsyncStorage.setItem('session', JSON.stringify({ user: userData }));
        setUser(userData);
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);