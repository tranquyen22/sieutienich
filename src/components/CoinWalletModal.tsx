import React, { useState } from 'react';
import { X, Coins, ArrowUpRight, ArrowDownLeft, CalendarCheck, CheckCircle2, AlertCircle, Clock, Sparkles, Store, ShieldCheck, Info, Flame, AlertTriangle, Settings } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface CoinWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinWalletModal: React.FC<CoinWalletModalProps> = ({ isOpen, onClose }) => {
  const { 
    regularCoins, 
    tqCoins, 
    coinTransactions, 
    dailyCheckIn, 
    hasCheckedInToday, 
    checkInStreak,
    reviewCashbackRate,
    setReviewCashbackRate,
    monthlyDistributedCoins,
    purchasedProductIds,
    orders
  } = useShop();

  const { isAdmin, userRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'tasks' | 'history' | 'admin_rules'>('tasks');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'regular' | 'tq'>('all');
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const hasCompletedOrder = completedOrdersCount > 0 || purchasedProductIds.length > 0;

  const filteredTransactions = coinTransactions.filter((tx) => {
    if (historyFilter === 'regular') return tx.coin_category === 'regular';
    if (historyFilter === 'tq') return tx.coin_category === 'tq';
    return true;
  });

  const handleCheckInClick = async () => {
    const res = await dailyCheckIn();
    setCheckInMsg({ success: res.success, text: res.message });
    setTimeout(() => setCheckInMsg(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-amber-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Banner - Dual Coin Wallet Balance */}
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-36 h-36 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-100 text-xs font-extrabold uppercase tracking-wider mb-3">
            <Coins className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>Ví Điểm Thưởng Siêu Tiện Ích • 1 Xu = 1 Đồng</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Wallet 1: Xu TQ */}
            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-100 font-bold mb-1">
                <Store className="w-3.5 h-3.5 text-yellow-300" />
                <span>👑 Xu TQ (Official)</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {tqCoins.toLocaleString('vi-VN')}
              </div>
              <p className="text-[10px] text-amber-200 mt-1">Dùng giảm tới 20% tại Shop TQ</p>
            </div>

            {/* Wallet 2: Xu Thường */}
            <div className="bg-white/15 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-100 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>✓ Xu Thường</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {regularCoins.toLocaleString('vi-VN')}
              </div>
              <p className="text-[10px] text-amber-200 mt-1">Dùng giảm tại các Shop xác minh</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Bar */}
        <div className="bg-slate-900 text-white px-4 py-2 text-[11px] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Xu là điểm thưởng (không đổi ra tiền). Shop không có xu.</span>
          </div>
          <span className="bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
            Hạn 6 tháng
          </span>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'tasks' ? 'bg-white text-amber-700 shadow-sm border border-amber-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-amber-600" />
            <span>Điểm danh & Nhiệm vụ</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-amber-700 shadow-sm border border-amber-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Lịch sử biến động</span>
          </button>

          {/* HIDDEN FROM ALL NORMAL USERS - RENDERED ONLY FOR ADMIN */}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin_rules')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'admin_rules' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
              }`}
              title="Bảng điều chỉnh Quy tắc Xu (Chỉ Admin mới thấy)"
            >
              <Settings className="w-4 h-4" />
              <span>👑 Quy tắc Xu (Admin)</span>
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: DAILY CHECK-IN & TASKS */}
          {(activeTab === 'tasks' || (!isAdmin && activeTab === 'admin_rules')) && (
            <div className="space-y-4">
              
              {/* Daily Check-in Card with 7-Day Streak */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>Chuỗi Điểm Danh 7 Ngày Nhận Xu</span>
                    </h3>
                    <p className="text-[11px] text-amber-800/80 mt-0.5">
                      Ngày 1-6 nhận 50 xu/ngày • Ngày 7 thưởng +300 xu (Trọn tuần 600 xu)
                    </p>
                  </div>

                  <span className="text-xs font-black bg-orange-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                    Chuỗi: Day {checkInStreak}/7
                  </span>
                </div>

                {/* Condition Notification */}
                {!hasCompletedOrder && (
                  <div className="p-2.5 bg-rose-100/80 border border-rose-300 rounded-xl text-xs text-rose-900 font-bold flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>⚠️ Bạn cần có ít nhất 1 đơn hàng đã hoàn thành để mở khóa tính năng Điểm Danh! (Giúp chống nick ảo).</span>
                  </div>
                )}

                {/* 7-Day Streak Visualization */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const isPassed = day < checkInStreak;
                    const isCurrent = day === checkInStreak;
                    const dayXu = day === 7 ? '+300' : '50';

                    return (
                      <div 
                        key={day}
                        className={`p-2 rounded-xl text-[10px] font-bold border transition ${
                          isCurrent
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md scale-105'
                            : isPassed
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                      >
                        <div className="text-[9px] uppercase font-extrabold opacity-80">N{day}</div>
                        <div className="font-black text-xs mt-0.5">{dayXu}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Check-in Trigger Button */}
                <button
                  type="button"
                  onClick={handleCheckInClick}
                  disabled={hasCheckedInToday || userRole === 'merchant'}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    userRole === 'merchant'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : hasCheckedInToday
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-200'
                  }`}
                >
                  {userRole === 'merchant' ? (
                    <span>Tài khoản Shop không có tích Xu</span>
                  ) : hasCheckedInToday ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã điểm danh hôm nay (Hẹn quay lại ngày mai)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
                      <span>Điểm Danh Ngay (+{checkInStreak === 7 ? '300' : '50'} Xu Thường)</span>
                    </>
                  )}
                </button>

                {checkInMsg && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    checkInMsg.success ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                  }`}>
                    {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{checkInMsg.text}</span>
                  </div>
                )}
              </div>

              {/* Tasks List */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-gray-900">Cách kiếm thêm Xu</h4>

                {/* Task 1: Review Completed Order */}
                <div className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">Viết Đánh Giá Đơn Đã Hoàn Thành</span>
                    <span className="text-gray-500 text-[11px]">Hoàn {reviewCashbackRate}% giá trị đơn (Admin cài đặt)</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold rounded-lg shrink-0">
                    +{reviewCashbackRate}% Xu
                  </span>
                </div>

                {/* Task 2: Admin / Campaign Reward */}
                <div className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">Thưởng Đăng Tin & Sự Kiện Admin</span>
                    <span className="text-gray-500 text-[11px]">Admin tặng Xu khi tham gia các chiến dịch toàn sàn</span>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 font-extrabold rounded-lg shrink-0">
                    +10.000 Xu
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* Filter sub-tabs */}
              <div className="flex gap-1.5 text-xs">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    historyFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Tất cả ({coinTransactions.length})
                </button>
                <button
                  onClick={() => setHistoryFilter('tq')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    historyFilter === 'tq' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Xu TQ
                </button>
                <button
                  onClick={() => setHistoryFilter('regular')}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                    historyFilter === 'regular' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Xu Thường
                </button>
              </div>

              {/* Transactions List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Chưa có biến động điểm thưởng nào.
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isEarn = tx.type === 'earn' || tx.type === 'bonus';
                    const isTQ = tx.coin_category === 'tq';
                    const dateStr = new Date(tx.created_at).toLocaleString('vi-VN');

                    return (
                      <div key={tx.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            isEarn ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {isEarn ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-1">{tx.description}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                              <span>{dateStr}</span>
                              <span>•</span>
                              <span className={isTQ ? 'text-amber-600 font-extrabold' : 'text-emerald-600 font-extrabold'}>
                                {isTQ ? 'Xu TQ' : 'Xu Thường'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-black text-sm ${
                            isEarn ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {isEarn ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} Xu
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXCLUSIVE ADMIN-ONLY COIN RULES CONTROL PANEL */}
          {activeTab === 'admin_rules' && isAdmin && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-amber-400 text-sm">Bảng Điều Chỉnh Quy Tắc Xu (Chỉ Admin)</h3>
                </div>
                <p className="text-[11px] text-slate-300">
                  Tùy chỉnh các tham số toàn sàn. Thẻ tab này ẩn hoàn toàn đối với các tài khoản thường.
                </p>
              </div>

              {/* ADMIN ADJUSTMENT CONTROLS */}
              <div className="space-y-3 p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                
                {/* Control 1: Review Cashback Rate (1-3%) */}
                <div className="space-y-1.5 pb-3 border-b border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-950">1. Tỷ lệ hoàn Xu khi đánh giá đơn:</span>
                    <span className="bg-amber-600 text-white font-black px-2 py-0.5 rounded text-xs">
                      {reviewCashbackRate}% giá trị đơn
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900/80">Quy định từ 1% đến 3% giá trị đơn mua hàng thành công.</p>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setReviewCashbackRate(rate)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer ${
                          reviewCashbackRate === rate ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-amber-900 border border-amber-300'
                        }`}
                      >
                        Hoàn {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control 2: Monthly Platform Cap Status */}
                <div className="space-y-1 pb-3 border-b border-amber-200/80">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-950">2. Trần phát Xu toàn sàn tháng này:</span>
                    <span className="font-black text-purple-700 text-xs">
                      {monthlyDistributedCoins.toLocaleString()} / 500.000 Xu
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (monthlyDistributedCoins / 500000) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-amber-900/80">Tự động tạm ngừng thưởng khi chạm mốc 500.000 Xu/tháng.</p>
                </div>

                {/* Summary of 11 Fixed Rules */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-extrabold text-amber-950 block">3. Bản quy tắc 11 nguyên tắc hệ thống:</span>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-900/90 font-medium">
                    <li><strong>Quy đổi:</strong> 1 Xu = 1 VNĐ.</li>
                    <li><strong>Điểm danh:</strong> N1-6 = 50 xu/ngày; N7 = +300 xu (Trọn tuần 600 xu). Miss 1 ngày reset.</li>
                    <li><strong>Điều kiện:</strong> Phải có ít nhất 1 đơn hoàn thành (chống nick ảo).</li>
                    <li><strong>Trần tiêu đơn:</strong> Tối đa 10% giá trị đơn, không quá 50.000 xu.</li>
                    <li><strong>Hạn dùng:</strong> 6 tháng từ ngày nhận.</li>
                    <li><strong>Đổi tiền mặt:</strong> KHÔNG (Xu là điểm thưởng, giữ ranh giới pháp lý).</li>
                    <li><strong>Tài khoản Shop:</strong> KHÔNG có Xu (Chỉ dành cho Buyer).</li>
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
