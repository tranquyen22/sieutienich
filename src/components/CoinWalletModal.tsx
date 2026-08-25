import React, { useState } from 'react';
import { X, Coins, ArrowUpRight, ArrowDownLeft, Gift, CalendarCheck, CheckCircle2, AlertCircle, Clock, Sparkles, Store, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CoinWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinWalletModal: React.FC<CoinWalletModalProps> = ({ isOpen, onClose }) => {
  const { regularCoins, tqCoins, coinTransactions, dailyCheckIn, hasCheckedInToday } = useShop();

  const [activeTab, setActiveTab] = useState<'history' | 'tasks'>('history');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'regular' | 'tq'>('all');
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);

  if (!isOpen) return null;

  const filteredTransactions = coinTransactions.filter((tx) => {
    if (historyFilter === 'regular') return tx.coin_category === 'regular';
    if (historyFilter === 'tq') return tx.coin_category === 'tq';
    return true;
  });

  const handleCheckInClick = async () => {
    const res = await dailyCheckIn();
    setCheckInMsg({ success: res.success, text: res.message });
    setTimeout(() => setCheckInMsg(null), 4000);
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
            <span>Ví Xu Tiện Ích Đa Năng</span>
          </div>

          {/* DUAL COIN DISPLAY (Xu TQ & Xu Thường) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* 1. XU TQ */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-yellow-200">
                <Store className="w-3.5 h-3.5" />
                <span>Ví Xu TQ</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {tqCoins.toLocaleString('vi-VN')}
              </div>
              <p className="text-[10px] text-amber-100 mt-1 leading-tight">
                👑 Áp dụng tại Cửa hàng TQ
              </p>
            </div>

            {/* 2. XU THƯỜNG */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3 rounded-2xl">
              <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ví Xu Thường</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {regularCoins.toLocaleString('vi-VN')}
              </div>
              <p className="text-[10px] text-emerald-100 mt-1 leading-tight">
                ✓ Áp dụng Cửa hàng đã xác minh
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/20 text-xs text-amber-100">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Quy đổi: <strong>1 Xu = 1 VNĐ</strong></span>
            </div>

            {/* Daily Check-in Button */}
            <button
              onClick={handleCheckInClick}
              disabled={hasCheckedInToday}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs transition shadow-md cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-amber-800/40 text-amber-200 border border-amber-400/30'
                  : 'bg-white text-amber-700 hover:bg-yellow-50 shadow-amber-900/20'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{hasCheckedInToday ? 'Đã điểm danh' : 'Điểm danh (+5k Xu Thường)'}</span>
            </button>
          </div>
        </div>

        {/* Check-in Message Alert */}
        {checkInMsg && (
          <div className={`p-3 text-xs flex items-center gap-2 font-bold shrink-0 ${
            checkInMsg.success ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-amber-50 text-amber-800 border-b border-amber-200'
          }`}>
            {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>{checkInMsg.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-amber-800 shadow-sm border border-amber-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Lịch sử nhận Xu
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-white text-amber-800 shadow-sm border border-amber-200'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Quy định & Nhiệm vụ Xu
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          
          {/* TAB 1: LỊCH SỬ NHẬN / TIÊU XU */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* Filter pills */}
              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={() => setHistoryFilter('all')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                    historyFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({coinTransactions.length})
                </button>
                <button
                  onClick={() => setHistoryFilter('tq')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                    historyFilter === 'tq' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Xu TQ
                </button>
                <button
                  onClick={() => setHistoryFilter('regular')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                    historyFilter === 'regular' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  Xu Thường
                </button>
              </div>

              {/* Transactions List */}
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Chưa có lịch sử biến động Xu phù hợp.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTransactions.map((tx) => {
                    const isEarn = tx.type === 'earn' || tx.type === 'bonus';
                    const isTQ = tx.coin_category === 'tq';

                    const dateStr = new Date(tx.created_at).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    });

                    return (
                      <div 
                        key={tx.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-amber-200 transition gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isTQ 
                              ? 'bg-amber-100 text-amber-700' 
                              : isEarn 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : 'bg-rose-50 text-rose-600'
                          }`}>
                            {isEarn ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                isTQ ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {isTQ ? 'Xu TQ' : 'Xu Thường'}
                              </span>
                              <h4 className="text-xs font-bold text-gray-900 truncate">{tx.description}</h4>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`text-xs font-black shrink-0 ${
                          isEarn ? (isTQ ? 'text-amber-600' : 'text-emerald-600') : 'text-rose-600'
                        }`}>
                          {isEarn ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} Xu
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: QUY ĐỊNH & NHIỆM VỤ NHẬN XU */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {/* Rule Banner */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Phân Phối & Áp Dụng 2 Loại Xu</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  • <strong>Xu TQ</strong>: Tặng khi Đăng ký mới ➔ Áp dụng duy nhất tại <strong>Cửa hàng TQ</strong>.<br/>
                  • <strong>Xu Thường</strong>: Nhận từ Điểm danh / Đánh giá ➔ Áp dụng tại <strong>Cửa hàng đã xác minh</strong>.
                </p>
              </div>

              {/* Task 1: Đăng ký mới */}
              <div className="p-3.5 bg-white border border-amber-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900">Đăng ký tài khoản mới</h4>
                    <p className="text-[11px] text-gray-500">Tặng ngay <strong>Xu TQ</strong> khi tạo tài khoản thành công.</p>
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-amber-500 text-white font-black text-xs rounded-xl shadow-sm shrink-0">
                  +50.000 Xu TQ
                </span>
              </div>

              {/* Task 2: Điểm danh */}
              <div className="p-3.5 bg-white border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900">Điểm danh hàng ngày</h4>
                    <p className="text-[11px] text-gray-500">Nhận ngay <strong>Xu Thường</strong> mỗi ngày 1 lần điểm danh.</p>
                  </div>
                </div>

                <button
                  onClick={handleCheckInClick}
                  disabled={hasCheckedInToday}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer ${
                    hasCheckedInToday
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  {hasCheckedInToday ? 'Đã nhận' : '+5.000 Xu Thường'}
                </button>
              </div>

              {/* Task 3: Đánh giá & Đăng tin */}
              <div className="p-3.5 bg-white border border-gray-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900">Đánh giá & Đăng tin tiện ích mới</h4>
                    <p className="text-[11px] text-gray-500">Tặng <strong>Xu Thường</strong> khi đánh giá / tạo bài đăng dịch vụ mới.</p>
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 shrink-0">
                  +10.000 Xu Thường
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
