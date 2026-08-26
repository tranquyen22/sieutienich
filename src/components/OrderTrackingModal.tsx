import React, { useState } from 'react';
import { X, PackageCheck, Clock, Truck, CheckCircle2, ChevronRight, AlertCircle, ShoppingBag, Eye, XCircle, Filter, Store, Check, MapPin } from 'lucide-react';
import type { Order, OrderStatus } from '../types';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInvoiceModal?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ isOpen, onClose, onOpenInvoiceModal }) => {
  const { orders, updateOrderStatus } = useShop();
  const { user, userRole, canManageOrders } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled'>('all');

  if (!isOpen) return null;

  const isMerchantControl = (userRole === 'merchant' || userRole === 'admin' || userRole === 'staff') && canManageOrders;

  // 1. ROLE-BASED ORDER SCOPE FILTERING
  const scopeFilteredOrders = orders.filter((ord) => {
    if (userRole === 'admin' || userRole === 'staff') {
      return true; // Admin & Staff: Xem toàn bộ đơn hàng
    }
    if (userRole === 'merchant') {
      // Merchant Shop: Xem đơn từ shop mình
      return ord.items.some(
        (item) =>
          item.product.user_id === user?.id ||
          Boolean(item.product.isTQStore) ||
          Boolean(item.product.isLicensed)
      );
    }
    // Buyer Khách mua: Chỉ xem đơn của chính mình
    return ord.user_id === user?.id || ord.user_id === 'guest';
  });

  // 2. TAB STATUS FILTERING
  const finalOrders = scopeFilteredOrders.filter((ord) => {
    if (activeTab === 'pending') return ord.status === 'pending_seller_confirm' || ord.status === 'seller_accepted';
    if (activeTab === 'preparing') return ord.status === 'preparing';
    if (activeTab === 'shipping') return ord.status === 'ready_for_pickup' || ord.status === 'delivering';
    if (activeTab === 'completed') return ord.status === 'completed';
    if (activeTab === 'cancelled') return ord.status === 'cancelled';
    return true;
  });

  const getStatusStepInfo = (order: Order) => {
    switch (order.status) {
      case 'pending_seller_confirm':
        return {
          step: 1,
          label: 'Chờ shop xác nhận',
          subtitle: 'Khách vừa bấm đặt hàng',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock,
        };
      case 'seller_accepted':
        return {
          step: 2,
          label: 'Shop đã nhận đơn',
          subtitle: 'Shop đồng ý bán',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: Store,
        };
      case 'preparing':
        return {
          step: 3,
          label: 'Đang chuẩn bị',
          subtitle: 'Shop đang soạn hàng',
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          icon: PackageCheck,
        };
      case 'ready_for_pickup':
        return {
          step: 4,
          label: 'Sẵn sàng để lấy',
          subtitle: 'Khách chọn đến cửa hàng lấy',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: MapPin,
        };
      case 'delivering':
        return {
          step: 4,
          label: 'Đang giao',
          subtitle: 'Shop giao hàng tận nơi',
          badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-300',
          icon: Truck,
        };
      case 'completed':
        return {
          step: 5,
          label: 'Hoàn thành',
          subtitle: order.completed_by === 'buyer' ? 'Khách bấm đã nhận' : order.completed_by === 'seller' ? 'Shop bấm hoàn tất' : 'Tự động hoàn thành',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'cancelled':
        return {
          step: 0,
          label: 'Đã hủy',
          subtitle: `Bởi ${order.cancelled_by === 'buyer' ? 'Khách' : 'Shop'}: ${order.cancel_reason || 'Không rõ lý do'}`,
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: XCircle,
        };
      default:
        return {
          step: 1,
          label: 'Chờ xử lý',
          subtitle: '',
          badgeClass: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
        };
    }
  };

  // Next status transition according to specifications
  const handleAdvanceStatus = async (order: Order) => {
    let nextStatus: OrderStatus = order.status;
    let completedBy: 'buyer' | 'seller' = 'seller';

    if (order.status === 'pending_seller_confirm') {
      nextStatus = 'seller_accepted'; // 2. Shop đã nhận đơn
    } else if (order.status === 'seller_accepted') {
      nextStatus = 'preparing'; // 3. Đang chuẩn bị
    } else if (order.status === 'preparing') {
      if (order.delivery_method === 'customer_pickup') {
        nextStatus = 'ready_for_pickup'; // 4a. Sẵn sàng để lấy
      } else {
        nextStatus = 'delivering'; // 4b. Đang giao
      }
    } else if (order.status === 'ready_for_pickup' || order.status === 'delivering') {
      nextStatus = 'completed'; // 5. Hoàn thành
      completedBy = 'seller';
    }

    await updateOrderStatus(order.id, nextStatus, { completedBy });
  };

  // Buyer confirms received/completed
  const handleBuyerConfirmReceived = async (order: Order) => {
    if (window.confirm('Bạn xác nhận ĐÃ NHẬN HÀNG THÀNH CÔNG từ Shop?')) {
      await updateOrderStatus(order.id, 'completed', { completedBy: 'buyer' });
    }
  };

  // Cancel order with reason modal/prompt
  const handleCancelOrderPrompt = async (order: Order, isBuyerCancel: boolean = false) => {
    const reasonInput = window.prompt(
      `Vui lòng nhập lý do hủy đơn hàng #${order.id.slice(-6)}:`,
      isBuyerCancel ? 'Tôi thay đổi kế hoạch mua' : 'Gian hàng tạm hết sản phẩm'
    );

    if (reasonInput !== null && reasonInput.trim() !== '') {
      await updateOrderStatus(order.id, 'cancelled', {
        cancelReason: reasonInput.trim(),
        cancelledBy: isBuyerCancel ? 'buyer' : 'seller',
      });
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
            <span>Tiến Trình Đơn Hàng • Tín Hiệu Đồng Bộ (5-10 Giây)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Trạng Thái Đơn Hàng Thời Gian Thực
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Khách và Shop nhìn thấy cùng một trạng thái. Tự động đồng bộ liên tục 5-10s.
          </p>
        </div>

        {/* ROLE SCOPE BADGE */}
        <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-extrabold text-slate-300">Tài khoản:</span>
            <span className="text-[11px] bg-slate-800 text-indigo-300 px-2.5 py-0.5 rounded font-black border border-slate-700">
              {userRole === 'admin' ? (
                '👑 Admin Tối Cao'
              ) : userRole === 'staff' ? (
                '💼 Staff Nhân Viên'
              ) : userRole === 'merchant' ? (
                '🏪 Chủ Shop (Cập nhật trạng thái)'
              ) : (
                '👤 Khách Mua Hàng (Xem tín hiệu & nhận hàng)'
              )}
            </span>
          </div>

          <span className="bg-indigo-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
            {scopeFilteredOrders.length} đơn
          </span>
        </div>

        {/* Intermediary Notice Banner */}
        <div className="bg-amber-50 border-b border-amber-200/70 p-2.5 text-xs text-amber-900 flex items-start gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span>⚡ Trạng thái đồng bộ tự động 5-10s. Đơn <strong>Hoàn thành</strong> sẽ mở quyền Đánh giá & thưởng +10k Xu. Đơn <strong>Đã hủy</strong> kèm lý do rõ ràng.</span>
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
            Tất cả ({scopeFilteredOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Chờ / Đã nhận
          </button>
          <button
            onClick={() => setActiveTab('preparing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'preparing' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đang chuẩn bị
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'shipping' ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Giao / Sẵn sàng lấy
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'completed' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Hoàn thành
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
              activeTab === 'cancelled' ? 'bg-white text-rose-700 shadow-sm border border-rose-200' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Đã hủy
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {finalOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Không có đơn hàng nào trong mục này.
            </div>
          ) : (
            finalOrders.map((order) => {
              const statusInfo = getStatusStepInfo(order);
              const StatusIcon = statusInfo.icon;
              const dateStr = new Date(order.created_at).toLocaleString('vi-VN');
              const isCancelled = order.status === 'cancelled';
              const isCompleted = order.status === 'completed';
              const isPickup = order.delivery_method === 'customer_pickup';

              return (
                <div 
                  key={order.id}
                  className={`bg-white border rounded-2xl p-4 shadow-sm transition space-y-3 ${
                    isCancelled ? 'border-rose-200 bg-rose-50/20' : isCompleted ? 'border-emerald-200 bg-emerald-50/20' : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-gray-900">Mã đơn #{order.id.slice(-6)}</span>
                        <span className="text-[11px] text-gray-400 font-semibold">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                        <span>Khách đặt: <strong>{order.user_name}</strong></span>
                        <span>•</span>
                        <span className="font-extrabold text-indigo-700">
                          {isPickup ? '🏬 Đến cửa hàng lấy' : '🚚 Shop giao hàng'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-flex items-center gap-1.5 ${statusInfo.badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{statusInfo.subtitle}</p>
                    </div>
                  </div>

                  {/* Order Lifecycle Progress Steps (Khách & Shop nhìn cùng 1 trạng thái) */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Tín hiệu tiến trình thời gian thực (Cập nhật 5-10s):</span>
                      {isCancelled ? (
                        <span className="text-rose-600 font-extrabold">❌ Đơn đã hủy</span>
                      ) : (
                        <span className="text-indigo-600 font-extrabold flex items-center gap-1">
                          <Eye className="w-3 h-3 animate-pulse" />
                          <span>Đang ở Bước {statusInfo.step}/5</span>
                        </span>
                      )}
                    </div>
                    
                    {isCancelled ? (
                      <div className="p-2 bg-rose-100 text-rose-900 rounded-lg text-xs font-bold text-center border border-rose-200">
                        ❌ Đã hủy ({order.cancelled_by === 'buyer' ? 'Bởi Khách hàng' : 'Bởi Shop'}): {order.cancel_reason || 'Không ghi lý do'}
                      </div>
                    ) : (
                      <div className="grid grid-cols-5 gap-1 text-center">
                        <div className={`p-1.5 rounded-lg text-[9px] font-bold ${
                          statusInfo.step >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          1. Chờ xác nhận
                        </div>

                        <div className={`p-1.5 rounded-lg text-[9px] font-bold ${
                          statusInfo.step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          2. Đã nhận đơn
                        </div>

                        <div className={`p-1.5 rounded-lg text-[9px] font-bold ${
                          statusInfo.step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          3. Đang chuẩn bị
                        </div>

                        <div className={`p-1.5 rounded-lg text-[9px] font-bold ${
                          statusInfo.step >= 4 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isPickup ? '4. Sẵn sàng lấy' : '4. Đang giao'}
                        </div>

                        <div className={`p-1.5 rounded-lg text-[9px] font-bold ${
                          statusInfo.step >= 5 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          5. Hoàn thành
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

                  {/* Order Footer & Specific Actions */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 font-semibold">Thanh toán: </span>
                      <span className="text-rose-600 font-black text-sm">
                        {order.final_amount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>

                    {/* DYNAMIC ROLE ACTIONS */}
                    <div className="flex items-center gap-2">
                      {/* INVOICE GENERATION BUTTON */}
                      {onOpenInvoiceModal && (
                        <button
                          onClick={() => onOpenInvoiceModal(order)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold rounded-xl text-xs border border-emerald-200 transition cursor-pointer"
                          title="Tạo & Xuất hóa đơn (Tự động lưu vào doanh số shop)"
                        >
                          <span>🧾 In/Xuất Hóa Đơn</span>
                        </button>
                      )}

                      {!isCompleted && !isCancelled && (
                        <>
                        {/* HỦY ĐƠN BUTTON */}
                        <button
                          onClick={() => handleCancelOrderPrompt(order, !isMerchantControl)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-extrabold rounded-xl text-xs border border-rose-200 transition cursor-pointer"
                          title="Hủy đơn hàng này kèm lý do"
                        >
                          <span>❌ Hủy đơn</span>
                        </button>

                        {/* SHOP ACTION BUTTONS */}
                        {isMerchantControl && (
                          <button
                            onClick={() => handleAdvanceStatus(order)}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {order.status === 'pending_seller_confirm' ? 'Shop nhận đơn' :
                               order.status === 'seller_accepted' ? 'Đang chuẩn bị hàng' :
                               order.status === 'preparing' ? (isPickup ? 'Sẵn sàng để lấy' : 'Bắt đầu giao') :
                               'Shop hoàn tất đơn'}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        {/* BUYER CONFIRM RECEIVED BUTTON */}
                        {!isMerchantControl && (order.status === 'delivering' || order.status === 'ready_for_pickup') && (
                          <button
                            onClick={() => handleBuyerConfirmReceived(order)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Khách bấm đã nhận</span>
                          </button>
                        )}
                      </>
                      )}

                      {isCancelled && (
                        <div className="px-3 py-1 bg-rose-100 text-rose-900 font-extrabold rounded-xl text-[11px] border border-rose-200">
                          ❌ Đã hủy ({order.cancelled_by === 'buyer' ? 'Bởi Khách' : 'Bởi Shop'})
                        </div>
                      )}

                      {isCompleted && (
                        <span className="text-emerald-700 font-extrabold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hoàn thành • Mở Đánh giá & +10k Xu</span>
                        </span>
                      )}
                    </div>
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
