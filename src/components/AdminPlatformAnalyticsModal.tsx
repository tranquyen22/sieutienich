import React, { useState, useMemo } from 'react';
import { 
  X, Users, ShoppingBag, DollarSign, Calendar, 
  FileSpreadsheet, ChevronRight, BarChart3
} from 'lucide-react';

interface DailyStatRecord {
  date: string; // YYYY-MM-DD
  new_users_count: number;
  new_buyers_count: number;
  new_merchants_count: number;
  completed_orders_count: number;
  cancelled_orders_count: number;
  total_gmv: number;
  platform_fee_collected: number;
  voucher_coin_reimbursement: number;
}

interface AdminPlatformAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPlatformAnalyticsModal: React.FC<AdminPlatformAnalyticsModalProps> = ({ isOpen, onClose }) => {

  // Active Selected Drilldown Metric Tab ('users' | 'orders' | 'gmv')
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'gmv'>('gmv');

  // Time Range Quick Selection Mode
  const [rangeMode, setRangeMode] = useState<'7days' | '30days' | '3months' | '6months' | 'custom'>('30days');
  const [startDate, setStartDate] = useState<string>('2026-08-01');
  const [endDate, setEndDate] = useState<string>('2026-08-26');

  // Simulated 30-Day Platform Analytics Master Dataset
  const sampleDailyStats: DailyStatRecord[] = useMemo(() => {
    const list: DailyStatRecord[] = [];
    const baseDate = new Date('2026-08-01');

    for (let i = 0; i < 26; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Random realistic daily numbers
      const newUsers = 35 + Math.floor(Math.sin(i) * 15) + Math.floor(Math.random() * 20);
      const completedOrders = 120 + Math.floor(Math.cos(i) * 30) + Math.floor(Math.random() * 40);
      const cancelledOrders = Math.floor(completedOrders * 0.05);
      const avgOrderVal = 250000 + Math.floor(Math.random() * 80000);
      const gmv = completedOrders * avgOrderVal;
      const fee = Math.floor(gmv * 0.03); // Phí sàn 3%
      const coinReimburse = Math.floor(gmv * 0.015); // Bù xu 1.5%

      list.push({
        date: dateStr,
        new_users_count: newUsers,
        new_buyers_count: Math.floor(newUsers * 0.85),
        new_merchants_count: Math.floor(newUsers * 0.15),
        completed_orders_count: completedOrders,
        cancelled_orders_count: cancelledOrders,
        total_gmv: gmv,
        platform_fee_collected: fee,
        voucher_coin_reimbursement: coinReimburse,
      });
    }

    return list.reverse(); // Most recent dates first
  }, []);

  if (!isOpen) return null;

  // Filtered dataset based on date selection
  const filteredData = sampleDailyStats.filter((item) => {
    if (rangeMode === '7days') {
      const idx = sampleDailyStats.indexOf(item);
      return idx < 7;
    }
    if (rangeMode === '30days') {
      const idx = sampleDailyStats.indexOf(item);
      return idx < 30;
    }
    if (rangeMode === 'custom') {
      return item.date >= startDate && item.date <= endDate;
    }
    return true;
  });

  // Aggregated Totals in selected period
  const totalNewUsers = filteredData.reduce((acc, curr) => acc + curr.new_users_count, 0);
  const totalCompletedOrders = filteredData.reduce((acc, curr) => acc + curr.completed_orders_count, 0);
  const totalGMV = filteredData.reduce((acc, curr) => acc + curr.total_gmv, 0);
  const totalPlatformFee = filteredData.reduce((acc, curr) => acc + curr.platform_fee_collected, 0);

  // EXPORT DATASET TO EXCEL / CSV WITH UTF-8 BOM
  const handleExportData = (format: 'xlsx' | 'csv') => {
    let csvContent = '\uFEFF'; // Add UTF-8 BOM for Excel Vietnamese compatibility

    if (activeTab === 'users') {
      csvContent += 'Ngày,Tổng người dùng mới,Số người mua mới,Số gian hàng mới\n';
      filteredData.forEach((row) => {
        csvContent += `${row.date},${row.new_users_count},${row.new_buyers_count},${row.new_merchants_count}\n`;
      });
    } else if (activeTab === 'orders') {
      csvContent += 'Ngày,Đơn hoàn thành,Đơn đã hủy,Tỷ lệ thành công (%)\n';
      filteredData.forEach((row) => {
        const rate = ((row.completed_orders_count / (row.completed_orders_count + row.cancelled_orders_count)) * 100).toFixed(1);
        csvContent += `${row.date},${row.completed_orders_count},${row.cancelled_orders_count},${rate}%\n`;
      });
    } else {
      csvContent += 'Ngày,Tổng giá trị giao dịch GMV (đ),Phí sàn thu được 3% (đ),Tiền bù xu voucher (đ),Doanh thu ròng (đ)\n';
      filteredData.forEach((row) => {
        const netRev = row.platform_fee_collected - row.voucher_coin_reimbursement;
        csvContent += `${row.date},${row.total_gmv},${row.platform_fee_collected},${row.voucher_coin_reimbursement},${netRev}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Thong_Ke_Toan_San_${activeTab.toUpperCase()}_${rangeMode}_${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`🎉 Đã xuất tập tin báo cáo thống kê Excel/CSV cho chỉ số [${activeTab.toUpperCase()}] thành công!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Trung Tâm Thống Kê & Báo Cáo Số Liệu Toàn Sàn (Super Admin)</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-white">Thống Kê Dữ Liệu Thực Tế Hàng Ngày</h2>

            {/* Export File Button */}
            <button
              onClick={() => handleExportData('csv')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>📥 Xuất Báo Cáo Excel / CSV</span>
            </button>
          </div>
        </div>

        {/* TIME RANGE FILTER TOOLBAR */}
        <div className="bg-indigo-50/90 p-4 border-b border-indigo-100 space-y-3 shrink-0 text-xs font-bold text-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Chọn khoảng thời gian thống kê:</span>
            </div>

            {/* Quick Selection Buttons */}
            <div className="flex flex-wrap gap-1.5 font-extrabold">
              {[
                { id: '7days', label: '7 ngày qua' },
                { id: '30days', label: '30 ngày qua' },
                { id: '3months', label: '3 tháng qua' },
                { id: 'custom', label: '📅 Chọn theo bảng lịch' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setRangeMode(btn.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer border ${
                    rangeMode === btn.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Inputs Range if custom selected */}
          {rangeMode === 'custom' && (
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-indigo-200 text-xs font-bold">
              <span>Từ ngày:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-1 bg-gray-50 border border-gray-300 rounded-lg"
              />
              <span>Đến ngày:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-1 bg-gray-50 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* 3 KEY INTERACTIVE METRIC CARDS (BẤM VÀO CÁI NÀO RA CHI TIẾT CÁI ĐÓ) */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-slate-50 border-b border-gray-200">
          
          {/* METRIC CARD 1: NEW USERS */}
          <div
            onClick={() => setActiveTab('users')}
            className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 relative overflow-hidden ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400'
                : 'bg-white text-gray-900 border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-extrabold opacity-90">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>1. Số Người Dùng Mới</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black">{totalNewUsers.toLocaleString()} tài khoản</div>
            <p className="text-[11px] opacity-80 font-medium">Bấm vào để xem chi tiết theo ngày</p>
          </div>

          {/* METRIC CARD 2: COMPLETED TRANSACTIONS */}
          <div
            onClick={() => setActiveTab('orders')}
            className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 relative overflow-hidden ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                : 'bg-white text-gray-900 border-gray-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-extrabold opacity-90">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span>2. Đơn Giao Dịch Thành Công</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black">{totalCompletedOrders.toLocaleString()} đơn</div>
            <p className="text-[11px] opacity-80 font-medium">Bấm vào để xem chi tiết giao dịch</p>
          </div>

          {/* METRIC CARD 3: TOTAL GMV AMOUNT */}
          <div
            onClick={() => setActiveTab('gmv')}
            className={`p-4 rounded-2xl border transition cursor-pointer space-y-1 relative overflow-hidden ${
              activeTab === 'gmv'
                ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400'
                : 'bg-white text-gray-900 border-gray-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-extrabold opacity-90">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>3. Tổng Doanh Thu Toàn Sàn (GMV)</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black">{totalGMV.toLocaleString()} đ</div>
            <p className="text-[11px] opacity-80 font-medium">Phí sàn thu được: {totalPlatformFee.toLocaleString()} đ</p>
          </div>

        </div>

        {/* DRILLDOWN DETAILS TABLE DATA AREA */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 text-xs">
          
          <div className="flex items-center justify-between font-black text-gray-800">
            <span className="text-sm">
              📋 Bảng Chi Tiết Số Liệu: [{activeTab === 'users' ? 'NGƯỜI DÙNG MỚI' : activeTab === 'orders' ? 'ĐƠN HOÀN THÀNH' : 'DOANH THU & PHÍ SÀN'}] ({filteredData.length} ngày trong kỳ)
            </span>
            <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg">
              Đồng bộ dữ liệu Realtime
            </span>
          </div>

          {/* TABLE TAB 1: USERS DRILLDOWN */}
          {activeTab === 'users' && (
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-indigo-900 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Ngày</th>
                    <th className="p-3">Tổng người dùng mới</th>
                    <th className="p-3">Tài khoản Khách mua</th>
                    <th className="p-3">Tài khoản Chủ shop</th>
                    <th className="p-3 text-right">Tỉ lệ Shop / Khách</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {filteredData.map((row) => (
                    <tr key={row.date} className="hover:bg-indigo-50/50 transition">
                      <td className="p-3 font-extrabold text-indigo-950">{row.date}</td>
                      <td className="p-3 text-indigo-700 font-black">+{row.new_users_count} người</td>
                      <td className="p-3 text-gray-700">+{row.new_buyers_count} khách</td>
                      <td className="p-3 text-emerald-700">+{row.new_merchants_count} shop</td>
                      <td className="p-3 text-right text-gray-500 font-mono">
                        {((row.new_merchants_count / row.new_users_count) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE TAB 2: ORDERS DRILLDOWN */}
          {activeTab === 'orders' && (
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-emerald-900 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Ngày</th>
                    <th className="p-3">Đơn hoàn thành</th>
                    <th className="p-3">Đơn đã hủy</th>
                    <th className="p-3 text-right">Tỉ lệ giao thành công (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {filteredData.map((row) => {
                    const total = row.completed_orders_count + row.cancelled_orders_count;
                    const successRate = ((row.completed_orders_count / total) * 100).toFixed(1);

                    return (
                      <tr key={row.date} className="hover:bg-emerald-50/50 transition">
                        <td className="p-3 font-extrabold text-emerald-950">{row.date}</td>
                        <td className="p-3 text-emerald-700 font-black">+{row.completed_orders_count} đơn</td>
                        <td className="p-3 text-rose-600">-{row.cancelled_orders_count} đơn</td>
                        <td className="p-3 text-right font-black text-emerald-800">{successRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE TAB 3: GMV & REVENUE DRILLDOWN */}
          {activeTab === 'gmv' && (
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-purple-900 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Ngày</th>
                    <th className="p-3">Tổng GMV Giao Dịch</th>
                    <th className="p-3">Phí Sàn Thu Được (3%)</th>
                    <th className="p-3">Sàn Bù Xu & Voucher</th>
                    <th className="p-3 text-right">Doanh Thu Ròng Sàn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-bold">
                  {filteredData.map((row) => {
                    const netRevenue = row.platform_fee_collected - row.voucher_coin_reimbursement;

                    return (
                      <tr key={row.date} className="hover:bg-purple-50/50 transition">
                        <td className="p-3 font-extrabold text-purple-950">{row.date}</td>
                        <td className="p-3 text-purple-900 font-black">{row.total_gmv.toLocaleString()} đ</td>
                        <td className="p-3 text-emerald-700">+{row.platform_fee_collected.toLocaleString()} đ</td>
                        <td className="p-3 text-amber-700">-{row.voucher_coin_reimbursement.toLocaleString()} đ</td>
                        <td className="p-3 text-right font-black text-emerald-700">
                          {netRevenue > 0 ? `+${netRevenue.toLocaleString()} đ` : `${netRevenue.toLocaleString()} đ`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
