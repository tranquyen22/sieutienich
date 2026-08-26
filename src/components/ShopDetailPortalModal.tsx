import React, { useState } from 'react';
import { X, Store, ShieldCheck, ShoppingBag, Package, DollarSign, MessageSquare, FileText, History, Clock, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { OperatingHours, CategoryDocument } from '../types';

interface ShopDetailPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
}

export const ShopDetailPortalModal: React.FC<ShopDetailPortalModalProps> = ({
  isOpen,
  onClose,
  shopName = 'Nông Sản & Lẩu Thái Khoái Châu Official',
}) => {
  const { products, orders } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'verification' | 'products' | 'orders' | 'financials' | 'messages' | 'documents' | 'audit_logs'
  >('overview');

  // Operating Hours (Mon-Sun)
  const operatingHours: OperatingHours[] = [
    { day: 'T2', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T3', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T4', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T5', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T6', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T7', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'CN', open_time: '08:00', close_time: '22:00', is_open: true },
  ];

  // Category Document Compliance (Báo trước khi hết hạn)
  const [documents] = useState<CategoryDocument[]>([
    {
      id: 'doc-1',
      document_name: 'Giấy Chứng Nhận An Toàn Thực Phẩm',
      category: 'food',
      issue_date: '2025-01-10',
      expiry_date: '2026-09-10', // Sắp hết hạn trong 1 tháng!
      is_valid: true,
    },
    {
      id: 'doc-2',
      document_name: 'Giấy Đăng Ký Kinh Doanh Hộ Gia Đình',
      category: 'all',
      issue_date: '2024-05-15',
      expiry_date: '2029-05-15',
      is_valid: true,
    },
  ]);

  // Audit Logs History
  const auditLogs = [
    { id: 'log-1', action: 'Cấp nhãn xác minh Khâu 2', actor: 'Admin tối cao', time: '2026-08-20 10:30' },
    { id: 'log-2', action: 'Cập nhật lịch giờ mở cửa 08:00 - 22:00', actor: 'Chủ gian hàng', time: '2026-08-18 15:45' },
    { id: 'log-3', action: 'Đăng sản phẩm mới Combo Lẩu Thái', actor: 'Chủ gian hàng', time: '2026-08-15 09:12' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
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

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Trang Chi Tiết Gian Hàng (8 Thẻ Chức Năng Cốt Lõi)</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{shopName}</span>
                <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>✓ Đã xác minh</span>
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">⭐ 4.9 (342 đánh giá) • Đã bán 1.500+ sản phẩm</p>
            </div>

            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              🟢 Đang mở cửa (08:00 - 22:00)
            </span>
          </div>
        </div>

        {/* 8-TAB NAVIGATION BAR */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 p-2 gap-1 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>1. Tổng quan</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'verification' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. Hồ sơ xác minh</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>3. Sản phẩm ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>4. Đơn ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'financials' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>5. Công nợ</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>6. Tin nhắn</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'documents' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>7. Giấy tờ ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'audit_logs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>8. Nhật ký</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: TỔNG QUAN (OVERVIEW) */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <span className="text-gray-500 font-bold block">Tổng doanh số bán:</span>
                  <span className="text-xl font-black text-indigo-700">34.500.000 đ</span>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-gray-500 font-bold block">Đánh giá trung bình:</span>
                  <span className="text-xl font-black text-emerald-700">⭐ 4.9 / 5.0</span>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <span className="text-gray-500 font-bold block">Tỷ lệ phản hồi tin nhắn:</span>
                  <span className="text-xl font-black text-amber-700">100% (trong 5 phút)</span>
                </div>
              </div>

              {/* GOOGLE MAPS SHOP LOCATION SETTING */}
              <div className="p-4 bg-white border border-indigo-200 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-indigo-950 flex items-center gap-1.5 text-xs">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Định Vị Google Maps Trực Tiếp Gian Hàng:</span>
                  </h4>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Số 18 Thị trấn Khoái Châu, Hưng Yên')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold rounded-xl border border-rose-200 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>🗺️ Mở Google Maps Gian Hàng</span>
                  </a>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-700 space-y-1">
                  <p><strong>Địa chỉ đăng ký:</strong> Số 18 Thị trấn Khoái Châu, Huyện Khoái Châu, Tỉnh Hưng Yên</p>
                  <p className="text-emerald-700 font-bold">✓ Tọa độ GPS đã ghim: 20.83512, 105.97231 (Tâm Thị trấn Khoái Châu)</p>
                  <p className="text-gray-500 italic">Khách mua hàng bấm vào chỉ đường sẽ mở ngay ứng dụng Google Maps dẫn tới tận cửa hàng của bạn!</p>
                </div>
              </div>

              {/* Operating Hours Grid */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-gray-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Giờ mở cửa theo từng ngày trong tuần:</span>
                </h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {operatingHours.map((oh, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-xl border border-gray-200 font-bold">
                      <span className="text-indigo-900 block font-extrabold text-[11px]">{oh.day}</span>
                      <span className="text-gray-500 block text-[10px]">{oh.open_time} - {oh.close_time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HỒ SƠ XÁC MINH (VERIFICATION DOSSIER) */}
          {activeTab === 'verification' && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <strong className="text-sm font-extrabold block">✓ Cửa Hàng Đã Được Cấp Nhãn Xác Minh GPKD</strong>
                <p className="text-xs">Số Giấy Phép ĐKKD: <strong>0108920192</strong> • Đã kiểm tra địa điểm thực tế tại Chợ Khoái Châu.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="font-bold text-gray-700 block">Ảnh Giấy Phép GPKD:</span>
                  <img src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&q=80" alt="GPKD" className="w-full h-36 object-cover rounded-2xl border" />
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-700 block">Ảnh Mặt Bằng Thực Tế:</span>
                  <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80" alt="Mặt bằng" className="w-full h-36 object-cover rounded-2xl border" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SẢN PHẨM & VARIANTS (PRODUCTS LIST) */}
          {activeTab === 'products' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <strong className="text-gray-900 font-extrabold text-sm">Danh sách sản phẩm & Phân loại SKU (Size, Màu, Topping):</strong>
              </div>

              <div className="space-y-2">
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                      <div>
                        <strong className="font-bold text-gray-900 block">{p.name}</strong>
                        <span className="text-rose-600 font-black">{p.price.toLocaleString()} đ</span>
                        <span className="text-gray-400 text-[10px] block">Đã bán: {p.soldCount || 342} sp</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Multi-Variant Available
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ĐƠN HÀNG (SHOP ORDERS) */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <strong className="text-gray-900 font-extrabold text-sm block">Đơn hàng của gian hàng ({orders.length} đơn):</strong>
              <div className="space-y-2">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <strong className="text-indigo-700 font-extrabold block">#{ord.id} - {ord.user_name}</strong>
                      <span className="text-gray-500 text-[11px]">Trạng thái: {ord.status}</span>
                    </div>
                    <span className="font-black text-rose-600">{ord.final_amount.toLocaleString()} đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CÔNG NỢ (FINANCIAL LEDGER) */}
          {activeTab === 'financials' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <strong className="text-amber-400 font-black block text-sm">Chốt Sổ Công Nợ Cấn Trừ 2 Chiều</strong>
                <p className="text-xs text-slate-300">Shop nợ phí sàn 3%: 1.035.000đ • Sàn bù Xu/Voucher: 450.000đ ➔ <strong>Shop nợ Sàn: 585.000đ</strong>.</p>
              </div>
            </div>
          )}

          {/* TAB 6: TIN NHẮN (MESSAGES INBOX) */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <p className="text-gray-600 font-bold">Hộp thư trao đổi trực tiếp giữa Shop và Khách Hàng.</p>
            </div>
          )}

          {/* TAB 7: GIẤY TỜ & THỜI HẠN (CATEGORY DOCUMENT COMPLIANCE & EXPIRATION ALERTS) */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl space-y-1 text-amber-950">
                <strong className="font-extrabold text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Theo Dõi Hạn Giấy Tờ Ngành Hàng & Cảnh Báo Trước</span>
                </strong>
                <p className="text-[11px]">Hệ thống tự động nhắc nhở Shop trước 30 ngày khi giấy tờ kinh doanh sắp hết hạn.</p>
              </div>

              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <strong className="font-extrabold text-gray-900 block">{doc.document_name}</strong>
                      <span className="text-gray-500 text-[11px]">Hạn dùng: {doc.expiry_date}</span>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                      ✓ Còn hiệu lực
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: NHẬT KÝ (AUDIT LOGS) */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-3">
              <strong className="text-gray-900 font-extrabold text-sm block">Lịch sử nhật ký hoạt động & thẩm định:</strong>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <strong className="font-bold text-gray-900 block">{log.action}</strong>
                      <span className="text-gray-400 text-[10px]">{log.actor} • {log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
