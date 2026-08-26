import React, { useState, useEffect } from 'react';
import { 
  X, Send, ShoppingBag, ShieldCheck, Search, MessageSquare, 
  Phone, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export interface ChatThread {
  id: string;
  partner_name: string;
  partner_avatar?: string;
  partner_role: UserRole | 'directory' | 'cskh';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_online: boolean;
}

export interface SingleChatMessage {
  id: string;
  thread_id: string;
  sender_name: string;
  sender_role: UserRole | 'directory' | 'cskh';
  content: string;
  product_name?: string;
  product_price?: number;
  product_img?: string;
  created_at: string;
  is_me: boolean;
}

interface DirectMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetShopName?: string;
  initialProductId?: string | number;
  initialProductName?: string;
  initialProductPrice?: number;
  initialProductImg?: string;
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({
  isOpen,
  onClose,
  initialTargetShopName,
  initialProductName,
  initialProductPrice,
}) => {
  const { user, userRole } = useAuth();

  // Mobile View Mode State ('list' = list of conversations, 'detail' = active conversation chat stream)
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'detail'>('list');

  // Preset Active Conversations Threads List (Empty [] for unauthenticated Guest)
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    if (!user) {
      setThreads([]);
    } else {
      setThreads([
        {
          id: 'thread-1',
          partner_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
          partner_avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80',
          partner_role: 'merchant',
          last_message: 'Dạ shop sẵn sàng hỗ trợ đóng hàng giao ngay cho bạn nhé!',
          last_message_time: '16:45',
          unread_count: 1,
          is_online: true,
        },
        {
          id: 'thread-2',
          partner_name: 'Thời Trang Nam TQ Flagship Store',
          partner_avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&q=80',
          partner_role: 'merchant',
          last_message: 'Áo khoác gió có sẵn đủ size S, M, L nha khách ơi!',
          last_message_time: 'Hôm qua',
          unread_count: 0,
          is_online: true,
        },
      ]);
    }
  }, [user]);

  const [activeThreadId, setActiveThreadId] = useState<string>('thread-1');
  const [searchThreadTerm, setSearchThreadTerm] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');

  // Individual Chat Messages Stream state
  const [chatMessages, setChatMessages] = useState<Record<string, SingleChatMessage[]>>({
    'thread-1': [
      {
        id: 'm-1',
        thread_id: 'thread-1',
        sender_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
        sender_role: 'merchant',
        content: 'Chào bạn! Cửa hàng nhận đơn ship giao siêu tốc trong 30 phút.',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        is_me: false,
      },
      {
        id: 'm-2',
        thread_id: 'thread-1',
        sender_name: 'Khách Hàng',
        sender_role: 'buyer',
        content: 'Shop ơi, mình mua đơn từ 300k có được miễn phí vận chuyển không ạ?',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        is_me: true,
      },
      {
        id: 'm-3',
        thread_id: 'thread-1',
        sender_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
        sender_role: 'merchant',
        content: 'Dạ shop hỗ trợ Freeship bán kính 5km cho đơn từ 200k nha bạn! Đơn của bạn ship ngay 30 phút ạ.',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        is_me: false,
      },
    ],
    'thread-2': [
      {
        id: 'm-201',
        thread_id: 'thread-2',
        sender_name: 'Thời Trang Nam TQ Flagship Store',
        sender_role: 'merchant',
        content: 'Áo khoác gió có sẵn đủ size S, M, L nha khách ơi!',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_me: false,
      },
    ],
    'thread-3': [
      {
        id: 'm-301',
        thread_id: 'thread-3',
        sender_name: 'Thợ Sửa Điện Nước Hùng Cường',
        sender_role: 'directory',
        content: 'Em đang qua hỗ trợ rà soát đường ống nước nhà mình đây ạ.',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        is_me: false,
      },
    ],
    'thread-4': [
      {
        id: 'm-401',
        thread_id: 'thread-4',
        sender_name: 'Trung Tâm CSKH Siêu Tiện Ích',
        sender_role: 'cskh',
        content: 'Tổng đài hỗ trợ 24/7 sẵn sàng giải đáp thắc mắc của quý khách.',
        created_at: new Date().toISOString(),
        is_me: false,
      },
    ],
  });

  // AUTO-TRIGGER NEW CHAT THREAD WITH PRODUCT ASKING WHEN BUYER CLICKS FROM PRODUCT PAGE
  useEffect(() => {
    if (isOpen && initialProductName) {
      const shopName = initialTargetShopName || 'Gian Hàng Siêu Tiện Ích';
      
      // Check if thread already exists with this shop
      const existingThread = threads.find((t) => t.partner_name === shopName);
      
      const autoProductMessage = `Chào shop, mình đang quan tâm sản phẩm "${initialProductName}" ${initialProductPrice ? `- Giá: ${initialProductPrice.toLocaleString()} đ` : ''}. Shop cho mình hỏi hàng có sẵn giao ngay không ạ?`;

      if (existingThread) {
        setActiveThreadId(existingThread.id);
        setMobileViewMode('detail');

        // Append product question message automatically
        const newProdMsg: SingleChatMessage = {
          id: `msg-prod-${Date.now()}`,
          thread_id: existingThread.id,
          sender_name: 'Khách Hàng',
          sender_role: 'buyer',
          content: autoProductMessage,
          product_name: initialProductName,
          product_price: initialProductPrice,
          created_at: new Date().toISOString(),
          is_me: true,
        };

        setChatMessages((prev) => ({
          ...prev,
          [existingThread.id]: [...(prev[existingThread.id] || []), newProdMsg],
        }));
      } else {
        const newThreadId = `thread-auto-${Date.now()}`;
        const newThread: ChatThread = {
          id: newThreadId,
          partner_name: shopName,
          partner_avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80',
          partner_role: 'merchant',
          last_message: autoProductMessage,
          last_message_time: 'Vừa xong',
          unread_count: 0,
          is_online: true,
        };

        const newProdMsg: SingleChatMessage = {
          id: `msg-prod-${Date.now()}`,
          thread_id: newThreadId,
          sender_name: 'Khách Hàng',
          sender_role: 'buyer',
          content: autoProductMessage,
          product_name: initialProductName,
          product_price: initialProductPrice,
          created_at: new Date().toISOString(),
          is_me: true,
        };

        setThreads((prev) => [newThread, ...prev]);
        setChatMessages((prev) => ({
          ...prev,
          [newThreadId]: [newProdMsg],
        }));
        setActiveThreadId(newThreadId);
        setMobileViewMode('detail');
      }
    }
  }, [isOpen, initialProductName, initialTargetShopName, initialProductPrice]);

  if (!isOpen) return null;

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const activeMessages = chatMessages[activeThreadId] || [];

  const filteredThreads = threads.filter((t) => 
    t.partner_name.toLowerCase().includes(searchThreadTerm.toLowerCase()) ||
    t.last_message.toLowerCase().includes(searchThreadTerm.toLowerCase())
  );

  // Send Message Action
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: SingleChatMessage = {
      id: `msg-${Date.now()}`,
      thread_id: activeThreadId,
      sender_name: userRole === 'merchant' ? 'Chủ Shop' : 'Khách Hàng',
      sender_role: userRole === 'merchant' ? 'merchant' : 'buyer',
      content: inputMessage,
      created_at: new Date().toISOString(),
      is_me: true,
    };

    setChatMessages((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), newMsg],
    }));

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, last_message: inputMessage, last_message_time: 'Vừa xong' }
          : t
      )
    );

    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 h-[90vh] sm:h-[88vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-black text-white truncate">
              Messenger Realtime • Tin Nhắn Trực Tiếp
            </h2>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-COLUMN MESSENGER INTERFACE BODY */}
        <div className="flex-1 flex min-h-0 overflow-hidden text-xs">
          
          {/* LEFT SIDEBAR: THREADS LIST (Hidden on mobile when active conversation detail is open) */}
          <div className={`w-full sm:w-80 md:w-96 border-r border-gray-200 bg-gray-50/70 flex flex-col shrink-0 ${
            mobileViewMode === 'detail' ? 'hidden sm:flex' : 'flex'
          }`}>
            
            {/* Search Threads Box */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm tin nhắn, tên shop, khách..."
                  value={searchThreadTerm}
                  onChange={(e) => setSearchThreadTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-100 border border-transparent rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            {/* Scrollable Threads List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;

                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setMobileViewMode('detail'); // Switch to conversation detail view on mobile
                    }}
                    className={`p-3.5 flex items-center gap-3 transition cursor-pointer ${
                      isActive ? 'bg-indigo-50/90 border-l-4 border-indigo-600' : 'hover:bg-gray-100/80 bg-white'
                    }`}
                  >
                    {/* Partner Avatar with Online Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={thread.partner_avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80'}
                        alt={thread.partner_name}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                      />
                      {thread.is_online && (
                        <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>

                    {/* Partner Info & Last Message */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-gray-900 font-extrabold text-xs truncate">{thread.partner_name}</strong>
                        <span className="text-[10px] text-gray-400 font-medium shrink-0">{thread.last_message_time}</span>
                      </div>

                      <p className={`text-[11px] truncate ${isActive ? 'text-indigo-900 font-bold' : 'text-gray-500'}`}>
                        {thread.last_message}
                      </p>

                      {/* Partner Role Badge */}
                      <div className="flex items-center gap-1 pt-0.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold">
                          {thread.partner_role === 'merchant' ? '🏪 Chủ shop' : thread.partner_role === 'directory' ? '📇 Danh bạ' : '🎧 CSKH'}
                        </span>
                        {thread.unread_count > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full font-black text-[9px]">
                            {thread.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT MAIN PANEL: ACTIVE CONVERSATION MESSAGES & CHAT STREAM (Hidden on mobile when viewing list) */}
          <div className={`flex-1 flex flex-col bg-white min-w-0 ${
            mobileViewMode === 'list' ? 'hidden sm:flex' : 'flex'
          }`}>
            
            {/* Active Thread Header */}
            <div className="p-3 border-b border-gray-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                
                {/* Mobile Back Button to Conversations List */}
                <button
                  type="button"
                  onClick={() => setMobileViewMode('list')}
                  className="sm:hidden p-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  title="Quay lại danh sách các cuộc trò chuyện"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-600" />
                </button>

                <img
                  src={activeThread.partner_avatar || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80'}
                  alt={activeThread.partner_name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover border border-gray-200 shrink-0"
                />

                <div className="min-w-0">
                  <strong className="text-xs sm:text-sm font-black text-gray-900 truncate block flex items-center gap-1">
                    <span className="truncate">{activeThread.partner_name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </strong>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Đang hoạt động (Realtime)</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="tel:0912345678"
                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-extrabold text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer border border-emerald-200"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Gọi thoại</span>
                </a>
              </div>
            </div>

            {/* Scrollable Messages Stream */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 bg-gray-50/40">
              {activeMessages.map((msg) => {
                const timeStr = new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.is_me ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="text-[10px] text-gray-400 font-bold px-1 flex items-center gap-1">
                      <span>{msg.sender_name}</span>
                      <span>•</span>
                      <span>{timeStr}</span>
                    </div>

                    {/* Rich Product Card Attached in Message if Present */}
                    {msg.product_name && (
                      <div className="max-w-xs p-3 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1.5 shadow-sm text-xs">
                        <div className="text-[10px] text-indigo-900 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Hỏi về sản phẩm:</span>
                        </div>
                        <strong className="text-gray-900 font-black block text-xs">{msg.product_name}</strong>
                        {msg.product_price && (
                          <span className="text-rose-600 font-black text-xs block">
                            {msg.product_price.toLocaleString()} đ
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Bubble Content */}
                    <div
                      className={`max-w-[88%] sm:max-w-[75%] p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                        msg.is_me
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
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
                placeholder={`Nhắn tin trao đổi...`}
                className="flex-1 px-3.5 py-2.5 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-indigo-500 focus:outline-none text-xs text-gray-900 font-medium"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-4 sm:px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-extrabold rounded-full transition shadow-md cursor-pointer shrink-0 flex items-center gap-1.5 text-xs"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
