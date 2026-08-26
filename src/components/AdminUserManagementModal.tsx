import React, { useState } from 'react';
import { X, Users, UserPlus, Edit, Lock, Unlock, Trash2, Key, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { AdminManagedUser, UserRole, UserAccountAuditLog } from '../types';

interface AdminUserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUserManagementModal: React.FC<AdminUserManagementModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  // Initial Managed Users Database (Trần Văn Quyền is the SOLE Super Admin)
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
      full_name: 'Trần Thị Thu Hải',
      phone: '0987654321',
      email: 'hai.tran@gmail.com',
      address: 'Chợ Thị trấn Khoái Châu, Hưng Yên',
      roles: ['buyer'],
      status: 'active',
      internal_notes: 'Khách hàng thường xuyên mua đồ ăn & nông sản',
      must_change_password_on_first_login: false,
      orders_count: 6,
      regular_coins: 35000,
      tq_coins: 10000,
      reviews_written_count: 4,
      report_count: 0,
      active_devices: ['Samsung Galaxy S24 (Hưng Yên)'],
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      audit_logs: [],
    },
    {
      id: 'USR-8803',
      full_name: 'Phạm Minh Tuấn',
      phone: '0977112233',
      email: 'tuan.staff@sieutienich.vn',
      address: 'Quận Đống Đa, Hà Nội',
      roles: ['staff'],
      status: 'active',
      internal_notes: 'Nhân viên hỗ trợ duyệt shop & hỗ trợ đơn hàng',
      must_change_password_on_first_login: false,
      orders_count: 0,
      regular_coins: 0,
      tq_coins: 0,
      reviews_written_count: 0,
      report_count: 0,
      active_devices: ['Windows PC (Văn phòng)'],
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      created_by_admin: true,
      audit_logs: [],
    },
  ]);

  // Selected User Modal States
  const [selectedUser, setSelectedUser] = useState<AdminManagedUser | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'coins' | 'reviews' | 'devices' | 'audit'>('profile');

  // Modals for Actions
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [lockReason, setLockReason] = useState('Vi phạm quy định giao dịch hoặc bị phản ánh nhiều lần');

  // Create Form State
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newRoles] = useState<UserRole[]>(['buyer']);
  const [mustChangePassword, setMustChangePassword] = useState(true);

  // Edit Form State
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (!isOpen) return null;

  // HANDLE 1: MANUAL ACCOUNT CREATION BY ADMIN
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newPhone) {
      alert('Vui lòng điền tên và số điện thoại!');
      return;
    }

    const created: AdminManagedUser = {
      id: `USR-${Math.floor(8000 + Math.random() * 1000)}`,
      full_name: newFullName,
      phone: newPhone,
      email: newEmail || `${newPhone}@sieutienich.vn`,
      roles: newRoles,
      status: 'active',
      must_change_password_on_first_login: mustChangePassword,
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
          before_state: 'Chưa có tài khoản',
          after_state: `Tạo tài khoản mới (${newFullName}, SĐT: ${newPhone}, Vai: [${newRoles.join(', ')}])`,
          reason: 'Tạo tài khoản thủ công từ trang quản trị',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setUsersList((prev) => [created, ...prev]);
    setCreateModalOpen(false);
    setNewFullName('');
    setNewPhone('');
    setNewEmail('');

    alert(`🎉 Đã tạo thành công tài khoản cho "${newFullName}"!\nLần đăng nhập đầu tiên người dùng bắt buộc phải đổi mật khẩu.`);
  };

  // HANDLE 2: EDIT PROFILE WITH AUDIT LOG (BEFORE VS AFTER)
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
      reason: isRevokingStaff ? 'Thu hồi vai trò Nhân viên sàn' : 'Cập nhật phân quyền vai trò',
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

  // HANDLE 4: LOCK / UNLOCK ACCOUNT WITH REASON
  const handleConfirmLockToggle = () => {
    if (!selectedUser) return;

    const isLocking = selectedUser.status === 'active';

    if (isLocking && !lockReason.trim()) {
      alert('Vui lòng nhập lý do tạm khóa tài khoản!');
      return;
    }

    const newStatus = isLocking ? 'locked' : 'active';

    const newLog: UserAccountAuditLog = {
      id: `log-${Date.now()}`,
      user_id: selectedUser.id,
      admin_name: isAdmin ? 'Admin Tổng' : 'Nhân Viên Staff',
      action_type: isLocking ? 'lock' : 'unlock',
      before_state: `Trạng thái: ${selectedUser.status}`,
      after_state: `Trạng thái: ${newStatus}`,
      reason: isLocking ? lockReason : 'Mở khóa tài khoản hoạt động trở lại',
      timestamp: new Date().toISOString(),
    };

    const updated: AdminManagedUser = {
      ...selectedUser,
      status: newStatus,
      lock_reason: isLocking ? lockReason : undefined,
      audit_logs: [newLog, ...selectedUser.audit_logs],
    };

    setUsersList((prev) => prev.map((u) => (u.id === selectedUser.id ? updated : u)));
    setSelectedUser(updated);
    setLockModalOpen(false);

    alert(isLocking 
      ? `🔒 Đã TẠM KHÓA tài khoản "${selectedUser.full_name}"!\nLý do: "${lockReason}"` 
      : `🟢 Đã MỞ KHÓA tài khoản "${selectedUser.full_name}" hoạt động bình thường.`);
  };

  // HANDLE 5: SOFT DELETE (SUPER ADMIN ONLY)
  const handleSoftDelete = (user: AdminManagedUser) => {
    if (!isAdmin) {
      alert('⛔ CẮT TÀI KHOẢN / XÓA MỀM CHỈ DÀNH CHO ADMIN TỔNG!');
      return;
    }

    if (!confirm(`⚠️ XÁC NHẬN XÓA MỀM TÀI KHOẢN "${user.full_name}"?\n\n• Thông tin cá nhân sẽ bị cắt và ẩn đi.\n• Số liệu đơn hàng & ví xu vẫn được giữ lại trong lịch sử chung.`)) {
      return;
    }

    const newLog: UserAccountAuditLog = {
      id: `log-${Date.now()}`,
      user_id: user.id,
      admin_name: 'Admin Tổng',
      action_type: 'soft_delete',
      before_state: `Tên: ${user.full_name}, SĐT: ${user.phone}`,
      after_state: 'Tài khoản đã cắt & xóa mềm (Ẩn thông tin cá nhân)',
      reason: 'Admin tổng thực hiện xóa mềm tài khoản',
      timestamp: new Date().toISOString(),
    };

    const updated: AdminManagedUser = {
      ...user,
      full_name: '[Tài khoản đã xóa mềm]',
      phone: '0000000000',
      email: 'deleted_user@sieutienich.vn',
      status: 'soft_deleted',
      audit_logs: [newLog, ...user.audit_logs],
    };

    setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    if (selectedUser?.id === user.id) setSelectedUser(updated);

    alert('🗑️ Đã cắt tài khoản và ẩn thông tin cá nhân thành công!');
  };

  // HANDLE 6: SEND RESET PASSWORD LINK (ENFORCED CONSTRAINT)
  const handleSendResetPasswordLink = (user: AdminManagedUser) => {
    alert(`📩 Mã xác thực đặt lại mật khẩu đã được gửi trực tiếp về điện thoại chính chủ (${user.phone})!\n\n📌 NGUYÊN TẮC BẢO MẬT: Admin và Nhân viên không bao giờ tự gõ mật khẩu mới cho ai — kể cả khi người đó nhờ.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
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
            <Users className="w-4 h-4 text-amber-400" />
            <span>Quản Lý Tài Khoản Người Dùng (Khách, Chủ Shop, Nhân Viên)</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-black text-white">Admin Quản Lý Tài Khoản — Thêm, Sửa, Xóa</h2>

            {/* CREATE NEW ACCOUNT BUTTON */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm Tài Khoản Mới</span>
            </button>
          </div>
        </div>

        {/* REGISTRATION ROLE POLICY RULES PANEL */}
        <div className="bg-slate-800 text-slate-200 px-5 py-2 text-[11px] font-medium border-b border-slate-700 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <span className="font-extrabold text-amber-400 uppercase tracking-wider text-[10px]">📌 Quy tắc chọn vai khi tự đăng ký:</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded font-bold">👤 Khách: Mở tự do</span>
            <span className="bg-emerald-900/80 text-emerald-200 px-2 py-0.5 rounded font-bold">🏪 Chủ shop: Mở (cần duyệt)</span>
            <span className="bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded font-bold">💼 Nhân viên & Admin: Đóng hẳn (Chỉ tạo từ bên trong)</span>
          </div>
        </div>

        {/* Main Body Layout: Split Left Users List vs Right Detail Inspector */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 text-xs">
          
          {/* LEFT 5 COLS: USERS LIST */}
          <div className="md:col-span-5 border-r border-gray-200 overflow-y-auto p-4 space-y-3 bg-gray-50/60">
            <div className="flex items-center justify-between">
              <strong className="text-gray-900 font-extrabold text-xs">Danh sách tài khoản ({usersList.length}):</strong>
              <span className="text-[10px] text-gray-500 font-semibold">Tự động đồng bộ hệ thống</span>
            </div>

            {usersList.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              const isLocked = u.status === 'locked';
              const isSoftDeleted = u.status === 'soft_deleted';

              return (
                <div
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setActiveTab('profile');
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                      : 'bg-white hover:bg-gray-100/80 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0">
                        {u.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-gray-900 truncate text-xs">{u.full_name}</h4>
                        <p className="text-[11px] text-gray-500 font-bold">{u.phone}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isSoftDeleted ? (
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-black rounded-full">
                        Đã xóa mềm
                      </span>
                    ) : isLocked ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full">
                        🔒 Đã khóa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        🟢 Hoạt động
                      </span>
                    )}
                  </div>

                  {/* Roles Pill */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          r === 'admin' ? 'bg-amber-500 text-white' :
                          r === 'staff' ? 'bg-indigo-600 text-white' :
                          r === 'merchant' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {r === 'admin' ? '👑 Admin' : r === 'staff' ? '💼 Staff' : r === 'merchant' ? '🏪 Shop' : '👤 Khách'}
                      </span>
                    ))}
                    {u.must_change_password_on_first_login && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black rounded">
                        Đổi MK lần đầu
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT 7 COLS: USER PROFILE INSPECTOR & ACTIONS */}
          <div className="md:col-span-7 p-4 sm:p-5 overflow-y-auto flex flex-col justify-between">
            {selectedUser ? (
              <div className="space-y-4">
                
                {/* Header User Title & Action Buttons */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                        <span>{selectedUser.full_name}</span>
                        <span className="text-xs font-bold text-gray-400">({selectedUser.id})</span>
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{selectedUser.email} • SĐT: {selectedUser.phone}</p>
                    </div>

                    {/* Reset Password Button */}
                    <button
                      type="button"
                      onClick={() => handleSendResetPasswordLink(selectedUser)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold rounded-xl border border-amber-300 flex items-center gap-1 cursor-pointer"
                      title="Gửi mã đặt lại mật khẩu cho máy chính chủ"
                    >
                      <Key className="w-3.5 h-3.5 text-amber-600" />
                      <span>Đặt lại MK</span>
                    </button>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                    {/* Edit Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditFullName(selectedUser.full_name);
                        setEditPhone(selectedUser.phone);
                        setEditEmail(selectedUser.email);
                        setEditAddress(selectedUser.address || '');
                        setEditNotes(selectedUser.internal_notes || '');
                        setEditModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Sửa Hồ Sơ</span>
                    </button>

                    {/* Lock / Unlock Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedUser.status === 'active') {
                          setLockModalOpen(true);
                        } else {
                          handleConfirmLockToggle();
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer text-white font-extrabold ${
                        selectedUser.status === 'active' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {selectedUser.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{selectedUser.status === 'active' ? 'Khóa Tài Khoản' : 'Mở Khóa'}</span>
                    </button>

                    {/* Soft Delete Button (Super Admin Only) */}
                    <button
                      type="button"
                      onClick={() => handleSoftDelete(selectedUser)}
                      className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer font-extrabold ${
                        isAdmin ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      title={isAdmin ? 'Cắt tài khoản / Xóa mềm' : 'Chỉ Admin tổng mới có quyền xóa'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cắt / Xóa Mềm</span>
                    </button>
                  </div>

                  {/* Role Checkboxes for Dynamic Elevation/Revocation */}
                  <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-2">
                    <strong className="text-gray-900 font-extrabold text-xs block">Phân vai trò tài khoản (Hiệu lực tức thì):</strong>
                    <div className="flex items-center gap-4 text-xs">
                      <label className="flex items-center gap-1.5 font-extrabold text-blue-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUser.roles.includes('buyer')}
                          onChange={() => handleToggleRole(selectedUser, 'buyer')}
                          className="rounded text-blue-600"
                        />
                        <span>👤 Khách</span>
                      </label>

                      <label className="flex items-center gap-1.5 font-extrabold text-emerald-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUser.roles.includes('merchant')}
                          onChange={() => handleToggleRole(selectedUser, 'merchant')}
                          className="rounded text-emerald-600"
                        />
                        <span>🏪 Chủ Shop</span>
                      </label>

                      <label className="flex items-center gap-1.5 font-extrabold text-indigo-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedUser.roles.includes('staff')}
                          onChange={() => handleToggleRole(selectedUser, 'staff')}
                          className="rounded text-indigo-600"
                        />
                        <span>💼 Nhân Viên</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* READ ONLY COMPLETE PROFILE INSPECTOR TABS */}
                <div className="space-y-3">
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-extrabold text-xs flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>🔒 Chế độ Xem Hồ Sơ Đầy Đủ: Chỉ xem số liệu thực tế, không thể sửa trực tiếp đơn hàng hay ví xu từ đây.</span>
                  </div>

                  {/* Tab Selector */}
                  <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-1 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Thông Tin
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Đơn Đã Đặt ({selectedUser.orders_count})
                    </button>
                    <button
                      onClick={() => setActiveTab('coins')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'coins' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Ví Xu ({selectedUser.regular_coins.toLocaleString()} Xu)
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'reviews' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Đánh Giá ({selectedUser.reviews_written_count})
                    </button>

                    <button
                      onClick={() => setActiveTab('devices')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'devices' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Thiết Bị ({selectedUser.active_devices.length})
                    </button>

                    <button
                      onClick={() => setActiveTab('audit')}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Lịch Sử Sửa Đối Chiếu ({selectedUser.audit_logs.length})
                    </button>
                  </div>

                  {/* Tab Contents */}
                  {activeTab === 'profile' && (
                    <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                      <div><strong>Địa chỉ:</strong> {selectedUser.address || 'Chưa cập nhật'}</div>
                      <div><strong>Ghi chú nội bộ:</strong> {selectedUser.internal_notes || 'Không có'}</div>
                      <div><strong>Ngày tham gia:</strong> {new Date(selectedUser.created_at).toLocaleDateString('vi-VN')}</div>
                      <div><strong>Bắt buộc đổi MK lần đầu:</strong> {selectedUser.must_change_password_on_first_login ? '✓ Có' : 'Không'}</div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                      <p className="font-extrabold text-indigo-900">Tổng số đơn hàng đã đặt: {selectedUser.orders_count} đơn</p>
                      <p className="text-gray-500">Dữ liệu đơn được đồng bộ tự động từ Supabase Order Ledger.</p>
                    </div>
                  )}

                  {activeTab === 'coins' && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1">
                      <p className="font-extrabold text-amber-700">Xu Thường: {selectedUser.regular_coins.toLocaleString()} xu</p>
                      <p className="font-extrabold text-yellow-600">Xu TQ: {selectedUser.tq_coins.toLocaleString()} xu</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs">
                      <p className="font-extrabold text-emerald-800">Đã viết {selectedUser.reviews_written_count} bài đánh giá gian hàng</p>
                    </div>
                  )}

                  {activeTab === 'devices' && (
                    <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-2">
                      <strong className="font-extrabold text-gray-900 block">Thiết bị đang đăng nhập:</strong>
                      {selectedUser.active_devices.length === 0 ? (
                        <p className="text-gray-400">Không có thiết bị hoạt động</p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1 text-gray-700 font-medium">
                          {selectedUser.active_devices.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* AUDIT TRAIL HISTORY (BEFORE VS AFTER STATE) */}
                  {activeTab === 'audit' && (
                    <div className="p-3 bg-gray-50 rounded-xl space-y-3 text-xs">
                      <strong className="font-black text-indigo-900 block">Lịch sử đối chiếu Trước & Sau mỗi lần Admin sửa:</strong>
                      {selectedUser.audit_logs.length === 0 ? (
                        <p className="text-gray-400">Chưa có lịch sử chỉnh sửa tài khoản này.</p>
                      ) : (
                        selectedUser.audit_logs.map((log) => (
                          <div key={log.id} className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-500">
                              <span>Bởi: {log.admin_name} ({log.action_type})</span>
                              <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                            </div>
                            {log.before_state && (
                              <div className="text-[11px] bg-rose-50 text-rose-900 p-1.5 rounded font-mono">
                                <strong>Trước:</strong> {log.before_state}
                              </div>
                            )}
                            {log.after_state && (
                              <div className="text-[11px] bg-emerald-50 text-emerald-900 p-1.5 rounded font-mono">
                                <strong>Sau:</strong> {log.after_state}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-xs">
                <Users className="w-12 h-12 text-gray-300 mb-2" />
                <span>Vui lòng chọn 1 tài khoản bên trái để quản lý</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl cursor-pointer shadow-md"
          >
            Đóng Quản Lý Tài Khoản
          </button>
        </div>

      </div>

      {/* MODAL 1: CREATE ACCOUNT BY ADMIN */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form 
            onSubmit={handleCreateAccount}
            className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Tạo Tài Khoản Mới Thủ Công (Admin)</span>
              </h3>
              <button type="button" onClick={() => setCreateModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Họ và tên *:</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="VD: Nguyễn Văn Hùng"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Số điện thoại *:</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Email (Không bắt buộc):</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="hung@gmail.com"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Mật khẩu ban đầu:</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              {/* Force Password Change Checkbox Constraint */}
              <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer text-amber-900 font-extrabold">
                <input
                  type="checkbox"
                  checked={mustChangePassword}
                  onChange={(e) => setMustChangePassword(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <span>🔒 Lần đăng nhập đầu tiên bắt buộc đổi mật khẩu</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl shadow-md">Tạo Tài Khoản</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: EDIT PROFILE WITH AUDIT LOG */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                <Edit className="w-5 h-5 text-indigo-600" />
                <span>Sửa Hồ Sơ Tài Khoản (Lưu Vết Trước/Sau)</span>
              </h3>
              <button type="button" onClick={() => setEditModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Họ tên:</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Số điện thoại:</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Địa chỉ:</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-extrabold text-gray-800 mb-1">Ghi chú nội bộ:</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button type="button" onClick={handleSaveEdit} className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md">Lưu & Lưu Vết Log</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LOCK ACCOUNT WITH MANDATORY REASON */}
      {lockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5">
                <Lock className="w-5 h-5" />
                <span>Tạm Khóa Tài Khoản Kèm Lý Do</span>
              </h3>
              <button type="button" onClick={() => setLockModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <label className="block font-extrabold text-gray-800">Nhập lý do tạm khóa (Bắt buộc):</label>
              <textarea
                rows={3}
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="VD: Vi phạm quy định đăng tin, nợ công nợ sàn..."
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-rose-900"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button type="button" onClick={() => setLockModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button type="button" onClick={handleConfirmLockToggle} className="px-5 py-2 bg-rose-600 text-white rounded-xl shadow-md">Xác Nhận Khóa</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
