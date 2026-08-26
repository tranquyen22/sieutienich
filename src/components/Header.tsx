import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, LogOut, Plus, ChevronDown, ShieldCheck, Coins, PackageCheck, Settings, DollarSign, MapPin, MessageSquare, Store, Key, Users, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { NotificationBell } from './NotificationBell';
import type { UserRole } from '../types';

interface HeaderProps {
  onOpenAuthModal: () => void;
  onOpenAddProductModal: () => void;
  onOpenAdminReviewModal: () => void;
  onOpenCoinWalletModal: () => void;
  onOpenOrderTrackingModal: () => void;
  onOpenStaffPermissionModal: () => void;
  onOpenMerchantReconciliationModal: () => void;
  onOpenCustomerAddressBookModal: () => void;
  onOpenDirectMessagingModal: () => void;
  onOpenBuyerDashboardModal: () => void;
  onOpenMultiStepOnboardingModal: () => void;
  onOpenShopDetailPortalModal: () => void;
  onOpenShopStatusToggleModal: () => void;
  onOpenAccountRoleAccessMatrixModal: () => void;
  onOpenAdminUserManagementModal: () => void;
  onOpenAdminDashboardModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAuthModal, 
  onOpenAddProductModal, 
  onOpenAdminReviewModal,
  onOpenCoinWalletModal,
  onOpenOrderTrackingModal,
  onOpenStaffPermissionModal,
  onOpenMerchantReconciliationModal,
  onOpenCustomerAddressBookModal,
  onOpenDirectMessagingModal,
  onOpenBuyerDashboardModal,
  onOpenMultiStepOnboardingModal,
  onOpenShopDetailPortalModal,
  onOpenShopStatusToggleModal,
  onOpenAccountRoleAccessMatrixModal,
  onOpenAdminUserManagementModal,
  onOpenAdminDashboardModal,
}) => {
  const { 
    user, 
    signOut, 
    userRole, 
    isAdmin, 
    canApproveShops, 
    canManageProducts 
  } = useAuth();

  const { searchQuery, setSearchQuery, setSelectedCategory, cartCount, setIsCartOpen } = useShop();
  const [showDropdown, setShowDropdown] = useState(false);

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-500 text-white shadow-sm';
      case 'staff':
        return 'bg-indigo-600 text-white shadow-sm';
      case 'merchant':
        return 'bg-emerald-600 text-white shadow-sm';
      case 'buyer':
      default:
        return 'bg-blue-600 text-white shadow-sm';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '👑 Admin tổng (Tối cao)';
      case 'staff':
        return '💼 Nhân viên (Staff)';
      case 'merchant':
        return '🏪 Shop (Merchant)';
      case 'buyer':
        return '👤 Khách (Buyer)';
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* BRAND LOGO */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setSelectedCategory('all')}>
            <div className="bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white p-2 rounded-2xl shadow-md shadow-indigo-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 bg-clip-text text-transparent block leading-none">
                SIÊU TIỆN ÍCH
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 tracking-wider uppercase block mt-0.5">
                Danh bạ & Thương Mại Điện Tử
              </span>
            </div>
          </div>

          {/* SEARCH BAR WITH LIVE ACCENTLESS SEARCH */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm, shop, kiot, quán ăn (gõ không dấu vẫn ra)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200 rounded-full text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs font-bold bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* NOTIFICATION BELL WITH COUNTER */}
            <NotificationBell 
              onOpenOrderTrackingModal={onOpenOrderTrackingModal}
              onOpenDirectMessagingModal={onOpenDirectMessagingModal}
            />

            {/* SHOPPING CART BUTTON */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition cursor-pointer"
              title="Giỏ hàng của bạn"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* BUTTON 1: BẤM ĐĂNG KÝ SHOP NỔI TRÊN TRANG CHỦ */}
            <button
              onClick={onOpenMultiStepOnboardingModal}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-xs font-black shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
              title="Đăng ký mở gian hàng từng bước"
            >
              <Store className="w-4 h-4" />
              <span>Đăng Ký Shop</span>
            </button>

            {/* BUTTON 2: ĐĂNG SẢN PHẨM MỚI (CHỈ HIỆN CHO MERCHANT / STAFF / ADMIN) */}
            {canManageProducts && (
              <button
                onClick={onOpenAddProductModal}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-black shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Sản Phẩm</span>
              </button>
            )}

            {/* USER PROFILE / AVATAR DROPDOWN MENU */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full hidden sm:inline ${getRoleBadgeStyle(userRole)}`}>
                    {getRoleLabel(userRole)}
                  </span>

                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {/* DROPDOWN MENU ITEMS */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-gray-100 bg-slate-50/50">
                      <p className="text-xs font-black text-gray-900 truncate">
                        {user.user_metadata?.full_name || 'Người dùng Siêu Tiện Ích'}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* SUPER ADMIN DASHBOARD LANDING SCREEN (HÔM NAY CÓ GÌ CẦN LÀM & SÀN ĐANG CHẠY RA SAO) */}
                    {isAdmin && onOpenAdminDashboardModal && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenAdminDashboardModal();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-slate-900 bg-amber-50/80 hover:bg-amber-100 border-b border-amber-200 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>📊 Dashboard Quản Trị Sàn (Màn hình chính)</span>
                      </button>
                    )}

                    {/* ADMIN USER MANAGEMENT HUB (THÊM, SỬA, XÓA, KHÓA TK) */}
                    {(userRole === 'admin' || userRole === 'staff') && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenAdminUserManagementModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-extrabold text-blue-900 hover:bg-blue-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>👥 Admin Quản Lý Tài Khoản (Thêm/Sửa/Xóa)</span>
                      </button>
                    )}

                    {/* 4-TIER RBAC ROLE MATRIX MODAL */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenAccountRoleAccessMatrixModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>🛡️ Bốn Loại Tài Khoản & Ma Trận Phân Quyền</span>
                    </button>

                    {/* BUYER DASHBOARD PORTAL MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenBuyerDashboardModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-900 hover:bg-indigo-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      <span>Hồ Sơ Khách Hàng (18 Phân Hệ)</span>
                    </button>

                    {/* SHOP DETAIL PORTAL MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenShopDetailPortalModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-slate-700" />
                      <span>Trang Quản Lý Gian Hàng (Shop Portal)</span>
                    </button>

                    {/* SHOP OPEN/TEMPORARILY CLOSED STATUS TOGGLE */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenShopStatusToggleModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-orange-900 hover:bg-orange-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-orange-600" />
                      <span>Trạng Thái Đang Mở / Tạm Nghỉ Shop</span>
                    </button>

                    {/* VÍ XU SIÊU TIỆN ÍCH MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenCoinWalletModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>Ví Xu Siêu Tiện Ích</span>
                    </button>

                    {/* QUẢN LÝ ĐƠN HÀNG MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenOrderTrackingModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <PackageCheck className="w-4 h-4 text-emerald-600" />
                      <span>Đơn Hàng Của Tôi</span>
                    </button>

                    {/* SỔ ĐỊA CHỈ KHÁCH HÀNG MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenCustomerAddressBookModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>Sổ Địa Chỉ Giao Hàng</span>
                    </button>

                    {/* DIRECT MESSAGING CHAT MENU ITEM */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenDirectMessagingModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-800 hover:bg-indigo-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>Nhắn tin Khách ⇄ Shop</span>
                    </button>

                    {/* RECONCILIATION & FINANCIAL LEDGER BUTTON (Merchant & Admin) */}
                    {(userRole === 'merchant' || userRole === 'admin' || userRole === 'staff') && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenMerchantReconciliationModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-extrabold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                      >
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span>Đối soát Công nợ (Sàn ⇄ Shop)</span>
                      </button>
                    )}

                    {/* ADMIN STAFF PERMISSION MANAGEMENT BUTTON */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenStaffPermissionModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-50 flex items-center gap-2 transition border-b border-gray-100 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-violet-600" />
                        <span>Cấp quyền Nhân viên (Admin)</span>
                      </button>
                    )}

                    {/* ADMIN OR AUTHORIZED STAFF REVIEW SHOPS BUTTON */}
                    {canApproveShops && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenAdminReviewModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition border-b border-gray-100 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Duyệt hồ sơ mở Shop ({isAdmin ? 'Admin' : 'Staff'})</span>
                      </button>
                    )}

                    <button
                      onClick={async () => {
                        setShowDropdown(false);
                        await signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-black shadow-md transition cursor-pointer"
              >
                Đăng Nhập
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
