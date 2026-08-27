import React, { useState, useEffect } from 'react';
import { 
  X, Send, ShoppingBag, ShieldCheck, Search, MessageSquare, 
  Phone, ArrowLeft, Image, MapPin, Loader2, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
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
  initialTargetPhone?: string;
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({
  isOpen,
  onClose,
  initialTargetShopName,
  initialProductName,
  initialProductPrice,
  initialTargetPhone,
}) => {
  const { user, userRole } = useAuth();

  // Mobile View Mode State ('list' = list of conversations, 'detail' = active conversation chat stream)
  const [mobileViewMode, setMobileViewMode] = useState<'list' | 'detail'>('list');

  // Preset Active Conversations Threads List
  const [threads, setThreads] = useState<ChatThread[]>([]);

  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [searchThreadTerm, setSearchThreadTerm] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSendingGPS, setIsSendingGPS] = useState(false);

  // Individual Chat Messages Stream state
  const [chatMessages, setChatMessages] = useState<Record<string, SingleChatMessage[]>>({});

  useEffect(() => {
    if (!user) {
      setThreads([]);
      setChatMessages({});
      return;
    }

    const fetchRealChatMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          const grouped: Record<string, SingleChatMessage[]> = {};
          const threadMap: Record<string, ChatThread> = {};

          data.forEach((msg: any) => {
            const tid = msg.thread_id || 'thread-default';
            if (!grouped[tid]) grouped[tid] = [];

            grouped[tid].push({
              id: msg.id,
              thread_id: tid,
              sender_name: msg.sender_name || 'Thành viên',
              sender_role: msg.sender_role || 'buyer',
              content: msg.content,
              created_at: msg.created_at,
              is_me: msg.sender_id === user.id,
            });

            threadMap[tid] = {
              id: tid,
              partner_name: msg.sender_name || 'Hộp thoại trao đổi',
              partner_avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80',
              partner_role: msg.sender_role || 'merchant',
              last_message: msg.content,
              last_message_time: 'Gần đây',
              unread_count: 0,
              is_online: true,
            };
          });

          setChatMessages(grouped);
          const threadList = Object.values(threadMap);
          setThreads(threadList);
          if (threadList.length > 0 && !activeThreadId) {
            setActiveThreadId(threadList[0].id);
          }
        }
      } catch (err) {
        console.warn('Supabase fetch chat messages note:', err);
      }
    };

    fetchRealChatMessages();
  }, [user]);

  // AUTO-TRIGGER NEW CHAT THREAD WHEN BUYER CLICKS FROM PRODUCT PAGE OR SOS DIRECTORY
  useEffect(() => {
    if (isOpen && (initialTargetShopName || initialProductName || initialTargetPhone)) {
      const isSOSDirectory = !initialProductName;
      const targetName = initialTargetShopName || 'Gian Hàng Siêu Tiện Ích';
      const targetPhoneKey = initialTargetPhone ? initialTargetPhone.replace(/\D/g, '') : '';
      
      // Form structured thread ID for SOS accounts
      const targetThreadId = targetPhoneKey ? `thread-sos-${targetPhoneKey}` : `thread-auto-${Date.now()}`;
      
      // Check if thread already exists with this shop / SOS service by ID or name
      const existingThread = threads.find((t) => t.id === targetThreadId || t.partner_name === targetName);
      
      const defaultMessage = isSOSDirectory
        ? `🆘 Chào đội dịch vụ cứu hộ "${targetName}"${initialTargetPhone ? ` (${initialTargetPhone})` : ''}, tôi đang cần hỗ trợ khẩn cấp. Vui lòng phản hồi!`
        : `Chào shop, mình đang quan tâm sản phẩm "${initialProductName}" ${initialProductPrice ? `- Giá: ${initialProductPrice.toLocaleString()} đ` : ''}. Shop cho mình hỏi hàng có sẵn giao ngay không ạ?`;

      if (existingThread) {
        setActiveThreadId(existingThread.id);
        setMobileViewMode('detail');
      } else {
        const newThread: ChatThread = {
          id: targetThreadId,
          partner_name: targetName,
          partner_avatar: isSOSDirectory
            ? 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&q=80'
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&q=80',
          partner_role: isSOSDirectory ? 'directory' : 'merchant',
          last_message: defaultMessage,
          last_message_time: 'Vừa xong',
          unread_count: 0,
          is_online: true,
        };

        const newInitialMsg: SingleChatMessage = {
          id: `msg-auto-${Date.now()}`,
          thread_id: targetThreadId,
          sender_name: user?.user_metadata?.full_name || 'Khách Hàng',
          sender_role: userRole || 'buyer',
          content: defaultMessage,
          product_name: initialProductName,
          product_price: initialProductPrice,
          created_at: new Date().toISOString(),
          is_me: true,
        };

        setThreads((prev) => [newThread, ...prev]);
        setChatMessages((prev) => ({
          ...prev,
          [targetThreadId]: [newInitialMsg],
        }));
        setActiveThreadId(targetThreadId);
        setMobileViewMode('detail');

        // Persist initial SOS rescue message to Supabase direct_messages table
        if (user) {
          supabase.from('direct_messages').insert([
            {
              id: newInitialMsg.id,
              thread_id: targetThreadId,
              sender_id: user.id || user.phone,
              sender_name: newInitialMsg.sender_name,
              sender_role: newInitialMsg.sender_role,
              receiver_id: initialTargetPhone || targetName,
              content: defaultMessage,
              created_at: newInitialMsg.created_at,
            }
          ]).then(({ error }) => {
            if (error) console.warn('Supabase initial SOS message sync note:', error);
          });
        }
      }
    }
  }, [isOpen, initialTargetShopName, initialProductName, initialProductPrice, initialTargetPhone]);

  if (!isOpen) return null;

  const userThreads = user ? threads : [];
  const activeThread = userThreads.find((t) => t.id === activeThreadId) || userThreads[0];
  const activeMessages = (user && activeThread) ? (chatMessages[activeThread.id] || []) : [];

  const filteredThreads = userThreads.filter((t) => 
    t.partner_name.toLowerCase().includes(searchThreadTerm.toLowerCase()) ||
    t.last_message.toLowerCase().includes(searchThreadTerm.toLowerCase())
  );

  // Send Message Action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeThreadId) return;

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

    const msgContent = inputMessage;
    setInputMessage('');

    if (user) {
      try {
        await supabase.from('direct_messages').insert([
          {
            id: newMsg.id,
            thread_id: newMsg.thread_id,
            sender_id: user.id,
            sender_name: newMsg.sender_name,
            sender_role: newMsg.sender_role,
            content: msgContent,
            created_at: newMsg.created_at,
          }
        ]);
      } catch (err) {
        console.warn('Supabase messaging sync note:', err);
      }
    }
  };

  const handleChatImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeThreadId) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const newMsg: SingleChatMessage = {
          id: `msg-photo-${Date.now()}`,
          thread_id: activeThreadId,
          sender_name: userRole === 'merchant' ? 'Chủ Shop' : 'Khách Hàng',
          sender_role: userRole === 'merchant' ? 'merchant' : 'buyer',
          content: '📷 [Đã gửi 1 hình ảnh từ thiết bị]',
          product_name: 'Hình ảnh đính kèm từ bộ nhớ thiết bị',
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
              ? { ...t, last_message: '📷 [Đã gửi 1 hình ảnh từ thiết bị]', last_message_time: 'Vừa xong' }
              : t
          )
        );

        if (user) {
          try {
            await supabase.from('direct_messages').insert([
              {
                id: newMsg.id,
                thread_id: newMsg.thread_id,
                sender_id: user.id,
                sender_name: newMsg.sender_name,
                sender_role: newMsg.sender_role,
                content: newMsg.content,
                created_at: newMsg.created_at,
              }
            ]);
          } catch (err) {
            console.warn('Supabase photo messaging sync note:', err);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS!');
      return;
    }

    setIsSendingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const gpsMsgText = `🆘 VỊ TRÍ CỨU HỘ KHẨN CẤP CỦA TÔI:\n📍 Vị trí GPS hiện tại: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n🗺️ Chỉ đường Google Maps: ${mapsUrl}`;

        const currentTid = activeThreadId || 'thread-default';
        const newMsg: SingleChatMessage = {
          id: `msg-gps-${Date.now()}`,
          thread_id: currentTid,
          sender_name: user?.user_metadata?.full_name || 'Khách Hàng Cần Cứu Hộ',
          sender_role: userRole,
          content: gpsMsgText,
          created_at: new Date().toISOString(),
          is_me: true,
        };

        setChatMessages((prev) => ({
          ...prev,
          [currentTid]: [...(prev[currentTid] || []), newMsg],
        }));

        setThreads((prev) =>
          prev.map((t) =>
            t.id === currentTid
              ? { ...t, last_message: '📍 [Đã gửi Vị trí GPS Cứu hộ khẩn cấp]', last_message_time: 'Vừa xong' }
              : t
          )
        );

        if (user) {
          try {
            await supabase.from('direct_messages').insert([
              {
                id: newMsg.id,
                thread_id: newMsg.thread_id,
                sender_id: user.id,
                sender_name: newMsg.sender_name,
                sender_role: newMsg.sender_role,
                content: newMsg.content,
                created_at: newMsg.created_at,
              },
            ]);
          } catch (err) {
            console.warn('Supabase GPS messaging sync note:', err);
          }
        }

        setIsSendingGPS(false);
      },
      (error) => {
        setIsSendingGPS(false);
        alert(`Không thể lấy vị trí GPS: ${error.message}. Vui lòng bật quyền vị trí GPS trên thiết bị!`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 h-[90vh] sm:h-[88vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className={`px-4 sm:px-5 py-3 flex items-center justify-between shrink-0 text-white ${
          userRole === 'service_247'
            ? 'bg-gradient-to-r from-rose-950 via-red-900 to-amber-950 border-b border-rose-700'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className={`w-5 h-5 ${userRole === 'service_247' ? 'text-amber-400 animate-pulse' : 'text-indigo-400'} shrink-0`} />
            <h2 className="text-sm sm:text-base font-black text-white truncate flex items-center gap-2">
              <span>{userRole === 'service_247' ? '🆘 BÀN TRỰC CỨU HỘ & DỊCH VỤ SOS 24/7' : 'Messenger Realtime • Tin Nhắn Trực Tiếp'}</span>
              {userRole === 'service_247' && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-black animate-pulse">
                  🟢 ONLINE TRỰC 24/7
                </span>
              )}
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
            {!activeThread ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-3">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-sm text-gray-800">
                  {user ? 'Không có tin nhắn nào' : '🔒 Chưa Đăng Nhập'}
                </h4>
                <p className="text-xs max-w-xs text-gray-500">
                  {user 
                    ? 'Bạn chưa chọn hoặc chưa có cuộc trò chuyện nào.' 
                    : 'Vui lòng đăng nhập tài khoản để nhắn tin trao đổi với shop.'}
                </p>
              </div>
            ) : (
              <>
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

                {/* QUICK RESCUE REPLIES FOR SERVICE 24/7 ACCOUNTS */}
                {userRole === 'service_247' && (
                  <div className="px-3 py-2 bg-amber-50/90 border-t border-amber-200 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                    <span className="text-[10px] font-black text-amber-900 shrink-0 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600 animate-pulse" />
                      <span>Mẫu phản hồi nhanh:</span>
                    </span>
                    {[
                      '⚡ Đội cứu hộ đang trên đường tới vị trí của bạn!',
                      '🚑 Xe cấp cứu / Y tế đang di chuyển khẩn cấp!',
                      '📍 Đã nhận tọa độ vị trí GPS của bạn trên bản đồ Google Maps!',
                      '🛵 Thợ cứu hộ đang di chuyển, vui lòng giữ liên lạc!',
                      '📞 Đang gọi điện thoại lại cho bạn ngay lập tức!',
                    ].map((templateText, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputMessage(templateText)}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-full text-[11px] font-bold shrink-0 transition shadow-xs cursor-pointer active:scale-95"
                      >
                        {templateText}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    id="chat-photo-attachment"
                    className="hidden"
                    onChange={handleChatImageUpload}
                  />
                  <label
                    htmlFor="chat-photo-attachment"
                    className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full cursor-pointer transition shrink-0 border border-indigo-200 flex items-center justify-center"
                    title="Gửi tệp ảnh từ bộ nhớ thiết bị / thư viện điện thoại"
                  >
                    <Image className="w-4 h-4 text-indigo-600" />
                  </label>

                  {/* SOS GPS Location Share Button */}
                  <button
                    type="button"
                    onClick={handleSendGPSLocation}
                    disabled={isSendingGPS}
                    className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full cursor-pointer transition shrink-0 border border-rose-200 flex items-center justify-center font-bold text-xs"
                    title="Gửi vị trí định vị GPS thực tế kèm bản đồ Google Maps cho đội cứu hộ"
                  >
                    {isSendingGPS ? (
                      <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 text-rose-600" />
                    )}
                  </button>

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
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
