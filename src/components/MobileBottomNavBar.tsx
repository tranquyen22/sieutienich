import React from 'react';
import { Home, MessageCircle, PackageCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavBarProps {
  onOpenPublicDirectoryModal: () => void;
  onOpenDirectMessagingModal: () => void;
  onOpenOrderTrackingModal: () => void;
  onOpenBuyerDashboardModal: () => void;
  onOpenAuthModal: () => void;
  unreadMessageCount?: number;
}

export const MobileBottomNavBar: React.FC<MobileBottomNavBarProps> = ({
  onOpenPublicDirectoryModal,
  onOpenDirectMessagingModal,
  onOpenOrderTrackingModal,
  onOpenBuyerDashboardModal,
  onOpenAuthModal,
  unreadMessageCount = 2,
}) => {
  const { user } = useAuth();

  const handleProfileClick = () => {
    if (user) {
      onOpenBuyerDashboardModal();
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
      
      {/* 1. TRANG CHỦ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex flex-col items-center justify-center gap-0.5 text-indigo-600 font-black py-1 px-2 rounded-xl active:bg-indigo-50 transition cursor-pointer"
      >
        <Home className="w-5 h-5" />
        <span>Trang Chủ</span>
      </button>

      {/* 2. SOS TIỆN ÍCH CẤP CỨU */}
      <button
        onClick={onOpenPublicDirectoryModal}
        className="flex flex-col items-center justify-center gap-0.5 text-rose-600 font-extrabold hover:text-rose-700 py-1 px-2 rounded-xl active:bg-rose-50 transition cursor-pointer"
      >
        <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none">SOS</span>
        <span>SOS</span>
      </button>

      {/* 3. TIN NHẮN REALTIME (VỚI HUY HIỆU NỔI) */}
      <button
        onClick={onOpenDirectMessagingModal}
        className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-indigo-600 py-1 px-2 rounded-xl active:bg-gray-100 transition cursor-pointer relative"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-gray-500" />
          {unreadMessageCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {unreadMessageCount}
            </span>
          )}
        </div>
        <span>Tin Nhắn</span>
      </button>

      {/* 4. ĐƠN HÀNG CỦA TÔI */}
      <button
        onClick={onOpenOrderTrackingModal}
        className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-indigo-600 py-1 px-2 rounded-xl active:bg-gray-100 transition cursor-pointer"
      >
        <PackageCheck className="w-5 h-5 text-gray-500" />
        <span>Đơn Hàng</span>
      </button>

      {/* 5. MỤC TÔI / HỒ SƠ */}
      <button
        onClick={handleProfileClick}
        className="flex flex-col items-center justify-center gap-0.5 text-gray-600 hover:text-indigo-600 py-1 px-2 rounded-xl active:bg-gray-100 transition cursor-pointer"
      >
        <User className="w-5 h-5 text-gray-500" />
        <span>{user ? 'Mục Tôi' : 'Tài Khoản'}</span>
      </button>

    </nav>
  );
};
