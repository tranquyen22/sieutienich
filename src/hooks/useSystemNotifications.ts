import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { triggerNativePWAWebPush } from '../utils/pushNotification';

export type NotificationPriority = 'NORMAL' | 'HIGH' | 'URGENT';
export type NotificationTargetScope = 'ALL_PLATFORM' | 'ALL_MERCHANTS' | 'ALL_BUYERS' | 'ALL_STAFF' | 'SPECIFIC_USER';

export interface SystemNotificationItem {
  id: string;
  title: string;
  body: string;
  target_type: NotificationTargetScope;
  target_user_id?: string;
  priority: NotificationPriority;
  image_url?: string;
  action_url?: string;
  created_at: string;
  expires_at?: string;
  is_read?: boolean;
}

const BROADCAST_CHANNEL_NAME = 'sieutienich_system_notifications_v1';
const CACHE_KEY = 'sieutienich_system_notifications_cache_v1';

export function useSystemNotifications() {
  const { user, userRole } = useAuth();
  const [notifications, setNotifications] = useState<SystemNotificationItem[]>([]);
  const [urgentNotification, setUrgentNotification] = useState<SystemNotificationItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // 1. Filter notification relevance based on user role & target scope
  const isNotificationForUser = useCallback(
    (notif: SystemNotificationItem): boolean => {
      if (!user) return notif.target_type === 'ALL_PLATFORM';

      if (notif.target_type === 'ALL_PLATFORM') return true;
      if (notif.target_type === 'ALL_BUYERS' && (userRole === 'buyer' || userRole === 'admin')) return true;
      if (notif.target_type === 'ALL_MERCHANTS' && (userRole === 'merchant' || userRole === 'admin')) return true;
      if (notif.target_type === 'ALL_STAFF' && (userRole === 'staff' || userRole === 'admin')) return true;
      if (notif.target_type === 'SPECIFIC_USER') {
        return (
          notif.target_user_id === user.id ||
          notif.target_user_id === user.phone ||
          notif.target_user_id === user.email
        );
      }

      return false;
    },
    [user, userRole]
  );

  // 2. Load cached notifications from LocalStorage
  const loadCachedNotifications = useCallback(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed: SystemNotificationItem[] = JSON.parse(raw);
        setNotifications(parsed);
      }
    } catch (e) {
      console.warn('Load notification cache note:', e);
    }
  }, []);

  // 3. Save notifications to LocalStorage
  const persistCache = useCallback((items: SystemNotificationItem[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items.slice(0, 50)));
    } catch (e) {
      console.warn('Persist notification cache note:', e);
    }
  }, []);

  // 4. Fetch notifications from Supabase DB
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);

      if (!error && data) {
        const filtered = data.filter(isNotificationForUser);
        setNotifications(filtered);
        persistCache(filtered);
      }
    } catch (err) {
      console.warn('Fetch system notifications note:', err);
    } finally {
      setLoading(false);
    }
  }, [isNotificationForUser, persistCache]);

  // 5. Multi-Layer Realtime Setup: Supabase Realtime + BroadcastChannel + Window Storage
  useEffect(() => {
    let isMounted = true;

    loadCachedNotifications();
    fetchNotifications();

    // Layer 1: Setup Window BroadcastChannel for Cross-Tab Sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        if (!isMounted) return;
        const { type, payload } = event.data;

        if (type === 'NEW_NOTIFICATION' && payload) {
          const item: SystemNotificationItem = payload;
          if (isNotificationForUser(item)) {
            setNotifications((prev) => {
              if (prev.some((n) => n.id === item.id)) return prev;
              const next = [item, ...prev];
              persistCache(next);
              return next;
            });

            if (item.priority === 'URGENT') {
              setUrgentNotification(item);
            }
          }
        } else if (type === 'MARK_READ' && payload?.id) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === payload.id ? { ...n, is_read: true } : n))
          );
        }
      };
    }

    // Layer 2: Supabase Realtime Channel Subscription
    const channel = supabase
      .channel('realtime:system_notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_notifications' },
        (payload) => {
          if (!isMounted) return;
          const newNotif = payload.new as SystemNotificationItem;

          if (isNotificationForUser(newNotif)) {
            setNotifications((prev) => {
              if (prev.some((n) => n.id === newNotif.id)) return prev;
              const updated = [newNotif, ...prev];
              persistCache(updated);
              return updated;
            });

            // Trigger PWA Native Push + Ringtone Synthesizer
            triggerNativePWAWebPush({
              title: newNotif.title,
              body: newNotif.body,
              icon: newNotif.image_url || '/icon-192.png',
              soundType: newNotif.priority === 'URGENT' ? 'emergency' : 'chime',
            });

            // Show Urgent Pop-up Banner on Screen
            if (newNotif.priority === 'URGENT' || newNotif.priority === 'HIGH') {
              setUrgentNotification(newNotif);
            }

            // Sync across other open browser tabs
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({
                type: 'NEW_NOTIFICATION',
                payload: newNotif,
              });
            }
          }
        }
      )
      .subscribe();

    // Layer 3: Storage Event Listener Fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CACHE_KEY && e.newValue && isMounted) {
        try {
          const parsed = JSON.parse(e.newValue);
          setNotifications(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // CLEANUP MEMORY LEAK PREVENTION
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [fetchNotifications, isNotificationForUser, loadCachedNotifications, persistCache]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => {
        const next = prev.map((n) => (n.id === id ? { ...n, is_read: true } : n));
        persistCache(next);
        return next;
      });

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'MARK_READ',
          payload: { id },
        });
      }

      if (user) {
        try {
          await supabase.from('user_notification_reads').insert([
            {
              notification_id: id,
              user_id: user.id,
              read_at: new Date().toISOString(),
            },
          ]);
        } catch (e) {
          console.warn('Persist read marker note:', e);
        }
      }
    },
    [persistCache, user]
  );

  const dismissUrgentToast = useCallback(() => {
    setUrgentNotification(null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    urgentNotification,
    unreadCount,
    loading,
    markAsRead,
    dismissUrgentToast,
    refreshNotifications: fetchNotifications,
  };
}
