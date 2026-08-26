import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle, Sparkles } from 'lucide-react';

export const PWAInstallPromptBar: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSGuideModal, setShowIOSGuideModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Check if running as standalone app (already installed)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return; // Already installed as PWA!
    }

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // 3. Listen for Android Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt for iOS after 2 seconds if not installed
    if (isIOSDevice && !isStandaloneMode) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // Show general desktop/android prompt after 3 seconds if beforeinstallprompt not fired yet
    const timer = setTimeout(() => setShowPrompt(true), 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  // Handle 1-click Install Trigger for Android / Desktop
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setTimeout(() => setShowPrompt(false), 3000);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuideModal(true);
    } else {
      alert('📲 Hướng dẫn cài app lên Màn Hình Chính Điện Thoại:\n\n• Trên Android Chrome: Bấm nút 3 chấm (...) góc phải ➔ Chọn "Thêm vào màn hình chính" (Add to Home Screen).\n• Trên iPhone Safari: Bấm nút Chia sẻ (Share 📤) ➔ Chọn "Thêm vào MH chính" (+).');
    }
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <>
      {/* STICKY BOTTOM PWA INSTALL BAR */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-md z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-indigo-500/30 flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md">
          
          {/* Subtle Ambient Background Light */}
          <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Left Info: App Icon & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=192&q=80" 
              alt="Siêu Tiện Ích"
              className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-white/20 shadow-md"
            />

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <span className="truncate">Cài App Siêu Tiện Ích</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium truncate">
                Cài thẳng lên màn hình chính điện thoại
              </p>
            </div>
          </div>

          {/* Right Action: Install Button & Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {installedSuccess ? (
              <span className="px-3 py-2 bg-emerald-500 text-white rounded-2xl font-black text-xs flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Đã Cài Đặt!</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Cài Ngay</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* iOS SAFARI INSTALL INSTRUCTIONS MODAL */}
      {showIOSGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100 relative">
            <button 
              onClick={() => setShowIOSGuideModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-indigo-900 font-black text-base">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              <span>Cài Lên Màn Hình Chính iPhone (iOS)</span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Trình duyệt Safari trên iPhone yêu cầu thực hiện 2 bước đơn giản sau để đưa ứng dụng ra ngoài Màn Hình Chính:
            </p>

            <div className="space-y-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <strong className="text-gray-900 font-extrabold block text-xs flex items-center gap-1">
                    <span>Bấm nút Chia sẻ</span>
                    <Share className="w-4 h-4 text-indigo-600 inline" />
                  </strong>
                  <span className="text-gray-500 text-[11px]">Nằm ở thanh công cụ chính giữa phía dưới cùng trình duyệt Safari</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-1 border-t border-indigo-100">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <strong className="text-gray-900 font-extrabold block text-xs flex items-center gap-1">
                    <span>Chọn "Thêm vào MH chính"</span>
                    <PlusSquare className="w-4 h-4 text-indigo-600 inline" />
                  </strong>
                  <span className="text-gray-500 text-[11px]">Vuốt danh sách tùy chọn xuống và chọn "(Add to Home Screen)"</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuideModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-black rounded-xl shadow-md cursor-pointer"
            >
              Đã Hiểu, Cài Ngay!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
