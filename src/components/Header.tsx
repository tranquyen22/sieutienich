import React, { useState } from 'react';
import { ShoppingBag, Search, User as UserIcon, LogOut, Plus, ChevronDown, Store, ShieldCheck, Clock, Coins, PackageCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

interface HeaderProps {
  onOpenAuthModal: () => void;
  onOpenAddProductModal: () => void;
  onOpenAdminReviewModal: () => void;
  onOpenCoinWalletModal: () => void;
  onOpenOrderTrackingModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAuthModal, 
  onOpenAddProductModal, 
  onOpenAdminReviewModal,
  onOpenCoinWalletModal,
  onOpenOrderTrackingModal
}) => {
  const { user, signOut, merchantApplication, isAdmin } = useAuth();
  const { searchQuery, setSearchQuery, cartCount, setIsCartOpen, isCartOpen, regularCoins, tqCoins, orders } = useShop();
  const [showDropdown, setShowDropdown] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Tài khoản';
  const totalCoins = regularCoins + tqCoins;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
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

          {/* THANH TÌM KIẾM */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm shop cho thuê, đồ ăn, spa, việc làm, vận tải..." 
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
          </div>

          {/* NÚT CHỨC NĂNG (VÍ XU + THEO DÕI ĐƠN + NÚT ĐĂNG TIN + GIỎ HÀNG + AUTH) */}
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

            {/* QUẢN LÝ THEO DÕI ĐƠN HÀNG TRUNG GIAN BUTTON */}
            <button
              onClick={onOpenOrderTrackingModal}
              title="Quản lý & Theo dõi tiến trình đơn hàng trung gian (4 bước)"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer shrink-0"
            >
              <PackageCheck className="w-6 h-6 text-indigo-600" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </button>

            {/* Nút Đăng tin */}
            <button
              onClick={onOpenAddProductModal}
              title="Đăng tiện ích mới"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-full border border-emerald-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Đăng tin</span>
            </button>

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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Tài khoản xác thực</p>
                      <p className="text-xs font-bold text-gray-800 truncate">{user.email}</p>
                    </div>

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
                        <span>Theo dõi đơn hàng (4 bước)</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                        {orders.length}
                      </span>
                    </button>

                    {/* Merchant Application Status Badge for Normal Users */}
                    {merchantApplication && (
                      <div className="px-4 py-2 border-b border-gray-100 bg-amber-50/50">
                        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          {merchantApplication.status === 'pending_review' ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
                              <span>Hồ sơ mở Shop: Chờ Admin duyệt</span>
                            </>
                          ) : merchantApplication.status === 'approved' ? (
                            <>
                              <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Tài khoản Merchant (Đã duyệt Shop)</span>
                            </>
                          ) : (
                            <span>Hồ sơ mở Shop: Từ chối</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ONLY VISIBLE FOR ADMIN ACCOUNTS */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenAdminReviewModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 transition border-b border-gray-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>Duyệt hồ sơ mở Shop (Chỉ Admin)</span>
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
