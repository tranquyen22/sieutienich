// Native PWA Web Push Notification API Helper with Audio Chime & Emergency Ringing Engine
import { soundEngine } from './sound';

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  soundType?: 'chime' | 'emergency';
}

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Request notification permission note:', err);
    return Notification.permission;
  }
};

export const triggerNativePWAWebPush = async ({
  title,
  body,
  icon = '/icon-192.png',
  badge = '/icon-192.png',
  tag = 'sieutienich-notif',
  data = {},
  soundType = 'chime',
}: PushNotificationOptions) => {
  // 1. Play Audio Synthesizer Ringtone
  if (soundType === 'emergency') {
    soundEngine.playEmergencySOSRing();
  } else {
    soundEngine.playChimeSound();
  }

  // 2. Check if Notification API is available and permission granted
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const notificationOptions = {
    body,
    icon,
    badge,
    tag,
    data,
    vibrate: soundType === 'emergency' ? [300, 100, 300, 100, 300, 100, 300] : [200, 100, 200],
    requireInteraction: soundType === 'emergency', // Keep banner open on mobile for SOS rescue
  };

  try {
    // Try Service Worker registration first for native PWA background push
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return;
      }
    }

    // Fallback to standard Window Notification API
    new Notification(title, notificationOptions);
  } catch (err) {
    console.warn('Trigger native notification note:', err);
  }
};
