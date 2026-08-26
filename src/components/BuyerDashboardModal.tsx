import React, { useState } from 'react';
import { 
  X, ShoppingBag, Coins, Ticket, MapPin, Clock, MessageSquare, 
  Star, Calendar, KeyRound, 
  LogOut, ChevronRight, Truck, CheckCircle2, RotateCcw, Package, Sparkles, Store
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import type { CustomerAddress } from '../types';

interface BuyerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: CustomerAddress[];
  onOpenAddressBook: () => void;
  onOpenMessaging: () => void;
  onOpenOrderTracking: () => void;
}

export const BuyerDashboardModal: React.FC<BuyerDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenAddressBook,
  onOpenMessaging,
  onOpenOrderTracking,
}) => {
  const { 
    regularCoins, 
    tqCoins, 
    dailyCheckIn, 
    checkInStreak,
    orders
  } = useShop();

  const { user, signOut } = useAuth();

  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled'>('all');

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'orders' 
    | 'wallet' 
    | 'vouchers' 
    | 'addresses' 
    | 'messages' 
    | 'notifications' 
    | 'reviews' 
    | 'checkin' 
    | 'booking' 
    | 'rentals' 
    | 'support' 
    | 'settings' 
    | 'delete_account'
  >('overview');

  if (!isOpen) return null;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Khách Hàng Siêu Tiện Ích';
  const displayPhone = user?.user_metadata?.phone || '0367.818.343';
  const displayEmail = user?.email || 'tranvanquyen2211@gmail.com';

  const handleSignOutUser = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản cá nhân?')) {
      await signOut();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col md:flex-row min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* DESKTOP & TABLET SIDEBAR NAVIGATION */}
        <div className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 overflow-y-auto space-y-4 text-xs">
          
          {/* User Profile Card Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm text-white truncate">{displayName}</h3>
              <p className="text-[10px] text-slate-400 truncate">{displayPhone}</p>
              <span className="text-[9px] text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
                🥇 Hạng Vàng TQ Member
              </span>
            </div>
          </div>

          {/* Nav Group 1: Overview & Orders */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider px-2 mb-1">
              Trang cá nhân & Đơn hàng
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. Tổng Quan Hồ Sơ</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span>2. Đơn Hàng Của Tôi</span>
              </div>
              <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full font-extrabold text-[10px]">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'wallet' ? 'bg-amber-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>3. Ví Xu & Điểm Thưởng</span>
              </div>
              <span className="text-[10px] text-amber-300 font-extrabold">{(regularCoins + tqCoins).toLocaleString()} Xu</span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'vouchers' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Ticket className="w-4 h-4 text-rose-400" />
              <span>4. Mã Ưu Đãi Voucher (3)</span>
            </button>
          </div>

          {/* Nav Group 2: Personalization & Address */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider px-2 mb-1">
              Tiện ích & Địa chỉ
            </div>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'addresses' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>5. Sổ Địa Chỉ & GPS Maps</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'messages' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>6. Tin Nhắn Messenger</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'reviews' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>7. Đánh Giá Của Tôi</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'booking' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>8. Đặt Lịch Booking</span>
            </button>

            <button
              onClick={() => setActiveTab('rentals')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'rentals' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Store className="w-4 h-4 text-orange-400" />
              <span>9. Theo Dõi Đồ Đang Thuê</span>
            </button>
          </div>

          {/* Nav Group 3: Settings & Logout */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <KeyRound className="w-4 h-4 text-slate-400" />
              <span>10. Cài Đặt & Bảo Mật</span>
            </button>

            <button
              onClick={handleSignOutUser}
              className="w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 hover:bg-rose-950/40 text-rose-400 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          </div>

        </div>

        {/* MOBILE HORIZONTAL SUBTAB BAR (Visible on Smartphones) */}
        <div className="md:hidden bg-slate-900 text-white p-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🌟 Hồ Sơ Chuẩn
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🛍️ Đơn Hàng ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'wallet' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🪙 Ví Xu ({(regularCoins + tqCoins).toLocaleString()})
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'vouchers' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🎟️ Mã Voucher
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'addresses' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🗺️ Ghim Địa Chỉ Maps
          </button>
        </div>

        {/* MAIN DISPLAY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative text-xs font-medium">
          
          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* TAB 1: OVERVIEW (MODERN E-COMMERCE PROFILE DASHBOARD) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Profile Card Header Banner */}
              <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-2xl text-white border-2 border-white/30 shadow-md shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-lg font-black text-white">{displayName}</strong>
                        <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded-full font-bold text-[10px] border border-emerald-300/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Chính chủ</span>
                        </span>
                      </div>
                      <p className="text-xs text-indigo-200 font-medium">SĐT: {displayPhone} • Email: {displayEmail}</p>
                      <span className="text-[10px] text-amber-200 bg-amber-950/80 px-2.5 py-0.5 rounded-full font-bold border border-amber-300/30 inline-block">
                        🥇 Thành Viên Vàng TQ Member (Đã xác thực)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md font-bold text-xs transition cursor-pointer border border-white/30"
                  >
                    ✏️ Sửa Hồ Sơ
                  </button>
                </div>

                {/* DUAL WALLET & VOUCHER QUICK BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/20 text-center">
                  <div 
                    onClick={() => setActiveTab('wallet')}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-[10px] text-amber-200 block font-bold">🪙 Ví Xu Thường</span>
                    <strong className="text-sm font-black text-amber-300">{regularCoins.toLocaleString()} Xu</strong>
                  </div>

                  <div 
                    onClick={() => setActiveTab('wallet')}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-[10px] text-yellow-200 block font-bold">👑 Ví Xu TQ</span>
                    <strong className="text-sm font-black text-yellow-300">{tqCoins.toLocaleString()} Xu</strong>
                  </div>

                  <div 
                    onClick={() => setActiveTab('vouchers')}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-[10px] text-rose-200 block font-bold">🎟️ Mã Voucher</span>
                    <strong className="text-sm font-black text-white">3 Khả dụng</strong>
                  </div>

                  <div 
                    onClick={dailyCheckIn}
                    className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition cursor-pointer backdrop-blur-sm"
                  >
                    <span className="text-[10px] text-emerald-200 block font-bold">🔥 Điểm danh</span>
                    <strong className="text-sm font-black text-emerald-300">Day {checkInStreak}/7 (+50)</strong>
                  </div>
                </div>
              </div>

              {/* 5-STEP ORDER PIPELINE GRID (STANDARD E-COMMERCE FORM) */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-sm flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    <span>Đơn Hàng Của Tôi</span>
                  </h3>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Xem lịch sử đơn</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1 text-center pt-2">
                  <div 
                    onClick={() => { setOrderFilter('pending'); setActiveTab('orders'); }}
                    className="p-2.5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition cursor-pointer space-y-1"
                  >
                    <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block">Chờ nhận</span>
                  </div>

                  <div 
                    onClick={() => { setOrderFilter('preparing'); setActiveTab('orders'); }}
                    className="p-2.5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition cursor-pointer space-y-1"
                  >
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block">Chuẩn bị</span>
                  </div>

                  <div 
                    onClick={() => { setOrderFilter('shipping'); setActiveTab('orders'); }}
                    className="p-2.5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition cursor-pointer space-y-1"
                  >
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block">Đang giao</span>
                  </div>

                  <div 
                    onClick={() => { setOrderFilter('completed'); setActiveTab('orders'); }}
                    className="p-2.5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition cursor-pointer space-y-1"
                  >
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block">Đánh giá (+Xu)</span>
                  </div>

                  <div 
                    onClick={() => { setOrderFilter('cancelled'); setActiveTab('orders'); }}
                    className="p-2.5 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 transition cursor-pointer space-y-1"
                  >
                    <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto font-bold">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700 block">Trả hàng / Hủy</span>
                  </div>
                </div>
              </div>

              {/* SERVICE UTILITIES GRID */}
              <div className="space-y-3">
                <h3 className="font-black text-gray-900 text-sm">Dịch Vụ & Tiện Ích Đa Năng:</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={onOpenAddressBook}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Sổ Địa Chỉ & GPS</strong>
                      <span className="text-[10px] text-gray-400 block">Ghim Google Maps</span>
                    </div>
                  </div>

                  <div 
                    onClick={onOpenMessaging}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Tin Nhắn Messenger</strong>
                      <span className="text-[10px] text-indigo-600 font-bold block">Chat Realtime (🔴 2)</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('vouchers')}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Kho Voucher Đã Lưu</strong>
                      <span className="text-[10px] text-rose-600 font-bold block">3 Giảm giá khả dụng</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('reviews')}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Đánh Giá Của Tôi</strong>
                      <span className="text-[10px] text-amber-600 font-bold block">Thưởng 2% Hoàn Xu</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('booking')}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Lịch Đặt Booking</strong>
                      <span className="text-[10px] text-gray-400 block">Spa / Đồ ăn / Dịch vụ</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('rentals')}
                    className="p-3.5 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl flex items-center gap-3 transition cursor-pointer shadow-2xs"
                  >
                    <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0 font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="font-bold text-gray-900 block text-xs">Đồ Thuê / Mặt Bằng</strong>
                      <span className="text-[10px] text-gray-400 block">Căn hộ / Homestay</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MODULE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <span>Quản Lý Đơn Hàng Của Tôi ({orders.length})</span>
                </h2>

                <button
                  onClick={onOpenOrderTracking}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
                >
                  Mở Tracking Tiến Trình Đơn
                </button>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((o) => {
                    if (orderFilter === 'all') return true;
                    if (orderFilter === 'pending') return o.status === 'pending_seller_confirm' || o.status === 'seller_accepted';
                    if (orderFilter === 'preparing') return o.status === 'preparing';
                    if (orderFilter === 'shipping') return o.status === 'delivering' || o.status === 'ready_for_pickup';
                    if (orderFilter === 'completed') return o.status === 'completed';
                    if (orderFilter === 'cancelled') return o.status === 'cancelled';
                    return true;
                  })
                  .map((ord) => (
                  <div key={ord.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <span className="font-extrabold text-indigo-700">Mã đơn: #{ord.id}</span>
                      <span className="text-gray-400">{new Date(ord.created_at).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">{it.product.name} x{it.quantity}</span>
                          <span className="font-bold text-gray-900">{(it.price * it.quantity).toLocaleString()} đ</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-bold">
                      <span>Tổng tiền: <strong className="text-rose-600">{ord.final_amount.toLocaleString()} đ</strong></span>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-extrabold">
                        {ord.status === 'completed' ? '✓ Đã hoàn thành' : '🚚 Đang xử lý'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COIN WALLET MODULE */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Ví Xu Thưởng Đa Năng</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md space-y-1">
                  <span className="text-xs font-extrabold uppercase text-amber-100 block">👑 Ví Xu TQ</span>
                  <span className="text-3xl font-black">{tqCoins.toLocaleString()} Xu</span>
                  <p className="text-[11px] text-amber-100 pt-1">Chiết khấu trực tiếp tại Gian hàng TQ Official</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl shadow-md space-y-1">
                  <span className="text-xs font-extrabold uppercase text-indigo-100 block">🪙 Ví Xu Thường</span>
                  <span className="text-3xl font-black">{regularCoins.toLocaleString()} Xu</span>
                  <p className="text-[11px] text-indigo-100 pt-1">Đổi Voucher giảm giá & quà tặng sàn</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VOUCHER MODULE */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Ticket className="w-5 h-5 text-rose-500" />
                <span>Kho Voucher Đã Lưu (3 Mã Khả Dụng)</span>
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <strong className="font-extrabold text-rose-900 text-xs block">VOUCHER FREESHIP KHOÁI CHÂU</strong>
                    <p className="text-[11px] text-rose-700">Giảm 20.000đ phí vận chuyển cho đơn từ 150k</p>
                  </div>
                  <button className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs cursor-pointer">
                    Dùng ngay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Sổ Địa Chỉ Giao Hàng & Ghim GPS</span>
                </h2>

                <button
                  onClick={onOpenAddressBook}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-sm cursor-pointer"
                >
                  + Thêm / Quản lý Địa chỉ
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: MESSENGER */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Trung Tâm Tin Nhắn Messenger Realtime</span>
                </h2>

                <button
                  onClick={onOpenMessaging}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-sm cursor-pointer"
                >
                  Mở Messenger 2 Cột
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & PRIVACY */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <KeyRound className="w-5 h-5 text-slate-700" />
                <span>Cài Đặt Bảo Mật & Tài Khoản</span>
              </h2>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Bảo mật 2 Lớp (2FA):</span>
                  <span className="text-emerald-600 font-extrabold">✓ Đã bật</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800">Quyền riêng tư dữ liệu (PDPD):</span>
                  <span className="text-indigo-600 font-extrabold">Chuẩn NĐ 13/2023/NĐ-CP</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
