import { useEffect, useState, useCallback } from 'react';
import { NotificationSettings, Item } from '../types';
import { getDailyQuote } from '../data/jokesData';

const NOTIF_STORAGE_KEY = 'chutkule_notification_settings_v2';

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    try {
      const stored = localStorage.getItem(NOTIF_STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            enabled: false,
            time: '08:00',
            category: 'all',
          };
    } catch {
      return {
        enabled: false,
        time: '08:00',
        category: 'all',
      };
    }
  });

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [inAppAlert, setInAppAlert] = useState<{ title: string; body: string } | null>(null);

  // Sync permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        saveSettings({ ...settings, enabled: true });
      }
      return result;
    } catch (e) {
      console.error('Error requesting notification permission', e);
      return 'denied';
    }
  };

  const deliverNotification = useCallback(
    async (item: Item, isTest = false) => {
      const title =
        item.categoryId === 'funny_jokes'
          ? '😂 आज का मजेदार चुटकुला (Daily Dose)'
          : '✨ आज का अनमोल विचार (Daily Inspiration)';

      const body = `${item.text.slice(0, 110)}...\n— ${item.authorOrCharacter || 'चुटकुले & विचार ऐप'}`;

      // 1. Try Service Worker Notification (Most reliable on Android & Mobile PWA)
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && Notification.permission === 'granted') {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body,
              icon: '/icon.svg',
              badge: '/pwa-192x192.png',
              tag: isTest ? 'test-notif' : 'daily-dose',
            });
            return true;
          }
        } catch (e) {
          console.warn('Service worker showNotification failed, trying standard', e);
        }
      }

      // 2. Standard Web Notification constructor
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/icon.svg',
            badge: '/pwa-192x192.png',
          });
          return true;
        } catch (err) {
          console.warn('Standard notification constructor failed', err);
        }
      }

      // 3. In-App Pop Toast Fallback
      setInAppAlert({ title, body });
      setTimeout(() => setInAppAlert(null), 7000);
      return true;
    },
    []
  );

  const sendTestNotification = useCallback(() => {
    const dailyItem = getDailyQuote(
      settings.category === 'all' ? undefined : settings.category
    );
    return deliverNotification(dailyItem, true);
  }, [settings.category, deliverNotification]);

  // Scheduled interval check (checks every 30 seconds if time matches settings.time)
  useEffect(() => {
    if (!settings.enabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toDateString();

      if (currentTimeStr === settings.time && settings.lastNotificationDate !== todayDateStr) {
        const item = getDailyQuote(settings.category === 'all' ? undefined : settings.category);
        deliverNotification(item, false);
        saveSettings({
          ...settings,
          lastNotificationDate: todayDateStr,
        });
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [settings, deliverNotification]);

  return {
    settings,
    saveSettings,
    permission,
    requestPermission,
    sendTestNotification,
    inAppAlert,
    dismissInAppAlert: () => setInAppAlert(null),
  };
}
