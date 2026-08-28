import { useState, useEffect, useCallback } from 'react';
import type { SubwebTheme } from '../types';

interface UseSubShopPWAParams {
  shopName?: string;
  slug?: string;
  iconUrl?: string;
  theme?: SubwebTheme;
}

export function useSubShopPWA({ shopName, slug, iconUrl, theme }: UseSubShopPWAParams = {}) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  // 1. Check if app is currently running in PWA Standalone Mode
  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(Boolean(isStandaloneMode));
  }, []);

  // 2. Listen for BeforeInstallPromptEvent
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // 3. Dynamic PWA Web App Manifest & Meta Tags Injection Strategy
  useEffect(() => {
    if (!slug || !shopName) return;

    const brandColor = theme?.brand_color || '#4f46e5';
    const appIcon = iconUrl || '/icon-192.png';
    const startUrl = `/shop/${slug}`;

    // Construct Dynamic Web Manifest JSON
    const dynamicManifest = {
      name: `${shopName} - Siêu Tiện Ích`,
      short_name: shopName.length > 12 ? `${shopName.slice(0, 12)}...` : shopName,
      description: `Gian hàng ${shopName} chính hãng trên nền tảng Siêu Tiện Ích`,
      start_url: startUrl,
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: brandColor,
      icons: [
        {
          src: appIcon,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: appIcon,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    };

    // Inject Dynamic Manifest Data URL into DOM <head>
    const manifestBlob = new Blob([JSON.stringify(dynamicManifest)], {
      type: 'application/json',
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);

    let manifestLink = document.getElementById('dynamic-pwa-manifest') as HTMLLinkElement;
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.id = 'dynamic-pwa-manifest';
      manifestLink.rel = 'manifest';
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestUrl;

    // Update Theme Color Meta Tag
    let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = brandColor;

    // Update Page Title & Apple Web App Title Meta Tag
    document.title = `${shopName} • Gian Hàng Độc Lập`;

    let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement;
    if (!appleTitleMeta) {
      appleTitleMeta = document.createElement('meta');
      appleTitleMeta.name = 'apple-mobile-web-app-title';
      document.head.appendChild(appleTitleMeta);
    }
    appleTitleMeta.content = shopName;

    return () => {
      URL.revokeObjectURL(manifestUrl);
    };
  }, [shopName, slug, iconUrl, theme]);

  // 4. Trigger Native PWA Installation Prompt
  const promptInstallPWA = useCallback(async () => {
    if (!deferredPrompt) {
      alert('⚠️ Trình duyệt của bạn hiện chưa sẵn sàng cài đặt PWA tự động. Vui lòng bấm vào Menu trình duyệt và chọn "Thêm vào màn hình chính" (Add to Home Screen).');
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.warn('PWA prompt install note:', err);
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isStandalone,
    promptInstallPWA,
  };
}
