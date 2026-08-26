import React, { useState } from 'react';
import { 
  X, ShieldCheck, UserCheck, Lock, Unlock, Key, RotateCcw, 
  Eye, Search, Trash2, Edit3, Filter, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AdminManagedUser, UserAccountAuditLog, UserRole, AccountLifecycleStatus, StaffPermissions } from '../types';

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type StaffDepartmentKey = 'pos_counter' | 'directory_entry' | 'audit_reviewer' | 'customer_support' | 'finance_accounting';

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  // Initial Managed Users Database with all 5 Standard Lifecycle States
  const [usersList, setUsersList] = useState<AdminManagedUser[]>([
    {
      id: 'USR-ADMIN-001',
      full_name: 'Trần Văn Quyền',
      phone: '0367818343',
      email: 'tranvanquyen2211@gmail.com',
      address: 'Chủ sàn tối cao — Toàn quyền quản trị hệ thống',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      roles: ['admin'],
      status: 'active',
      internal_notes: '👑 Tài khoản Admin tổng DUY NHẤT của Chủ sàn. Bất tử: Không ai khóa hay xóa được!',
      must_change_password_on_first_login: false,
      orders_count: 50,
      regular_coins: 999999,
      tq_coins: 999999,
      reviews_written_count: 20,
      report_count: 0,
      active_devices: ['iPhone 16 Pro Max (Hà Nội)', 'MacBook Pro M3 Max'],
      created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
      audit_logs: [
        {
          id: 'log-0',
          user_id: 'USR-ADMIN-001',
          admin_name: 'Hệ Thống',
          action_type: 'create',
          before_state: 'Khởi tạo hệ thống',
          after_state: 'Khởi tạo tài khoản Admin Tổng DUY NHẤT (Trần Văn Quyền)',
          reason: 'Khởi tạo tài khoản chủ sàn tối cao',
          timestamp: new Date(Date.now() - 86400000 * 365).toISOString(),
        },
      ],
    },
    {
      id: 'USR-8801',
      full_name: 'Nguyễn Văn Hùng',
      phone: '0912345678',
      email: 'hung.nguyen@gmail.com',
      address: 'Số 18 Trần Thái Tông, Cầu Giấy, Hà Nội',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      roles: ['buyer', 'merchant'],
      status: 'active',
      internal_notes: 'Shop quen uy tín nội khu Cầu Giấy, đã thẩm định GPKD',
      must_change_password_on_first_login: false,
      orders_count: 14,
      regular_coins: 125000,
      tq_coins: 50000,
      reviews_written_count: 8,
      report_count: 0,
      active_devices: ['iPhone 15 Pro (Hà Nội)', 'MacBook Pro M2'],
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
      audit_logs: [],
    },
    {
      id: 'USR-8802',
      full_name: 'Lê Văn Nam',
      phone: '0987654321',
      email: 'nam.le@gmail.com',
      address: 'Thị trấn Khoái Châu, Hưng Yên',
      roles: ['buyer'],
      status: 'locked_temp',
      lock_reason: 'Tài khoản bị khiếu nại nhiều lần về spam tin nhắn phá phách.',
      internal_notes: 'Bị khóa tạm thời bởi Admin, bấm mở là hoạt động lại ngay',
      must_change_password_on_first_login: false,
      orders_count: 3,
      regular_coins: 15000,
      tq_coins: 0,
      reviews_written_count: 1,
      report_count: 5,
      active_devices: ['Samsung Galaxy S23'],
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      audit_logs: [],
    },
    {
      id: 'USR-8803',
      full_name: 'Nông Sản Khoái Châu Official',
      phone: '0933445566',
      email: 'nongsankhoaichau@gmail.com',
      address: 'Xã Đông Kết, Khoái Châu, Hưng Yên',
      roles: ['merchant'],
      status: 'locked_debt',
      lock_reason: 'Hệ thống tự động khóa shop do nợ phí sàn quá 1.000.000đ (Hiện nợ: 1.250.000đ).',
      internal_notes: 'Hệ thống tự làm. Shop ẩn khỏi tìm kiếm, không nhận đơn mới. Đơn cũ làm nốt. Shop vẫn đăng nhập xem công nợ trả tiền được.',
      must_change_password_on_first_login: false,
      orders_count: 85,
      regular_coins: 450000,
      tq_coins: 120000,
      reviews_written_count: 12,
      report_count: 0,
      active_devices: ['iPad Pro 11'],
      created_at: new Date(Date.now() - 86400000 * 120).toISOString(),
      audit_logs: [],
    },
    {
      id: 'USR-8804',
      full_name: 'Phạm Thu Trang',
      phone: '0977889900',
      email: 'trang.pham@gmail.com',
      address: 'Quận Nam Từ Liêm, Hà Nội',
      roles: ['buyer'],
      status: 'deleted_by_user_pending',
      user_delete_grace_period_ends_at: new Date(Date.now() + 86400000 * 22).toISOString(),
      internal_notes: 'Chính chủ tự bấm yêu cầu xóa trong Cài đặt. Đang trong thời gian ân hạn 30 ngày để đổi ý khôi phục.',
      must_change_password_on_first_login: false,
      orders_count: 9,
      regular_coins: 20000,
      tq_coins: 5000,
      reviews_written_count: 2,
      report_count: 0,
      active_devices: ['iPhone 13'],
      created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
      audit_logs: [],
    },
    {
      id: 'USR-8805',
      full_name: '[Tài khoản đã xóa do vi phạm]',
      phone: '0000000000',
      email: 'deleted_violator@sieutienich.vn',
      address: '[Đã ẩn thông tin cá nhân]',
      roles: ['buyer'],
      status: 'deleted_by_admin_permanently',
      lock_reason: 'Xóa vĩnh viễn do gian lận tích xu và vi phạm bản quyền nghiêm trọng.',
      internal_notes: 'Cắt hẳn bởi Admin tổng. Không bao giờ khôi phục được.',
      must_change_password_on_first_login: false,
      orders_count: 2,
      regular_coins: 0,
      tq_coins: 0,
      reviews_written_count: 0,
      report_count: 12,
      active_devices: [],
      created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
      audit_logs: [],
    },
  ]);

  // UI Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected User Inspector State
  const [selectedUser, setSelectedUser] = useState<AdminManagedUser | null>(null);

  // Add Form State
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('buyer');
  const [newStaffDepartment, setNewStaffDepartment] = useState<StaffDepartmentKey>('pos_counter');

  // Edit Form State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (!isOpen) return null;

  // Filter Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch = 
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.roles.includes(roleFilter as UserRole);
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get Badge Color for the 5 Standard Lifecycle States
  const getStatusBadge = (status: AccountLifecycleStatus) => {
    switch (status) {
      case 'active':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-black text-[10px]">🟢 Đang hoạt động</span>;
      case 'locked_temp':
        return <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-black text-[10px]">🟠 Tạm khoá (Mở lại được)</span>;
      case 'locked_debt':
        return <span className="bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full font-black text-[10px]">🔴 Khoá do nợ phí (Shop)</span>;
      case 'deleted_by_user_pending':
        return <span className="bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-black text-[10px]">⏳ Đã xoá theo yêu cầu (Ân hạn)</span>;
      case 'deleted_by_admin_permanently':
        return <span className="bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full font-black text-[10px]">💀 Đã xoá do vi phạm (Cắt hẳn)</span>;
    }
  };

  // Department Label Generator
  const getDepartmentLabel = (key: StaffDepartmentKey) => {
    switch (key) {
      case 'pos_counter': return '🏪 Trực Quầy TQ';
      case 'directory_entry': return '📇 Nhập Liệu Danh Bạ';
      case 'audit_reviewer': return '📋 Duyệt Hồ Sơ Shop';
      case 'customer_support': return '🎧 Hỗ Trợ Khách & CSKH';
      case 'finance_accounting': return '💰 Sổ Sách Kế Toán';
    }
  };

  // HANDLE 1: CREATE USER MANUALLY WITH STAFF DEPARTMENT TEMPLATE SELECTION
  const handleCreateUser = () => {
    if (!newFullName || !newPhone || !newPassword) {
      alert('Vui lòng điền đầy đủ Tên, Số điện thoại và Mật khẩu ban đầu!');
      return;
    }

    let staffPerms: StaffPermissions | undefined;

    if (newRole === 'staff') {
      staffPerms = {
        can_manage_users: false,
        can_lock_unlock_users: newStaffDepartment === 'customer_support',
        can_reset_passwords: newStaffDepartment === 'customer_support',
        can_manage_directory_items: newStaffDepartment === 'directory_entry',
        can_toggle_verified_badge: newStaffDepartment === 'directory_entry',
        can_manage_categories_and_regions: newStaffDepartment === 'directory_entry',
        can_approve_shop_phase1: newStaffDepartment === 'audit_reviewer',
        can_approve_shop_phase2: newStaffDepartment === 'audit_reviewer',
        can_revoke_verification_badge: newStaffDepartment === 'audit_reviewer',
        can_takedown_violating_products: newStaffDepartment === 'audit_reviewer',
        can_view_dispute_messages: newStaffDepartment === 'customer_support',
        can_scan_qr_approve_pending_coins: newStaffDepartment === 'pos_counter',
        can_manage_vouchers_and_banners: false,
        can_manually_adjust_coins: false,
        can_view_merchant_ledger: newStaffDepartment === 'finance_accounting',
        can_record_shop_payments: newStaffDepartment === 'finance_accounting',
        can_settle_monthly_ledger: false,
        can_export_financial_reports: newStaffDepartment === 'finance_accounting',
      };
    }

    const deptName = getDepartmentLabel(newStaffDepartment);

    const newUser: AdminManagedUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: newFullName,
      phone: newPhone,
      email: newEmail || `${newPhone}@sieutienich.vn`,
      roles: [newRole],
      status: 'active',
      internal_notes: newRole === 'staff' ? `Bộ phận: ${deptName} (${Object.keys(staffPerms || {}).filter(k => (staffPerms as any)[k]).length} quyền)` : undefined,
      must_change_password_on_first_login: true,
      orders_count: 0,
      regular_coins: 0,
      tq_coins: 0,
      reviews_written_count: 0,
      report_count: 0,
      active_devices: [],
      created_at: new Date().toISOString(),
      created_by_admin: true,
      audit_logs: [
        {
          id: `log-${Date.now()}`,
          user_id: `USR-NEW`,
          admin_name: isAdmin ? 'Admin Tổng' : 'Nhân Viên Staff',
          action_type: 'create',
          before_state: 'Chưa khởi tạo',
          after_state: `Tạo tài khoản thủ công [${newRole}] ${newRole === 'staff' ? `- Bộ phận: ${deptName}` : ''}`,
          reason: 'Tạo tài khoản thủ công không qua đăng ký công khai',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setUsersList([newUser, ...usersList]);
    setAddAccountModalOpen(false);
    setNewFullName('');
    setNewPhone('');
    setNewEmail('');
    setNewPassword('');

    alert(`🎉 Đã tạo thành công tài khoản cho "${newUser.full_name}"!\n${newRole === 'staff' ? `⚡ Đã gán Bộ phận: ${deptName} & tự động bật bộ quyền hạn tương ứng!` : ''}\nLần đăng nhập đầu tiên bắt buộc đổi mật khẩu.`);
  };

  // HANDLE 2: EDIT PROFILE WITH AUDIT LOG
  const handleSaveEdit = () => {
    if (!selectedUser) return;

    const beforeState = `Tên: "${selectedUser.full_name}", SĐT: "${selectedUser.phone}", Email: "${selectedUser.email}", Ghi chú: "${selectedUser.internal_notes || ''}"`;
    const afterState = `Tên: "${editFullName}", SĐT: "${editPhone}", Email: "${editEmail}", Ghi chú: "${editNotes}"`;

    const newLog: UserAccountAuditLog = {
      id: `log-${Date.now()}`,
      user_id: selectedUser.id,
      admin_name: isAdmin ? 'Admin Tổng' : 'Nhân Viên Staff',
      action_type: 'edit_profile',
      before_state: beforeState,
      after_state: afterState,
      reason: 'Cập nhật thông tin hồ sơ người dùng',
      timestamp: new Date().toISOString(),
    };

    const updated: AdminManagedUser = {
      ...selectedUser,
      full_name: editFullName,
      phone: editPhone,
      email: editEmail,
      address: editAddress,
      internal_notes: editNotes,
      audit_logs: [newLog, ...selectedUser.audit_logs],
    };

    setUsersList((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
    setSelectedUser(updated);
    setEditModalOpen(false);

    alert('✅ Đã cập nhật hồ sơ tài khoản và lưu vết Lịch sử sửa đổi trước & sau!');
  };

  // HANDLE 3: TOGGLE ROLE WITH IMMEDIATE REVOCATION
  const handleToggleRole = (user: AdminManagedUser, targetRole: UserRole) => {
    const hasRole = user.roles.includes(targetRole);
    let newRoles: UserRole[];

    if (hasRole) {
      if (user.roles.length === 1) {
        alert('Tài khoản bắt buộc phải giữ ít nhất 1 vai trò!');
        return;
      }
      newRoles = user.roles.filter((r) => r !== targetRole);
    } else {
      newRoles = [...user.roles, targetRole];
    }

    const beforeState = `Vai trò: [${user.roles.join(', ')}]`;
    const afterState = `Vai trò: [${newRoles.join(', ')}]`;
    const isRevokingStaff = hasRole && targetRole === 'staff';

    const newLog: UserAccountAuditLog = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      admin_name: isAdmin ? 'Admin Tổng' : 'Nhân Viên Staff',
      action_type: 'change_roles',
      before_state: beforeState,
      after_state: afterState,
      reason: isRevokingStaff ? 'Thu hồi vai nhân viên ngay lập tức' : 'Cập nhật vai trò tài khoản',
      timestamp: new Date().toISOString(),
    };

    const updated: AdminManagedUser = {
      ...user,
      roles: newRoles,
      audit_logs: [newLog, ...user.audit_logs],
    };

    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    if (selectedUser?.id === user.id) setSelectedUser(updated);

    if (isRevokingStaff) {
      alert('🔴 ĐÃ THU HỒI VAI NHÂN VIÊN TỨC THÌ!\nQuyền hạn mất ngay lập tức tại thời điểm bấm, người dùng bị văng khỏi trang quản trị mà không cần chờ đăng xuất.');
    } else {
      alert(`✅ Đã cập nhật vai trò cho "${user.full_name}" thành: [${newRoles.join(', ')}]`);
    }
  };

  // HANDLE 4: CHANGE LIFECYCLE STATE (LOCK / UNLOCK / RESTORE FROM GRACE PERIOD)
  const handleStateTransition = (user: AdminManagedUser, targetStatus: AccountLifecycleStatus) => {
    let reasonPrompt = '';

    if (targetStatus === 'locked_temp') {
      const input = prompt(`Nhập lý do TẠM KHÓA tài khoản "${user.full_name}":`, 'Vi phạm quy định gửi spam / tin nhắn phá phách.');
      if (!input) return;
      reasonPrompt = input;
    } else if (targetStatus === 'deleted_by_admin_permanently') {
      if (!isAdmin) {
        alert('⛔ XÓA DO VI PHẠM (CẮT HẲN VĨNH VIỄN) CHỈ DÀNH RIÊNG CHO ADMIN TỔNG!');
        return;
      }
      const input = prompt(`⚠️ XÁC NHẬN CẮT HẲN VĨNH VIỄN TÀI KHOẢN VI PHẠM "${user.full_name}".\n\nNhập lý do lưu hồ sơ audit log:`, 'Vi phạm bản quyền & lạm dụng gian lận tài chính.');
      if (!input) return;
      reasonPrompt = input;
    }

    const beforeState = `Trạng thái: ${user.status}`;
    const afterState = `Trạng thái: ${targetStatus}`;

    const newLog: UserAccountAuditLog = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      admin_name: isAdmin ? 'Admin Tổng' : 'Nhân Viên Staff',
      action_type: targetStatus.includes('lock') ? 'lock' : targetStatus === 'active' ? 'unlock' : 'soft_delete',
      before_state: beforeState,
      after_state: afterState,
      reason: reasonPrompt || (targetStatus === 'active' ? 'Mở lại tài khoản hoạt động bình thường' : 'Chuyển trạng thái tài khoản'),
      timestamp: new Date().toISOString(),
    };

    const updated: AdminManagedUser = {
      ...user,
      status: targetStatus,
      lock_reason: reasonPrompt || user.lock_reason,
      full_name: targetStatus === 'deleted_by_admin_permanently' ? '[Tài khoản đã xóa do vi phạm]' : user.full_name,
      phone: targetStatus === 'deleted_by_admin_permanently' ? '0000000000' : user.phone,
      email: targetStatus === 'deleted_by_admin_permanently' ? 'deleted_violator@sieutienich.vn' : user.email,
      audit_logs: [newLog, ...user.audit_logs],
    };

    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    if (selectedUser?.id === user.id) setSelectedUser(updated);

    if (targetStatus === 'active') {
      alert(`🟢 Đã MỞ KHÓA / KHÔI PHỤC tài khoản "${user.full_name}" hoạt động trở lại bình thường!`);
    } else if (targetStatus === 'locked_temp') {
      alert(`🟠 Đã TẠM KHÓA tài khoản "${user.full_name}". Màn hình người dùng sẽ hiển thị lý do & chỗ gửi khiếu nại.`);
    } else if (targetStatus === 'deleted_by_admin_permanently') {
      alert(`💀 Đã CẮT HẲN tài khoản do vi phạm. Không thể khôi phục.`);
    }
  };

  // HANDLE 5: RESET PASSWORD LINK TRIGGER
  const handleSendResetPasswordLink = (user: AdminManagedUser) => {
    alert(`🔑 ĐÃ GỬI MÃ ĐẶT LẠI MẬT KHẨU VỀ SĐT / THIẾT BỊ CHÍNH CHỦ "${user.phone}"!\n\n📌 RÀNG BUỘC BẢO MẬT: Admin & Nhân viên KHÔNG BAO GIỜ tự gõ mật khẩu mới cho bất kỳ ai — kể cả khi người đó nhờ.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
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
            <span>Phân Hệ Admin Quản Lý Tài Khoản & Phân Vai Nhân Viên</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">Quản Lý Tài Khoản (Thêm, Sửa, Khóa, Xóa & Phân Vai)</h2>

            <button
              onClick={() => setAddAccountModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <UserCheck className="w-4 h-4" />
              <span>+ Thêm Tài Khoản Thủ Công</span>
            </button>
          </div>
        </div>

        {/* 5 Standard Account States Explanatory Banner */}
        <div className="bg-slate-100 p-3 border-b border-gray-200 text-[11px] text-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span className="font-extrabold text-slate-900">Quy tắc 5 Trạng thái Tài khoản:</span>
          <div className="flex flex-wrap items-center gap-2 font-bold text-[10px]">
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">1. Đang hoạt động</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">2. Tạm khoá (Hiện lý do + Khiếu nại)</span>
            <span className="bg-orange-100 text-orange-900 px-2 py-0.5 rounded-full">3. Khoá nợ phí (Shop - Tự mở khi trả)</span>
            <span className="bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">4. Xoá theo yêu cầu (Ân hạn 30 ngày)</span>
            <span className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded-full">5. Xoá do vi phạm (Cắt hẳn - Chỉ Admin)</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Tìm theo Tên, SĐT, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 font-extrabold text-gray-700">
            <Filter className="w-4 h-4 text-gray-500" />
            <span>Vai trò:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-bold"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">👑 Admin tổng</option>
              <option value="staff">💼 Nhân viên</option>
              <option value="merchant">🏪 Chủ shop</option>
              <option value="buyer">👤 Khách hàng</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 font-extrabold text-gray-700">
            <span>Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 font-bold"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">🟢 Đang hoạt động</option>
              <option value="locked_temp">🟠 Tạm khoá</option>
              <option value="locked_debt">🔴 Khoá do nợ phí</option>
              <option value="deleted_by_user_pending">⏳ Xoá theo yêu cầu (Ân hạn)</option>
              <option value="deleted_by_admin_permanently">💀 Xoá do vi phạm</option>
            </select>
          </div>
        </div>

        {/* Scrollable Users List Table */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            
            {filteredUsers.map((u) => {
              const isSuperAdminUser = u.roles.includes('admin');
              const isLocked = u.status === 'locked_temp' || u.status === 'locked_debt';

              return (
                <div key={u.id} className="p-4 hover:bg-gray-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: User Info & Roles */}
                  <div className="flex items-start gap-3 min-w-0">
                    <img 
                      src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80'} 
                      alt={u.full_name}
                      className="w-11 h-11 rounded-2xl object-cover shrink-0 border border-gray-200 shadow-2xs"
                    />

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-black text-gray-900 truncate">{u.full_name}</strong>
                        {getStatusBadge(u.status)}
                      </div>

                      <div className="text-[11px] text-gray-500 font-medium flex flex-wrap items-center gap-3">
                        <span>SĐT: <strong className="text-gray-800">{u.phone}</strong></span>
                        <span>Email: <strong className="text-gray-800">{u.email}</strong></span>
                        <span>ID: <code className="text-indigo-600 bg-indigo-50 px-1 rounded">{u.id}</code></span>
                      </div>

                      {/* Display Roles Checkboxes / Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-extrabold text-gray-400">Vai trò:</span>
                        
                        {/* Admin Badge */}
                        {isSuperAdminUser && (
                          <span className="px-2 py-0.5 bg-amber-500 text-white rounded-md font-black text-[10px]">
                            👑 Admin tổng (Bất tử)
                          </span>
                        )}

                        {/* Staff Role Toggle */}
                        {!isSuperAdminUser && (
                          <button
                            onClick={() => handleToggleRole(u, 'staff')}
                            className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] transition cursor-pointer ${
                              u.roles.includes('staff') ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            💼 Nhân viên {u.roles.includes('staff') ? '✓' : '+'}
                          </button>
                        )}

                        {/* Merchant Role Toggle */}
                        {!isSuperAdminUser && (
                          <button
                            onClick={() => handleToggleRole(u, 'merchant')}
                            className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] transition cursor-pointer ${
                              u.roles.includes('merchant') ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            🏪 Chủ shop {u.roles.includes('merchant') ? '✓' : '+'}
                          </button>
                        )}

                        {/* Buyer Role Badge */}
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-extrabold text-[10px]">
                          👤 Khách hàng ✓
                        </span>
                      </div>

                      {/* Internal Notes / Department Badge */}
                      {u.internal_notes && (
                        <div className="text-[10px] text-indigo-900 bg-indigo-50 p-1.5 rounded-lg border border-indigo-200 font-bold inline-block">
                          📌 {u.internal_notes}
                        </div>
                      )}

                      {/* Lock Reason Warning Notice */}
                      {u.lock_reason && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1 font-semibold">
                          ⚠️ Lý do khóa: "{u.lock_reason}"
                        </div>
                      )}

                      {/* Grace Period Countdown Notice */}
                      {u.status === 'deleted_by_user_pending' && (
                        <div className="text-[10px] text-purple-900 bg-purple-50 p-1.5 rounded-lg border border-purple-200 mt-1 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-600" />
                          <span>Đang trong thời gian ân hạn 30 ngày đổi ý. Tự động cắt hẳn sau 22 ngày nữa.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-center">
                    
                    {/* Read-Only Full Profile Inspector */}
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        alert(`👁️ Đang mở Hồ Sơ Chi Tiết (Chế Độ Chỉ Xem Read-Only) của user "${u.full_name}"...\n\n• Vai trò: [${u.roles.join(', ')}]\n• Đơn đã đặt: ${u.orders_count}\n• Ví xu: ${u.regular_coins.toLocaleString()} Xu Thường | ${u.tq_coins.toLocaleString()} Xu TQ\n• Thiết bị đang dùng: ${u.active_devices.join(', ')}`);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      title="Xem hồ sơ đầy đủ (Chế độ chỉ xem Read-only)"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Xem Hồ Sơ</span>
                    </button>

                    {/* Edit Profile Button */}
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setEditFullName(u.full_name);
                        setEditPhone(u.phone);
                        setEditEmail(u.email);
                        setEditAddress(u.address || '');
                        setEditNotes(u.internal_notes || '');
                        setEditModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      title="Sửa thông tin & ghi vết lịch sử trước/sau"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>

                    {/* Reset Password Link Trigger Button */}
                    <button
                      onClick={() => handleSendResetPasswordLink(u)}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-extrabold text-xs flex items-center gap-1 border border-amber-200 cursor-pointer"
                      title="Gửi mã đặt lại MK về SĐT chính chủ"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gửi Mã MK</span>
                    </button>

                    {/* State Transitions: Lock / Unlock / Restore */}
                    {!isSuperAdminUser && (
                      <>
                        {u.status === 'active' && (
                          <button
                            onClick={() => handleStateTransition(u, 'locked_temp')}
                            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Tạm Khoá</span>
                          </button>
                        )}

                        {isLocked && (
                          <button
                            onClick={() => handleStateTransition(u, 'active')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Mở Khoá Ngay</span>
                          </button>
                        )}

                        {u.status === 'deleted_by_user_pending' && (
                          <button
                            onClick={() => handleStateTransition(u, 'active')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi Phục Ân Hạn</span>
                          </button>
                        )}

                        {/* Permanent Deletion (Super Admin Only) */}
                        {isAdmin && u.status !== 'deleted_by_admin_permanently' && (
                          <button
                            onClick={() => handleStateTransition(u, 'deleted_by_admin_permanently')}
                            className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                            title="Xóa hẳn do vi phạm (Chỉ Admin tổng)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa Do Vi Phạm</span>
                          </button>
                        )}
                      </>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Màn Hình
          </button>
        </div>
      </div>

      {/* SUB-MODAL 1: ADD ACCOUNT MANUALLY (WITH STAFF DEPARTMENT SELECTOR) */}
      {addAccountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-indigo-900">Tự Tạo Tài Khoản Thủ Công</h3>
              <button onClick={() => setAddAccountModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="VD: Nguyễn Thị Mai"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Email (Không bắt buộc)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Mật khẩu ban đầu *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Chọn vai trò ban đầu:</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                >
                  <option value="buyer">👤 Khách hàng</option>
                  <option value="merchant">🏪 Chủ shop (Chờ duyệt khâu 1)</option>
                  <option value="staff">💼 Nhân viên (Chọn bộ phận bên dưới)</option>
                </select>
              </div>

              {/* STAFF DEPARTMENT TEMPLATE SELECTION DROPDOWN */}
              {newRole === 'staff' && (
                <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl space-y-2">
                  <label className="block font-extrabold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    <span>Chọn Bộ Phận / Mẫu Nhân Viên Cấu Hình Sẵn:</span>
                  </label>
                  <select
                    value={newStaffDepartment}
                    onChange={(e) => setNewStaffDepartment(e.target.value as StaffDepartmentKey)}
                    className="w-full p-2.5 bg-white border border-indigo-300 rounded-xl font-black text-xs text-indigo-950 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pos_counter">🏪 1. Trực quầy (Quét mã tại quầy, duyệt xu chờ)</option>
                    <option value="directory_entry">📇 2. Nhập liệu danh bạ (Thêm/Sửa/Xóa danh bạ, xác minh, địa giới)</option>
                    <option value="audit_reviewer">📋 3. Duyệt hồ sơ (Duyệt mở shop 1 & 2, gỡ SP. Không thấy tiền!)</option>
                    <option value="customer_support">🎧 4. Hỗ trợ khách (Reset MK, khóa tài khoản phá. Không sửa xu/nợ!)</option>
                    <option value="finance_accounting">💰 5. Sổ sách (Xem công nợ, ghi nhận tiền shop, xuất báo cáo)</option>
                  </select>
                  <span className="text-[10px] text-indigo-800 font-bold block">
                    ✨ Bộ quyền tương ứng của bộ phận này sẽ được gán tự động khi tạo!
                  </span>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button onClick={() => setAddAccountModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleCreateUser} className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer">Tạo Tài Khoản</button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: EDIT PROFILE */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-indigo-900">Sửa Hồ Sơ Tài Khoản ({selectedUser.id})</h3>
              <button onClick={() => setEditModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Ghi chú nội bộ Admin</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleSaveEdit} className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer">Lưu & Lưu Vết Lịch Sử</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
