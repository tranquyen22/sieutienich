import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { MerchantApplication } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  merchantApplication: MerchantApplication | null;
  allApplications: MerchantApplication[];
  signInWithIdentifier: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithDetails: (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    wantOpenShop?: boolean
  ) => Promise<{ error: Error | null; applicationCreated?: boolean }>;
  signOut: () => Promise<void>;
  validateVietnamesePhone: (phone: string) => boolean;
  approveMerchantApplication: (applicationId: string) => Promise<void>;
  rejectMerchantApplication: (applicationId: string) => Promise<void>;
  fetchApplications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const validateVietnamesePhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\.]/g, '');
  const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
  return vnPhoneRegex.test(cleanPhone);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [merchantApplication, setMerchantApplication] = useState<MerchantApplication | null>(null);
  const [allApplications, setAllApplications] = useState<MerchantApplication[]>([]);

  // Fetch current user's merchant application status
  const fetchUserMerchantApplication = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (data) {
        setMerchantApplication(data as MerchantApplication);
      } else {
        setMerchantApplication(null);
      }
    } catch (err) {
      console.warn('Error fetching merchant application:', err);
    }
  }, []);

  // Fetch all applications for Admin Review
  const fetchApplications = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('merchant_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setAllApplications(data as MerchantApplication[]);
      }
    } catch (err) {
      console.warn('Error fetching all merchant applications:', err);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserMerchantApplication(session.user.id);
        fetchApplications();
      }
      setLoading(false);
    }).catch((err) => {
      console.error('Error fetching session:', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserMerchantApplication(session.user.id);
        fetchApplications();
      } else {
        setMerchantApplication(null);
        setAllApplications([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserMerchantApplication, fetchApplications]);

  // Sign in with either Email OR Phone Number
  const signInWithIdentifier = async (identifier: string, password: string) => {
    try {
      const cleanIdentifier = identifier.trim();

      if (!cleanIdentifier || !password) {
        return { error: new Error('Vui lòng nhập đầy đủ tài khoản và mật khẩu.') };
      }

      let targetEmail = cleanIdentifier;

      if (!cleanIdentifier.includes('@')) {
        const formattedPhone = cleanIdentifier.replace(/[\s\-\.]/g, '');

        if (!validateVietnamesePhone(formattedPhone)) {
          return { error: new Error('Số điện thoại không hợp lệ (ví dụ đúng: 0988123456).') };
        }

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

  // Sign up with Full Name, Phone (VN format check), Email, Password, and optional "Đăng ký mở Shop"
  const signUpWithDetails = async (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    wantOpenShop: boolean = false
  ) => {
    try {
      const cleanFullName = fullName.trim();
      const cleanPhone = phone.replace(/[\s\-\.]/g, '');
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanFullName || !cleanPhone || !cleanEmail || !password) {
        return { error: new Error('Vui lòng điền đầy đủ 4 thông tin bắt buộc.') };
      }

      if (!validateVietnamesePhone(cleanPhone)) {
        return { error: new Error('Số điện thoại phải đúng dạng số Việt Nam 10 chữ số (ví dụ: 0988123456 hoặc 0351234567).') };
      }

      // Check if Email or Phone ALREADY exists in profiles
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

      // Create user on Supabase Auth (Role default: Buyer)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanFullName,
            phone: cleanPhone,
            role: 'buyer',
            merchant_status: wantOpenShop ? 'pending_review' : null,
          },
        },
      });

      if (authError) {
        if (authError.message.includes('User already registered')) {
          return { error: new Error('Email này đã được đăng ký trên hệ thống.') };
        }
        return { error: authError };
      }

      if (authData.user) {
        // 1. Save profile to public.profiles table
        await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: cleanFullName,
            phone: cleanPhone,
            email: cleanEmail,
            role: 'buyer',
            merchant_status: wantOpenShop ? 'pending_review' : null,
          },
        ]);

        // 2. Pipeline: Buyer -> Merchant Application -> Admin Review
        if (wantOpenShop) {
          const applicationRecord: Omit<MerchantApplication, 'id'> = {
            user_id: authData.user.id,
            user_email: cleanEmail,
            full_name: cleanFullName,
            phone: cleanPhone,
            shop_name: `Shop ${cleanFullName}`,
            status: 'pending_review',
            created_at: new Date().toISOString(),
          };

          await supabase.from('merchant_applications').insert([applicationRecord]);
          await fetchUserMerchantApplication(authData.user.id);
        }
      }

      return { error: null, applicationCreated: wantOpenShop };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  // Admin Review: Approve Merchant Application (Buyer -> Merchant)
  const approveMerchantApplication = async (applicationId: string) => {
    try {
      const { data: app } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (app) {
        // Update application status to approved
        await supabase
          .from('merchant_applications')
          .update({ status: 'approved' })
          .eq('id', applicationId);

        // Update user profile role to merchant
        await supabase
          .from('profiles')
          .update({ role: 'merchant', merchant_status: 'approved' })
          .eq('id', app.user_id);

        await fetchApplications();
        if (user && user.id === app.user_id) {
          fetchUserMerchantApplication(user.id);
        }
      }
    } catch (err) {
      console.warn('Error approving merchant application:', err);
    }
  };

  // Admin Review: Reject Merchant Application
  const rejectMerchantApplication = async (applicationId: string) => {
    try {
      const { data: app } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (app) {
        await supabase
          .from('merchant_applications')
          .update({ status: 'rejected' })
          .eq('id', applicationId);

        await supabase
          .from('profiles')
          .update({ merchant_status: 'rejected' })
          .eq('id', app.user_id);

        await fetchApplications();
        if (user && user.id === app.user_id) {
          fetchUserMerchantApplication(user.id);
        }
      }
    } catch (err) {
      console.warn('Error rejecting merchant application:', err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setMerchantApplication(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        merchantApplication,
        allApplications,
        signInWithIdentifier,
        signUpWithDetails,
        signOut,
        validateVietnamesePhone,
        approveMerchantApplication,
        rejectMerchantApplication,
        fetchApplications,
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
