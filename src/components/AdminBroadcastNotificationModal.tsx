import React, { useState } from 'react';
import { X, Send, Bell, Users, Store, ShieldCheck, User, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { NotificationTargetScope, AppNotification } from '../types';

interface AdminBroadcastNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBroadcastNotificationModal: React.FC<AdminBroadcastNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [targetScope, setTargetScope] = useState<NotificationTargetScope>('to_all');
  const [specificUserId, setSpecificUserId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert('Vui lòng điền Tiêu đề và Nội dung thông báo!');
      return;
    }

    if (targetScope === 'to_specific' && !specificUserId.trim()) {
      alert('Vui lòng nhập SĐT hoặc User ID của tài khoản nhận!');
      return;
    }

    setSending(true);

    try {
      const notifId = `broadcast-${Date.now()}`;
      const newNotif: AppNotification = {
        id: notifId,
        user_id: targetScope === 'to_specific' ? specificUserId.trim() : 'broadcast',
        title: title.trim(),
        body: body.trim(),
        message: body.trim(),
        type: 'admin_broadcast',
        target_scope: targetScope,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Save notification record into Supabase notifications table
      await supabase.from('notifications').insert([newNotif]);

      const scopeLabels: Record<NotificationTargetScope, string> = {
        to_all: '📢 Toàn Sàn (Tất cả khách hàng & người dùng)',
        to_merchants: '🏪 Tất Cả Các Gian Hàng / Chủ Shop',
        to_staff: '👥 Khối Nhân Viên Nội Bộ',
        to_specific: `🎯 Tài Khoản Đích Danh (${specificUserId.trim()})`,
      };

      alert(`🎉 ĐÃ PHÁT THÔNG BÁO HỆ THỐNG THÀNH CÔNG!\nPhạm vi mục tiêu: ${scopeLabels[targetScope]}\nTiêu đề: "${title}"`);

      setTitle('');
      setBody('');
      setSpecificUserId('');
      onClose();
    } catch (err: any) {
      alert(`Đã xảy ra lỗi khi gửi thông báo: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Trung Tâm Phát Thông Báo Hệ Thống Admin</span>
          </div>

          <h2 className="text-xl font-black text-white">Soạn & Gửi Thông Báo Hệ Thống</h2>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSendBroadcast} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs font-medium">
          
          {/* 1. Target Scope Picker */}
          <div className="space-y-2">
            <label className="block font-black text-gray-900">
              1. Chọn Phạm Vi Mục Tiêu Nhận Thông Báo *
            </label>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTargetScope('to_all')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2 ${
                  targetScope === 'to_all'
                    ? 'bg-indigo-600 text-white border-indigo-600 font-black shadow-md'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <div>
                  <strong className="block text-xs">📢 Toàn Sàn</strong>
                  <span className="text-[10px] opacity-80 block">Gửi tất cả người dùng</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope('to_merchants')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2 ${
                  targetScope === 'to_merchants'
                    ? 'bg-amber-600 text-white border-amber-600 font-black shadow-md'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Store className="w-4 h-4 shrink-0" />
                <div>
                  <strong className="block text-xs">🏪 Các Gian Hàng</strong>
                  <span className="text-[10px] opacity-80 block">Gửi tất cả Chủ Shop</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope('to_staff')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2 ${
                  targetScope === 'to_staff'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-md'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <div>
                  <strong className="block text-xs">👥 Khối Nhân Viên</strong>
                  <span className="text-[10px] opacity-80 block">Gửi tài khoản nhân viên</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetScope('to_specific')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-2 ${
                  targetScope === 'to_specific'
                    ? 'bg-purple-600 text-white border-purple-600 font-black shadow-md'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <div>
                  <strong className="block text-xs">🎯 Đích Danh</strong>
                  <span className="text-[10px] opacity-80 block">Gửi 1 tài khoản cụ thể</span>
                </div>
              </button>
            </div>
          </div>

          {/* Specific User ID Input */}
          {targetScope === 'to_specific' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="block font-bold text-gray-800">
                Nhập Số điện thoại hoặc User ID người nhận *:
              </label>
              <input
                type="text"
                required
                value={specificUserId}
                onChange={(e) => setSpecificUserId(e.target.value)}
                placeholder="VD: 0912345678 hoặc USR-0912345678..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          )}

          {/* 2. Notification Title */}
          <div className="space-y-1.5">
            <label className="block font-black text-gray-900">
              2. Tiêu Đề Thông Báo *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: 📣 Thông báo bảo trì hệ thống & Cập nhật chính sách giao hàng..."
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* 3. Notification Body Text */}
          <div className="space-y-1.5">
            <label className="block font-black text-gray-900">
              3. Nội Dung Chi Tiết Thông Báo *
            </label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="VD: Kính gửi quý khách hàng / gian hàng, hệ thống Siêu Tiện Ích vừa cập nhật tính năng định vị Google Maps trực tiếp..."
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-2xl font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Guidelines Box */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-indigo-950 space-y-1 text-[11px]">
            <strong className="font-extrabold block text-indigo-900">📌 Quy Tắc Phát Thông Báo Hệ Thống:</strong>
            <p className="font-medium leading-relaxed">
              Thông báo sau khi gửi sẽ lập tức hiển thị trên biểu tượng Chuông thông báo (`NotificationBell`) của tài khoản mục tiêu theo thời gian thực.
            </p>
          </div>

          {/* Submit Controls */}
          <div className="pt-2 border-t border-gray-100 flex justify-end gap-2 shrink-0 font-extrabold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl shadow-md cursor-pointer font-black flex items-center gap-1.5"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang phát thông báo...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-indigo-200" />
                  <span>🚀 Phát Thông Báo Tức Thời</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
