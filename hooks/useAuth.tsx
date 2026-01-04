import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL('/');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) throw error;

      // Open browser for OAuth
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          const url = Linking.parse(result.url);
          // Handle the OAuth callback
          const params = parseUrlParams(result.url);
          const access_token = params.access_token;
          const refresh_token = params.refresh_token;
          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || '',
            });
          } else {
            console.log("Token tidak ditemukan di URL:", result.url);
            }
        }
      }
    } catch (error) {
      console.log('Error signing in with Google:', error);
      throw error;
    }
  };

  const parseUrlParams = (url: string) => {
    const params: Record<string, string> = {};
    // Regex untuk menangkap key=value dari ? maupun #
    const regex = /[?&#]([^=#]+)=([^&#]*)/g;
    let match;
    while ((match = regex.exec(url))) {
      params[match[1]] = decodeURIComponent(match[2]);
    }
    return params;
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      // Error akan di-handle di komponen yang memanggil function ini
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error signing up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.log('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile(user.id);
    } catch (error) {
      console.log('Error updating profile:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    updateProfile,
  };
}