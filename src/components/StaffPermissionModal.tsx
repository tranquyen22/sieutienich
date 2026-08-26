import React from 'react';
import { X, Check, Settings, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { StaffPermissions } from '../types';

interface StaffPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPermissionModal: React.FC<StaffPermissionModalProps> = ({ isOpen, onClose }) => {
  const { staffPermissions, setStaffPermissions } = useAuth();

  if (!isOpen) return null;

  const togglePermission = (key: keyof StaffPermissions) => {
    setStaffPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-violet-800 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-indigo-300" />
            <span>Phân Quyền Quyền Hạn Nhân Viên (Staff RBAC)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Cấp Quyền Động Cho Nhân Viên</span>
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Tài khoản Admin có quyền quản trị tối cao, tự do bật/tắt các quyền chức năng cho Nhân viên cấp dưới.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-snug">
            👑 <strong>Admin cấp quyền:</strong> Nhân viên cấp dưới chỉ được thao tác trên hệ thống dựa theo danh sách quyền mà Admin tích bật dưới đây.
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            
            {/* Permission 1: Duyệt hồ sơ mở Shop */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm text-gray-900 block">Duyệt Hồ Sơ Mở Shop</span>
                <span className="text-xs text-gray-500">Cho phép Nhân viên phê duyệt hoặc từ chối đơn mở Shop của Khách hàng.</span>
              </div>
              <button
                type="button"
                onClick={() => togglePermission('canApproveShops')}
                className={`p-1 transition cursor-pointer shrink-0 ${
                  staffPermissions.canApproveShops ? 'text-indigo-600' : 'text-gray-300'
                }`}
              >
                {staffPermissions.canApproveShops ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Permission 2: Thêm/Sửa/Xóa sản phẩm */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm text-gray-900 block">Quản Lý Sản Phẩm & Tiện Ích</span>
                <span className="text-xs text-gray-500">Cho phép Nhân viên đăng bài, chỉnh sửa và xóa tiện ích trên toàn sàn.</span>
              </div>
              <button
                type="button"
                onClick={() => togglePermission('canManageProducts')}
                className={`p-1 transition cursor-pointer shrink-0 ${
                  staffPermissions.canManageProducts ? 'text-indigo-600' : 'text-gray-300'
                }`}
              >
                {staffPermissions.canManageProducts ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Permission 3: Tiến trình đơn hàng */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm text-gray-900 block">Quản Lý & Hủy Tiến Trình Đơn Hàng</span>
                <span className="text-xs text-gray-500">Cho phép Nhân viên chuyển bước 4 giai đoạn đơn hàng hoặc thực hiện Hủy đơn.</span>
              </div>
              <button
                type="button"
                onClick={() => togglePermission('canManageOrders')}
                className={`p-1 transition cursor-pointer shrink-0 ${
                  staffPermissions.canManageOrders ? 'text-indigo-600' : 'text-gray-300'
                }`}
              >
                {staffPermissions.canManageOrders ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Permission 4: Quản lý Xu */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between gap-3">
              <div>
                <span className="font-extrabold text-sm text-gray-900 block">Quản Lý Ví Xu & Thưởng</span>
                <span className="text-xs text-gray-500">Cho phép Nhân viên điểm danh, thưởng Xu TQ và Xu Thường cho người dùng.</span>
              </div>
              <button
                type="button"
                onClick={() => togglePermission('canManageCoins')}
                className={`p-1 transition cursor-pointer shrink-0 ${
                  staffPermissions.canManageCoins ? 'text-indigo-600' : 'text-gray-300'
                }`}
              >
                {staffPermissions.canManageCoins ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-gray-500">Dữ liệu phân quyền nhân viên cập nhật tức thì.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md transition cursor-pointer flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>Lưu & Hoàn tất</span>
          </button>
        </div>
      </div>
    </div>
  );
};
