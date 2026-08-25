import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Coins, Lock, Store, ShieldCheck, Plus, Minus, CheckSquare, Square } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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

  // Selected item IDs state for combined checkout selection
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedItemIds(cartItems.map((item) => item.id));
  }, [cartItems]);

  if (!isCartOpen) return null;

  const selectedCartItems = cartItems.filter((item) => selectedItemIds.includes(item.id));
  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map((item) => item.id));
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

  let tqDiscount = 0;
  if (useTQCoins && hasTQItems && selectedTotalAmount > 0) {
    tqDiscount = Math.min(tqCoins, Math.floor(selectedTotalAmount * 0.2));
  }

  let regularDiscount = 0;
  if (useRegularCoins && (hasVerifiedItems || hasTQItems) && selectedTotalAmount > 0) {
    regularDiscount = Math.min(regularCoins, Math.floor((selectedTotalAmount - tqDiscount) * 0.1));
  }

  const totalDiscount = tqDiscount + regularDiscount;
  const finalTotalAmount = Math.max(0, selectedTotalAmount - totalDiscount);

  const handleCheckout = async () => {
    if (selectedCartItems.length === 0) {
      alert('Vui lòng tích chọn ít nhất 1 đơn hàng để tiến hành mua gộp!');
      return;
    }

    if (tqDiscount > 0) {
      await addCoinTransaction(-tqDiscount, `🛒 Giảm giá đơn mua gộp bằng Xu TQ`, 'spend', 'tq');
    }
    if (regularDiscount > 0) {
      await addCoinTransaction(-regularDiscount, `🛒 Giảm giá đơn mua gộp bằng Xu Thường`, 'spend', 'regular');
    }

    // Create Intermediary Order in stage 1 (Chờ Shop xác nhận đơn)
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
      payment_method: 'direct_with_seller',
    });

    alert(`Đặt hàng thành công!\n- Đơn hàng đã được khởi tạo: Giai đoạn 1 (Chờ Shop xác nhận)\n- Phương thức: Sàn trung gian hiển thị (Shop và Khách tự liên hệ giao hàng & tự thanh toán)\n\nKhi Shop chuyển trạng thái sang "Đã giao thành công", bạn sẽ được quyền gửi Đánh Giá sản phẩm!`);
    
    // Remove ONLY selected items from cart
    for (const item of selectedCartItems) {
      await removeFromCart(item.product.id);
    }

    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Giỏ hàng của bạn</h2>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
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
                        <div className="text-amber-800 font-bold flex items-center gap-1">
                          <Store className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>👑 Shop TQ</span>
                        </div>
                      ) : isVerified ? (
                        <div className="text-emerald-800 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>✓ Đã xác minh</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>🔒 Chưa xác minh</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout & Coin Discount Panel */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/70 space-y-3 shrink-0">
              
              {/* Intermediary Platform Disclaimer */}
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-tight">
                ℹ️ <strong>Sàn giao dịch trung gian:</strong> Shop và Khách hàng tự liên hệ thanh toán & tự giao nhận trực tiếp.
              </div>

              {/* Coin Options Panel */}
              <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Áp dụng Xu giảm giá cho đơn đã tích:</span>
                </div>

                {/* Option 1: Xu TQ */}
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

                {/* Option 2: Xu Thường */}
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
              </div>

              {/* Price Calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính ({selectedCartItems.length} đơn đã tích):</span>
                  <span>{selectedTotalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá từ Xu:</span>
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
                <span>Xác nhận Đặt Hàng Trung Gian ({selectedCartItems.length} Đơn)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
