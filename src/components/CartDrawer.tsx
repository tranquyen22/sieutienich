import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Coins, Lock, Store, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { cartItems, cartCount, cartTotalAmount, removeFromCart, clearCart, isCartOpen, setIsCartOpen, regularCoins, tqCoins, addCoinTransaction, recordPurchase } = useShop();

  const [useTQCoins, setUseTQCoins] = useState(false);
  const [useRegularCoins, setUseRegularCoins] = useState(false);

  if (!isCartOpen) return null;

  // Check shop verification statuses in cart
  const hasTQItems = cartItems.some((item) => Boolean(item.product.isTQStore));
  const hasVerifiedItems = cartItems.some((item) => Boolean(item.product.isLicensed));
  const hasUnverifiedItems = cartItems.some((item) => !item.product.isTQStore && !item.product.isLicensed);

  // Calculate Coin Discounts
  let tqDiscount = 0;
  if (useTQCoins && hasTQItems) {
    tqDiscount = Math.min(tqCoins, Math.floor(cartTotalAmount * 0.2)); // Up to 20% discount using TQ Coins
  }

  let regularDiscount = 0;
  if (useRegularCoins && (hasVerifiedItems || hasTQItems)) {
    regularDiscount = Math.min(regularCoins, Math.floor((cartTotalAmount - tqDiscount) * 0.1)); // Up to 10% discount using Regular Coins
  }

  const totalDiscount = tqDiscount + regularDiscount;
  const finalTotalAmount = Math.max(0, cartTotalAmount - totalDiscount);

  const handleCheckout = async () => {
    if (tqDiscount > 0) {
      await addCoinTransaction(-tqDiscount, `🛒 Giảm giá đơn hàng bằng Xu TQ tại Cửa hàng TQ`, 'spend', 'tq');
    }
    if (regularDiscount > 0) {
      await addCoinTransaction(-regularDiscount, `🛒 Giảm giá đơn hàng bằng Xu Thường tại Cửa hàng đã xác minh`, 'spend', 'regular');
    }

    // Record verified purchase for review eligibility
    recordPurchase(cartItems.map((item) => item.product.id));

    alert(`Đặt hàng thành công!\n- Tổng tiền: ${cartTotalAmount.toLocaleString('vi-VN')} đ\n- Giảm giá từ Xu: -${totalDiscount.toLocaleString('vi-VN')} đ\n- Thanh toán cuối: ${finalTotalAmount.toLocaleString('vi-VN')} đ\n\n🎉 Bạn đã đủ điều kiện viết Đánh Giá dịch vụ và nhận thưởng +10.000 Xu Thường!`);
    await clearCart();
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

                return (
                  <div key={item.product.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.product.img} 
                        alt={item.product.name} 
                        className="w-14 h-14 object-cover rounded-xl shrink-0 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</h4>
                        <p className="text-xs text-rose-600 font-bold mt-0.5">
                          {Number(item.product.price).toLocaleString('vi-VN')} đ
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Số lượng: <span className="font-bold">{item.quantity}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Shop Verification & Coin Eligibility Status */}
                    <div className="pt-2 border-t border-gray-200/60 text-[10px]">
                      {isTQ ? (
                        <div className="text-amber-800 font-bold flex items-center gap-1">
                          <Store className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>👑 Cửa hàng TQ: Áp dụng được cả Xu TQ & Xu Thường</span>
                        </div>
                      ) : isVerified ? (
                        <div className="text-emerald-800 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>✓ Cửa hàng xác minh: Chỉ áp dụng Xu Thường</span>
                        </div>
                      ) : (
                        <div className="text-gray-500 font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>🔒 Shop chưa xác minh: KHÔNG áp dụng giảm giá bằng Xu</span>
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
              
              {/* Coin Options Panel */}
              <div className="bg-white p-3 rounded-2xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>Áp dụng Xu giảm giá đơn hàng:</span>
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
                    <span className="font-bold text-gray-800">Dùng Xu TQ ({tqCoins.toLocaleString()} Xu sẵn có)</span>
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

                {hasUnverifiedItems && (
                  <p className="text-[10px] text-amber-800 font-medium pt-1">
                    ⚠️ Giỏ hàng có sản phẩm từ Shop chưa xác minh sẽ không được giảm giá bằng Xu cho sản phẩm đó.
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính tiền hàng:</span>
                  <span>{cartTotalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Giảm giá từ Xu:</span>
                    <span>-{totalDiscount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-gray-900 pt-1 border-t border-gray-200">
                  <span>Tổng thanh toán:</span>
                  <span className="text-lg text-rose-600">{finalTotalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Xác nhận Thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
