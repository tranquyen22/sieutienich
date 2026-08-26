import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, Store, Briefcase, Crown, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface AccountRoleAccessMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountRoleAccessMatrixModal: React.FC<AccountRoleAccessMatrixModalProps> = ({ isOpen, onClose }) => {
  const { setUserRole, staffPermissions, setStaffPermissions } = useAuth();

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('buyer');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
            <span>Phân Hệ 4 Loại Tài Khoản & Ma Trận Phân Quyền (RBAC System)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">Bốn Loại Tài Khoản Hệ Thống</h2>
        </div>

        {/* 4 Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-3 bg-gray-50 border-b border-gray-200 text-xs font-extrabold shrink-0">
          <button
            onClick={() => {
              setActiveRoleTab('buyer');
              setUserRole('buyer');
            }}
            className={`p-3 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
              activeRoleTab === 'buyer' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>1. Khách Hàng</span>
            <span className="text-[10px] font-normal opacity-90">Người mua / tra danh bạ</span>
          </button>

          <button
            onClick={() => {
              setActiveRoleTab('merchant');
              setUserRole('merchant');
            }}
            className={`p-3 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
              activeRoleTab === 'merchant' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Store className="w-5 h-5" />
            <span>2. Chủ Shop</span>
            <span className="text-[10px] font-normal opacity-90">Người đăng ký gian hàng</span>
          </button>

          <button
            onClick={() => {
              setActiveRoleTab('staff');
              setUserRole('staff');
            }}
            className={`p-3 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
              activeRoleTab === 'staff' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>3. Nhân Viên</span>
            <span className="text-[10px] font-normal opacity-90">Phân quyền động</span>
          </button>

          <button
            onClick={() => {
              setActiveRoleTab('admin');
              setUserRole('admin');
            }}
            className={`p-3 rounded-2xl transition cursor-pointer flex flex-col items-center gap-1 ${
              activeRoleTab === 'admin' ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Crown className="w-5 h-5" />
            <span>4. Admin Tổng</span>
            <span className="text-[10px] font-normal opacity-90">Duy nhất 1 TK tối cao</span>
          </button>
        </div>

        {/* Scrollable Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: BUYER ACCOUNT ROLE */}
          {activeRoleTab === 'buyer' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 text-blue-950">
                <strong className="text-sm font-extrabold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>Loại 1: Tài Khoản Khách Hàng (Buyer / Người Mua & Tra Danh Bạ)</span>
                </strong>
                <p className="text-xs leading-relaxed">
                  Là người mua sắm hàng hóa, đặt lịch dịch vụ, tra cứu danh bạ vận tải / homestay nội khu. Quyền hạn hoàn toàn tập trung vào trang cá nhân riêng tư của mình.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <strong className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VÀO ĐƯỢC NHỮNG GÌ:</span>
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-950 font-semibold">
                    <li>Trang khách: 18 Phân hệ cá nhân.</li>
                    <li>Đơn hàng của mình (Đang xử lý & Đã xong).</li>
                    <li>Ví xu của mình & Lịch sử nhận/tiêu xu.</li>
                    <li>Tin nhắn chat của mình với Shop.</li>
                    <li>Sổ địa chỉ, Đã xem gần đây, Yêu thích.</li>
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <strong className="text-rose-900 font-extrabold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>KHÔNG THỂ TRUY CẬP:</span>
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-rose-950 font-semibold">
                    <li>Trang quản trị Shop (Hàng & Đơn shop khác).</li>
                    <li>Bảng đối soát công nợ Sàn ⇄ Shop.</li>
                    <li>Trang quản trị Nhân viên & Admin.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MERCHANT ACCOUNT ROLE */}
          {activeRoleTab === 'merchant' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <strong className="text-sm font-extrabold flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  <span>Loại 2: Tài Khoản Chủ Shop (Merchant / Người Đăng Ký Gian Hàng)</span>
                </strong>
                <p className="text-xs leading-relaxed">
                  Là cá nhân/hộ kinh doanh đăng ký mở gian hàng bán sản phẩm hoặc cho thuê. Có trang quản lý dành riêng cho cửa hàng của mình.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <strong className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>VÀO ĐƯỢC NHỮNG GÌ:</span>
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-emerald-950 font-semibold">
                    <li>Trang shop: Hàng của mình (Đăng tin/Thêm variant).</li>
                    <li>Đơn của mình (Đổi 6 bước trạng thái đơn).</li>
                    <li>Công nợ của mình (Bảng đối soát 2 chiều sàn & shop).</li>
                    <li>Bật/tắt trạng thái Đang mở cửa & Tạm nghỉ.</li>
                    <li>Giấy tờ ngành hàng & Hạn sử dụng.</li>
                  </ul>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <strong className="text-rose-900 font-extrabold flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>KHÔNG THỂ TRUY CẬP:</span>
                  </strong>
                  <ul className="list-disc pl-4 space-y-1 text-rose-950 font-semibold">
                    <li>Hồ sơ duyệt mở shop của gian hàng khác.</li>
                    <li>Phân quyền nhân viên sàn.</li>
                    <li>Trang quản trị toàn sàn Admin tổng.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAFF ACCOUNT ROLE */}
          {activeRoleTab === 'staff' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2 text-indigo-950">
                <strong className="text-sm font-extrabold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Loại 3: Tài Khoản Nhân Viên (Staff / Người Chủ Sàn Thuê Giúp Việc)</span>
                </strong>
                <p className="text-xs leading-relaxed">
                  Vào được trang quản trị hệ thống, nhưng <strong>chỉ hiển thị đúng những mục/chức năng được Admin cấp quyền</strong>.
                </p>
              </div>

              {/* Dynamic Staff Permissions Panel */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-gray-900 block text-xs">Bảng phân quyền động dành cho Nhân viên:</span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={staffPermissions.canApproveShops}
                      onChange={(e) => setStaffPermissions({ ...staffPermissions, canApproveShops: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>1. Duyệt hồ sơ mở Shop ({staffPermissions.canApproveShops ? '✓ Mở' : '🔒 Khóa'})</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={staffPermissions.canManageProducts}
                      onChange={(e) => setStaffPermissions({ ...staffPermissions, canManageProducts: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>2. Quản lý Sản phẩm ({staffPermissions.canManageProducts ? '✓ Mở' : '🔒 Khóa'})</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={staffPermissions.canManageOrders}
                      onChange={(e) => setStaffPermissions({ ...staffPermissions, canManageOrders: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>3. Quản lý Đơn hàng ({staffPermissions.canManageOrders ? '✓ Mở' : '🔒 Khóa'})</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={staffPermissions.canManageCoins}
                      onChange={(e) => setStaffPermissions({ ...staffPermissions, canManageCoins: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>4. Quản lý Xu thưởng ({staffPermissions.canManageCoins ? '✓ Mở' : '🔒 Khóa'})</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPER ADMIN ACCOUNT ROLE */}
          {activeRoleTab === 'admin' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500 text-white rounded-2xl space-y-2 shadow-md">
                <strong className="text-sm font-black flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-200" />
                  <span>Loại 4: Tài Khoản Admin Tổng (Super Admin / Chủ Sàn Tối Cao)</span>
                </strong>
                <p className="text-xs text-amber-100 leading-relaxed font-medium">
                  Là <strong>duy nhất một tài khoản tối cao của Chủ Sàn</strong>. Có toàn quyền quản trị hệ thống, cấp quyền cho nhân viên, đổi chu kỳ chốt sổ và cài đặt quy tắc Xu.
                </p>
              </div>

              {/* Immutable Protection Features Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
                <strong className="font-extrabold text-amber-400 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Đặc Tính Bảo Vệ Tối Cao (Immutable Super Admin Protection):</span>
                </strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-xs font-medium">
                  <li><strong>TOÀN BỘ HỆ THỐNG:</strong> Truy cập không giới hạn mọi module và tính năng.</li>
                  <li><strong>KHÔNG AI KHÓA ĐƯỢC:</strong> Quyền Admin tổng bất tử, hệ thống từ chối mọi thao tác vô hiệu hóa/khóa tài khoản này.</li>
                  <li><strong>KHÔNG AI XÓA ĐƯỢC:</strong> Dữ liệu Admin tổng được bảo vệ tuyệt đối ở cấp cơ sở dữ liệu.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl cursor-pointer shadow-md"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
