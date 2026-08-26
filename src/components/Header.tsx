import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, LogOut, Plus, ChevronDown, ShieldCheck, Coins, PackageCheck, Settings, DollarSign, MapPin, MessageSquare, Store, Clock } from 'lucide-react';
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
}) => {
  const { 
    user, 
    signOut, 
    userRole, 
    setUserRole, 
    isAdmin, 
    canApproveShops, 
    canManageProducts 
  } = useAuth();

  const { searchQuery, setSearchQuery, cartCount, setIsCartOpen, isCartOpen, regularCoins, tqCoins, orders, filteredProducts } = useShop();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Tài khoản';
  const totalCoins = regularCoins + tqCoins;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '👑 Admin tối cao';
      case 'staff':
        return '💼 Nhân viên (Staff)';
      case 'merchant':
        return '🏪 Shop (Merchant)';
      case 'buyer':
        return '👤 Người dùng (Buyer)';
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      
      {/* 4-TIER RBAC QUICK DEMO ROLE SWITCHER BAR */}
      <div className="bg-slate-900 text-white px-4 py-1 text-[11px] font-semibold flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Mô hình phân quyền 4 Cấp:</span>
          <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black text-[10px]">
            {getRoleLabel(userRole)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-slate-400 text-[10px] hidden sm:inline">Thử nghiệm vai trò:</span>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition cursor-pointer ${
              userRole === 'admin' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Quyền Admin tối cao"
          >
            👑 Admin
          </button>
          <button
            onClick={() => setUserRole('staff')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition cursor-pointer ${
              userRole === 'staff' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Quyền Nhân viên cấp dưới (Admin phân quyền)"
          >
            💼 Staff
          </button>
          <button
            onClick={() => setUserRole('merchant')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition cursor-pointer ${
              userRole === 'merchant' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Quyền Shop (Đăng tiện ích + Quản lý đơn hàng)"
          >
            🏪 Shop
          </button>
          <button
            onClick={() => setUserRole('buyer')}
            className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition cursor-pointer ${
              userRole === 'buyer' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Quyền Người dùng (Mua sắm & sử dụng dịch vụ)"
          >
            👤 Buyer
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* LOGO */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform tracking-wider">
              TQ
            </div>
            <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Siêu Tiện Ích
            </span>
          </a>

          {/* THANH TÌM KIẾM CÓ GỢI Ý & TÌM KIẾM KHÔNG DẤU */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 relative">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm shop cho thuê, đồ ăn, spa, việc làm (gõ không dấu)..." 
                className="w-full pl-10 pr-8 py-2 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition text-xs sm:text-sm text-gray-800"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* LIVE SEARCH SUGGESTIONS POPOVER WHILE TYPING */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3.5 py-1 text-[10px] text-gray-400 font-extrabold uppercase">
                  🔍 Gợi ý tìm kiếm tức thì (Gõ không dấu):
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="px-3.5 py-2 text-gray-400 text-xs">Không tìm thấy tiện ích phù hợp.</div>
                ) : (
                  filteredProducts.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSearchQuery(p.name);
                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 hover:bg-indigo-50 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.img} alt={p.name} className="w-7 h-7 object-cover rounded-lg shrink-0" />
                        <span className="font-bold text-gray-800 truncate max-w-[200px] sm:max-w-xs">{p.name}</span>
                      </div>
                      <span className="text-rose-600 font-black shrink-0">{p.price.toLocaleString()} đ</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* NÚT CHỨC NĂNG */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* VÍ XU HÀNG NGÀY BUTTON */}
            <button
              onClick={onOpenCoinWalletModal}
              title={`Xu TQ: ${tqCoins.toLocaleString()} | Xu Thường: ${regularCoins.toLocaleString()}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-xs rounded-full shadow-md shadow-amber-200 transition cursor-pointer shrink-0"
            >
              <Coins className="w-4 h-4 text-yellow-200 animate-pulse" />
              <span className="hidden sm:inline">
                {tqCoins > 0 ? `${(tqCoins / 1000).toFixed(0)}k TQ` : ''} 
                {tqCoins > 0 && regularCoins > 0 ? ' | ' : ''}
                {regularCoins > 0 ? `${(regularCoins / 1000).toFixed(0)}k Thường` : ''}
              </span>
              <span className="sm:hidden">{totalCoins.toLocaleString('vi-VN')} Xu</span>
            </button>

            {/* REALTIME NOTIFICATION BELL FOR BOTH BUYER & SHOP */}
            <NotificationBell
              onOpenOrderTrackingModal={onOpenOrderTrackingModal}
              onOpenDirectMessagingModal={onOpenDirectMessagingModal}
            />

            {/* QUẢN LÝ THEO DÕI ĐƠN HÀNG BUTTON */}
            <button
              onClick={onOpenOrderTrackingModal}
              title="Quản lý & Theo dõi tiến trình đơn hàng (5 bước)"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer shrink-0"
            >
              <PackageCheck className="w-6 h-6 text-indigo-600" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Nút Đăng tin (Shop, Staff hoặc Admin mới thấy nút) */}
            {canManageProducts && (
              <button
                onClick={onOpenAddProductModal}
                title="Đăng tiện ích mới (Dành cho Shop / Staff / Admin)"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-full border border-emerald-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Đăng tin</span>
              </button>
            )}

            {/* Giỏ hàng */}
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
              title="Danh sách tiện ích đã lưu"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition text-sm font-medium border border-indigo-200 cursor-pointer"
                >
                  <div className="w-6 h-6 bg-indigo-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate hidden md:inline">{displayName}</span>
                  <ChevronDown className="w-4 h-4 text-indigo-500" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Tài khoản xác thực</p>
                      <p className="text-xs font-bold text-gray-800 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded">
                        {getRoleLabel(userRole)}
                      </span>
                    </div>

                    {/* SHOP OPEN / PAUSE SELF TOGGLE SWITCH LINK */}
                    {(userRole === 'merchant' || userRole === 'admin' || userRole === 'staff') && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenShopStatusToggleModal();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>🏪 Bật/Tắt Trạng Thái Đang Mở & Tạm Nghỉ</span>
                      </button>
                    )}

                    {/* MULTI-STEP SHOP ONBOARDING WIZARD LINK */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenMultiStepOnboardingModal();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span>🏪 Đăng Ký Mở Shop 4 Bước (Wizard)</span>
                    </button>

                    {/* SHOP DETAIL & PORTAL (8 TABS) LINK */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenShopDetailPortalModal();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 flex items-center gap-2 border-b border-gray-100 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-indigo-600" />
                      <span>🏪 Trang Chi Tiết Gian Hàng (8 Thẻ)</span>
                    </button>

                    {/* BUYER PROFILE & DASHBOARD PORTAL LINK */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenBuyerDashboardModal();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-black text-indigo-900 hover:bg-indigo-50 flex items-center gap-2 border-b border-indigo-100 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      <span>👤 Quản Lý Tài Khoản Khách (18 Mục)</span>
                    </button>

                    {/* Ví Xu Item in User Menu */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenCoinWalletModal();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-extrabold text-amber-800 hover:bg-amber-50 flex items-center justify-between border-b border-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-600" />
                        <span>Ví Xu (TQ & Thường)</span>
                      </div>
                      <div className="text-[10px] text-right font-extrabold">
                        <div className="text-amber-600">{tqCoins.toLocaleString()} TQ</div>
                        <div className="text-emerald-600">{regularCoins.toLocaleString()} Thường</div>
                      </div>
                    </button>

                    {/* Order Tracking Menu Item */}
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        onOpenOrderTrackingModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-extrabold text-indigo-700 hover:bg-indigo-50 flex items-center justify-between border-b border-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-indigo-600" />
                        <span>Theo dõi đơn hàng (5 bước)</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {orders.length}
                      </span>
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
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng nhập / Đăng ký</span>
                <span className="sm:hidden">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
