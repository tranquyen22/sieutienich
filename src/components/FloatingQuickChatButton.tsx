import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingQuickChatButtonProps {
  onOpenDirectMessagingModal: () => void;
  unreadCount?: number;
}

export const FloatingQuickChatButton: React.FC<FloatingQuickChatButtonProps> = ({
  onOpenDirectMessagingModal,
  unreadCount = 2,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block px-3 py-1.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-lg border border-slate-700 opacity-90 group-hover:opacity-100 transition">
        💬 Tin Nhắn Realtime
      </span>

      {/* Floating Button */}
      <button
        onClick={onOpenDirectMessagingModal}
        className="relative p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center"
        title="Bấm để mở khung chat tin nhắn nhanh"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />

        {/* Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

    </div>
  );
};
