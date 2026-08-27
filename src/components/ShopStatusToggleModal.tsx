import React, { useState, useEffect } from 'react';
import { X, Store, PauseCircle, CheckCircle2, Truck, ShoppingBag, ShieldAlert } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface ShopStatusToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopStatusToggleModal: React.FC<ShopStatusToggleModalProps> = ({ isOpen, onClose }) => {
  const { toggleShopOpenStatus, getEffectiveFulfillmentMode, setShopFulfillmentSettings } = useShop();
  const { user } = useAuth();

  const shopId = user?.id || 'default-shop';
  const effectiveFulfillment = getEffectiveFulfillmentMode(shopId);

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const [closeReason, setCloseReason] = useState('Quán nghỉ bán buổi chiều, mở lại lúc 17:30');
  
  const [allowDelivery, setAllowDelivery] = useState(effectiveFulfillment.allowDelivery);
  const [allowPickup, setAllowPickup] = useState(effectiveFulfillment.allowPickup);

  useEffect(() => {
    setAllowDelivery(effectiveFulfillment.allowDelivery);
    setAllowPickup(effectiveFulfillment.allowPickup);
  }, [effectiveFulfillment.allowDelivery, effectiveFulfillment.allowPickup]);

  if (!isOpen) return null;

  const handleSaveToggle = () => {
    toggleShopOpenStatus(isTemporarilyClosed, isTemporarilyClosed ? closeReason : undefined);
    setShopFulfillmentSettings(shopId, { allowDelivery, allowPickup });

    alert(isTemporarilyClosed 
      ? `🟠 Cửa hàng đã gạt TẠM NGHỈ!\nLý do: "${closeReason}"\nCài đặt hình thức phục vụ: ${allowDelivery ? '🚚 Giao hàng' : ''} ${allowPickup ? '🏪 Tự lấy' : ''}` 
      : `🟢 Đã lưu trạng thái & cấu hình phục vụ Shop thành công!\n• Giao hàng tận nơi: ${allowDelivery ? 'BẬT' : 'TẮT'}\n• Tự đến lấy hàng: ${allowPickup ? 'BẬT' : 'TẮT'}`);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
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
            <Store className="w-4 h-4 text-amber-400" />
            <span>Quản Lý Trạng Thái & Phương Thức Phục Vụ Shop</span>
          </div>

          <h2 className="text-xl font-black text-white">Đang Mở Cửa & Hình Thức Nhận Đơn</h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Main Toggle Switch Panel */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-gray-900 font-extrabold text-sm block">1. Trạng thái hoạt động gian hàng:</strong>
                <span className="text-gray-500 text-[11px]">Bật/Tắt tức thì hoặc để máy gạt tự động theo lịch mở cửa.</span>
              </div>

              {/* Big Toggle Switch Button */}
              <button
                type="button"
                onClick={() => setIsTemporarilyClosed(!isTemporarilyClosed)}
                className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  isTemporarilyClosed ? 'bg-amber-500' : 'bg-emerald-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                    isTemporarilyClosed ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Visual Status Banner */}
            <div className={`p-3 rounded-xl font-black flex items-center gap-2 ${
              isTemporarilyClosed ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}>
              {isTemporarilyClosed ? (
                <>
                  <PauseCircle className="w-5 h-5 text-orange-600 shrink-0" />
                  <span>🟠 Cửa Hàng Đang Trong Trạng Thái TẠM NGHỈ</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>🟢 Cửa Hàng Đang MỞ CỬA Phục Vụ Nhanh</span>
                </>
              )}
            </div>
          </div>

          {/* Reason Input Field */}
          {isTemporarilyClosed && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="block font-extrabold text-gray-900">Nhập lý do tạm nghỉ (Hiển thị công khai cho Khách):</label>
              <textarea
                rows={2}
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="VD: Quán ăn đóng cửa buổi chiều, thợ đi làm xa 2 hôm..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              ></textarea>
            </div>
          )}

          {/* 2. FULFILLMENT METHOD TOGGLE SECTION (DELIVERY VS PICKUP) */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <strong className="text-indigo-950 font-extrabold text-sm block flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>2. Cài đặt Hình Thức Nhận Hàng của Shop:</span>
              </strong>
              {effectiveFulfillment.isOverriddenByAdmin && (
                <span className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[10px] font-black uppercase">
                  🔒 ĐƯỢC ADMIN CÀI ĐẶT
                </span>
              )}
            </div>

            {effectiveFulfillment.isOverriddenByAdmin && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-950 space-y-1">
                <div className="font-extrabold text-xs flex items-center gap-1.5 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Quyền hạn Admin sàn đang có hiệu lực tối cao:</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed">
                  {effectiveFulfillment.adminReason}
                </p>
                <p className="text-[10px] italic text-amber-800">
                  (Shop không thể thay đổi cài đặt này ngoại trừ khi Admin gỡ bỏ cấu hình đè).
                </p>
              </div>
            )}

            <div className="space-y-2 pt-1">
              <label className={`flex items-center justify-between p-3 rounded-xl border transition ${
                allowDelivery ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-gray-100 border-gray-200 text-gray-400'
              } ${effectiveFulfillment.isOverriddenByAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-5 h-5 ${allowDelivery ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <div>
                    <strong className="block text-xs font-black">🚚 Có giao hàng tận nơi (Door-to-door Delivery)</strong>
                    <span className="text-[10px] text-gray-500 block">Shop/Shipper mang hàng đến tận nhà cho khách.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={effectiveFulfillment.isOverriddenByAdmin}
                  checked={allowDelivery}
                  onChange={(e) => setAllowDelivery(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>

              <label className={`flex items-center justify-between p-3 rounded-xl border transition ${
                allowPickup ? 'bg-blue-50 border-blue-300 text-blue-950' : 'bg-gray-100 border-gray-200 text-gray-400'
              } ${effectiveFulfillment.isOverriddenByAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className={`w-5 h-5 ${allowPickup ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <strong className="block text-xs font-black">🏪 Chỉ bán cho khách tự đến lấy hàng (Self-pickup)</strong>
                    <span className="text-[10px] text-gray-500 block">Khách hàng theo bản đồ chỉ đường đến tận gian hàng lấy đồ.</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  disabled={effectiveFulfillment.isOverriddenByAdmin}
                  checked={allowPickup}
                  onChange={(e) => setAllowPickup(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Explanatory Rules List */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 text-indigo-950">
            <strong className="font-extrabold text-xs block text-indigo-900">📌 Quy Tắc Vận Hành & Quyền Hạn Admin Sàn:</strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium leading-relaxed">
              <li><strong>Shop tự chọn:</strong> Tùy chọn gạt Giao hàng hoặc Tự lấy hàng theo khả năng vận hành của shop.</li>
              <li><strong>Admin đè quyền:</strong> Admin sàn có quyền lực tối cao khóa toàn sàn hoặc khóa tùy chỉnh từng shop sang "Chỉ tự đến lấy" hoặc "Bắt buộc giao hàng".</li>
              <li><strong>Hiển thị khách hàng:</strong> Khung giỏ hàng tự động chọn chế độ Tự đến lấy nếu shop tắt giao hàng tận nơi.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2 shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveToggle}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer font-black"
          >
            Lưu Trạng Thái & Cấu Hình
          </button>
        </div>

      </div>
    </div>
  );
};
