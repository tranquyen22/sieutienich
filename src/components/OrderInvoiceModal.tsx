import React, { useState } from 'react';
import { 
  X, Printer, CheckCircle2, Receipt
} from 'lucide-react';
import type { Order } from '../types';

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  taxCode?: string;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  shopName = 'Nông Sản & Lẩu Thái Khoái Châu Official',
  shopAddress = 'Số 18 Thị trấn Khoái Châu, Hưng Yên',
  shopPhone = '0988.123.456',
  taxCode = '09012345678-001',
}) => {
  const [includeVAT] = useState(true);
  const [invoiceType, setInvoiceType] = useState<'retail' | 'vat'>('retail');

  if (!isOpen || !order) return null;

  const subtotal = order.total_amount || order.final_amount;
  const discount = order.discount_amount || 0;
  const vatAmount = includeVAT && invoiceType === 'vat' ? Math.floor((subtotal - discount) * 0.08) : 0;
  const grandTotal = subtotal - discount + vatAmount;

  // Print Invoice Command Trigger
  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0 print:p-0 print:m-0 print:border-none print:shadow-none print:max-w-none print:w-full print:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Screen only */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">Xuất Hóa Đơn Bán Hàng & Doanh Thu Shop</h3>
              <p className="text-[11px] text-indigo-300">
                ✓ Dữ liệu hóa đơn đã tự động lưu vào Sổ Doanh Thu của Shop. In hoặc xuất PDF tùy chọn.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls - Screen only */}
        <div className="bg-indigo-50/90 p-3 px-4 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          
          <div className="flex items-center gap-3 font-bold">
            <span>Loại Hóa Đơn:</span>
            <select
              value={invoiceType}
              onChange={(e) => setInvoiceType(e.target.value as any)}
              className="p-1.5 bg-white border border-gray-300 rounded-xl font-extrabold"
            >
              <option value="retail">🧾 Hóa Đơn Bán Lẻ Tính Tiền</option>
              <option value="vat">📜 Hóa Đơn Giá Trị Gia Tăng (VAT 8%)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 font-black">
            <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Đã lưu vào doanh số</span>
            </span>

            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ In / Xuất PDF Hóa Đơn</span>
            </button>
          </div>

        </div>

        {/* PRINTABLE INVOICE BODY (Formatted for A4 or Thermal K80 Printer) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-gray-900 text-xs font-medium print:p-4 print:text-black">
          
          {/* Invoice Header Branding */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <div className="space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                  TQ
                </div>
                <strong className="text-base font-black text-indigo-950 uppercase">{shopName}</strong>
              </div>
              <p className="text-[11px] text-gray-600">Địa chỉ: {shopAddress}</p>
              <p className="text-[11px] text-gray-600">Hotline: {shopPhone} • MST: {taxCode}</p>
            </div>

            <div className="text-right space-y-0.5">
              <h2 className="text-lg font-black text-gray-900 uppercase">
                {invoiceType === 'vat' ? 'HÓA ĐƠN GTGT (VAT)' : 'HÓA ĐƠN BÁN HÀNG'}
              </h2>
              <p className="text-[11px] text-gray-500 font-bold">Số HĐ: HD-{order.id}</p>
              <p className="text-[11px] text-gray-500">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Customer & Order Info */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80 text-xs print:bg-transparent print:border-gray-300">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Thông tin Khách hàng</span>
              <strong className="text-gray-900 block font-black">{order.user_name || 'Khách Mua Hàng'}</strong>
              <p className="text-[11px] text-gray-600">SĐT: {order.user_phone || '0912.345.678'}</p>
              <p className="text-[11px] text-gray-600">Địa chỉ: {order.shipping_address || 'Thị trấn Khoái Châu, Hưng Yên'}</p>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Thông tin Đơn hàng</span>
              <p className="text-[11px] text-gray-700 font-bold">Mã Đơn: #{order.id}</p>
              <p className="text-[11px] text-gray-600">Hình thức giao: {order.delivery_method === 'seller_delivery' ? 'Shop giao hàng' : 'Đến lấy tại quầy'}</p>
              <p className="text-[11px] font-black text-emerald-700">Trạng thái: Đã thanh toán</p>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-gray-100 text-gray-700 font-black text-[11px] uppercase tracking-wider print:bg-gray-200">
                <tr>
                  <th className="p-3">STT</th>
                  <th className="p-3">Tên Sản Phẩm / Dịch Vụ</th>
                  <th className="p-3 text-center">Số Lượng</th>
                  <th className="p-3 text-right">Đơn Giá (đ)</th>
                  <th className="p-3 text-right">Thành Tiền (đ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-500">{idx + 1}</td>
                    <td className="p-3 font-black text-gray-900">{item.product.name}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right">{item.price.toLocaleString()}</td>
                    <td className="p-3 text-right font-black text-gray-900">
                      {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Tiền hàng (chưa giảm):</span>
                <span className="font-bold">{subtotal.toLocaleString()} đ</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Giảm giá / Voucher:</span>
                  <span className="font-bold">-{discount.toLocaleString()} đ</span>
                </div>
              )}

              {invoiceType === 'vat' && (
                <div className="flex justify-between text-indigo-700">
                  <span>Thuế VAT (8%):</span>
                  <span className="font-bold">+{vatAmount.toLocaleString()} đ</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-300 flex justify-between text-sm font-black text-gray-900">
                <span>TỔNG THÀNH TIỀN:</span>
                <span className="text-emerald-600 text-base">{grandTotal.toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          {/* Footer Note & Signatures */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-4 text-center text-[11px] text-gray-500">
            <div className="space-y-1">
              <strong className="block text-gray-900 font-bold">Người Mua Hàng</strong>
              <span className="text-[10px] italic">(Ký & ghi rõ họ tên)</span>
            </div>

            <div className="space-y-1">
              <strong className="block text-gray-900 font-bold">Đại Diện Gian Hàng (Bán Hàng)</strong>
              <span className="text-[10px] italic">(Ký, đóng dấu nếu có)</span>
              <div className="h-12"></div>
              <p className="text-indigo-900 font-extrabold">{shopName}</p>
            </div>
          </div>

        </div>

        {/* Screen Only Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Hóa Đơn
          </button>
        </div>

      </div>
    </div>
  );
};
