import React, { useState } from 'react';
import { X, DollarSign, ShieldCheck, AlertTriangle, Settings, CheckCircle2, Clock, Ban, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { MerchantFinancials, SettlementRecord } from '../types';

interface MerchantReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantReconciliationModal: React.FC<MerchantReconciliationModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin, userRole } = useAuth();

  const [settlementCycle, setSettlementCycle] = useState<'monthly_1st' | 'biweekly_15th' | 'weekly_monday'>('monthly_1st');
  const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'admin_config'>('summary');

  // Sample Merchant Financial Ledgers
  const [merchantsFinancials, setMerchantsFinancials] = useState<MerchantFinancials[]>([
    {
      shop_id: 'shop-1',
      shop_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
      is_verified: true,
      total_sales: 34500000,
      shop_debt_fee: 1035000, // 3% of sales = 1.035.000đ
      platform_debt_reimburse: 450000, // Sàn nợ shop = 450.000đ
      net_balance: 585000, // Shop nợ Sàn = 585.000đ
      debt_limit: 1000000,
      is_suspended: false,
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'pending_payment',
    },
    {
      shop_id: 'shop-2',
      shop_name: 'Thời Trang Nam TQ Flagship Store',
      is_verified: true,
      total_sales: 58000000,
      shop_debt_fee: 1740000, // 3% = 1.740.000đ
      platform_debt_reimburse: 2100000, // Sàn bù voucher = 2.100.000đ
      net_balance: -360000, // Sàn nợ Shop = 360.000đ
      debt_limit: 1500000,
      is_suspended: false,
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'settled',
    },
    {
      shop_id: 'shop-3',
      shop_name: 'Kiot Cho Thuê & Điện Máy Hưng Yên',
      is_verified: true,
      total_sales: 42000000,
      shop_debt_fee: 1260000,
      platform_debt_reimburse: 150000,
      net_balance: 1110000, // 1.110.000đ > 1M ➔ Nợ quá trần!
      debt_limit: 1000000,
      is_suspended: true, // TẠM DỪNG SHOP DO NỢ QUÁ TRẦN!
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'overdue',
    },
    {
      shop_id: 'shop-4',
      shop_name: 'Gội Đầu Thảo Dược Đông Y (Chưa xác minh)',
      is_verified: false,
      total_sales: 12500000,
      shop_debt_fee: 0, // 0% phí sàn!
      platform_debt_reimburse: 0,
      net_balance: 0,
      debt_limit: 1000000,
      is_suspended: false,
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'settled',
    },
  ]);

  // Settlement records history
  const [settlementRecords, setSettlementRecords] = useState<SettlementRecord[]>([
    {
      id: 'SETTLE-2026-07',
      shop_id: 'shop-1',
      shop_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
      period: 'Tháng 07/2026',
      shop_debt_fee: 920000,
      platform_debt_reimburse: 300000,
      net_amount: 620000,
      who_pays: 'shop_pays_platform',
      deadline_date: '2026-08-08',
      status: 'completed',
      created_at: '2026-08-01T00:00:00.000Z',
    },
    {
      id: 'SETTLE-2026-07-2',
      shop_id: 'shop-2',
      shop_name: 'Thời Trang Nam TQ Flagship Store',
      period: 'Tháng 07/2026',
      shop_debt_fee: 1400000,
      platform_debt_reimburse: 1800000,
      net_amount: 400000,
      who_pays: 'platform_pays_shop',
      deadline_date: '2026-08-08',
      status: 'completed',
      created_at: '2026-08-01T00:00:00.000Z',
    },
  ]);

  if (!isOpen) return null;

  // Filter current user's shop if merchant
  const displayedFinancials = userRole === 'merchant'
    ? merchantsFinancials.filter((m) => m.shop_id === 'shop-1' || m.shop_name.includes('Khoái Châu'))
    : merchantsFinancials;

  const handleUpdateDebtLimit = (shopId: string, newLimit: number) => {
    setMerchantsFinancials((prev) =>
      prev.map((item) => {
        if (item.shop_id === shopId) {
          const updatedLimit = newLimit;
          const updatedSuspended = item.net_balance > updatedLimit;
          return {
            ...item,
            debt_limit: updatedLimit,
            is_suspended: updatedSuspended,
          };
        }
        return item;
      })
    );
  };

  const handleRunMonthlySettlement = () => {
    if (!isAdmin) return;

    if (window.confirm('Bạn có chắc chắn muốn thực hiện CHỐT SỔ & CẤN TRỪ HAI CHIỀU ngày 1 tháng này không?')) {
      const today = new Date();
      const deadline = new Date(Date.now() + 3600000 * 24 * 7).toISOString().split('T')[0];

      const newRecords: SettlementRecord[] = merchantsFinancials.map((shop) => {
        const net = shop.net_balance;
        let who: 'shop_pays_platform' | 'platform_pays_shop' | 'balanced' = 'balanced';
        if (net > 0) who = 'shop_pays_platform';
        else if (net < 0) who = 'platform_pays_shop';

        return {
          id: `SETTLE-${today.getFullYear()}-${today.getMonth() + 1}-${shop.shop_id}`,
          shop_id: shop.shop_id,
          shop_name: shop.shop_name,
          period: `Tháng ${today.getMonth() + 1}/${today.getFullYear()}`,
          shop_debt_fee: shop.shop_debt_fee,
          platform_debt_reimburse: shop.platform_debt_reimburse,
          net_amount: Math.abs(net),
          who_pays: who,
          deadline_date: deadline,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
      });

      setSettlementRecords([...newRecords, ...settlementRecords]);
      alert(`🎉 Đã chốt sổ cấn trừ hai chiều thành công!\n- Thời hạn chuyển khoản cấn trừ: 7 ngày (đến ngày ${deadline}).\n- Các shop nợ quá mốc trần đã tự động tạm dừng hoạt động.`);
    }
  };

  const handleMarkPaymentCompleted = (recordId: string) => {
    setSettlementRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, status: 'completed' } : rec))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-emerald-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0 border-b border-indigo-900/50">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Đối Soát Công Nợ & Cấn Trừ Hai Chiều (Sàn ⇄ Shop)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Chốt Sổ Công Nợ Ngày 1 Hàng Tháng</span>
            <span className="text-xs bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold">
              Chuyển khoản 7 ngày
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Shop nợ sàn phí % • Sàn nợ shop bù Xu & Voucher • Cấn trừ hai chiều ra 1 số dư duy nhất.
          </p>
        </div>

        {/* TOP SUMMARY STATS */}
        <div className="bg-slate-800 text-white p-3 text-xs shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-slate-700">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Shop Nợ Sàn (Phí %):</span>
            <span className="text-rose-400 font-black text-sm">
              {displayedFinancials.reduce((sum, m) => sum + m.shop_debt_fee, 0).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Sàn Nợ Shop (Bù Xu/Voucher):</span>
            <span className="text-emerald-400 font-black text-sm">
              {displayedFinancials.reduce((sum, m) => sum + m.platform_debt_reimburse, 0).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Chu kỳ chốt sổ hiện tại:</span>
            <span className="text-amber-300 font-extrabold text-xs">
              {settlementCycle === 'monthly_1st' ? '📅 Ngày 1 hàng tháng' : settlementCycle === 'biweekly_15th' ? '📅 Ngày 15 hàng tháng' : '📅 Thứ 2 hàng tuần'}
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'summary' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Sổ Sách Cấn Trừ Shop ({displayedFinancials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Lịch Sử Chốt Sổ ({settlementRecords.length})</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin_config')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'admin_config' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>👑 Admin Cài Đặt Chu Kỳ</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: SHOP FINANCIAL LEDGERS */}
          {activeTab === 'summary' && (
            <div className="space-y-3">
              
              {/* Trigger Settlement Button for Admin */}
              {isAdmin && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="leading-snug">
                    <span className="font-extrabold text-emerald-900 block">👑 Nút Chốt Sổ & Cấn Trừ Hai Chiều Dành Cho Admin</span>
                    <span className="text-emerald-700 text-[11px]">Bấm chốt sổ để xuất biên bản công nợ 7 ngày chuyển khoản và kiểm soát mốc trần nợ 1 triệu.</span>
                  </div>
                  <button
                    onClick={handleRunMonthlySettlement}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>⚡ Chốt Sổ Ngay</span>
                  </button>
                </div>
              )}

              {/* Financials List */}
              <div className="space-y-3">
                {displayedFinancials.map((shop) => {
                  const isShopDebt = shop.net_balance > 0;
                  const isPlatformDebt = shop.net_balance < 0;

                  return (
                    <div 
                      key={shop.shop_id}
                      className={`bg-white border rounded-2xl p-4 shadow-sm transition space-y-3 ${
                        shop.is_suspended ? 'border-rose-300 bg-rose-50/20' : 'border-gray-200 hover:border-indigo-200'
                      }`}
                    >
                      {/* Shop Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-gray-900">{shop.shop_name}</span>
                          {shop.is_verified ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>✓ Đã xác minh (3% phí)</span>
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              🔒 Chưa xác minh (0% phí)
                            </span>
                          )}
                        </div>

                        {shop.is_suspended && (
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Ban className="w-3 h-3" />
                            <span>❌ TẠM DỪNG SHOP (Nợ &gt; {shop.debt_limit.toLocaleString()}đ)</span>
                          </span>
                        )}
                      </div>

                      {/* Financial Metrics Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        
                        {/* Metric 1: Shop Debt Fee */}
                        <div className="p-2.5 bg-rose-50/70 rounded-xl border border-rose-100">
                          <span className="text-[10px] text-rose-700 font-bold block uppercase">Shop nợ sàn (Phí %):</span>
                          <span className="text-rose-600 font-black text-sm">
                            {shop.shop_debt_fee.toLocaleString('vi-VN')} đ
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">3% trên doanh số ban đầu</span>
                        </div>

                        {/* Metric 2: Platform Debt Reimburse */}
                        <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100">
                          <span className="text-[10px] text-emerald-700 font-bold block uppercase">Sàn nợ shop (Bù Xu/Voucher):</span>
                          <span className="text-emerald-600 font-black text-sm">
                            {shop.platform_debt_reimburse.toLocaleString('vi-VN')} đ
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Sàn hoàn tiền khách giảm xu</span>
                        </div>

                        {/* Metric 3: Net Balance after Two-Way Net Off */}
                        <div className={`p-2.5 rounded-xl border ${
                          isShopDebt ? 'bg-amber-50 border-amber-200' : isPlatformDebt ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <span className="text-[10px] text-gray-600 font-bold block uppercase">Số dư cấn trừ 2 chiều:</span>
                          <span className={`font-black text-sm ${
                            isShopDebt ? 'text-amber-800' : isPlatformDebt ? 'text-blue-800' : 'text-gray-700'
                          }`}>
                            {isShopDebt 
                              ? `Shop nợ Sàn: ${shop.net_balance.toLocaleString('vi-VN')} đ` 
                              : isPlatformDebt 
                              ? `Sàn nợ Shop: ${Math.abs(shop.net_balance).toLocaleString('vi-VN')} đ` 
                              : '0 đ (Cân bằng)'}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-0.5">Chuyển khoản trong 7 ngày</span>
                        </div>
                      </div>

                      {/* Admin Debt Limit Configuration & Suspension Warning */}
                      {isAdmin && (
                        <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-bold text-[11px]">Trần nợ shop (Admin chỉnh):</span>
                            <select
                              value={shop.debt_limit}
                              onChange={(e) => handleUpdateDebtLimit(shop.shop_id, Number(e.target.value))}
                              className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold text-gray-800"
                            >
                              <option value={500000}>500.000 đ</option>
                              <option value={1000000}>1.000.000 đ (Mặc định)</option>
                              <option value={2000000}>2.000.000 đ</option>
                              <option value={5000000}>5.000.000 đ</option>
                            </select>
                          </div>

                          {shop.is_suspended && (
                            <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Nợ vượt {shop.debt_limit.toLocaleString()}đ ➔ Khóa quyền đăng bài mới</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: SETTLEMENT RECORDS HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              <div className="space-y-2">
                {settlementRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Chưa có biên bản chốt sổ công nợ nào.</div>
                ) : (
                  settlementRecords.map((rec) => {
                    const isShopPays = rec.who_pays === 'shop_pays_platform';
                    const isCompleted = rec.status === 'completed';

                    return (
                      <div key={rec.id} className="p-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-gray-900">{rec.shop_name}</span>
                            <span className="text-xs text-gray-500 ml-2 font-semibold">({rec.period})</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isCompleted ? '✓ Đã hoàn tất thanh toán' : '⏳ Chờ chuyển khoản 7 ngày'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl text-xs">
                          <div>
                            <span className="text-gray-500">Nội dung đối soát: </span>
                            <strong className={isShopPays ? 'text-rose-600' : 'text-emerald-600'}>
                              {isShopPays ? `Shop chuyển trả Sàn: ${rec.net_amount.toLocaleString()}đ` : `Sàn chuyển trả Shop: ${rec.net_amount.toLocaleString()}đ`}
                            </strong>
                          </div>
                          <span className="text-[11px] text-gray-400">Hạn chót: {rec.deadline_date}</span>
                        </div>

                        {!isCompleted && isAdmin && (
                          <div className="text-right pt-1">
                            <button
                              onClick={() => handleMarkPaymentCompleted(rec.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs transition cursor-pointer"
                            >
                              Xác nhận đã nhận chuyển khoản
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADMIN SETTLEMENT CYCLE CONFIGURATION */}
          {activeTab === 'admin_config' && isAdmin && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-3">
                <h3 className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-amber-600" />
                  <span>Cài Đặt Chu Kỳ Chốt Sổ Công Nợ Toàn Sàn</span>
                </h3>

                <div className="space-y-2">
                  <label className="block font-bold text-gray-800">Chọn chu kỳ chốt sổ công nợ:</label>
                  
                  <div className="space-y-2">
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      settlementCycle === 'monthly_1st' ? 'bg-white border-amber-500 shadow-sm font-extrabold text-amber-950' : 'bg-white/60 border-amber-200 text-gray-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cycle"
                          checked={settlementCycle === 'monthly_1st'}
                          onChange={() => setSettlementCycle('monthly_1st')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span>📅 Ngày 1 hàng tháng (Mặc định chuẩn)</span>
                      </div>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">Chuẩn nhất</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      settlementCycle === 'biweekly_15th' ? 'bg-white border-amber-500 shadow-sm font-extrabold text-amber-950' : 'bg-white/60 border-amber-200 text-gray-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cycle"
                          checked={settlementCycle === 'biweekly_15th'}
                          onChange={() => setSettlementCycle('biweekly_15th')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span>📅 Ngày 15 hàng tháng (Bán nguyệt)</span>
                      </div>
                      <span className="text-[10px] text-gray-500">15 ngày/lần</span>
                    </label>

                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      settlementCycle === 'weekly_monday' ? 'bg-white border-amber-500 shadow-sm font-extrabold text-amber-950' : 'bg-white/60 border-amber-200 text-gray-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="cycle"
                          checked={settlementCycle === 'weekly_monday'}
                          onChange={() => setSettlementCycle('weekly_monday')}
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <span>📅 Thứ Hai hàng tuần (Hàng tuần)</span>
                      </div>
                      <span className="text-[10px] text-gray-500">7 ngày/lần</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <strong>Quy trình đối soát tự động:</strong>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Shop nợ phí sàn % (chỉ áp dụng shop đã xác minh).</li>
                    <li>Sàn nợ shop phần bù khách tiêu Xu hoặc Voucher.</li>
                    <li>Chốt sổ cấn trừ 2 chiều ra 1 số dư duy nhất. Bên nợ chuyển khoản trong 7 ngày.</li>
                    <li>Shop nợ quá trần (mặc định 1.000.000đ) tự động tạm dừng hoạt động.</li>
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
