import React, { useState } from 'react';
import { X, Store, PauseCircle, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface ShopStatusToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopStatusToggleModal: React.FC<ShopStatusToggleModalProps> = ({ isOpen, onClose }) => {
  const { toggleShopOpenStatus } = useShop();

  const [isTemporarilyClosed, setIsTemporarilyClosed] = useState(false);
  const [closeReason, setCloseReason] = useState('Quán nghỉ bán buổi chiều, mở lại lúc 17:30');

  if (!isOpen) return null;

  const handleSaveToggle = () => {
    toggleShopOpenStatus(isTemporarilyClosed, isTemporarilyClosed ? closeReason : undefined);

    alert(isTemporarilyClosed 
      ? `🟠 Cửa hàng đã được gạt sang trạng thái TẠM NGHỈ!\nLý do: "${closeReason}"\n• Không nhận đơn mới (sản phẩm vẫn hiển thị cho khách lưu lại).\n• Các đơn đang chạy vẫn xử lý bình thường.` 
      : '🟢 Cửa hàng đã MỞ CỬA hoạt động trở lại! Sẵn sàng nhận đơn hàng mới.');

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
            <span>Quản Lý Trạng Thái Gian Hàng (Shop Tự Gạt)</span>
          </div>

          <h2 className="text-xl font-black text-white">Đang Mở Cửa & Tạm Nghỉ</h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Main Toggle Switch Panel */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-gray-900 font-extrabold text-sm block">Trạng thái hoạt động gian hàng:</strong>
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

          {/* Explanatory Rules List */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2 text-indigo-950">
            <strong className="font-extrabold text-xs block text-indigo-900">📌 Quy Tắc Vận Hành Trạng Thái Tạm Nghỉ:</strong>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium leading-relaxed">
              <li><strong>Không nhận đơn mới:</strong> Khách không thể bấm Đặt hàng/Thêm vào giỏ.</li>
              <li><strong>Đơn đang chạy vẫn xử lý:</strong> Các đơn hàng đã đặt trước đó vẫn tiếp tục giao bình thường.</li>
              <li><strong>Hàng vẫn giữ nguyên:</strong> Sản phẩm KHÔNG bị xóa khỏi sàn, khách vẫn tìm thấy để lưu thích hôm sau.</li>
              <li><strong>Sắp xếp tìm kiếm:</strong> Shop tạm nghỉ tự động tụt xuống bên dưới kết quả tìm kiếm.</li>
              <li><strong>Khác biệt với bị khóa:</strong> Tạm nghỉ do Shop tự chọn khác hoàn toàn với bị Sàn khóa do nợ công nợ (`is_suspended`).</li>
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
            Lưu Trạng Thái Gian Hàng
          </button>
        </div>

      </div>
    </div>
  );
};
