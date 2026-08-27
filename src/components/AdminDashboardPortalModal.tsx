import React, { useState } from 'react';
import { 
  X, ShieldCheck, Clock, AlertTriangle, TrendingUp, Users, 
  Coins, FileText, AlertCircle, CheckCircle2, DollarSign, Wallet, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AdminBroadcastNotificationModal } from './AdminBroadcastNotificationModal';

interface AdminDashboardPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminReviewModal: () => void;
  onOpenAdminUserManagementModal: () => void;
  onOpenMerchantReconciliationModal: () => void;
  onOpenDirectMessagingModal: () => void;
  onOpenAdminPlatformAnalyticsModal?: () => void;
}

export const AdminDashboardPortalModal: React.FC<AdminDashboardPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminReviewModal,
  onOpenAdminUserManagementModal,
  onOpenMerchantReconciliationModal,
  onOpenDirectMessagingModal,
  onOpenAdminPlatformAnalyticsModal,
}) => {
  const { allApplications } = useAuth();
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Action Queue Pending Item Counts
  const [pendingItems] = useState({
    shopOpeningQueue: (allApplications || []).filter((a) => a.status === 'pending_review').length || 2,
    shopVerificationQueue: 2,
    passwordResetRequests: 1,
    directoryReports: 2,
    unansweredDisputes: 1,
    shopsNearDebtLockout: 2,
    secondApproverSettlements: 1,
  });

  if (!isOpen) return null;

  const totalPendingWork = Object.values(pendingItems).reduce((a, b) => a + b, 0);

  // Platform Metrics Mock Data
  const gmvToday = 14580000;      // 14.580.000 đ
  const gmvMonth = 342500000;     // 342.500.000 đ

  const ordersToday = {
    newOrders: 42,
    completedOrders: 38,
    cancelledOrders: 4,
  };

  const newGrowth = {
    newUsersToday: 18,
    newShopsThisWeek: 5,
    activeShops: 48,
    verifiedShops: 32,
  };

  const coinStats = {
    issuedThisMonth: 45000,
    monthlyCeiling: 100000,
    pendingCoinApproval: 12500,
  };

  const financialLedger = {
    platformFeeEarned: 10275000,   // Phí sàn thu được 3%
    coinVoucherReimburse: 3450000, // Sàn bù tiền xu & voucher
    netPlatformEarnings: 6825000,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Màn Hình Quản Trị Trung Tâm (Admin Super Landing Dashboard)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Hôm Nay Có Gì Cần Làm & Sàn Đang Chạy Ra Sao?</span>
          </h2>
        </div>

        {/* Scrollable Dashboard Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs bg-slate-50/60">
          
          {/* SECTION 1: VIỆC ĐANG CHỜ MÌNH (ACTIONABLE PENDING QUEUE) */}
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">VIỆC ĐANG CHỜ MÌNH (CẦN XỬ LÝ NGAY)</h3>
                  <p className="text-[11px] text-gray-500">Mỗi mục có con số đếm, bấm vào ra thẳng danh sách. Số về 0 = Hôm nay xong việc!</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-purple-200" />
                  <span>📢 Gửi Thông Báo Hệ Thống</span>
                </button>

                {totalPendingWork === 0 ? (
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-2xl font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>🎉 Hôm nay xong việc!</span>
                  </div>
                ) : (
                  <div className="bg-amber-100 text-amber-900 px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Còn {totalPendingWork} việc cần xử lý</span>
                  </div>
                )}
              </div>
            </div>

            {/* 7 Action Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Item 1 */}
              <div 
                onClick={() => { onClose(); onOpenAdminReviewModal(); }}
                className="p-3.5 bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-indigo-900">Hồ sơ chờ duyệt mở shop</span>
                  <span className="text-[10px] text-indigo-600 font-bold">Khâu 1 mở gian hàng</span>
                </div>
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.shopOpeningQueue}
                </span>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => { onClose(); onOpenAdminReviewModal(); }}
                className="p-3.5 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-emerald-900">Hồ sơ chờ duyệt xác minh</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Khâu 2 thực địa</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.shopVerificationQueue}
                </span>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => { onClose(); onOpenAdminUserManagementModal(); }}
                className="p-3.5 bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-blue-900">Yêu cầu đặt lại mật khẩu</span>
                  <span className="text-[10px] text-blue-600 font-bold">Gửi mã xác thực máy chủ</span>
                </div>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.passwordResetRequests}
                </span>
              </div>

              {/* Item 4 */}
              <div 
                onClick={() => alert('📇 Đang chuyển sang danh sách Báo số danh bạ sai chưa kiểm...')}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/80 border border-purple-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-purple-900">Báo số danh bạ sai chưa kiểm</span>
                  <span className="text-[10px] text-purple-600 font-bold">Rà soát SĐT & Địa chỉ</span>
                </div>
                <span className="px-2.5 py-1 bg-purple-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.directoryReports}
                </span>
              </div>

              {/* Item 5 */}
              <div 
                onClick={() => { onClose(); onOpenDirectMessagingModal(); }}
                className="p-3.5 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-amber-900">Khiếu nại chưa trả lời</span>
                  <span className="text-[10px] text-amber-700 font-bold">Đơn hàng & Khách hàng</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.unansweredDisputes}
                </span>
              </div>

              {/* Item 6 */}
              <div 
                onClick={() => { onClose(); onOpenMerchantReconciliationModal(); }}
                className="p-3.5 bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-rose-900">Shop sắp bị khoá vì nợ phí</span>
                  <span className="text-[10px] text-rose-600 font-bold">Quá mốc nợ 1.000.000đ</span>
                </div>
                <span className="px-2.5 py-1 bg-rose-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.shopsNearDebtLockout}
                </span>
              </div>

              {/* Item 7 */}
              <div 
                onClick={() => { onClose(); onOpenMerchantReconciliationModal(); }}
                className="p-3.5 bg-teal-50/60 hover:bg-teal-100/80 border border-teal-200/80 rounded-2xl flex items-center justify-between cursor-pointer transition shadow-2xs group sm:col-span-2 lg:col-span-1"
              >
                <div className="space-y-0.5">
                  <span className="font-extrabold text-gray-900 text-xs block group-hover:text-teal-900">Lệnh chờ người 2 duyệt</span>
                  <span className="text-[10px] text-teal-700 font-bold">Chốt sổ công nợ tháng</span>
                </div>
                <span className="px-2.5 py-1 bg-teal-600 text-white rounded-full font-black text-xs shadow-sm">
                  {pendingItems.secondApproverSettlements}
                </span>
              </div>

            </div>
          </div>

          {/* SECTION 2: SỐ LIỆU SÀN (LIVE PLATFORM METRICS & ANALYTICS) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>SỐ LIỆU VẬN HÀNH SÀN THỜI GIAN THỰC</span>
              </h3>
              
              {onOpenAdminPlatformAnalyticsModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPlatformAnalyticsModal();
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>📊 Xem Chi Tiết Thống Kê & Xuất Excel</span>
                </button>
              )}
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: GMV Today & Month */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-indigo-300 font-bold text-[11px]">
                  <span>Tổng Giá Trị Đơn (GMV)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400">
                  {gmvToday.toLocaleString()} đ
                  <span className="text-[10px] text-gray-300 font-bold block">Hôm nay</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-indigo-200">
                  <span>Tháng này:</span>
                  <strong className="font-extrabold text-white text-xs">{gmvMonth.toLocaleString()} đ</strong>
                </div>
              </div>

              {/* Card 2: Orders Count Breakdown */}
              <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 font-bold text-[11px]">
                  <span>Số Đơn Hàng Hôm Nay</span>
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-xl font-black text-gray-900">
                  {ordersToday.newOrders + ordersToday.completedOrders} đơn
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-amber-600">Mới: {ordersToday.newOrders}</span>
                  <span className="text-emerald-600">Xong: {ordersToday.completedOrders}</span>
                  <span className="text-rose-600">Hủy: {ordersToday.cancelledOrders}</span>
                </div>
              </div>

              {/* Card 3: New Users & Active Shops */}
              <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 font-bold text-[11px]">
                  <span>Người Dùng & Gian Hàng</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-black text-purple-900">
                  +{newGrowth.newUsersToday} Khách mới
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-600">
                  <span>Hoạt động: {newGrowth.activeShops} shop</span>
                  <span className="text-emerald-600">✓ Đã xác minh: {newGrowth.verifiedShops}</span>
                </div>
              </div>

              {/* Card 4: Coins vs Monthly Ceiling */}
              <div className="p-4 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500 font-bold text-[11px]">
                  <span>Xu Phát So Với Trần Tháng</span>
                  <Coins className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-base font-black text-amber-900">
                  {coinStats.issuedThisMonth.toLocaleString()} / {coinStats.monthlyCeiling.toLocaleString()} Xu
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(coinStats.issuedThisMonth / coinStats.monthlyCeiling) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-amber-700 font-bold">
                  ⏳ Đang chờ duyệt: {coinStats.pendingCoinApproval.toLocaleString()} Xu
                </div>
              </div>

            </div>

            {/* Financial Ledger & Financial Anomaly Warning */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Financial Ledger Balance Box */}
              <div className="p-5 bg-emerald-950 text-white rounded-3xl shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
                  <strong className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>Phí Sàn & Tiền Bù Xu/Voucher</span>
                  </strong>
                  <span className="bg-emerald-800 text-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold">Tháng 08/2026</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-emerald-900/60 rounded-2xl border border-emerald-700/60">
                    <span className="text-[10px] text-emerald-300 block">Phí sàn thu được (3%)</span>
                    <strong className="text-sm font-black text-emerald-200">{financialLedger.platformFeeEarned.toLocaleString()} đ</strong>
                  </div>

                  <div className="p-2.5 bg-rose-900/60 rounded-2xl border border-rose-700/60">
                    <span className="text-[10px] text-rose-300 block">Sàn bù xu & voucher</span>
                    <strong className="text-sm font-black text-rose-200">-{financialLedger.coinVoucherReimburse.toLocaleString()} đ</strong>
                  </div>

                  <div className="p-2.5 bg-amber-900/60 rounded-2xl border border-amber-700/60">
                    <span className="text-[10px] text-amber-300 block">Thực thu ròng sàn</span>
                    <strong className="text-sm font-black text-amber-200">+{financialLedger.netPlatformEarnings.toLocaleString()} đ</strong>
                  </div>
                </div>
              </div>

              {/* Financial Anomaly Alert Box */}
              <div className="p-5 bg-rose-50 border border-rose-200 text-rose-950 rounded-3xl shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                  <span>Dấu Hiệu Bất Thường Về Tiền (Hệ Thống Tự Động Cảnh Báo)</span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-rose-200 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>⚠️ Shop "Thợ Sửa Điện Lạnh 24h"</span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-black">Nghi vấn Spay/Coin abuse</span>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-snug">
                    Tăng đột biến 18 đơn xu cùng 1 IP wifi trong 10 phút. Đã tạm đóng bằng mã bảo vệ để Admin kiểm tra.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs font-extrabold">
          <span className="text-gray-500 font-medium">Bảng thông số Super Admin được đồng bộ với máy chủ.</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Màn Hình
          </button>
        </div>

      </div>

      <AdminBroadcastNotificationModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
      />
    </div>
  );
};
