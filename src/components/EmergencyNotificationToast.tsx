import React from 'react';
import { ShieldAlert, X, ExternalLink, Bell, AlertTriangle } from 'lucide-react';
import type { SystemNotificationItem } from '../hooks/useSystemNotifications';

interface EmergencyNotificationToastProps {
  notification: SystemNotificationItem | null;
  onClose: () => void;
  onActionClick?: (url: string) => void;
}

export const EmergencyNotificationToast: React.FC<EmergencyNotificationToastProps> = ({
  notification,
  onClose,
  onActionClick,
}) => {
  if (!notification) return null;

  const isUrgent = notification.priority === 'URGENT';

  return (
    <div className="fixed top-4 inset-x-3 sm:inset-auto sm:right-5 sm:max-w-md z-[9999] animate-in slide-in-from-top-5 duration-300">
      <div
        className={`rounded-3xl p-4 sm:p-5 shadow-2xl border backdrop-blur-md relative overflow-hidden transition-all ${
          isUrgent
            ? 'bg-gradient-to-r from-red-600 via-rose-700 to-amber-600 text-white border-rose-400/50 shadow-rose-900/40 ring-4 ring-rose-500/30'
            : 'bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border-indigo-500/40 shadow-indigo-900/30'
        }`}
      >
        {/* Animated Background Alert Pulse */}
        {isUrgent && (
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer shrink-0 z-10"
          title="Đóng thông báo khẩn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Priority Badge Header */}
        <div className="flex items-center gap-2 mb-2">
          {isUrgent ? (
            <div className="px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] font-black text-amber-200 uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
              <span>🚨 THÔNG BÁO KHẨN CẤP THỜI GIAN THỰC</span>
            </div>
          ) : (
            <div className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] font-extrabold text-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>📢 THÔNG BÁO QUAN TRỌNG HỆ THỐNG</span>
            </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="flex items-start gap-3.5">
          {/* Banner Image or Large Icon */}
          {notification.image_url ? (
            <img
              src={notification.image_url}
              alt="Notification Banner"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-white/20 shrink-0 shadow-md"
            />
          ) : (
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                isUrgent ? 'bg-white/20 text-white' : 'bg-indigo-600/40 text-amber-400 border border-indigo-400/30'
              }`}
            >
              {isUrgent ? (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              ) : (
                <Bell className="w-6 h-6 text-amber-300" />
              )}
            </div>
          )}

          {/* Title & Body */}
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="font-black text-sm sm:text-base leading-snug text-white line-clamp-2">
              {notification.title}
            </h4>
            <p className="text-xs text-white/90 font-medium leading-relaxed mt-1 line-clamp-3">
              {notification.body}
            </p>

            {/* Optional Action Button URL */}
            {notification.action_url && (
              <div className="mt-3">
                <a
                  href={notification.action_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (onActionClick && notification.action_url) {
                      onActionClick(notification.action_url);
                    }
                    onClose();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shadow-md no-underline ${
                    isUrgent
                      ? 'bg-white text-red-700 hover:bg-amber-100 border border-white/40'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white border border-indigo-400/40'
                  }`}
                >
                  <span>Xem Chi Tiết Ngay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer timestamp */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70 font-bold">
          <span>Vừa gửi tức thời từ Hệ thống Admin</span>
          <span>Bấm ✖ để tắt</span>
        </div>
      </div>
    </div>
  );
};
