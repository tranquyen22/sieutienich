import React, { useState } from 'react';
import { X, PackageCheck, Clock, Truck, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag, Store, User, Eye, Lock, XCircle } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus } = useShop();
  const { userRole, isAdmin, isMerchant, isStaff, canManageOrders } = useAuth();

  // Role perspective mode state ('buyer' or 'merchant')
  const [viewRoleMode, setViewRoleMode] = useState<'buyer' | 'merchant'>(
    userRole === 'merchant' || userRole === 'admin' || userRole === 'staff' ? 'merchant' : 'buyer'
  );

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivering' | 'completed' | 'cancelled'>('all');

  if (!isOpen) return null;

  const isMerchantControl = (viewRoleMode === 'merchant' || isMerchant || isAdmin || isStaff) && canManageOrders;

  const filteredOrders = orders.filter((ord) => {
    if (activeTab === 'pending') return ord.status === 'pending_seller_confirm' || ord.status === 'preparing';
    if (activeTab === 'delivering') return ord.status === 'delivering';
    if (activeTab === 'completed') return ord.status === 'completed';
    if (activeTab === 'cancelled') return ord.status === 'cancelled';
    return true;
  });

  const getStatusStepInfo = (status: OrderStatus) => {
    switch (status) {
      case 'pending_seller_confirm':
        return {
          step: 1,
          label: 'Chờ Shop xác nhận đơn',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
      case 'preparing':
        return {
          step: 2,
          label: 'Shop đang chuẩn bị hàng',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: PackageCheck,
        };
      case 'delivering':
        return {
          step: 3,
          label: 'Đang giao hàng (Shop tự giao)',
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Truck,
        };
      case 'completed':
        return {
          step: 4,
          label: 'Đã giao thành công',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          step: 0,
          label: '❌ Đã hủy đơn bởi Shop',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: XCircle,
        };
      default:
        return {
          step: 1,
          label: 'Chờ xử lý',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
        };
    }
  };

  const handleNextStatus = async (order: Order) => {
    if (!isMerchantControl) return;

    let nextStatus: OrderStatus = 'pending_seller_confirm';
    if (order.status === 'pending_seller_confirm') nextStatus = 'preparing';
    else if (order.status === 'preparing') nextStatus = 'delivering';
    else if (order.status === 'delivering') nextStatus = 'completed';

    await updateOrderStatus(order.id, nextStatus);
  };

  const handleCancelOrder = async (order: Order) => {
    if (!isMerchantControl) return;

    if (window.confirm(`Bạn có chắc chắn muốn HỦY đơn hàng #${order.id.slice(-6)} này không?`)) {
      await updateOrderStatus(order.id, 'cancelled');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4 text-indigo-300" />
            <span>Quản Lý Tiến Trình Đơn Hàng Trung Gian</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Theo Dõi Đơn Hàng Theo Các Giai Đoạn
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Sàn giao dịch trung gian • Khách xem tín hiệu thời gian thực • Shop điều chỉnh & Hủy đơn
          </p>
        </div>

        {/* DEMO ROLE MODE SWITCHER */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">Chế độ giao diện:</span>
            <span className="text-[11px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded font-bold">
              {isMerchantControl ? '👑 Quyền Chủ Shop / Staff (Có quyền cập nhật & Hủy đơn)' : '👁️ Quyền Khách Hàng (Chỉ xem & nhận tín hiệu)'}
            </span>
          </div>

          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewRoleMode('buyer')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                viewRoleMode === 'buyer' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Khách hàng</span>
            </button>
            <button
              onClick={() => setViewRoleMode('merchant')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                viewRoleMode === 'merchant' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3 h-3" />
              <span>Tài khoản Shop</span>
            </button>
          </div>
        </div>

        {/* Intermediary Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/70 p-3 text-xs text-amber-900 flex items-start gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            {isMerchantControl ? (
              <span>⚡ <strong>Quyền Cửa Hàng / Staff:</strong> Bạn có quyền bấm <em>"Chuyển sang bước tiếp"</em> hoặc <em>"Hủy đơn hàng"</em>.</span>
            ) : (
              <span>👁️ <strong>Tín hiệu Khách hàng:</strong> Khách chỉ xem tín hiệu thời gian thực từ Shop. Nếu Shop hủy đơn, tiến trình sẽ báo Hủy trực tiếp.</span>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Chờ / Chuẩn bị
          </button>
          <button
            onClick={() => setActiveTab('delivering')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'delivering' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đang giao hàng
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'completed' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đã giao thành công
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'cancelled' ? 'bg-white text-rose-700 shadow-sm border border-rose-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đã hủy đơn
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Chưa có đơn hàng nào trong danh mục này.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusStepInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const dateStr = new Date(order.created_at).toLocaleString('vi-VN');
              const isCancelled = order.status === 'cancelled';

              return (
                <div 
                  key={order.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition space-y-3 ${
                    isCancelled ? 'border-rose-200 bg-rose-50/20' : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">Mã đơn #{order.id.slice(-6)}</span>
                        <span className="text-[11px] text-gray-400 font-semibold">{dateStr}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Khách đặt: <strong>{order.user_name}</strong>
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${statusInfo.badgeClass}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Order Lifecycle Progress Bar (4 Giai đoạn) */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Tín hiệu tiến trình giai đoạn đơn hàng:</span>
                      {isCancelled ? (
                        <span className="text-rose-600 font-extrabold">❌ Đơn đã hủy</span>
                      ) : (
                        <span className="text-indigo-600 font-extrabold flex items-center gap-1">
                          <Eye className="w-3 h-3 animate-pulse" />
                          <span>Bước {statusInfo.step}/4</span>
                        </span>
                      )}
                    </div>
                    
                    {isCancelled ? (
                      <div className="p-2 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold text-center border border-rose-200">
                        ❌ Đơn hàng này đã bị Cửa hàng hủy bỏ.
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5 text-center">
                        <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
                          statusInfo.step >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          1. Shop xác nhận
                        </div>

                        <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
                          statusInfo.step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          2. Chuẩn bị hàng
                        </div>

                        <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
                          statusInfo.step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          3. Đang giao hàng
                        </div>

                        <div className={`p-1.5 rounded-lg text-[10px] font-bold ${
                          statusInfo.step >= 4 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          4. Giao thành công
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => {
                      const isTQ = Boolean(item.product.isTQStore);
                      const isVerified = Boolean(item.product.isLicensed);

                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50/80 rounded-xl text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={item.product.img} 
                              alt={item.product.name} 
                              className="w-10 h-10 object-cover rounded-lg shrink-0 bg-white"
                            />
                            <div className="min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span>x{item.quantity}</span>
                                {isTQ ? (
                                  <span className="text-amber-700 font-bold">👑 Shop TQ</span>
                                ) : isVerified ? (
                                  <span className="text-emerald-700 font-bold">✓ Đã xác minh</span>
                                ) : (
                                  <span className="text-gray-400 font-bold">🔒 Chưa xác minh</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-bold text-rose-600">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold">Thanh toán cuối: </span>
                      <span className="text-rose-600 font-black text-sm">
                        {order.final_amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* PERMISSION BASED ACTIONS */}
                    {order.status !== 'completed' && order.status !== 'cancelled' ? (
                      isMerchantControl ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCancelOrder(order)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-extrabold rounded-xl text-xs border border-rose-200 transition cursor-pointer"
                            title="Chủ shop hủy đơn hàng này"
                          >
                            <span>❌ Hủy Đơn</span>
                          </button>
                          
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>⚡ Bước Tiếp</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-gray-100 rounded-xl text-[11px] text-gray-500 font-bold flex items-center gap-1.5 border border-gray-200">
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Khách chỉ xem tín hiệu • Shop đang xử lý</span>
                        </div>
                      )
                    ) : isCancelled ? (
                      <div className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold rounded-xl text-[11px] border border-rose-200">
                        ❌ Đã hủy bởi Cửa hàng
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã giao thành công • Mở quyền Đánh giá</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
