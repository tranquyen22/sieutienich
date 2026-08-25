import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const { cartItems, cartCount, cartTotalAmount, removeFromCart, isCartOpen, setIsCartOpen } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
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
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-800 font-bold text-base">Giỏ hàng đang trống</p>
                <p className="text-gray-500 text-xs mt-1">Hãy thêm các sản phẩm công nghệ yêu thích vào giỏ hàng.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <img 
                    src={item.product.img} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-xl shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-xs text-indigo-600 font-bold mt-1">
                      {Number(item.product.price).toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Số lượng: <span className="font-bold">{item.quantity}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Tổng tiền thanh toán:</span>
                <span className="text-xl font-black text-rose-600">
                  {cartTotalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
              <button 
                onClick={() => {
                  alert('Cảm ơn bạn đã đặt hàng tại TQ Store! Đơn hàng đang được xử lý.');
                  setIsCartOpen(false);
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Thanh toán ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
