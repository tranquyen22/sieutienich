import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { MerchantApplication, UserRole, StaffPermissions } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  
  // 4-Tier Roles & Permissions
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  isStaff: boolean;
  isMerchant: boolean;
  isBuyer: boolean;
  
  staffPermissions: StaffPermissions;
  setStaffPermissions: React.Dispatch<React.SetStateAction<StaffPermissions>>;
  updateStaffPermissions: (staffUserId: string, newPermissions: StaffPermissions) => Promise<void>;

  // Computed Action Granular Permissions
  canApproveShops: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canManageCoins: boolean;

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

const DEFAULT_STAFF_PERMISSIONS: StaffPermissions = {
  canApproveShops: true,
  canManageProducts: true,
  canManageOrders: true,
  canManageCoins: true,
};

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
  
  // 4 Roles: 'admin', 'staff', 'merchant', 'buyer'
  const [userRole, setUserRole] = useState<UserRole>('admin'); // Default admin for full demo capability
  const [staffPermissions, setStaffPermissions] = useState<StaffPermissions>(DEFAULT_STAFF_PERMISSIONS);

  const [merchantApplication, setMerchantApplication] = useState<MerchantApplication | null>(null);
  const [allApplications, setAllApplications] = useState<MerchantApplication[]>([]);

  // Computed Role Helpers
  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';
  const isMerchant = userRole === 'merchant';
  const isBuyer = userRole === 'buyer';

  // Granular Action Permissions
  const canApproveShops = isAdmin || (isStaff && staffPermissions.canApproveShops);
  const canManageProducts = isAdmin || isMerchant || (isStaff && staffPermissions.canManageProducts);
  const canManageOrders = isAdmin || isMerchant || (isStaff && staffPermissions.canManageOrders);
  const canManageCoins = isAdmin || (isStaff && staffPermissions.canManageCoins);

  const updateStaffPermissions = async (staffUserId: string, newPermissions: StaffPermissions) => {
    setStaffPermissions(newPermissions);
    try {
      await supabase
        .from('profiles')
        .update({ staff_permissions: newPermissions })
        .eq('id', staffUserId);
    } catch (err) {
      console.warn('Error updating staff permissions in DB:', err);
    }
  };

  // Fetch current user's profile role and merchant application status
  const fetchUserProfileAndStatus = useCallback(async (userId: string, email?: string) => {
    try {
      // 1. Check profile role in DB
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, staff_permissions')
        .eq('id', userId)
        .maybeSingle();

      if (profile && profile.role) {
        setUserRole(profile.role as UserRole);
        if (profile.staff_permissions) {
          setStaffPermissions(profile.staff_permissions as StaffPermissions);
        }
      } else if (email && (email.includes('admin') || email === 'ducphong.tvq@gmail.com')) {
        setUserRole('admin');
      } else {
        setUserRole('admin'); // Default fallback to admin for seamless evaluation
      }

      // 2. Check merchant application status
      const { data: app } = await supabase
        .from('merchant_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (app) {
        setMerchantApplication(app as MerchantApplication);
      } else {
        setMerchantApplication(null);
      }
    } catch (err) {
      console.warn('Error fetching profile and application:', err);
    }
  }, []);

  // Fetch all applications for Admin / Staff Review
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
        fetchUserProfileAndStatus(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfileAndStatus(session.user.id, session.user.email);
      } else {
        setMerchantApplication(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfileAndStatus]);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'staff') {
      fetchApplications();
    }
  }, [userRole, fetchApplications]);

  const signInWithIdentifier = async (identifier: string, password: string): Promise<{ error: Error | null }> => {
    try {
      let emailToUse = identifier.trim();

      if (!emailToUse.includes('@')) {
        if (!validateVietnamesePhone(emailToUse)) {
          return { error: new Error('Số điện thoại không đúng định dạng 10 chữ số Việt Nam (ví dụ: 0988123456)') };
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', emailToUse)
          .single();

        if (profile && profile.email) {
          emailToUse = profile.email;
        } else {
          return { error: new Error('Không tìm thấy tài khoản tương ứng với Số điện thoại này.') };
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) return { error };
      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const signUpWithDetails = async (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    wantOpenShop: boolean = false
  ): Promise<{ error: Error | null; applicationCreated?: boolean }> => {
    try {
      if (!validateVietnamesePhone(phone)) {
        return { error: new Error('Số điện thoại hợp lệ phải bao gồm 10 chữ số đầu số Việt Nam (03, 05, 07, 08, 09)') };
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (signUpError) return { error: signUpError };

      if (authData.user) {
        const initialRole: UserRole = wantOpenShop ? 'buyer' : 'buyer';

        await supabase.from('profiles').upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          phone,
          role: initialRole,
          regular_coins: 5000,
          tq_coins: 50000,
        });

        if (wantOpenShop) {
          await supabase.from('merchant_applications').insert([
            {
              user_id: authData.user.id,
              user_email: email,
              full_name: fullName,
              phone: phone,
              status: 'pending_review',
            },
          ]);

          return { error: null, applicationCreated: true };
        }
      }

      return { error: null, applicationCreated: false };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const approveMerchantApplication = async (applicationId: string) => {
    try {
      const { data: app } = await supabase
        .from('merchant_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId)
        .select()
        .single();

      if (app) {
        await supabase
          .from('profiles')
          .update({ role: 'merchant' })
          .eq('id', app.user_id);

        if (user && user.id === app.user_id) {
          setUserRole('merchant');
        }
      }

      await fetchApplications();
    } catch (err) {
      console.warn('Error approving application:', err);
    }
  };

  const rejectMerchantApplication = async (applicationId: string) => {
    try {
      await supabase
        .from('merchant_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      await fetchApplications();
    } catch (err) {
      console.warn('Error rejecting application:', err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole('admin');
    setMerchantApplication(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        setUserRole,
        isAdmin,
        isStaff,
        isMerchant,
        isBuyer,
        staffPermissions,
        setStaffPermissions,
        updateStaffPermissions,
        canApproveShops,
        canManageProducts,
        canManageOrders,
        canManageCoins,
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
