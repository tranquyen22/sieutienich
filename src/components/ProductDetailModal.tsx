import React, { useState } from 'react';
import { X, Star, MapPin, Phone, ShieldCheck, Store, Lock, Check, Plus, Minus, PhoneCall, BookmarkCheck, MessageCircle, PauseCircle } from 'lucide-react';
import type { Product, ProductReview } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenDirectMessagingModal?: (productInfo?: { shopName?: string; productId?: string | number; productName?: string; productPrice?: number }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onOpenDirectMessagingModal }) => {
  const { addToCart } = useShop();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [reserved, setReserved] = useState(false);

  // Review list state
  const [reviewsList] = useState<ProductReview[]>(
    product?.reviews || [
      {
        id: 'rev-1',
        user_name: 'Nguyễn Văn Hùng',
        rating: 5,
        comment: 'Dịch vụ rất chất lượng, chủ shop tư vấn nhiệt tình đúng thông tin!',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: 'rev-2',
        user_name: 'Trần Thị Thu Hải',
        rating: 5,
        comment: 'Giao hàng đúng hẹn, vị trí ngay trung tâm vô cùng tiện lợi.',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
    ]
  );

  if (!product) return null;

  const isClosed = Boolean(product.isShopTemporarilyClosed);
  const isSuspended = Boolean(product.isShopSuspended);
  const isOrderingBlocked = isClosed || isSuspended;

  const isLodging = product.category === 'lodging';
  const isTransport = product.category === 'transport';

  const isTQStore = Boolean(product.isTQStore);
  const isVerified = Boolean(product.isLicensed);
  const isUnverified = !isTQStore && !isVerified;

  // Verified Buyer Review Eligibility Rules
  const isEligibleShopForReview = isTQStore || isVerified;

  const phoneNumber = product.phone || '0988.123.456';

  const formatPrice = (price: number, cat: string) => {
    if (price === 0) return 'Miễn phí';
    if (cat === 'jobs') return `Lương ${Number(price).toLocaleString('vi-VN')} đ`;
    if (cat === 'lodging') return `${Number(price).toLocaleString('vi-VN')} đ / đêm`;
    if (cat === 'transport') return `Giá: ${Number(price).toLocaleString('vi-VN')} đ`;
    return `${Number(price).toLocaleString('vi-VN')} đ`;
  };

  const handleAddToCart = () => {
    if (isOrderingBlocked) {
      alert(isSuspended 
        ? '🔴 Shop hiện đang bị Sàn tạm khóa do nợ công nợ hoặc vi phạm.' 
        : `🟠 Shop hiện đang TẠM NGHỈ (${product.shopCloseReason || 'Tạm ngưng nhận đơn'}). Bạn vẫn có thể xem & bấm Đặt Giữ Hàng!`);
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReserveGoods = () => {
    if (!isEligibleShopForReview) {
      alert('📌 Đặt giữ hàng chỉ áp dụng cho Shop Đã Xác Minh & Shop TQ!');
      return;
    }
    setReserved(!reserved);
    alert(!reserved 
      ? '📌 Bạn đã gửi yêu cầu ĐẶT GIỮ HÀNG tại Shop thành công! Gian hàng sẽ giữ sản phẩm cho bạn trong 24 giờ.' 
      : 'Đã hủy yêu cầu đặt giữ hàng.');
  };

  const handleDirectChat = () => {
    onClose();
    if (onOpenDirectMessagingModal) {
      onOpenDirectMessagingModal({
        shopName: product.contactName || 'Gian Hàng Siêu Tiện Ích',
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute right-4 top-4 z-20 text-gray-400 hover:text-gray-600 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          
          {/* COMPACT & SLEEK SHOP STATUS BANNER */}
          {isSuspended ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
                <strong className="font-extrabold">🔴 Shop bị Sàn tạm khóa do quá hạn công nợ</strong>
              </div>
            </div>
          ) : isClosed ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <strong className="font-extrabold">🟠 Shop đang tạm nghỉ: {product.shopCloseReason || 'Tạm ngưng nhận đơn mới'}</strong>
              </div>
              <span className="text-[10px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-extrabold shrink-0">Vẫn xem & lưu thích</span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <strong className="font-extrabold">🟢 Cửa hàng đang mở cửa — Giao ngay tận nơi</strong>
              </div>
            </div>
          )}

          {/* Product Image & Main Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
                }}
              />
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {isTQStore ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-xs font-black shadow-md border border-amber-300/40">
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      <span>👑 Shop TQ Official</span>
                    </span>
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>✓ Đã xác minh GPKD</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-gray-200 rounded-lg text-xs font-bold shadow-sm">
                      <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span>🔒 Chưa xác minh</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs mb-2">
                  {!isUnverified ? (
                    <div className="flex items-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="ml-1 font-black text-gray-900 text-sm">
                        {product.rating ? product.rating.toFixed(1) : '5.0'}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        ({product.reviewCount || reviewsList.length} đánh giá từ người mua)
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Chưa xác minh • Không mở lượt đánh giá</span>
                    </div>
                  )}

                  <span className="text-gray-300">|</span>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                    🛒 Đã bán {product.soldCount !== undefined ? product.soldCount.toLocaleString('vi-VN') : '150'} lượt
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                  {product.name}
                </h2>
              </div>

              {/* Location & Contact Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3 text-xs">
                {(product.locationName || product.district) && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-800">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Địa chỉ & Vị trí cửa hàng:</span>
                        <span>{product.locationName || `${product.district}, ${product.province}`}</span>
                        {product.distanceKm !== undefined && (
                          <span className="text-gray-500 ml-1 font-semibold">({product.distanceKm} km từ vị trí hiện tại)</span>
                        )}
                      </div>
                    </div>

                    {/* Google Maps Directions Link Button */}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        product.locationName || `${product.district || ''}, ${product.province || ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-rose-200 transition cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-white animate-bounce shrink-0" />
                      <span>🗺️ Bấm vào đây để mở Google Maps chỉ đường</span>
                    </a>
                  </div>
                )}

                {product.contactName && (
                  <div className="flex items-center gap-2 text-indigo-700 font-bold pt-2 border-t border-gray-200/60">
                    <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Liên hệ: {product.contactName} ({phoneNumber})</span>
                  </div>
                )}

                {product.licenseNo && (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold pt-1 border-t border-gray-200/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Giấy phép kinh doanh: {product.licenseNo}</span>
                  </div>
                )}
              </div>

              {/* RESERVE GOODS & DIRECT CHAT FEATURE BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Direct Messaging */}
                <button
                  type="button"
                  onClick={handleDirectChat}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold rounded-2xl border border-indigo-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>💬 Nhắn tin với Khách / Shop</span>
                </button>

                {/* Reserve Goods (Only for Verified Shop) */}
                <button
                  type="button"
                  onClick={handleReserveGoods}
                  className={`p-2.5 font-extrabold rounded-2xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isEligibleShopForReview
                      ? reserved ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                  }`}
                  title={isEligibleShopForReview ? 'Đặt giữ hàng tại Shop' : 'Chỉ áp dụng cho Shop Đã Xác Minh & Shop TQ'}
                >
                  {isEligibleShopForReview ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-purple-600" />
                      <span>{reserved ? '✓ Đã đặt giữ hàng' : '📌 Đặt Giữ Hàng Tại Shop'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span>🔒 Đặt giữ hàng (Cần xác minh)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Mô tả chi tiết tiện ích</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-gray-100">
              {product.description || 'Chưa có thông tin mô tả chi tiết từ chủ đăng tin.'}
            </p>
          </div>

        </div>

        {/* Modal Fixed Footer CTA */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[11px] text-gray-400 font-bold block uppercase">Giá dịch vụ</span>
              <span className="text-rose-600 font-black text-base sm:text-lg">
                {formatPrice(product.price * quantity, product.category)}
              </span>
            </div>

            {/* Quantity Selector (- / +) */}
            {!isLodging && !isTransport && !isOrderingBlocked && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold rounded-lg transition cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-black text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold rounded-lg transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {isLodging || isTransport ? (
            <a
              href={isOrderingBlocked ? undefined : `tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              onClick={(e) => {
                if (isOrderingBlocked) {
                  e.preventDefault();
                  alert(isSuspended ? '🔴 Shop bị Sàn khóa do quá hạn công nợ!' : '🟠 Shop đang TẠM NGHỈ!');
                }
              }}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg transition flex items-center gap-2 ${
                isOrderingBlocked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{isOrderingBlocked ? 'Tạm Ngưng Nhận Đơn' : `Gọi ngay (${phoneNumber})`}</span>
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isOrderingBlocked}
              className={`px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer ${
                isOrderingBlocked
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {isOrderingBlocked ? (
                <>
                  <PauseCircle className="w-4 h-4 text-orange-600" />
                  <span>⏸️ Shop Tạm Nghỉ (Ngưng Nhận Đơn)</span>
                </>
              ) : added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã thêm ({quantity}) vào giỏ</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Thêm ({quantity}) vào giỏ hàng</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
