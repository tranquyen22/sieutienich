import React, { useState } from 'react';
import { Bell, PackageCheck, MessageSquare } from 'lucide-react';
import type { AppNotification } from '../types';

interface NotificationBellProps {
  onOpenOrderTrackingModal: () => void;
  onOpenDirectMessagingModal: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onOpenOrderTrackingModal,
  onOpenDirectMessagingModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Real-time Notification Feed for both Buyer & Shop
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      user_id: 'current-user',
      title: '🚚 Đơn hàng #ORD-882901 đang được chuẩn bị',
      body: 'Shop "Nông Sản Khoái Châu" đã xác nhận đơn và đang soạn hàng gửi bạn.',
      type: 'order_status_update',
      order_id: 'ORD-882901',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: 'notif-2',
      user_id: 'current-user',
      title: '💬 Tin nhắn mới từ Shop Khoái Châu',
      body: 'Shop vừa gửi tin nhắn hỗ trợ thời gian giao hàng tận nơi cho bạn.',
      type: 'new_message',
      order_id: 'ORD-882901',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'notif-3',
      user_id: 'current-user',
      title: '🎉 Thưởng điểm danh +50 Xu Thường',
      body: 'Bạn vừa nhận +50 Xu Thường cho điểm danh Ngày 1/7 thành công.',
      type: 'system',
      is_read: true,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 transition rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer shrink-0"
        title="Chuông thông báo cập nhật tiến trình đơn & tin nhắn"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs">Thông Báo Tức Thời (Realtime)</span>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] text-indigo-300 hover:text-white font-bold underline cursor-pointer"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs">Không có thông báo nào.</div>
            ) : (
              notifications.map((notif) => (
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
                  className={`p-3 text-xs transition cursor-pointer hover:bg-indigo-50/50 flex items-start gap-2.5 ${
                    notif.is_read ? 'bg-white text-gray-700' : 'bg-indigo-50/70 font-semibold text-gray-900'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                    {notif.type === 'new_message' ? (
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <PackageCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs line-clamp-1">{notif.title}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{notif.body}</p>
                    <span className="text-[9px] text-gray-400 mt-1 block">
                      {new Date(notif.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};
