import React, { useState } from 'react';
import { X, ShieldCheck, Check, Ban, Clock, PhoneCall, ShieldAlert, Key, Truck, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import type { FulfillmentPolicy } from '../types';

interface AdminMerchantReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSubwebModal?: (merchant: any) => void;
}

export const AdminMerchantReviewModal: React.FC<AdminMerchantReviewModalProps> = ({ isOpen, onClose, onOpenSubwebModal }) => {
  const { allApplications, approveMerchantApplication, rejectMerchantApplication, isAdmin, startShopImpersonation } = useAuth();
  const { 
    products, deleteProduct, 
    adminPlatformFulfillmentPolicy, setAdminPlatformFulfillmentPolicy,
    adminShopFulfillmentOverrides, setAdminShopFulfillmentOverride 
  } = useShop();

  const [activeReviewTab, setActiveReviewTab] = useState<'phase_1' | 'phase_2' | 'revoke_and_takedown' | 'admin_fulfillment'>('phase_1');
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'needs_info' | 'reject' | 'revoke' | 'takedown_product'>('reject');
  const [reasonInput, setReasonInput] = useState('');

  if (!isOpen) return null;

  const handleOpenReasonModal = (appId: string, action: 'needs_info' | 'reject' | 'revoke') => {
    setSelectedAppId(appId);
    setActionType(action);
    setReasonInput('');
    setReasonModalOpen(true);
  };

  const handleConfirmReason = () => {
    if (!reasonInput.trim()) {
      alert('Vui lòng nhập lý do cụ thể để gửi thông báo cho Shop!');
      return;
    }

    if (selectedAppId) {
      if (actionType === 'reject' || actionType === 'needs_info') {
        rejectMerchantApplication(selectedAppId);
        alert(`❌ Đã từ chối / Yêu cầu bổ sung hồ sơ mở shop!\nLý do gửi shop: "${reasonInput}"`);
      }
    }

    setReasonModalOpen(false);
  };

  const handleTakedownProduct = (productId: number | string, productName: string) => {
    const reason = prompt(`Nhập lý do chi tiết gỡ sản phẩm vi phạm "${productName}":`, 'Sản phẩm thuộc danh mục cấm hoặc vi phạm bản quyền.');
    if (!reason) return;

    deleteProduct(productId);
    alert(`🔴 Đã gỡ sản phẩm "${productName}" khỏi sàn thành công!\nLý do thông báo shop: "${reason}"`);
  };

  const handleQuickImpersonation = (app: any) => {
    startShopImpersonation({
      shop_id: app.id,
      shop_name: app.shop_name || `Gian hàng ${app.full_name}`,
      owner_name: app.full_name,
      phone: app.phone,
    });
    onClose();
  };

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
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Hàng Đợi Quản Trị Hệ Thống (Admin & Staff)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">Phê Duyệt Mở Shop & Thẩm Định Gian Hàng</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-gray-100 border-b border-gray-200 text-xs font-extrabold shrink-0">
          <button
            onClick={() => setActiveReviewTab('phase_1')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeReviewTab === 'phase_1' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Khâu 1: Duyệt Mở Shop ({allApplications.length})</span>
          </button>

          <button
            onClick={() => setActiveReviewTab('phase_2')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeReviewTab === 'phase_2' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Khâu 2: Duyệt Xác Minh Thực Địa</span>
          </button>

          <button
            onClick={() => setActiveReviewTab('revoke_and_takedown')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeReviewTab === 'revoke_and_takedown' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Thu Hồi Nhãn & Gỡ SP</span>
          </button>

          <button
            onClick={() => setActiveReviewTab('admin_fulfillment')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeReviewTab === 'admin_fulfillment' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚚 Quyền Hạn Giao Hàng</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: PHASE 1 OPENING SHOP REVIEW QUEUE */}
          {activeReviewTab === 'phase_1' && (
            <div className="space-y-4">
              {(allApplications || []).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  Chưa có hồ sơ đăng ký mở Shop nào trong hàng đợi.
                </div>
              ) : (
                (allApplications || []).map((app) => {
                  const isPending = app.status === 'pending_review';

                  return (
                    <div key={app.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <strong className="text-sm font-extrabold text-gray-900 block">{app.shop_name || 'Tên Shop Đăng Ký'}</strong>
                          <span className="text-[11px] text-gray-400">Chủ gian hàng: {app.full_name} ({app.phone})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* SUBWEB & QR CREATION BUTTON */}
                          <button
                            type="button"
                            onClick={() => onOpenSubwebModal && onOpenSubwebModal(app)}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl font-extrabold text-[11px] border border-indigo-300 flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Cấu hình Web con độc lập & Tạo mã QR Standee cho Shop"
                          >
                            <Globe className="w-3.5 h-3.5 text-indigo-600" />
                            <span>🌐 Tạo Web Con & QR</span>
                          </button>

                          {/* QUICK IMPERSONATION ACCESS BUTTON (FOR TAX/POLICE INSPECTION) */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleQuickImpersonation(app)}
                              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-extrabold text-[11px] border border-amber-300 flex items-center gap-1 shadow-xs cursor-pointer"
                              title="Đăng nhập nhanh vào shop trả lời cơ quan thuế/công an mà không phải hỏi shop"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-600" />
                              <span>🔑 Vào tài khoản shop</span>
                            </button>
                          )}

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            isPending ? 'bg-amber-100 text-amber-800' : app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isPending ? '⏳ Chờ duyệt Khâu 1' : app.status === 'approved' ? '✓ Đã duyệt mở shop' : '❌ Từ chối'}
                          </span>
                        </div>
                      </div>

                      {/* 3 Decision Action Buttons */}
                      {isPending && (
                        <div className="grid grid-cols-3 gap-2 pt-1 font-extrabold">
                          <button
                            onClick={() => {
                              approveMerchantApplication(app.id);
                              alert(`🎉 Đã chấp thuận Duyệt Mở Shop Khâu 1 cho gian hàng "${app.shop_name || app.full_name}"!`);
                            }}
                            className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>✓ Duyệt Mở Shop</span>
                          </button>

                          <button
                            onClick={() => handleOpenReasonModal(app.id, 'needs_info')}
                            className="py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                            <span>⚠️ Yêu cầu bổ sung</span>
                          </button>

                          <button
                            onClick={() => handleOpenReasonModal(app.id, 'reject')}
                            className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-4 h-4" />
                            <span>❌ Từ chối</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: PHASE 2 VERIFICATION AUDIT QUEUE */}
          {activeReviewTab === 'phase_2' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Khâu 2: Quy Trình Duyệt Xác Minh Thực Địa (Chạy Sau Khi Mở Shop)</span>
                </h3>
                <p className="text-[11px] leading-snug">
                  Đội ngũ thẩm định tiến hành 3 bước: (1) Kiểm tra số GPKD/CCCD, (2) Gọi điện thẩm định chủ gian hàng, (3) Kiểm tra địa điểm cửa hàng thực tế để cấp nhãn **✓ Đã Xác Minh**.
                </p>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <strong className="font-extrabold text-gray-900 text-sm">Cửa hàng: Nông Sản & Lẩu Thái Khoái Châu Official</strong>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">Khâu 2: Đang thẩm định</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold">✓ Kiểm tra GPKD: Đạt</div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold">✓ Gọi điện: Đã liên hệ</div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold">⏳ Kiểm tra thực địa: Đang xử lý</div>
                </div>

                <button
                  onClick={() => alert('🎉 Đã hoàn tất Khâu 2 thẩm định thực địa! Cấp nhãn ✓ Đã xác minh cho Shop.')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer"
                >
                  Cấp Nhãn "✓ Đã Xác Minh"
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REVOKE VERIFICATION BADGE & TAKEDOWN VIOLATING PRODUCTS */}
          {activeReviewTab === 'revoke_and_takedown' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-rose-950">
                <strong className="font-extrabold text-sm block">⚠️ Thu Hồi Nhãn & Gỡ Sản Phẩm Vi Phạm (Bắt Buộc Báo Lý Do)</strong>
                <p className="text-[11px]">Mọi hành vi thu hồi nhãn xác minh hoặc gỡ sản phẩm đều tự động gửi thông báo báo rõ lý do cho gian hàng.</p>
              </div>

              {/* Products Takedown List */}
              <div className="space-y-2">
                <span className="font-extrabold text-gray-900 block">Danh sách sản phẩm hiện tại trên sàn:</span>
                {products.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={p.img} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                      <div>
                        <strong className="font-bold text-gray-900 block truncate max-w-xs">{p.name}</strong>
                        <span className="text-[10px] text-gray-400">{p.price.toLocaleString()} đ</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleTakedownProduct(p.id, p.name)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl cursor-pointer shrink-0"
                    >
                      Gỡ SP vi phạm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN SUPREME FULFILLMENT CONTROLS */}
          {activeReviewTab === 'admin_fulfillment' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* GLOBAL PLATFORM-WIDE POLICY SETTING */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-black text-amber-950 block">1. Cấu Hình Quy Định Giao Hàng TOÀN SÀN:</strong>
                    <span className="text-amber-800 text-[11px] font-medium">Áp dụng mặc định cho tất cả gian hàng trên ứng dụng.</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-600 text-white font-black text-[10px] rounded-lg uppercase">Quyền Admin Tối Cao</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPlatformFulfillmentPolicy('allow_all');
                      alert('🟢 Đã đặt chính sách TOÀN SÀN: "Cho phép các Shop tự cài đặt tùy chỉnh"!');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      adminPlatformFulfillmentPolicy === 'allow_all' 
                        ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-md' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <strong className="block text-xs">🟢 Cho phép các Shop tự cài đặt</strong>
                    <span className="text-[10px] opacity-90 block mt-0.5">Mặc định: Shop tự gạt giao hàng hoặc tự lấy.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminPlatformFulfillmentPolicy('force_pickup_only');
                      alert('🔒 Đã khóa TOÀN SÀN sang chế độ: "CHỈ CHO KHÁCH TỰ ĐẾN LẤY HÀNG"! Tất cả các shop đều áp dụng quy định này.');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      adminPlatformFulfillmentPolicy === 'force_pickup_only' 
                        ? 'bg-amber-600 text-white border-amber-600 font-extrabold shadow-md' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <strong className="block text-xs">🏪 Ép TOÀN SÀN: Chỉ tự đến lấy</strong>
                    <span className="text-[10px] opacity-90 block mt-0.5">Khóa quyền giao hàng toàn sàn, khách tự đến quán.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdminPlatformFulfillmentPolicy('force_delivery_only');
                      alert('🔒 Đã khóa TOÀN SÀN sang chế độ: "BẮT BUỘC GIAO HÀNG TẬN NƠI"! Tất cả các shop đều phải có giao hàng.');
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      adminPlatformFulfillmentPolicy === 'force_delivery_only' 
                        ? 'bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-md' 
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <strong className="block text-xs">🚚 Ép TOÀN SÀN: Bắt buộc Giao Hàng</strong>
                    <span className="text-[10px] opacity-90 block mt-0.5">Yêu cầu tất cả shop phải có dịch vụ giao tận nhà.</span>
                  </button>
                </div>
              </div>

              {/* PER-SHOP CUSTOM OVERRIDE TABLE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-xs">2. Tùy Chỉnh Ép Cấu Hình Riêng Cho Từng Gian Hàng Cụ Thể:</h3>
                  <span className="text-[11px] text-gray-500 font-medium">Yêu cầu của Admin trên quyền hạn của Shop</span>
                </div>

                <div className="space-y-2">
                  {(allApplications || []).length === 0 ? (
                    <div className="p-4 bg-gray-50 text-gray-400 rounded-xl text-center">Chưa có danh sách gian hàng để thiết lập.</div>
                  ) : (
                    (allApplications || []).map((app) => {
                      const shopId = app.id;
                      const currentOverride = adminShopFulfillmentOverrides[shopId] || 'allow_all';

                      return (
                        <div key={app.id} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <strong className="font-extrabold text-gray-900 block text-xs">{app.shop_name || `Gian hàng ${app.full_name}`}</strong>
                            <span className="text-[10px] text-gray-500">Chủ shop: {app.full_name} | SĐT: {app.phone}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-gray-600">Ép cấu hình:</span>
                            <select
                              value={currentOverride}
                              onChange={(e) => {
                                const val = e.target.value as FulfillmentPolicy;
                                setAdminShopFulfillmentOverride(shopId, val);
                                alert(`🔒 Đã cập nhật quyền Admin ép riêng cho shop "${app.shop_name || app.full_name}": [${val}]`);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-black text-indigo-900 focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="allow_all">🟢 Mặc định (Cho phép Shop tự gạt)</option>
                              <option value="force_pickup_only">🏪 Ép Shop CHỈ BÁN TỰ ĐẾN LẤY HÀNG</option>
                              <option value="force_delivery_only">🚚 Ép Shop BẮT BUỘC GIAO HÀNG TẬN NƠI</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* REASON PROMPT MODAL */}
      {reasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-rose-600">Nhập Lý Do Bắt Buộc Gửi Shop</h3>
              <button onClick={() => setReasonModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-gray-800">
                {actionType === 'needs_info' ? 'Lý do yêu cầu bổ sung thông tin:' : 'Lý do từ chối hồ sơ / thu hồi nhãn:'}
              </label>
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="VD: Giấy phép kinh doanh quá hạn, hình ảnh mặt bằng không đạt yêu cầu..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button onClick={() => setReasonModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleConfirmReason} className="px-5 py-2 bg-rose-600 text-white rounded-xl shadow-md">Xác Nhận Gửi Thông Báo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
