import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithIdentifier: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithDetails: (fullName: string, phone: string, email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  validateVietnamesePhone: (phone: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to validate Vietnamese Phone Number format (10 digits starting with 03, 05, 07, 08, 09)
export const validateVietnamesePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\.]/g, '');
  const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
  return vnPhoneRegex.test(cleanPhone);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching session:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with either Email OR Phone Number
  const signInWithIdentifier = async (identifier: string, password: string) => {
    try {
      const cleanIdentifier = identifier.trim();

      if (!cleanIdentifier || !password) {
        return { error: new Error('Vui lòng nhập đầy đủ tài khoản và mật khẩu.') };
      }

      let targetEmail = cleanIdentifier;

      // If user typed a phone number instead of an email, lookup email from profiles
      if (!cleanIdentifier.includes('@')) {
        const formattedPhone = cleanIdentifier.replace(/[\s\-\.]/g, '');

        if (!validateVietnamesePhone(formattedPhone)) {
          return { error: new Error('Số điện thoại không hợp lệ (ví dụ đúng: 0988123456).') };
        }

        // Query profiles table to find the email bound to this phone number
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', formattedPhone)
          .single();

        if (!profile || !profile.email) {
          return { error: new Error('Số điện thoại này chưa được đăng ký trên hệ thống.') };
        }

        targetEmail = profile.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      return { error };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  // Sign up with Full Name, Phone (VN format check), Email, Password
  const signUpWithDetails = async (fullName: string, phone: string, email: string, password: string) => {
    try {
      const cleanFullName = fullName.trim();
      const cleanPhone = phone.replace(/[\s\-\.]/g, '');
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanFullName || !cleanPhone || !cleanEmail || !password) {
        return { error: new Error('Vui lòng điền đầy đủ 4 thông tin bắt buộc.') };
      }

      // 1. Validate VN Phone Format
      if (!validateVietnamesePhone(cleanPhone)) {
        return { error: new Error('Số điện thoại phải đúng dạng số Việt Nam 10 chữ số (ví dụ: 0988123456 hoặc 0351234567).') };
      }

      // 2. Check if Email or Phone ALREADY exists in profiles
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingPhone) {
        return { error: new Error('Số điện thoại này đã được đăng ký trên hệ thống. Vui lòng sử dụng số khác hoặc đăng nhập.') };
      }

      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingEmail) {
        return { error: new Error('Email này đã được đăng ký trên hệ thống. Vui lòng sử dụng email khác hoặc đăng nhập.') };
      }

      // 3. Create user on Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
            phone: cleanPhone,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { error: new Error('Email này đã được đăng ký trên hệ thống.') };
        }
        return { error: authError };
      }

      // 4. Save profile record to public.profiles table
      if (authData.user) {
        await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: cleanFullName,
            phone: cleanPhone,
            email: cleanEmail,
          },
        ]);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithIdentifier,
        signUpWithDetails,
        signOut,
        validateVietnamesePhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
