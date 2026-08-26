import React, { useState } from 'react';
import { 
  X, DollarSign, AlertTriangle, Settings, CheckCircle2, Clock, 
  Unlock, Lock, Edit3, History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { MerchantFinancials, SettlementRecord, MerchantDebtLockLog } from '../types';

interface MerchantReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantReconciliationModal: React.FC<MerchantReconciliationModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const [settlementCycle, setSettlementCycle] = useState<'monthly_1st' | 'biweekly_15th' | 'weekly_monday'>('monthly_1st');
  const [activeTab, setActiveTab] = useState<'summary' | 'history' | 'audit_logs' | 'admin_config'>('summary');

  // Sample Merchant Financial Ledgers with 5-Step Debt Engine Features
  const [merchantsFinancials, setMerchantsFinancials] = useState<MerchantFinancials[]>([
    {
      shop_id: 'shop-1',
      shop_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
      is_verified: true,
      total_sales: 34500000,
      shop_debt_fee: 1035000, // 3% of sales = 1.035.000đ
      platform_debt_reimburse: 450000, // Sàn nợ shop = 450.000đ
      net_balance: 585000, // Shop nợ Sàn = 585.000đ
      debt_limit: 1000000, // Mốc trần 1tr
      is_suspended: false,
      warning_issued: false,
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'pending_payment',
      lock_logs: [
        {
          id: 'log-101',
          timestamp: '2026-08-01T08:00:00.000Z',
          action: 'auto_unlock_payment',
          reason: 'Chủ sàn ghi nhận đã nhận chuyển khoản 450.000đ ➔ Shop tự mở lại ngay.',
          actor: 'Hệ Thống (Ghi nhận thanh toán)',
        },
      ],
    },
    {
      shop_id: 'shop-2',
      shop_name: 'Thời Trang Nam TQ Flagship Store',
      is_verified: true,
      total_sales: 58000000,
      shop_debt_fee: 1740000,
      platform_debt_reimburse: 2100000,
      net_balance: -360000, // Sàn nợ Shop = 360.000đ
      debt_limit: 5000000, // Shop quen nới mốc nợ 5 triệu
      is_suspended: false,
      warning_issued: false,
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'settled',
      lock_logs: [],
    },
    {
      shop_id: 'shop-3',
      shop_name: 'Kiot Cho Thuê & Điện Máy Hưng Yên',
      is_verified: true,
      total_sales: 42000000,
      shop_debt_fee: 1260000,
      platform_debt_reimburse: 0,
      net_balance: 1260000, // Shop nợ Sàn 1.260.000đ (Vượt trần 1.000.000đ)
      debt_limit: 1000000,
      is_suspended: true, // TỰ KHÓA BỞI HỆ THỐNG
      warning_issued: true,
      warning_deadline_date: '2026-08-25T23:59:59.000Z',
      last_settled_at: '2026-08-01T00:00:00.000Z',
      settlement_status: 'overdue',
      lock_logs: [
        {
          id: 'log-102',
          timestamp: '2026-08-22T09:00:00.000Z',
          action: 'auto_warning',
          reason: 'Cảnh báo nợ phí gửi trước 3 ngày (Nợ 920.000đ / Trần 1.000.000đ) qua Web & Email.',
          actor: 'Hệ Thống Tự Động Cảnh Báo',
        },
        {
          id: 'log-103',
          timestamp: '2026-08-25T23:59:59.000Z',
          action: 'auto_lock',
          reason: 'Chạm mốc trần nợ phí (1.260.000đ > 1.000.000đ) mà chưa trả ➔ Tự khóa không cần ai bấm.',
          actor: 'Hệ Thống Tự Động Khóa',
        },
      ],
    },
  ]);

  // Settlement Records History List
  const [settlementHistory] = useState<SettlementRecord[]>([
    {
      id: 'SET-2026-07',
      shop_id: 'shop-1',
      shop_name: 'Nông Sản & Lẩu Thái Khoái Châu Official',
      period: 'Tháng 07/2026',
      shop_debt_fee: 980000,
      platform_debt_reimburse: 320000,
      net_amount: 660000,
      who_pays: 'shop_pays_platform',
      deadline_date: '2026-08-07T00:00:00.000Z',
      status: 'completed',
      created_at: '2026-08-01T00:00:00.000Z',
    },
  ]);

  if (!isOpen) return null;

  // Total Platform Fees and Debt Summary
  const totalShopDebtFees = merchantsFinancials.reduce((sum, m) => sum + (m.net_balance > 0 ? m.net_balance : 0), 0);
  const totalPlatformReimburse = merchantsFinancials.reduce((sum, m) => sum + (m.net_balance < 0 ? Math.abs(m.net_balance) : 0), 0);

  // 1. RECORD PAYMENT & AUTO-UNLOCK SHOP INSTANTLY
  const handleRecordPayment = (shopId: string, shopName: string) => {
    const paymentAmount = prompt(`Nhập số tiền chuyển khoản shop "${shopName}" đã thanh toán cho sàn (đ):`, '585000');
    if (!paymentAmount || isNaN(Number(paymentAmount))) return;

    const amountNum = Number(paymentAmount);

    setMerchantsFinancials((prev) =>
      prev.map((m) => {
        if (m.shop_id === shopId) {
          const newNetBalance = Math.max(0, m.net_balance - amountNum);
          const wasSuspended = m.is_suspended;
          const autoUnlocked = wasSuspended && newNetBalance < m.debt_limit;

          const newLog: MerchantDebtLockLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: 'auto_unlock_payment',
            reason: `Chủ sàn ghi nhận đã nhận chuyển khoản ${amountNum.toLocaleString()} đ ${autoUnlocked ? '➔ SHOP TỰ MỞ LẠI NGAY LẬP TỨC!' : ''}`,
            actor: isAdmin ? 'Admin Tổng (Chủ sàn)' : 'Nhân Viên Thu Chi',
          };

          return {
            ...m,
            net_balance: newNetBalance,
            is_suspended: autoUnlocked ? false : m.is_suspended,
            settlement_status: newNetBalance === 0 ? 'settled' : 'pending_payment',
            lock_logs: [newLog, ...(m.lock_logs || [])],
          };
        }
        return m;
      })
    );

    alert(`✅ Đã ghi nhận nhận thanh toán ${amountNum.toLocaleString()} đ của Shop "${shopName}"!\n⚡ Shop tự động mở lại ngay lập tức tại thời điểm bấm, không phải chờ hôm sau!`);
  };

  // 2. EDIT DEBT LIMIT PER SHOP (SHOP QUEN CHO NỚI, SHOP MỚI SIẾT)
  const handleEditDebtLimit = (shop: MerchantFinancials) => {
    const newLimit = prompt(`Đặt Mốc Trần Nợ Phí Riêng cho Shop "${shop.shop_name}" (đ):\n(Mẹo: Shop quen cho nới 5.000.000đ, Shop mới siết 500.000đ)`, shop.debt_limit.toString());
    if (!newLimit || isNaN(Number(newLimit))) return;

    const limitNum = Number(newLimit);

    setMerchantsFinancials((prev) =>
      prev.map((m) => (m.shop_id === shop.shop_id ? { ...m, debt_limit: limitNum } : m))
    );

    alert(`⚙️ Đã cập nhật Mốc Trần Nợ cho Shop "${shop.shop_name}" thành: ${limitNum.toLocaleString()} đ`);
  };

  // 3. MANUAL FORCE OPEN (EXTEND DEBT FOR LOYAL SHOP) OR FORCE LOCK
  const handleForceToggleLock = (shop: MerchantFinancials, action: 'force_open' | 'force_lock') => {
    const isForceOpen = action === 'force_open';

    const reason = prompt(
      isForceOpen 
        ? `Nhập lý do ÉP MỞ TAY gia hạn nợ cho Shop quen "${shop.shop_name}":` 
        : `Nhập lý do ÉP KHÓA TAY Shop "${shop.shop_name}":`,
      isForceOpen ? 'Gia hạn nợ thêm 7 ngày cho Shop quen uy tín.' : 'Ép khóa tay để rà soát công nợ.'
    );

    if (!reason) return;

    const newLog: MerchantDebtLockLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: isForceOpen ? 'manual_force_open' : 'manual_force_lock',
      reason: reason,
      actor: isAdmin ? 'Admin Tổng (Chủ sàn)' : 'Nhân Viên Quản Trị',
    };

    setMerchantsFinancials((prev) =>
      prev.map((m) => {
        if (m.shop_id === shop.shop_id) {
          return {
            ...m,
            is_suspended: !isForceOpen,
            lock_logs: [newLog, ...(m.lock_logs || [])],
          };
        }
        return m;
      })
    );

    alert(isForceOpen 
      ? `🔓 Đã ÉP MỜ TAY gia hạn nợ thành công cho Shop "${shop.shop_name}"!` 
      : `🔒 Đã ÉP KHÓA TAY Shop "${shop.shop_name}".`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Hệ Thống Quản Lý & Tự Động Khóa/Mở Công Nợ Phí Sàn</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">Sổ Công Nợ Hai Chiều (Sàn ⇄ Shop)</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-gray-100 border-b border-gray-200 text-xs font-extrabold shrink-0">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'summary' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Sổ Công Nợ & Tự Động Khóa/Mở</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'audit_logs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Nhật Ký Khóa & Mở (Dùng Chung 2 Bên)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Lịch Sử Chốt Sổ Hằng Tháng</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin_config')}
              className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'admin_config' ? 'bg-slate-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Cấu Hình Chu Kỳ Chốt Sổ</span>
            </button>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* TAB 1: LEDGER SUMMARY & AUTOMATED LOCK/UNLOCK SYSTEM */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              
              {/* Rule Summary Banner */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-amber-400">
                  <span>⚡ Quy Tắc Khóa / Mở Shop Tự Động Theo Phí Sàn (Phần Mềm Tự Xử Lý):</span>
                  <span>Chủ sàn không phải mở lời đòi!</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white block">1. Mốc nợ riêng từng shop:</strong>
                    Shop quen cho nới (5tr), shop mới siết chặt (500k).
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white block">2. Cảnh báo trước 3 ngày:</strong>
                    Thông báo Web & Email kèm ngày giờ tự ngắt.
                  </div>
                  <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                    <strong className="text-white block">3. Nhận chuyển khoản = Tự mở ngay:</strong>
                    Bấm nhận tiền là shop tự mở lại tức thì!
                  </div>
                </div>
              </div>

              {/* Ledger Totals Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                  <span className="text-rose-700 font-extrabold text-[11px] block">Shop nợ sàn (Phí % các đơn):</span>
                  <strong className="text-lg font-black text-rose-900">{totalShopDebtFees.toLocaleString()} đ</strong>
                  <span className="text-[10px] text-rose-600 font-bold block">Chỉ áp dụng với Shop đã xác minh</span>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-emerald-700 font-extrabold text-[11px] block">Sàn nợ shop (Bù tiền xu & voucher):</span>
                  <strong className="text-lg font-black text-emerald-900">{totalPlatformReimburse.toLocaleString()} đ</strong>
                  <span className="text-[10px] text-emerald-600 font-bold block">Hoàn lại tiền cho shop khi khách dùng Xu</span>
                </div>
              </div>

              {/* Merchants Ledger List */}
              <div className="space-y-3">
                <span className="font-black text-gray-900 block text-xs">Danh sách gian hàng & Trạng thái Công nợ hai chiều:</span>

                {merchantsFinancials.map((m) => {
                  const shopPays = m.net_balance > 0;
                  const platformPays = m.net_balance < 0;

                  return (
                    <div key={m.shop_id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
                      
                      {/* Top Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                        <div>
                          <strong className="text-sm font-extrabold text-gray-900 block">{m.shop_name}</strong>
                          <span className="text-[11px] text-gray-400">Trần nợ riêng shop này: <strong className="text-gray-800">{m.debt_limit.toLocaleString()} đ</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Edit Debt Limit Button */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleEditDebtLimit(m)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer"
                              title="Chỉnh mốc nợ riêng cho shop quen/mới"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Đổi mốc trần nợ</span>
                            </button>
                          )}

                          {/* Suspended or Active Badge */}
                          {m.is_suspended ? (
                            <span className="bg-rose-100 text-rose-900 px-2.5 py-1 rounded-full font-black text-[10px]">
                              🔴 ĐÃ TỰ KHÓA (Nợ quá trần {m.debt_limit.toLocaleString()}đ)
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-black text-[10px]">
                              🟢 Đang hoạt động
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Financial Math Balance Row */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-gray-500 block">Phí sàn theo % (3%):</span>
                          <strong className="text-rose-600 font-extrabold">+{m.shop_debt_fee.toLocaleString()} đ</strong>
                        </div>

                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                          <span className="text-gray-500 block">Sàn bù xu & voucher:</span>
                          <strong className="text-emerald-600 font-extrabold">-{m.platform_debt_reimburse.toLocaleString()} đ</strong>
                        </div>

                        <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200">
                          <span className="text-indigo-950 font-extrabold block">Số dư cấn trừ 2 chiều:</span>
                          <strong className={`font-black text-xs ${shopPays ? 'text-rose-600' : platformPays ? 'text-emerald-600' : 'text-gray-700'}`}>
                            {shopPays ? `Shop nợ Sàn: ${m.net_balance.toLocaleString()} đ` : platformPays ? `Sàn nợ Shop: ${Math.abs(m.net_balance).toLocaleString()} đ` : 'Cân bằng (0 đ)'}
                          </strong>
                        </div>
                      </div>

                      {/* 3-Day Warning Alert Box if nearing limit */}
                      {shopPays && m.net_balance >= m.debt_limit * 0.8 && (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>⚠️ Cảnh báo nợ phí trước 3 ngày đã gửi qua Web & Email (Nợ {m.net_balance.toLocaleString()} đ / Trần {m.debt_limit.toLocaleString()} đ).</span>
                          </div>
                          <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md shrink-0">Hạn khóa: 23:59 hôm nay</span>
                        </div>
                      )}

                      {/* Action Buttons: Record Payment & Force Open / Lock */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-extrabold">
                        {shopPays ? (
                          <button
                            type="button"
                            onClick={() => handleRecordPayment(m.shop_id, m.shop_name)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>✓ Ghi Nhận Nhận Tiền (Tự Mở Lại Shop Ngay)</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 text-xs font-bold">✓ Sàn đã thanh toán tiền bù xu cho shop</span>
                        )}

                        {/* Admin Force Override Buttons */}
                        {isAdmin && (
                          <div className="flex items-center gap-2">
                            {m.is_suspended ? (
                              <button
                                type="button"
                                onClick={() => handleForceToggleLock(m, 'force_open')}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                                title="Ép mở tay gia hạn cho shop quen"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>🔓 Ép mở tay (Gia hạn shop quen)</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleForceToggleLock(m, 'force_lock')}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                                title="Ép khóa tay khi cần thiết"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>🔒 Ép khóa tay</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: AUDIT LOGS FOR DEBT LOCK/UNLOCK (SHARED 2-WAY LEDGER) */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1 text-indigo-950">
                <strong className="font-extrabold text-sm block flex items-center gap-1.5">
                  <History className="w-4 h-4 text-indigo-600" />
                  <span>Nhật Ký Khóa & Mở Công Nợ Phí Sàn (Hai Bên Cùng Nhìn 1 Bản Minh Bạch)</span>
                </strong>
                <p className="text-[11px]">Mọi lần phần mềm tự khóa/mở hoặc Admin ép mở/khóa tay đều ghi lại vết audit log công khai.</p>
              </div>

              <div className="space-y-2">
                {merchantsFinancials.flatMap((m) => m.lock_logs || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-400">Chưa có nhật ký khóa mở nào.</div>
                ) : (
                  merchantsFinancials.flatMap((m) => m.lock_logs || []).map((log) => (
                    <div key={log.id} className="p-3 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-gray-900 block font-black">{log.reason}</strong>
                        <span className="text-gray-400 text-[10px]">Thực hiện bởi: <strong>{log.actor}</strong> • {new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full font-black text-[10px] ${
                        log.action.includes('unlock') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SETTLEMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="font-black text-gray-900 block text-xs">Lịch sử chốt sổ các kỳ thanh toán gần nhất:</span>

              {settlementHistory.map((s) => (
                <div key={s.id} className="p-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-gray-900 font-extrabold block">{s.shop_name} ({s.period})</strong>
                    <span className="text-gray-500 text-[11px]">Số tiền chốt cấn trừ: <strong className="text-indigo-600">{s.net_amount.toLocaleString()} đ</strong></span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-black rounded-full text-[10px]">
                    ✓ Đã chốt & Hoàn tất
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ADMIN SETTLEMENT CYCLE CONFIGURATION */}
          {activeTab === 'admin_config' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <strong className="text-sm font-black text-amber-400 block">Cấu Hình Chu Kỳ Chốt Sổ Công Nợ (Chủ Sàn Đổi Được):</strong>
                <p className="text-[11px] text-slate-300">
                  Chu kỳ chốt sổ mặc định là **Ngày 1 hằng tháng**. Admin có thể thay đổi sang chu kỳ nửa tháng hoặc hằng tuần.
                </p>
              </div>

              <div className="space-y-3 bg-white p-4 border border-gray-200 rounded-2xl text-xs font-extrabold">
                <label className="block text-gray-900 font-black">Chọn chu kỳ chốt sổ tự động:</label>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="cycle"
                      checked={settlementCycle === 'monthly_1st'}
                      onChange={() => setSettlementCycle('monthly_1st')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>📅 Mặc định: Chốt sổ Ngày 01 hằng tháng (Thời hạn thanh toán 7 ngày)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="cycle"
                      checked={settlementCycle === 'biweekly_15th'}
                      onChange={() => setSettlementCycle('biweekly_15th')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>📅 Nửa tháng: Chốt sổ Ngày 15 và Ngày 01 hằng tháng</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                    <input
                      type="radio"
                      name="cycle"
                      checked={settlementCycle === 'weekly_monday'}
                      onChange={() => setSettlementCycle('weekly_monday')}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span>📅 Hằng tuần: Chốt sổ Thứ Hai hằng tuần</span>
                  </label>
                </div>

                <button
                  onClick={() => alert(`✅ Đã lưu thay đổi chu kỳ chốt sổ công nợ thành: ${settlementCycle === 'monthly_1st' ? 'Ngày 1 hằng tháng' : settlementCycle === 'biweekly_15th' ? 'Ngày 15 và Ngày 1' : 'Thứ Hai hằng tuần'}!`)}
                  className="mt-3 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md cursor-pointer font-black"
                >
                  Lưu Cài Đặt Chu Kỳ Chốt Sổ
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Màn Hình
          </button>
        </div>

      </div>
    </div>
  );
};
