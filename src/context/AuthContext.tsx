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
  applyForMerchantAccount: (details: { full_name: string; phone: string; shop_name?: string }) => Promise<{ error: Error | null }>;
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
  const [loading, setLoading] = useState(true);

  // Default demo role set to admin to allow testing full administrative power
  const [userRole, setUserRole] = useState<UserRole>('admin');

  // Staff Permissions (Admin can modify dynamically per staff member)
  const [staffPermissions, setStaffPermissions] = useState<StaffPermissions>(DEFAULT_STAFF_PERMISSIONS);

  const [merchantApplication, setMerchantApplication] = useState<MerchantApplication | null>(null);
  const [allApplications, setAllApplications] = useState<MerchantApplication[]>([
    {
      id: 'app-demo-1',
      user_id: 'user-demo-1',
      user_email: 'shopkhoaichau@gmail.com',
      full_name: 'Trần Văn Hùng',
      phone: '0912345678',
      shop_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
      status: 'pending_review',
      verification_phase: 'phase_1_opening',
      created_at: new Date().toISOString(),
    },
    {
      id: 'app-demo-2',
      user_id: 'user-demo-2',
      user_email: 'homestayhungyen@gmail.com',
      full_name: 'Lê Thị Thu',
      phone: '0987654321',
      shop_name: 'Homestay & Cho Thuê Kiot Khoái Châu',
      status: 'approved',
      verification_phase: 'phase_2_audit',
      created_at: new Date().toISOString(),
    },
  ]);

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'staff';
  const isMerchant = userRole === 'merchant';
  const isBuyer = userRole === 'buyer';

  // Granular Action Permissions
  const canApproveShops = isAdmin || (isStaff && staffPermissions.canApproveShops);
  const canManageProducts = isAdmin || isMerchant || (isStaff && staffPermissions.canManageProducts);
  const canManageOrders = isAdmin || isMerchant || (isStaff && staffPermissions.canManageOrders);
  const canManageCoins = isAdmin || (isStaff && staffPermissions.canManageCoins);

  const fetchApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setAllApplications(data);
        if (user) {
          const userApp = data.find((a: any) => a.user_id === user.id);
          if (userApp) setMerchantApplication(userApp);
        }
      }
    } catch (err) {
      console.warn('Using initial mock applications list:', err);
    }
  }, [user]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

  const updateStaffPermissions = async (_staffUserId: string, newPermissions: StaffPermissions) => {
    setStaffPermissions(newPermissions);
  };

  const applyForMerchantAccount = async (details: { full_name: string; phone: string; shop_name?: string }) => {
    const newApp: MerchantApplication = {
      id: `app-${Date.now()}`,
      user_id: user?.id || 'demo-user',
      user_email: user?.email || 'user@example.com',
      full_name: details.full_name,
      phone: details.phone,
      shop_name: details.shop_name,
      status: 'pending_review',
      verification_phase: 'phase_1_opening',
      created_at: new Date().toISOString(),
    };

    setAllApplications((prev) => [newApp, ...prev]);
    setMerchantApplication(newApp);

    try {
      if (user) {
        await supabase.from('merchant_applications').insert([{
          user_id: user.id,
          user_email: user.email,
          full_name: details.full_name,
          phone: details.phone,
          shop_name: details.shop_name,
          status: 'pending_review',
        }]);
      }
    } catch (e) {
      console.warn('Inserted application locally:', e);
    }

    return { error: null };
  };

  const signInWithIdentifier = async (identifier: string, password: string) => {
    let emailToUse = identifier;
    if (validateVietnamesePhone(identifier)) {
      emailToUse = `${identifier.replace(/\s+/g, '')}@sieutienich.internal`;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    return { error };
  };

  const signUpWithDetails = async (
    fullName: string,
    phone: string,
    email: string,
    password: string,
    wantOpenShop: boolean = false
  ) => {
    let emailToUse = email.trim();
    if (!emailToUse && validateVietnamesePhone(phone)) {
      emailToUse = `${phone.replace(/\s+/g, '')}@sieutienich.internal`;
    }

    const { data, error } = await supabase.auth.signUp({
      email: emailToUse,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          want_open_shop: wantOpenShop,
        },
      },
    });

    if (error) return { error };

    if (data.user && wantOpenShop) {
      await applyForMerchantAccount({
        full_name: fullName,
        phone,
        shop_name: `Shop của ${fullName}`,
      });
      return { error: null, applicationCreated: true };
    }

    return { error: null };
  };

  const approveMerchantApplication = async (applicationId: string) => {
    try {
      setAllApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'approved' } : a))
      );

      const app = allApplications.find((a) => a.id === applicationId);

      if (app) {
        await supabase
          .from('merchant_applications')
          .update({ status: 'approved' })
          .eq('id', applicationId);

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
      setAllApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: 'rejected' } : a))
      );

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
        applyForMerchantAccount,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
