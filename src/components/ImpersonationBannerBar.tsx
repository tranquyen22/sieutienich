import React from 'react';
import { LogOut, FileSpreadsheet, FileText, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ImpersonationBannerBar: React.FC = () => {
  const { impersonatedShop, impersonationTimeLeft, exitShopImpersonation, exportShopDataReport } = useAuth();

  if (!impersonatedShop) return null;

  const minutes = Math.floor(impersonationTimeLeft / 60);
  const seconds = impersonationTimeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white px-4 py-2 shadow-lg border-b border-amber-400 sticky top-0 z-50 text-xs font-bold animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left Impersonation Alert Notice */}
        <div className="flex items-center gap-2 text-white">
          <ShieldAlert className="w-5 h-5 text-yellow-200 shrink-0 animate-pulse" />
          <div>
            <span className="font-black uppercase tracking-wider text-[11px] text-amber-200 block">
              ⚠️ ĐANG XEM DƯỚI DANH NGHĨA SHOP: "{impersonatedShop.shop_name}"
            </span>
            <span className="text-[10px] text-amber-100 font-medium">
              Chủ gian hàng: <strong>{impersonatedShop.owner_name}</strong> ({impersonatedShop.phone || 'SĐT bảo mật'}) • Chế độ tra cứu cơ quan thuế/công an.
            </span>
          </div>
        </div>

        {/* Right Timer & Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-lg text-amber-200 text-[11px] font-mono border border-white/20">
            <Clock className="w-3.5 h-3.5" />
            <span>Tự hết phiên: {formattedTime}</span>
          </div>

          {/* Export Excel / CSV Report */}
          <button
            onClick={() => exportShopDataReport('excel')}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold text-[11px] transition shadow flex items-center gap-1 cursor-pointer"
            title="Xuất bảng kê đơn hàng, doanh thu & công nợ ra file Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>

          {/* Export PDF Report */}
          <button
            onClick={() => exportShopDataReport('pdf')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-extrabold text-[11px] transition shadow flex items-center gap-1 cursor-pointer"
            title="Xuất báo cáo PDF dữ liệu shop"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xuất PDF</span>
          </button>

          {/* Exit Impersonation Button */}
          <button
            onClick={exitShopImpersonation}
            className="px-3 py-1 bg-white text-rose-700 hover:bg-rose-50 rounded-lg font-black text-[11px] transition shadow-md flex items-center gap-1 cursor-pointer"
            title="Thoát phiên đăng nhập nhanh, quay lại trang Admin"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>🚪 Thoát Về Trang Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
