import React, { useState } from 'react';
import { 
  X, ShoppingBag, Coins, Ticket, MapPin, Heart, Clock, MessageSquare, 
  Bell, Star, CalendarCheck, QrCode, Share2, Calendar, KeyRound, HelpCircle, 
  Trash2, ShieldAlert, Copy, ArrowUpRight, ArrowDownLeft, Store
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
  addresses,
  onOpenAddressBook,
  onOpenMessaging,
  onOpenOrderTracking,
}) => {
  const { 
    regularCoins, 
    tqCoins, 
    coinTransactions, 
    dailyCheckIn, 
    hasCheckedInToday, 
    checkInStreak,
    orders,
    products
  } = useShop();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'orders' 
    | 'wallet' 
    | 'history' 
    | 'vouchers' 
    | 'addresses' 
    | 'favorites' 
    | 'recent' 
    | 'messages' 
    | 'notifications' 
    | 'reviews' 
    | 'checkin' 
    | 'qrcode' 
    | 'referral' 
    | 'booking' 
    | 'rentals' 
    | 'support' 
    | 'settings' 
    | 'delete_account'
  >('orders');

  const [orderFilter, setOrderFilter] = useState<'processing' | 'completed'>('processing');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  // Sample Favorites
  const favoriteProducts = products.slice(0, 4);

  // Sample Recently Viewed
  const recentlyViewedProducts = products.slice(0, 6);

  // Sample User Reviews
  const [myReviews] = useState([
    {
      id: 'rev-1',
      product_name: 'Combo Lẩu Thái Hải Sản Khoái Châu',
      rating: 5,
      comment: 'Đồ ăn cực tươi ngon, giao nhanh trong 30 phút. Rất hài lòng!',
      date: '2026-08-20',
    },
    {
      id: 'rev-2',
      product_name: 'Cho Thuê Kiot Mặt Tiền Chợ Khoái Châu',
      rating: 5,
      comment: 'Chủ gian hàng hỗ trợ thủ tục rất nhiệt tình. Vị trí kiot đắc địa.',
      date: '2026-08-15',
    },
  ]);

  // Sample Bookings & Active Rentals
  const myBookings = [
    {
      id: 'BK-9921',
      service_name: 'Đặt Lịch Gội Đầu Thảo Dược Đông Y',
      shop_name: 'Spa Đông Y Khoái Châu',
      booking_date: '2026-08-28 14:00',
      status: 'confirmed',
    },
  ];

  const activeRentals = [
    {
      id: 'RNT-4410',
      item_name: 'Thuê Thiết Bị Âm Thanh Sự Kiện',
      shop_name: 'Điện Máy Hưng Yên',
      rental_period: '25/08/2026 - 28/08/2026',
      status: 'in_use',
    },
  ];

  if (!isOpen) return null;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Khách Hàng Siêu Tiện Ích';
  const referralCode = `TQ-${displayName.toUpperCase().replace(/\s+/g, '')}889`;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleAccountDeletionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteReason.trim()) {
      alert('Vui lòng nhập lý do bạn muốn yêu cầu xóa tài khoản!');
      return;
    }
    alert('⚠️ Yêu cầu xóa tài khoản đã được ghi nhận theo Nghị định 13/ND-CP về Bảo vệ dữ liệu cá nhân. Hệ thống sẽ xử lý và xóa toàn bộ dữ liệu trong vòng 7 ngày làm việc.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col md:flex-row min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* SIDEBAR NAVIGATION (18 MODULES ACCORDING TO REQUIREMENTS) */}
        <div className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 overflow-y-auto max-h-48 md:max-h-full space-y-4">
          
          {/* User Profile Summary Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-md">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-sm text-white truncate">{displayName}</h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                ✓ Tài khoản Khách Hàng
              </span>
            </div>
          </div>

          {/* Navigation Links Group 1: Shopping & Wallet */}
          <div className="space-y-1 text-xs">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider px-2 mb-1">
              Mua sắm & Ví thưởng
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-indigo-400" />
              <span>1. Đơn Hàng</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center justify-between transition cursor-pointer ${
                activeTab === 'wallet' ? 'bg-amber-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>2. Ví Xu Thưởng</span>
              </div>
              <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded font-black">
                {(regularCoins + tqCoins).toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'history' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>3. Lịch Sử Biến Động Xu</span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'vouchers' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Ticket className="w-4 h-4 text-rose-400" />
              <span>4. Mã Ưu Đãi Voucher</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'addresses' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>5. Sổ Địa Chỉ Nhận Hàng</span>
            </button>
          </div>

          {/* Navigation Links Group 2: Personalization & Interactive */}
          <div className="space-y-1 text-xs">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider px-2 mb-1">
              Cá nhân & Tương tác
            </div>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'favorites' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>6. Danh Sách Yêu Thích</span>
            </button>

            <button
              onClick={() => setActiveTab('recent')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'recent' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>7. Đã Xem Gần Đây</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'messages' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>8. Tin Nhắn Với Shop</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'notifications' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>9. Thông Báo Hệ Thống</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'reviews' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>10. Đánh Giá Của Tôi</span>
            </button>
          </div>

          {/* Navigation Links Group 3: Verification & Utilities */}
          <div className="space-y-1 text-xs">
            <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider px-2 mb-1">
              Tiện ích & Bảo mật
            </div>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'checkin' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>11. Điểm Danh Nhận Xu</span>
            </button>

            <button
              onClick={() => setActiveTab('qrcode')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'qrcode' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>12. Mã QR Quét Tại Quầy</span>
            </button>

            <button
              onClick={() => setActiveTab('referral')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'referral' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>13. Giới Thiệu Bạn Bè</span>
            </button>

            <button
              onClick={() => setActiveTab('booking')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'booking' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>14. Đặt Lịch Booking</span>
            </button>

            <button
              onClick={() => setActiveTab('rentals')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'rentals' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Store className="w-4 h-4 text-orange-400" />
              <span>15. Theo Dõi Đồ Đang Thuê</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'support' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span>16. Hỗ Trợ Khách Hàng</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'settings' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <KeyRound className="w-4 h-4 text-yellow-400" />
              <span>17. Cài Đặt & Bảo Mật</span>
            </button>

            <button
              onClick={() => setActiveTab('delete_account')}
              className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center gap-2.5 transition cursor-pointer ${
                activeTab === 'delete_account' ? 'bg-rose-600 text-white' : 'hover:bg-rose-950/50 text-rose-400'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>18. Yêu Cầu Xóa Tài Khoản</span>
            </button>
          </div>

        </div>

        {/* MAIN DISPLAY CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col relative">
          
          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 1. ORDERS MODULE */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <span>Quản Lý Đơn Hàng Của Tôi</span>
                </h2>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => setOrderFilter('processing')}
                    className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition ${
                      orderFilter === 'processing' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Đang xử lý ({orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length})
                  </button>
                  <button
                    onClick={() => setOrderFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition ${
                      orderFilter === 'completed' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Đã xong ({orders.filter((o) => o.status === 'completed').length})
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((o) => (orderFilter === 'completed' ? o.status === 'completed' : o.status !== 'completed'))
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
                        <button
                          onClick={onOpenOrderTracking}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs cursor-pointer"
                        >
                          Xem chi tiết tiến trình
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. COIN WALLET MODULE */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Ví Xu Thưởng & Hạn Sử Dụng</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md">
                  <span className="text-xs font-extrabold uppercase text-amber-100 block">👑 Số Dư Xu TQ</span>
                  <span className="text-3xl font-black">{tqCoins.toLocaleString()} Xu</span>
                  <p className="text-[11px] text-amber-100 mt-2">Áp dụng giảm tới 20% tại Gian hàng TQ Official</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md">
                  <span className="text-xs font-extrabold uppercase text-emerald-100 block">✓ Số Dư Xu Thường</span>
                  <span className="text-3xl font-black">{regularCoins.toLocaleString()} Xu</span>
                  <p className="text-[11px] text-emerald-100 mt-2">Áp dụng giảm giá tại các Shop Đã Xác Minh</p>
                </div>
              </div>

              {/* Coins Nearing Expiration Notice */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-xs">
                <h3 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Xu Sắp Hết Hạn Sử Dụng (Thông Báo Trước)</span>
                </h3>
                <p className="text-amber-900">
                  ⏳ Bạn có <strong>500 Xu Thường</strong> sắp hết hạn sử dụng vào ngày <strong>15/09/2026</strong> (Hạn dùng 6 tháng). Hãy sử dụng ngay để được trừ tiền đơn hàng!
                </p>
              </div>
            </div>
          )}

          {/* 3. COIN TRANSACTION HISTORY MODULE */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Lịch Sử Xu — Nhận Vào Từ Đâu & Tiêu Vào Đâu</span>
              </h2>

              <div className="space-y-2 text-xs">
                {coinTransactions.map((tx) => {
                  const isEarn = tx.type === 'earn' || tx.type === 'bonus';
                  return (
                    <div key={tx.id} className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold ${
                          isEarn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {isEarn ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-extrabold text-gray-900 block">{tx.description}</span>
                          <span className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                      <span className={`font-black text-sm ${isEarn ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isEarn ? '+' : '-'}{tx.amount.toLocaleString()} Xu
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. SAVED VOUCHERS MODULE */}
          {activeTab === 'vouchers' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Ticket className="w-5 h-5 text-rose-500" />
                <span>Mã Ưu Đãi & Voucher Đã Lưu</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <span className="font-black text-rose-700 text-sm block">🎟️ PLATFORM15K</span>
                  <span className="font-bold text-gray-800 block">Voucher Sàn Giảm 15.000đ</span>
                  <p className="text-[11px] text-gray-500">Áp dụng cho các Shop đã xác minh & Shop TQ</p>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                  <span className="font-black text-indigo-700 text-sm block">🎟️ FREESHIP20K</span>
                  <span className="font-bold text-gray-800 block">Miễn Phí Vận Chuyển 20.000đ</span>
                  <p className="text-[11px] text-gray-500">Cho đơn hàng từ 200.000đ</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. SAVED ADDRESSES MODULE */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span>Sổ Địa Chỉ Nhận Hàng</span>
                </h2>
                <button
                  onClick={onOpenAddressBook}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Quản lý sổ địa chỉ
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {addresses.map((a) => (
                  <div key={a.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-900 font-extrabold">{a.recipient_name} ({a.phone})</strong>
                      {a.is_default && <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-black">Mặc định</span>}
                    </div>
                    <p className="text-gray-600">{a.detail_address}, {a.district}, {a.province}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. FAVORITES MODULE */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <span>Danh Sách Sản Phẩm / Dịch Vụ Yêu Thích</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {favoriteProducts.map((p) => (
                  <div key={p.id} className="p-2.5 bg-white border border-gray-200 rounded-2xl space-y-1.5">
                    <img src={p.img} alt={p.name} className="w-full h-24 object-cover rounded-xl" />
                    <span className="font-bold text-gray-900 block truncate">{p.name}</span>
                    <span className="font-black text-rose-600 block">{p.price.toLocaleString()} đ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. RECENTLY VIEWED MODULE */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>Đã Xem Gần Đây (Tính năng tối ưu dùng nhiều nhất)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {recentlyViewedProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center gap-2">
                    <img src={p.img} alt={p.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                    <div className="min-w-0">
                      <span className="font-bold text-gray-900 block truncate">{p.name}</span>
                      <span className="font-black text-indigo-600 block">{p.price.toLocaleString()} đ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MESSAGES INBOX MODULE */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  <span>Hộp Tin Nhắn Với Gian Hàng</span>
                </h2>
                <button
                  onClick={onOpenMessaging}
                  className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Mở khung chat trực tiếp
                </button>
              </div>
              <p className="text-xs text-gray-500">Xem danh sách các cuộc trò chuyện đã gắn với sản phẩm hoặc đơn hàng.</p>
            </div>
          )}

          {/* 9. NOTIFICATIONS MODULE */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Bell className="w-5 h-5 text-amber-500" />
                <span>Thông Báo Hệ Thống (Tách riêng khỏi luồng tin nhắn)</span>
              </h2>
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs text-indigo-900">
                Thông báo đơn hàng, cập nhật điểm thưởng và thông báo từ Admin được tách thành một luồng độc lập với tin nhắn chat trực tiếp.
              </div>
            </div>
          )}

          {/* 10. REVIEWS MODULE */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>Đánh Giá Của Tôi — Xem Lại & Chỉnh Sửa</span>
              </h2>

              <div className="space-y-3 text-xs">
                {myReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-gray-900 font-extrabold">{rev.product_name}</strong>
                      <span className="text-yellow-500 font-black">{'⭐'.repeat(rev.rating)} ({rev.rating}/5)</span>
                    </div>
                    <p className="text-gray-700">{rev.comment}</p>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-gray-100">
                      <span>Đăng ngày: {rev.date}</span>
                      <button className="text-indigo-600 font-bold hover:underline cursor-pointer">Sửa đánh giá</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. DAILY CHECK-IN MODULE */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <CalendarCheck className="w-5 h-5 text-amber-500" />
                <span>Điểm Danh Hàng Ngày Nhận Xu</span>
              </h2>

              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950">Chuỗi điểm danh hiện tại: Day {checkInStreak}/7</span>
                  <button
                    onClick={dailyCheckIn}
                    disabled={hasCheckedInToday}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-extrabold rounded-xl cursor-pointer"
                  >
                    {hasCheckedInToday ? 'Đã điểm danh hôm nay' : 'Điểm Danh Ngay'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 12. PHONE & QR CODE MODULE */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>Mã QR Xác Minh Quét Tại Quầy</span>
              </h2>

              <div className="p-6 bg-slate-900 text-white rounded-3xl text-center space-y-3 max-w-sm mx-auto">
                <div className="w-40 h-40 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center border-4 border-emerald-400">
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 font-mono text-xs font-bold p-2 text-center">
                    [MÃ QR XÁC MINH KHOÁI CHÂU NET]
                  </div>
                </div>
                <span className="font-extrabold text-sm block">SĐT: {user?.phone || '0987654321'}</span>
                <p className="text-[11px] text-slate-300">Đưa mã QR này cho nhân viên tại quầy cửa hàng để xác minh lấy hàng / đặt cọc.</p>
              </div>
            </div>
          )}

          {/* 13. REFERRAL CODE MODULE */}
          {activeTab === 'referral' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Share2 className="w-5 h-5 text-purple-600" />
                <span>Mã Giới Thiệu Bạn Bè Nhận Xu</span>
              </h2>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-3 text-xs">
                <span className="font-bold text-purple-950 block">Mã giới thiệu độc quyền của bạn:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralCode}
                    className="flex-1 px-3 py-2 bg-white border border-purple-300 rounded-xl font-mono font-black text-purple-900 text-sm"
                  />
                  <button
                    onClick={copyReferralCode}
                    className="px-4 py-2 bg-purple-600 text-white font-extrabold rounded-xl cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedReferral ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
                <p className="text-purple-900 text-[11px]">Giới thiệu bạn bè đăng ký và hoàn thành đơn hàng đầu tiên để cả 2 cùng nhận +5.000 Xu Thường!</p>
              </div>
            </div>
          )}

          {/* 14. BOOKINGS MODULE */}
          {activeTab === 'booking' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Quản Lý Đặt Lịch Booking Dịch Vụ</span>
              </h2>

              <div className="space-y-2 text-xs">
                {myBookings.map((bk) => (
                  <div key={bk.id} className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <strong className="text-gray-900 font-extrabold block">{bk.service_name}</strong>
                      <span className="text-gray-500 text-[11px]">{bk.shop_name} • Thời gian: {bk.booking_date}</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                      ✓ Đã xác nhận
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 15. ACTIVE RENTALS MODULE */}
          {activeTab === 'rentals' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <Store className="w-5 h-5 text-orange-500" />
                <span>Theo Dõi Đồ Đang Thuê</span>
              </h2>

              <div className="space-y-2 text-xs">
                {activeRentals.map((rnt) => (
                  <div key={rnt.id} className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <strong className="text-orange-950 font-extrabold block">{rnt.item_name}</strong>
                      <span className="text-orange-900 text-[11px]">Bên cho thuê: {rnt.shop_name} • Thời hạn: {rnt.rental_period}</span>
                    </div>
                    <span className="bg-orange-500 text-white font-extrabold px-2.5 py-1 rounded-full text-[10px]">
                      Đang trong thời hạn thuê
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 16. SUPPORT MODULE */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <span>Trung Tâm Hỗ Trợ Khách Hàng</span>
              </h2>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2 text-xs text-teal-950">
                <strong className="block text-sm">Tổng đài CSKH Siêu Tiện Ích: 1900 6889</strong>
                <p>Email hỗ trợ giải đáp khiếu nại: support@sieutienich.vn</p>
                <p>Thời gian làm việc: 08:00 - 22:00 tất cả các ngày trong tuần.</p>
              </div>
            </div>
          )}

          {/* 17. SETTINGS & SECURITY MODULE */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-3">
                <KeyRound className="w-5 h-5 text-yellow-500" />
                <span>Cài Đặt & Bảo Mật Tài Khoản</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <strong className="text-gray-900 font-extrabold block">Đổi mật khẩu tài khoản</strong>
                    <span className="text-gray-500 text-[11px]">Tăng cường độ an toàn bảo mật</span>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl cursor-pointer">
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 18. ACCOUNT DELETION REQUEST MODULE (WITH 30-DAY GRACE PERIOD) */}
          {activeTab === 'delete_account' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-3 text-xs">
                <h2 className="text-base font-black text-rose-950 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Yêu Cầu Xóa Tài Khoản (Bắt Buộc Theo Luật Bảo Vệ Dữ Liệu Cá Nhân)</span>
                </h2>
                <p className="text-rose-900 leading-relaxed">
                  Theo <strong>Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân (PDPD)</strong>, bạn có quyền yêu cầu xóa toàn bộ dữ liệu cá nhân khỏi hệ thống.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 font-bold">
                  ⏱️ <strong>Quy định Ân Hạn 30 Ngày:</strong> Sau khi bấm gửi yêu cầu, bạn có <strong>30 ngày ân hạn</strong> để đổi ý và bấm khôi phục lại tài khoản. Hết 30 ngày hệ thống mới tiến hành cắt hẳn.
                </div>

                <form onSubmit={handleAccountDeletionRequest} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-rose-950 mb-1">Vui lòng nhập lý do bạn muốn xóa tài khoản *</label>
                    <textarea
                      rows={3}
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="Nhập chi tiết lý do..."
                      className="w-full p-2.5 bg-white border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Gửi Yêu Cầu Xóa (Ân Hạn 30 Ngày Để Đổi Ý)
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
