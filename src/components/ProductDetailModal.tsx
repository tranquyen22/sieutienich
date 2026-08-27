import React, { useState } from 'react';
import { 
  X, Star, MapPin, Lock, Check, Plus, Minus, 
  PhoneCall, BookmarkCheck, MessageCircle, PauseCircle, ThumbsUp, CheckCircle2, Navigation, Truck, ShoppingBag 
} from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
  onOpenDirectMessagingModal?: (productInfo?: { shopName: string; productId: number | string; productName: string; productPrice: number }) => void;
  onOpenReviewFeedModal?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose, 
  onOpenDirectMessagingModal,
}) => {
  const { addToCart, getEffectiveFulfillmentMode } = useShop();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [reserved, setReserved] = useState(false);
  
  // Full Reviews Modal State
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5star' | '4star' | 'with_photos'>('all');
  const [helpfulLikes, setHelpfulLikes] = useState<{ [id: string]: number }>({});

  if (!product) return null;

  const isClosed = Boolean(product.isShopTemporarilyClosed);
  const isSuspended = Boolean(product.isShopSuspended);
  const isOrderingBlocked = isClosed || isSuspended;

  const isLodging = product.category === 'lodging';
  const isTransport = product.category === 'transport';

  const isTQStore = Boolean(product.isTQStore);
  const isVerified = Boolean(product.isLicensed);

  const isEligibleShopForReview = isTQStore || isVerified;
  const phoneNumber = product.phone || '0988.123.456';

  const sampleCustomerReviews = [
    {
      id: 'rev-1',
      user_name: 'Nguyễn Văn Hùng',
      avatar: 'H',
      rating: 5,
      comment: 'Dịch vụ rất chất lượng, sản phẩm tươi ngon đúng như mô tả, giao nóng hổi trong 25 phút. Rất hài lòng!',
      created_at: '2026-08-25T14:30:00Z',
      is_verified_purchase: true,
      variation: 'Combo chuẩn 2-3 người',
      helpful_default: 14,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80'
    },
    {
      id: 'rev-2',
      user_name: 'Trần Thị Thu Hải',
      avatar: 'H',
      rating: 5,
      comment: 'Giao hàng đúng hẹn, chủ shop tư vấn nhiệt tình chu đáo, vị trí ngay trung tâm Khoái Châu rất tiện lợi.',
      created_at: '2026-08-24T10:15:00Z',
      is_verified_purchase: true,
      variation: 'Dịch vụ xác minh',
      helpful_default: 9,
    },
    {
      id: 'rev-3',
      user_name: 'Lê Minh Tuấn',
      avatar: 'T',
      rating: 5,
      comment: 'Chất lượng tuyệt vời ngoài mong đợi, shop đóng gói cẩn thận 5 sao nhé!',
      created_at: '2026-08-22T09:20:00Z',
      is_verified_purchase: true,
      variation: 'Size XL - Màu Đen',
      helpful_default: 5,
    },
    {
      id: 'rev-4',
      user_name: 'Phạm Phương Thảo',
      avatar: 'T',
      rating: 4,
      comment: 'Sản phẩm đẹp như hình quảng cáo, shipper giao nhanh nhẹn lịch sự. Lần sau sẽ ủng hộ tiếp.',
      created_at: '2026-08-20T16:45:00Z',
      is_verified_purchase: true,
      variation: 'Size M - Màu Trắng',
      helpful_default: 3,
    }
  ];

  const filteredReviews = sampleCustomerReviews.filter((rev) => {
    if (reviewFilter === '5star') return rev.rating === 5;
    if (reviewFilter === '4star') return rev.rating === 4;
    if (reviewFilter === 'with_photos') return Boolean(rev.image);
    return true;
  });

  const handleToggleHelpful = (id: string, defaultCount: number) => {
    setHelpfulLikes((prev) => {
      const current = prev[id] !== undefined ? prev[id] : defaultCount;
      const isLiked = prev[`${id}_liked`];
      return {
        ...prev,
        [id]: isLiked ? current - 1 : current + 1,
        [`${id}_liked`]: isLiked ? 0 : 1,
      };
    });
  };

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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-2 pr-8 min-w-0">
            <span className="px-2.5 py-1 bg-amber-500 text-white rounded-lg text-[10px] uppercase font-black tracking-wider shrink-0">
              {product.category.toUpperCase()}
            </span>
            <h2 className="text-base sm:text-lg font-black text-white truncate">
              {product.name}
            </h2>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs font-medium">
          
          {/* Top Main Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            
            {/* Image Box with Badges */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
                }}
              />

              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {isTQStore ? (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-[10px] font-black shadow-md">
                    👑 Shop TQ Official
                  </span>
                ) : isVerified ? (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold shadow-md">
                    ✓ Đã xác minh GPKD
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-900/90 text-gray-200 rounded-lg text-[10px] font-extrabold shadow-md">
                    🔒 Chưa xác minh
                  </span>
                )}
              </div>
            </div>

            {/* Product Meta Details */}
            <div className="space-y-4">
              
              <div>
                <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating Summary Link Trigger */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center text-amber-400 font-black text-xs gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 / 5.0</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowAllReviewsModal(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold underline cursor-pointer"
                  >
                    Xem 128 Đánh giá từ khách hàng ➔
                  </button>
                </div>
              </div>

              {/* Location & Address Pin & Google Maps Navigation Button & Fulfillment Badge */}
              {(() => {
                const mapsNavigationUrl = product.google_maps_url || 
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${product.district ? `${product.district}, ` : ''}${product.province || 'Hà Nội'}`)}`;

                const effectiveFulfillment = getEffectiveFulfillmentMode(product.user_id, product);

                return (
                  <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl space-y-2.5">
                    
                    {/* Fulfillment Method Status Badge */}
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold text-xs ${
                      !effectiveFulfillment.allowDelivery
                        ? 'bg-amber-100 border-amber-300 text-amber-950'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    }`}>
                      <div className="flex items-center gap-2">
                        {!effectiveFulfillment.allowDelivery ? (
                          <>
                            <ShoppingBag className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>🏪 CHỈ BÁN TỰ ĐẾN LẤY HÀNG (Không hỗ trợ giao tận nhà)</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>🚚 Có giao hàng tận nơi & 🏪 Khách tự đến lấy</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-extrabold text-gray-900 block text-xs">Vị trí trực tiếp gian hàng:</strong>
                        <span className="text-[11px] text-gray-600 block font-medium">
                          {product.locationName || `${product.district || 'Khoái Châu'}, ${product.province || 'Hưng Yên'}`}
                        </span>
                      </div>
                    </div>

                    <a
                      href={mapsNavigationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-emerald-500 active:scale-98"
                      title="Bấm để mở trình duyệt / ứng dụng Google Maps chỉ đường trực tiếp tới vị trí gian hàng"
                    >
                      <Navigation className="w-4 h-4 text-emerald-200 animate-pulse" />
                      <span>🗺️ Mở Google Maps Chỉ Đường Đến Gian Hàng</span>
                    </a>
                  </div>
                );
              })()}

              {/* Direct Communication Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleDirectChat}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-extrabold rounded-2xl border border-indigo-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-indigo-600" />
                  <span>💬 Nhắn tin với Shop</span>
                </button>

                <button
                  type="button"
                  onClick={handleReserveGoods}
                  className={`p-2.5 font-extrabold rounded-2xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isEligibleShopForReview
                      ? reserved ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                  }`}
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
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Mô tả chi tiết sản phẩm / tiện ích</h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200">
              {product.description || 'Chưa có thông tin mô tả chi tiết từ chủ đăng tin.'}
            </p>
          </div>

          {/* ⭐ CUSTOMER REVIEWS FEED SECTION */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-amber-50/50 border border-amber-200/80 rounded-3xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
              <div>
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Đánh Giá Từ Khách Hàng (128 Đánh Giá)</span>
                </h3>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  100% đánh giá thực tế từ khách hàng đã mua sản phẩm tại Shop
                </p>
              </div>

              {/* SEE ALL REVIEWS BUTTON */}
              <button
                type="button"
                onClick={() => setShowAllReviewsModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs shadow-sm transition cursor-pointer self-start sm:self-auto"
              >
                ⭐ Xem Toàn Bộ Đánh Giá (128)
              </button>
            </div>

            {/* PREVIEW OF TOP 2 REVIEWS */}
            <div className="space-y-3">
              {sampleCustomerReviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-3.5 bg-white rounded-2xl border border-amber-100 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-600 text-white font-black text-xs rounded-full flex items-center justify-center">
                        {rev.avatar}
                      </div>
                      <div>
                        <strong className="font-extrabold text-gray-900 text-xs block">{rev.user_name}</strong>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>✓ Đã mua hàng tại Shop</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-snug">{rev.comment}</p>
                </div>
              ))}
            </div>

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
                  <span>⏸️ Shop Tạm Nghỉ</span>
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

      {/* FULL CUSTOMER REVIEWS MODAL OVERLAY */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-amber-200 max-h-[88vh] flex flex-col min-w-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <h3 className="font-black text-base text-white">Toàn Bộ 128 Đánh Giá Từ Khách Hàng</h3>
              </div>

              <button
                onClick={() => setShowAllReviewsModal(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs Header */}
            <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none text-xs font-extrabold">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  reviewFilter === 'all' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'
                }`}
              >
                Tất cả (128)
              </button>

              <button
                onClick={() => setReviewFilter('5star')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  reviewFilter === '5star' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'
                }`}
              >
                5 ⭐ (112)
              </button>

              <button
                onClick={() => setReviewFilter('4star')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  reviewFilter === '4star' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'
                }`}
              >
                4 ⭐ (14)
              </button>

              <button
                onClick={() => setReviewFilter('with_photos')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  reviewFilter === 'with_photos' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-900 border border-amber-200'
                }`}
              >
                📸 Có hình ảnh (42)
              </button>
            </div>

            {/* Full Review Cards List */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {filteredReviews.map((rev) => {
                const currentLikes = helpfulLikes[rev.id] !== undefined ? helpfulLikes[rev.id] : rev.helpful_default;
                const isLiked = Boolean(helpfulLikes[`${rev.id}_liked`]);

                return (
                  <div key={rev.id} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs rounded-full flex items-center justify-center shadow-xs">
                          {rev.avatar}
                        </div>
                        <div>
                          <strong className="font-extrabold text-gray-900 text-xs block">{rev.user_name}</strong>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>✓ Đã mua hàng thực tế</span>
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-gray-400">
                        {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">Phân loại: {rev.variation}</span>
                    </div>

                    <p className="text-xs text-gray-800 leading-relaxed font-medium">{rev.comment}</p>

                    {rev.image && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                        <img src={rev.image} alt="Đánh giá sản phẩm" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleToggleHelpful(rev.id, rev.helpful_default)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold transition cursor-pointer ${
                          isLiked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-amber-600" />
                        <span>Hữu ích ({currentLikes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
