import React, { useState } from 'react';
import { X, Send, ShoppingBag, Package, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { DirectMessage } from '../types';

interface DirectMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetShopName?: string;
  targetProductId?: string | number;
  targetProductName?: string;
  targetOrderId?: string;
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({
  isOpen,
  onClose,
  targetShopName = 'Nông Sản & Lẩu Thái Khoái Châu Official',
  targetProductId,
  targetProductName,
  targetOrderId,
}) => {
  const { user, userRole } = useAuth();
  const [inputMessage, setInputMessage] = useState('');

  // Sample Chat Messages History
  const [messages, setMessages] = useState<DirectMessage[]>([
    {
      id: 'msg-1',
      sender_id: 'shop-1',
      sender_name: targetShopName,
      sender_role: 'merchant',
      receiver_id: user?.id || 'buyer-1',
      receiver_name: 'Khách Hàng',
      product_id: targetProductId || 1,
      product_name: targetProductName || 'Combo Lẩu Thái Hải Sản Khoái Châu',
      order_id: targetOrderId || 'ORD-882901',
      content: 'Dạ chào bạn! Shop nhận được thông tin cần tư vấn của bạn rồi ạ. Sản phẩm luôn tươi ngon có sẵn nhé!',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-2',
      sender_id: user?.id || 'buyer-1',
      sender_name: 'Khách Hàng',
      sender_role: 'buyer',
      receiver_id: 'shop-1',
      receiver_name: targetShopName,
      product_id: targetProductId,
      product_name: targetProductName,
      order_id: targetOrderId,
      content: 'Shop ơi, đơn hàng của mình chọn Shop giao thì khoảng bao lâu giao tới nơi ạ?',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      is_read: true,
    },
    {
      id: 'msg-3',
      sender_id: 'shop-1',
      sender_name: targetShopName,
      sender_role: 'merchant',
      receiver_id: user?.id || 'buyer-1',
      receiver_name: 'Khách Hàng',
      order_id: targetOrderId,
      content: 'Dạ đơn đang được soạn hàng khẩn trương, dự kiến 30 phút nữa shipper giao tới tận tay bạn nhé! Cảm ơn bạn đã tin tưởng Shop.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      is_read: true,
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      sender_id: user?.id || 'buyer-1',
      sender_name: userRole === 'merchant' ? 'Shop' : 'Khách Hàng',
      sender_role: userRole === 'merchant' ? 'merchant' : 'buyer',
      receiver_id: 'shop-1',
      receiver_name: targetShopName,
      product_id: targetProductId,
      product_name: targetProductName,
      order_id: targetOrderId,
      content: inputMessage,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[85vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-4 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>{targetShopName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </h3>
              <p className="text-[11px] text-indigo-300">
                💬 Trao đổi trực tiếp Khách ⇄ Shop (Đồng bộ tức thì)
              </p>
            </div>
          </div>
        </div>

        {/* ATTACHMENT BADGE BAR */}
        {(targetProductName || targetOrderId) && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 text-xs flex items-center gap-2 shrink-0">
            {targetProductName && (
              <span className="bg-white text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 truncate">
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Sản phẩm: {targetProductName}</span>
              </span>
            )}

            {targetOrderId && (
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-lg font-bold flex items-center gap-1 shrink-0">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                <span>Đơn hàng #{targetOrderId}</span>
              </span>
            )}
          </div>
        )}

        {/* Chat History Messages Scroll Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-gray-50/50">
          {messages.map((msg) => {
            const isMe = msg.sender_role === (userRole === 'merchant' ? 'merchant' : 'buyer');
            const timeStr = new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="text-[10px] text-gray-400 font-bold px-1">
                  {msg.sender_name} • {timeStr}
                </div>

                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập tin nhắn trao đổi với Shop..."
            className="flex-1 px-4 py-2 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-indigo-500 focus:outline-none text-xs text-gray-800"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-full transition shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
