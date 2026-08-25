import React, { useState } from 'react';
import { X, Star, MapPin, Phone, ShieldCheck, Store, Lock, Check, Plus, Minus, PhoneCall, User, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Product, ProductReview } from '../types';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, addCoinTransaction, purchasedProductIds } = useShop();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Review submission state
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(
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
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const isLodging = product.category === 'lodging';
  const isTransport = product.category === 'transport';

  const isTQStore = Boolean(product.isTQStore);
  const isVerified = Boolean(product.isLicensed);

  // Verified Buyer Review Eligibility Rules
  const isEligibleShopForReview = isTQStore || isVerified;
  const isVerifiedBuyer = purchasedProductIds.includes(String(product.id));

  const phoneNumber = product.phone || '0988.123.456';

  const formatPrice = (price: number, cat: string) => {
    if (price === 0) return 'Miễn phí';
    if (cat === 'jobs') return `Lương ${Number(price).toLocaleString('vi-VN')} đ`;
    if (cat === 'lodging') return `${Number(price).toLocaleString('vi-VN')} đ / đêm`;
    if (cat === 'transport') return `Giá: ${Number(price).toLocaleString('vi-VN')} đ`;
    return `${Number(price).toLocaleString('vi-VN')} đ`;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isVerifiedBuyer || !isEligibleShopForReview) return;

    const reviewObj: ProductReview = {
      id: String(Date.now()),
      user_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Người mua xác minh',
      rating: newRating,
      comment: newComment.trim(),
      created_at: new Date().toISOString(),
    };

    setReviewsList([reviewObj, ...reviewsList]);
    setNewComment('');
    setReviewSubmitted(true);

    // Award +10,000 Xu Thường reward for reviewing
    await addCoinTransaction(
      10000,
      `⭐ Thưởng +10.000 Xu Thường đánh giá tiện ích ${product.name}`,
      'earn',
      'regular'
    );

    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute right-4 top-4 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition cursor-pointer shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 w-full bg-gray-100 overflow-hidden">
            <img 
              src={product.img} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
              }}
            />

            {/* Badges on Hero Image */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 max-w-[85%]">
              <span className="inline-block px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl text-xs uppercase font-black text-indigo-700 tracking-wider shadow-md">
                {product.category}
              </span>

              {isTQStore ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl text-xs font-black shadow-md border border-amber-300/40">
                  <Store className="w-4 h-4 shrink-0" />
                  <span>👑 Shop TQ</span>
                </span>
              ) : isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-md">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>✓ Đã xác minh</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900/80 backdrop-blur-md text-gray-200 rounded-xl text-xs font-bold shadow-md">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>🔒 Chưa xác minh</span>
                </span>
              )}
            </div>

            {/* Price Tag Overlay */}
            <div className="absolute bottom-4 right-4 px-4 py-2 bg-rose-600 text-white font-black text-base sm:text-lg rounded-2xl shadow-lg backdrop-blur-md">
              {formatPrice(product.price, product.category)}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6 space-y-5">
            
            {/* Title & Rating */}
            <div>
              {isEligibleShopForReview ? (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="ml-1 font-black text-gray-900 text-sm">
                      {product.rating ? product.rating.toFixed(1) : '5.0'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-semibold">
                    ({product.reviewCount || reviewsList.length} đánh giá từ người mua)
                  </span>
                </div>
              ) : (
                <div className="mb-2 text-xs font-bold text-gray-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Chưa xác minh • Không mở lượt đánh giá</span>
                </div>
              )}

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

            {/* Product Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Mô tả chi tiết tiện ích</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-gray-100">
                {product.description || 'Chưa có thông tin mô tả chi tiết từ chủ đăng tin.'}
              </p>
            </div>

            {/* Ratings & Customer Reviews Section */}
            {isEligibleShopForReview ? (
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase text-gray-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span>Đánh giá từ người mua hàng ({reviewsList.length})</span>
                  </h3>
                </div>

                {/* VERIFIED BUYER ONLY REVIEW FORM */}
                {isVerifiedBuyer ? (
                  <form onSubmit={handleAddReview} className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Bạn đã mua hàng thành công • Viết đánh giá:</span>
                      </span>
                      
                      {/* Star Selection */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-0.5 cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Nhập nhận xét của bạn về sản phẩm / dịch vụ..."
                        className="w-full pl-3 pr-28 py-2 border border-emerald-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500 bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="absolute right-1.5 top-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Gửi (+10k Xu)</span>
                      </button>
                    </div>

                    {reviewSubmitted && (
                      <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 pt-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                        <span>Đã gửi đánh giá thành công! Tặng ngay +10.000 Xu Thường vào ví.</span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 font-semibold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>🔒 Chỉ khách hàng đã mua/đặt hàng thành công tại gian hàng này mới được quyền viết đánh giá.</span>
                    </div>
                    <button 
                      onClick={handleAddToCart} 
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-[11px] shrink-0 shadow-sm cursor-pointer"
                    >
                      Đặt hàng ngay
                    </button>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {rev.user_name}
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold">✓ Đã mua hàng</span>
                        </span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-[11px]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-gray-100 rounded-2xl border border-gray-200 text-xs text-gray-600 font-bold flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <span>🔒 Shop chưa xác minh ➔ Tính năng Đánh giá & Hiển thị nhận xét chưa được mở.</span>
              </div>
            )}

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
            {!isLodging && !isTransport && (
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
              href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-200 transition flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Gọi ngay ({phoneNumber})</span>
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`px-6 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
            >
              {added ? (
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
