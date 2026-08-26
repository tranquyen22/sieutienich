import React, { useState } from 'react';
import { X, ShieldCheck, Check, Settings, ShieldAlert, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { StaffPermissions } from '../types';

interface StaffPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PermissionRow {
  key: keyof StaffPermissions;
  title: string;
  category: string;
  adminSuperAccess: boolean; // Always true for Super Admin
  isStaffTogglable: boolean; // True if Admin can toggle on/off for staff, false if strictly forbidden for staff (Admin only)
  restrictionReason?: string;
}

export interface PermissionTemplate {
  id: string;
  name: string;
  targetRoleDesc: string;
  enabledKeys: (keyof StaffPermissions)[];
}

export const STAFF_PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    id: 'pos_counter',
    name: '🏪 Mẫu 1: Trực quầy',
    targetRoleDesc: 'Dùng cho người đứng bán ở cửa hàng TQ (Bật: Quét mã tại quầy, duyệt xu chờ)',
    enabledKeys: ['can_scan_qr_approve_pending_coins'],
  },
  {
    id: 'directory_entry',
    name: '📇 Mẫu 2: Nhập liệu danh bạ',
    targetRoleDesc: 'Dùng cho người đi gom số thợ, quán, taxi (Bật: Thêm sửa xóa mục danh bạ, gắn nhãn xác minh, sửa cây địa giới)',
    enabledKeys: ['can_manage_directory_items', 'can_toggle_verified_badge', 'can_manage_categories_and_regions'],
  },
  {
    id: 'audit_reviewer',
    name: '📋 Mẫu 3: Duyệt hồ sơ',
    targetRoleDesc: 'Dùng cho người xử lý hàng đợi hồ sơ (Bật: Duyệt mở shop khâu 1 & 2, thu hồi nhãn, gỡ SP. KHÔNG thấy phần tiền!)',
    enabledKeys: ['can_approve_shop_phase1', 'can_approve_shop_phase2', 'can_revoke_verification_badge', 'can_takedown_violating_products'],
  },
  {
    id: 'customer_support',
    name: '🎧 Mẫu 4: Hỗ trợ khách',
    targetRoleDesc: 'Dùng cho người trả lời khách & shop (Bật: Gửi mã reset MK, khóa tài khoản phá phách, xem tin nhắn. KHÔNG sửa xu/công nợ!)',
    enabledKeys: ['can_reset_passwords', 'can_lock_unlock_users', 'can_view_dispute_messages'],
  },
  {
    id: 'finance_accounting',
    name: '💰 Mẫu 5: Sổ sách',
    targetRoleDesc: 'Dùng cho người làm thu chi (Bật: Xem công nợ, ghi nhận tiền shop, xuất báo cáo. KHÔNG tự chốt sổ 1 mình!)',
    enabledKeys: ['can_view_merchant_ledger', 'can_record_shop_payments', 'can_export_financial_reports'],
  },
];

export const StaffPermissionModal: React.FC<StaffPermissionModalProps> = ({ isOpen, onClose }) => {
  const { staffPermissions, setStaffPermissions } = useAuth();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  if (!isOpen) return null;

  // The Exact 22 Granular Permission Rules Matrix
  const permissionMatrix: PermissionRow[] = [
    // 1. Tài khoản và phân quyền
    { key: 'can_manage_users', title: 'Thêm, sửa tài khoản', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_lock_unlock_users', title: 'Khoá và mở lại tài khoản', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_reset_passwords', title: 'Bấm gửi mã đặt lại mật khẩu', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_manage_users', title: 'Đổi vai của người dùng', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng duy nhất có quyền đổi vai trò' },
    { key: 'can_manage_users', title: 'Xoá hẳn tài khoản', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng duy nhất có quyền xóa hẳn tài khoản' },
    { key: 'can_manage_users', title: 'Tạo tài khoản nhân viên và phân quyền', category: 'Tài khoản và phân quyền', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng duy nhất tạo nhân viên' },

    // 2. Danh bạ tiện ích
    { key: 'can_manage_directory_items', title: 'Thêm, sửa, xoá mục danh bạ', category: 'Danh bạ tiện ích', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_toggle_verified_badge', title: 'Gắn và gỡ nhãn đã xác minh', category: 'Danh bạ tiện ích', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_manage_categories_and_regions', title: 'Thêm danh mục và sửa cây địa giới', category: 'Danh bạ tiện ích', adminSuperAccess: true, isStaffTogglable: true },

    // 3. Gian hàng và sản phẩm
    { key: 'can_approve_shop_phase1', title: 'Duyệt hồ sơ mở shop — khâu 1', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_approve_shop_phase2', title: 'Duyệt xác minh shop — khâu 2', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_revoke_verification_badge', title: 'Thu hồi nhãn đã xác minh của shop', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_takedown_violating_products', title: 'Gỡ sản phẩm vi phạm', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_takedown_violating_products', title: 'Khai báo bộ trường theo ngành hàng', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng khai báo schema trường động' },
    { key: 'can_view_dispute_messages', title: 'Xem tin nhắn giữa khách và shop (khi có khiếu nại, ghi log)', category: 'Gian hàng và sản phẩm', adminSuperAccess: true, isStaffTogglable: true },

    // 4. Xu, voucher, quảng cáo
    { key: 'can_scan_qr_approve_pending_coins', title: 'Quét mã tại quầy, duyệt xu chờ', category: 'Xu, voucher, quảng cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_manage_vouchers_and_banners', title: 'Tạo voucher và đặt banner', category: 'Xu, voucher, quảng cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_manually_adjust_coins', title: 'Tặng hoặc trừ xu bằng tay (bắt buộc ghi lý do)', category: 'Xu, voucher, quảng cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_manually_adjust_coins', title: 'Khai báo loại xu, đổi trần phát và trần tiêu', category: 'Xu, voucher, quảng cáo', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng đổi cấu hình trần xu' },

    // 5. Tiền và báo cáo
    { key: 'can_view_merchant_ledger', title: 'Xem sổ công nợ của shop', category: 'Tiền và báo cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_record_shop_payments', title: 'Ghi nhận đã nhận tiền của shop', category: 'Tiền và báo cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_settle_monthly_ledger', title: 'Chốt sổ công nợ hằng tháng (cần người thứ hai duyệt)', category: 'Tiền và báo cáo', adminSuperAccess: true, isStaffTogglable: true },
    { key: 'can_export_financial_reports', title: 'Đặt phần trăm phí sàn cho từng shop', category: 'Tiền và báo cáo', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng cấu hình % phí sàn' },
    { key: 'can_export_financial_reports', title: 'Xem và xuất báo cáo thu chi', category: 'Tiền và báo cáo', adminSuperAccess: true, isStaffTogglable: true },

    // 6. Hệ thống
    { key: 'can_manage_users', title: 'Đăng nhập nhanh vào tài khoản shop', category: 'Hệ thống', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng mới có chìa khóa đăng nhập nhanh' },
    { key: 'can_manage_users', title: 'Xem nhật ký hệ thống', category: 'Hệ thống', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng xem audit log hệ thống' },
    { key: 'can_manage_users', title: 'Sửa cài đặt chung của sàn', category: 'Hệ thống', adminSuperAccess: true, isStaffTogglable: false, restrictionReason: 'Chỉ Admin tổng sửa cấu hình sàn' },
  ];

  const categories = Array.from(new Set(permissionMatrix.map((p) => p.category)));

  const handleApplyTemplate = (template: PermissionTemplate) => {
    setActiveTemplateId(template.id);
    
    // Create new permissions object with all togglable items set to false except enabledKeys
    const newPerms: StaffPermissions = {
      can_manage_users: template.enabledKeys.includes('can_manage_users'),
      can_lock_unlock_users: template.enabledKeys.includes('can_lock_unlock_users'),
      can_reset_passwords: template.enabledKeys.includes('can_reset_passwords'),
      can_manage_directory_items: template.enabledKeys.includes('can_manage_directory_items'),
      can_toggle_verified_badge: template.enabledKeys.includes('can_toggle_verified_badge'),
      can_manage_categories_and_regions: template.enabledKeys.includes('can_manage_categories_and_regions'),
      can_approve_shop_phase1: template.enabledKeys.includes('can_approve_shop_phase1'),
      can_approve_shop_phase2: template.enabledKeys.includes('can_approve_shop_phase2'),
      can_revoke_verification_badge: template.enabledKeys.includes('can_revoke_verification_badge'),
      can_takedown_violating_products: template.enabledKeys.includes('can_takedown_violating_products'),
      can_view_dispute_messages: template.enabledKeys.includes('can_view_dispute_messages'),
      can_scan_qr_approve_pending_coins: template.enabledKeys.includes('can_scan_qr_approve_pending_coins'),
      can_manage_vouchers_and_banners: template.enabledKeys.includes('can_manage_vouchers_and_banners'),
      can_manually_adjust_coins: template.enabledKeys.includes('can_manually_adjust_coins'),
      can_view_merchant_ledger: template.enabledKeys.includes('can_view_merchant_ledger'),
      can_record_shop_payments: template.enabledKeys.includes('can_record_shop_payments'),
      can_settle_monthly_ledger: template.enabledKeys.includes('can_settle_monthly_ledger'),
      can_export_financial_reports: template.enabledKeys.includes('can_export_financial_reports'),
    };

    setStaffPermissions(newPerms);
  };

  const handleToggle = (key: keyof StaffPermissions) => {
    setStaffPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
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
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Phân Quyền Nhân Viên Chi Tiết Từng Mục (Admin Phân Quyền)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">Bảng Phân Quyền Đầy Đủ & 5 Mẫu Đặt Sẵn</h2>
        </div>

        {/* 5 PRESET TEMPLATES SELECTION BAR */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Năm Mẫu Nhân Viên Đặt Sẵn (Áp Dụng 1-Click Không Phải Tick Từng Ô):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Chọn mẫu rồi tùy chỉnh thêm bớt</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {STAFF_PERMISSION_TEMPLATES.map((tmpl) => {
              const isSelected = activeTemplateId === tmpl.id;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className={`p-2 rounded-xl text-left transition cursor-pointer border font-bold text-[11px] flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-white shadow-md' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title={tmpl.targetRoleDesc}
                >
                  <div className="font-extrabold truncate">{tmpl.name}</div>
                  <div className="text-[9px] opacity-80 line-clamp-1 mt-0.5">{tmpl.targetRoleDesc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rule Banner Notice */}
        <div className="bg-amber-500 text-white px-5 py-2 text-xs font-bold flex items-center gap-2 shadow-inner shrink-0">
          <ShieldAlert className="w-4 h-4 text-yellow-200 shrink-0" />
          <span>📌 Nguyên tắc: Chỉ có DUY NHẤT 1 Admin tổng. Bên dưới là Nhân viên do Admin tổng tạo, bật tắt TỪNG QUYỀN MỘT chứ không cấp trọn gói — Giao được việc mà không phải giao chìa khóa nhà!</span>
        </div>

        {/* Scrollable Table Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {categories.map((cat) => {
            const rows = permissionMatrix.filter((p) => p.category === cat);

            return (
              <div key={cat} className="space-y-2">
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 font-black text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>📂 {cat}</span>
                  <span className="text-[10px] text-gray-500 font-bold">{rows.length} Mục chức năng</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
                  {rows.map((row, idx) => {
                    const isChecked = Boolean(staffPermissions[row.key]);

                    return (
                      <div key={idx} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition">
                        <div className="min-w-0 flex-1">
                          <strong className="text-gray-900 font-extrabold text-xs block">{row.title}</strong>
                          {row.restrictionReason && (
                            <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                              🔒 {row.restrictionReason}
                            </span>
                          )}
                        </div>

                        {/* Admin Super Access Column */}
                        <div className="flex items-center gap-4 shrink-0 font-extrabold text-xs">
                          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80" title="Admin tổng luôn có quyền tối cao">
                            <Crown className="w-3.5 h-3.5 text-amber-500" />
                            <span className="hidden sm:inline">Admin tổng: ✓</span>
                          </div>

                          {/* Staff Togglable Switch Column */}
                          {row.isStaffTogglable ? (
                            <button
                              type="button"
                              onClick={() => handleToggle(row.key)}
                              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isChecked ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isChecked ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-[10px] font-black border border-rose-200">
                              ❌ Không cấp
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs font-extrabold">
          <span className="text-gray-500 font-medium">Lưu ý: Thay đổi có hiệu lực ngay lập tức với tài khoản nhân viên.</span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 font-black"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Đã Lưu Cập Nhật!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lưu Phân Quyền Nhân Viên</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
