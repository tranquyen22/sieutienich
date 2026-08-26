import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Coins, Lock, Store, ShieldCheck, Plus, Minus, CheckSquare, Square, Truck, Ticket, Percent, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { DeliveryMethod } from '../types';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    cartCount, 
    removeFromCart, 
    updateCartItemQuantity,
    isCartOpen, 
    setIsCartOpen, 
    regularCoins, 
    tqCoins, 
    addCoinTransaction, 
    createOrder
  } = useShop();

  const [useTQCoins, setUseTQCoins] = useState(false);
  const [useRegularCoins, setUseRegularCoins] = useState(false);
  const [usePlatformVoucher, setUsePlatformVoucher] = useState(false); // Rule 7
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('seller_delivery');

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const safeCartItems = cartItems || [];

  useEffect(() => {
    setSelectedItemIds(safeCartItems.map((item) => item.id));
  }, [cartItems]);

  if (!isCartOpen) return null;

  const selectedCartItems = safeCartItems.filter((item) => selectedItemIds.includes(item.id));
  const isAllSelected = safeCartItems.length > 0 && selectedItemIds.length === safeCartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(safeCartItems.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedTotalAmount = selectedCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const hasTQItems = selectedCartItems.some((item) => Boolean(item.product.isTQStore));
  const hasVerifiedItems = selectedCartItems.some((item) => Boolean(item.product.isLicensed));
  const hasUnverifiedItems = selectedCartItems.some((item) => !item.product.isTQStore && !item.product.isLicensed);

  // Rule 8: Trần tiêu mỗi đơn - Tối đa 10% giá trị đơn, không quá 50.000 xu
  const maxCoinAllowedPerOrder = Math.min(50000, Math.floor(selectedTotalAmount * 0.10));

  let tqDiscount = 0;
  if (useTQCoins && hasTQItems && selectedTotalAmount > 0) {
    tqDiscount = Math.min(tqCoins, maxCoinAllowedPerOrder);
  }

  let regularDiscount = 0;
  if (useRegularCoins && (hasVerifiedItems || hasTQItems) && selectedTotalAmount > 0) {
    const remainingCoinCap = Math.max(0, maxCoinAllowedPerOrder - tqDiscount);
    regularDiscount = Math.min(regularCoins, remainingCoinCap);
  }

  // Rule 7: Platform Voucher (Only for verified shops)
  const isEligibleForVoucher = hasVerifiedItems || hasTQItems;
  const voucherDiscount = usePlatformVoucher && isEligibleForVoucher ? 15000 : 0;

  // Rule 9: Platform fee calculation (0% for unverified, 3% for verified)
  const platformFeeRate = (hasVerifiedItems || hasTQItems) ? 0.03 : 0.0;
  const estimatedPlatformFee = Math.floor(selectedTotalAmount * platformFeeRate);

  const totalDiscount = tqDiscount + regularDiscount + voucherDiscount;
  const finalTotalAmount = Math.max(0, selectedTotalAmount - totalDiscount);

  const handleCheckout = async () => {
    if (selectedCartItems.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 đơn hàng để tiến hành mua gộp!');
      return;
    }

    if (tqDiscount > 0) {
      await addCoinTransaction(tqDiscount, 'spend', '🛒 Giảm giá đơn mua gộp bằng Xu TQ', 'tq');
    }
    if (regularDiscount > 0) {
      await addCoinTransaction(regularDiscount, 'spend', '🛒 Giảm giá đơn mua gộp bằng Xu Thường', 'regular');
    }

    // Create Intermediary Order in Stage 1
    await createOrder({
      user_id: 'guest',
      user_name: 'Khách hàng',
      items: selectedCartItems.map((item) => ({
        product_id: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total_amount: selectedTotalAmount,
      discount_amount: totalDiscount,
      final_amount: finalTotalAmount,
      status: 'pending_seller_confirm',
      delivery_method: deliveryMethod,
      payment_method: 'direct_with_seller',
    });

    const methodLabel = deliveryMethod === 'seller_delivery' ? '🚚 Shop giao hàng tận nơi' : '🏬 Đến cửa hàng lấy';

    alert(`Đặt hàng thành công!\n- Phương thức: ${methodLabel}\n- Phí sàn áp dụng: ${platformFeeRate > 0 ? '3% (Shop đã xác minh)' : '0% (Shop chưa xác minh - Miễn phí sàn)'}\n- Tín hiệu đơn tự động đồng bộ thời gian thực (5-10s)!`);
    
    // Remove ONLY selected items from cart
    for (const item of selectedCartItems) {
      await removeFromCart(item.product.id);
    }

    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex justify-end">
      <div className="w-full h-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col min-w-0 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 text-indigo-400" />
              </button>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-black text-white">Giỏ Hàng Của Bạn</h2>
                <span className="bg-indigo-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Select All Toggle Bar */}
          {cartItems.length > 0 && (
            <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-900 shrink-0">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 hover:text-indigo-700 transition cursor-pointer"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400" />
                )}
                <span>Tích chọn tất cả ({selectedCartItems.length}/{cartItems.length} đơn)</span>
              </button>
              <span className="text-[11px] text-indigo-600 font-semibold">Tùy chọn mua gộp</span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-800 font-bold text-base">Giỏ hàng đang trống</p>
                <p className="text-gray-500 text-xs mt-1">Hãy thêm các sản phẩm & tiện ích yêu thích vào giỏ hàng.</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const isTQ = Boolean(item.product.isTQStore);
                const isVerified = Boolean(item.product.isLicensed);
                const isSelected = selectedItemIds.includes(item.id);

                return (
                  <div key={item.product.id} className={`p-3 rounded-2xl border transition space-y-2 ${
                    isSelected ? 'bg-white border-indigo-200 shadow-sm' : 'bg-gray-50/70 border-gray-200 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3">
                      
                      {/* Item Selection Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelectItem(item.id)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition cursor-pointer shrink-0"
                        title={isSelected ? 'Bỏ đơn này khi mua gộp' : 'Tích chọn đơn này khi mua gộp'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      <img 
                        src={item.product.img} 
                        alt={item.product.name} 
                        className="w-14 h-14 object-cover rounded-xl shrink-0 bg-white border border-gray-100"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</h4>
                        <p className="text-xs text-rose-600 font-bold mt-0.5">
                          {Number(item.product.price).toLocaleString('vi-VN')} đ
                        </p>
                        
                        {/* Quantity Adjuster */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px] text-gray-500 font-semibold">Số lượng:</span>
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                              title="Giảm số lượng"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-extrabold text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                              title="Tăng số lượng"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Shop Verification Badge */}
                    <div className="pt-2 border-t border-gray-100 text-[10px]">
                      {isTQ ? (
                        <div className="text-amber-800 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Store className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>👑 Shop TQ</span>
                          </span>
                          <span className="text-gray-400">Phí sàn: 3%</span>
                        </div>
                      ) : isVerified ? (
                        <div className="text-emerald-800 font-bold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>✓ Đã xác minh</span>
                          </span>
                          <span className="text-gray-400">Phí sàn: 3%</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 font-semibold flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>🔒 Chưa xác minh</span>
                          </span>
                          <span className="text-emerald-600 font-bold">Phí sàn: 0% (Miễn phí)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout & Delivery & Coin Discount Panel */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3 shrink-0">
              
              {/* Delivery Method Selection */}
              <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Chọn phương thức nhận hàng:</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className={`p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                    deliveryMethod === 'seller_delivery' ? 'bg-indigo-50 border-indigo-400 font-extrabold text-indigo-900' : 'bg-white border-gray-200 text-gray-600'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      checked={deliveryMethod === 'seller_delivery'}
                      onChange={() => setDeliveryMethod('seller_delivery')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="truncate">
                      <span className="block truncate">🚚 Shop giao hàng</span>
                    </div>
                  </label>

                  <label className={`p-2 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                    deliveryMethod === 'customer_pickup' ? 'bg-indigo-50 border-indigo-400 font-extrabold text-indigo-900' : 'bg-white border-gray-200 text-gray-600'
                  }`}>
                    <input 
                      type="radio" 
                      name="deliveryMethod" 
                      checked={deliveryMethod === 'customer_pickup'}
                      onChange={() => setDeliveryMethod('customer_pickup')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="truncate">
                      <span className="block truncate">🏬 Đến cửa hàng lấy</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Coin & Voucher Options Panel */}
              <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Ưu đãi & Voucher (Quy định loại Shop):</span>
                </div>

                {/* Option 1: Xu TQ (Rule 5) */}
                <label className={`flex items-center justify-between p-2 rounded-xl border text-xs transition cursor-pointer ${
                  !hasTQItems ? 'opacity-50 pointer-events-none bg-gray-50' : useTQCoins ? 'bg-amber-50 border-amber-300' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={useTQCoins} 
                      disabled={!hasTQItems || tqCoins <= 0}
                      onChange={(e) => setUseTQCoins(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-bold text-gray-800">Dùng Xu TQ ({tqCoins.toLocaleString()} Xu)</span>
                  </div>
                  <span className="font-extrabold text-amber-600">
                    {hasTQItems ? `-${tqDiscount.toLocaleString()} đ` : 'Chỉ dùng ở Shop TQ'}
                  </span>
                </label>

                {/* Option 2: Xu Thường (Rule 5) */}
                <label className={`flex items-center justify-between p-2 rounded-xl border text-xs transition cursor-pointer ${
                  hasUnverifiedItems && !hasVerifiedItems && !hasTQItems ? 'opacity-50 pointer-events-none bg-gray-50' : useRegularCoins ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={useRegularCoins} 
                      disabled={regularCoins <= 0}
                      onChange={(e) => setUseRegularCoins(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-bold text-gray-800">Dùng Xu Thường ({regularCoins.toLocaleString()} Xu)</span>
                  </div>
                  <span className="font-extrabold text-emerald-600">
                    {hasVerifiedItems || hasTQItems ? `-${regularDiscount.toLocaleString()} đ` : 'Chỉ dùng ở Shop xác minh'}
                  </span>
                </label>

                {/* Option 3: Voucher Sàn (Rule 7) */}
                <label className={`flex items-center justify-between p-2 rounded-xl border text-xs transition cursor-pointer ${
                  !isEligibleForVoucher ? 'opacity-50 pointer-events-none bg-gray-50' : usePlatformVoucher ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={usePlatformVoucher} 
                      disabled={!isEligibleForVoucher}
                      onChange={(e) => setUsePlatformVoucher(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-bold text-gray-800 flex items-center gap-1">
                      <Ticket className="w-3.5 h-3.5 text-purple-600" />
                      <span>Voucher Sàn (PLATFORM10K)</span>
                    </span>
                  </div>
                  <span className="font-extrabold text-purple-600">
                    {isEligibleForVoucher ? '-15.000 đ' : '× Không dùng ở Shop chưa xác minh'}
                  </span>
                </label>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính ({selectedCartItems.length} đơn đã tích):</span>
                  <span>{selectedTotalAmount.toLocaleString('vi-VN')} đ</span>
                </div>

                {/* Rule 9: Fee summary info */}
                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    <span>Phí sàn thu Shop:</span>
                  </span>
                  <span className={platformFeeRate > 0 ? 'text-gray-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {platformFeeRate > 0 ? `3% (~${estimatedPlatformFee.toLocaleString()}đ)` : '0% (Không thu phí)'}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá từ Xu & Voucher:</span>
                    <span>-{totalDiscount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-200">
                  <span>Tổng thanh toán gộp:</span>
                  <span className="text-lg text-rose-600">{finalTotalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Xác nhận Đặt Hàng ({selectedCartItems.length} Đơn)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
    </div>
  );
};
