import React, { useState } from 'react';
import { Bell, PackageCheck, MessageSquare, CheckCircle2, X } from 'lucide-react';
import type { AppNotification } from '../types';
import { useAuth } from '../context/AuthContext';

interface NotificationBellProps {
  onOpenOrderTrackingModal: () => void;
  onOpenDirectMessagingModal: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onOpenOrderTrackingModal,
  onOpenDirectMessagingModal,
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Real-time Notification Feed for both Buyer & Shop
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      user_id: 'current-user',
      title: '🚚 Đơn hàng #ORD-9812 đang giao',
      body: 'Shop "Nông Sản & Lẩu Thái Khoái Châu" đã gửi hàng cho shipper giao tới địa chỉ của bạn.',
      type: 'order_status_update',
      order_id: 'ORD-9812',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'current-user',
      title: '💬 Tin nhắn mới từ Shop Khoái Châu',
      body: 'Shop vừa gửi tin nhắn xác nhận sẵn sàng đóng gói và freeship cho đơn hàng.',
      type: 'new_message',
      order_id: 'ORD-9812',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'notif-3',
      user_id: 'current-user',
      title: '🎉 Thưởng điểm danh +50 Xu Thường',
      body: 'Bạn vừa nhận +50 Xu Thường cho điểm danh hàng ngày thành công.',
      type: 'system',
      is_read: true,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ]);

  // UNAUTHENTICATED GUEST = BLANK (0 NOTIFICATIONS)
  const activeNotifications = user ? notifications : [];
  const unreadCount = activeNotifications.filter((n) => !n.is_read).length;

  const handleToggleBell = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    
    // Automatic Mark Read on Opening Bell: Clear unread badge when user opens to view notifications
    if (nextState && unreadCount > 0) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleBell}
        className="relative p-2 text-gray-700 hover:text-indigo-600 transition rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer shrink-0"
        title="Chuông thông báo cập nhật tiến trình đơn & tin nhắn"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* MOBILE-RESPONSIVE NOTIFICATION POPUP PANEL */}
      {isOpen && (
        <>
          {/* Backdrop for closing when clicking outside on mobile */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs sm:bg-transparent" 
            onClick={() => setIsOpen(false)} 
          />

          <div 
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 bg-white rounded-3xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[82vh] flex flex-col min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Panel Header */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-xs text-white">Thông Báo Tức Thời (Realtime)</span>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-indigo-300 hover:text-white font-bold underline cursor-pointer"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications Scrollable Stream */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1">
              {activeNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-semibold">
                  {user ? 'Không có thông báo nào mới.' : '🔒 Chưa đăng nhập (0 thông báo)'}
                </div>
              ) : (
                activeNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
                      );
                      setIsOpen(false);

                      if (notif.type === 'order_status_update' || notif.type === 'new_order') {
                        onOpenOrderTrackingModal();
                      } else if (notif.type === 'new_message') {
                        onOpenDirectMessagingModal();
                      }
                    }}
                    className={`p-3 text-xs transition cursor-pointer hover:bg-indigo-50/60 rounded-2xl my-1 flex items-start gap-3 ${
                      notif.is_read ? 'bg-white text-gray-700' : 'bg-indigo-50/80 font-bold text-gray-900 border border-indigo-100'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5 shadow-2xs">
                      {notif.type === 'new_message' ? (
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-gray-900 truncate">{notif.title}</h4>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">{notif.body}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                        <span>{new Date(notif.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="text-indigo-600 font-bold hover:underline">Xem chi tiết ➔</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Panel Footer */}
            <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-500 font-medium shrink-0 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Đã xem toàn bộ thông báo • Tự tắt tín hiệu đỏ</span>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
