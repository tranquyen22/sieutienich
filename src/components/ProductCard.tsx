import React from 'react';
import { Plus, Trash2, Check, PhoneCall, ShieldCheck, Phone, MapPin, Store, CheckCircle, Star, Lock, AlertOctagon, Clock, PauseCircle } from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, deleteProduct } = useShop();
  const [added, setAdded] = React.useState(false);

  const isClosed = Boolean(product.isShopTemporarilyClosed);
  const isSuspended = Boolean(product.isShopSuspended);
  const isOrderingBlocked = isClosed || isSuspended;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOrderingBlocked) {
      alert(isSuspended 
        ? '🔴 Shop hiện đang bị Sàn tạm khóa do quá hạn công nợ hoặc vi phạm quy định.' 
        : `🟠 Shop hiện đang TẠM NGHỈ (${product.shopCloseReason || 'Mở lại theo lịch'}). Vui lòng quay lại sau!`);
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isLodging = product.category === 'lodging';
  const isTransport = product.category === 'transport';

  const isTQStore = Boolean(product.isTQStore);
  const isVerified = Boolean(product.isLicensed);
  const isUnverified = !isTQStore && !isVerified;

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'rental':
        return 'Shop cho thuê';
      case 'fashion':
        return 'Shop Quần áo';
      case 'food':
        return 'Đồ ăn - Đồ uống';
      case 'spa':
        return 'Spa làm đẹp';
      case 'groceries':
        return 'Nhu yếu phẩm';
      case 'transport':
        return 'Vận tải';
      case 'lodging':
        return 'Lưu trú';
      case 'home_services':
        return 'Gia đình & Sửa chữa';
      case 'jobs':
        return 'Việc làm';
      case 'public_utilities':
        return 'Tiện ích công cộng';
      default:
        return cat;
    }
  };

  const formatPrice = (price: number, cat: string) => {
    if (price === 0) return 'Miễn phí';
    if (cat === 'jobs') return `Lương ${Number(price).toLocaleString('vi-VN')} đ`;
    if (cat === 'lodging') return `${Number(price).toLocaleString('vi-VN')} đ / đêm`;
    if (cat === 'transport') return `Giá: ${Number(price).toLocaleString('vi-VN')} đ`;
    return `${Number(price).toLocaleString('vi-VN')} đ`;
  };

  const phoneNumber = product.phone || '0988.123.456';
  const fullAddress = product.locationName || `${product.district || ''}, ${product.province || ''}`;

  return (
    <div 
      onClick={() => onSelectProduct && onSelectProduct(product)}
      className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative w-full min-w-0 cursor-pointer ${
        isSuspended 
          ? 'border-rose-300 opacity-80' 
          : isClosed 
          ? 'border-amber-300 bg-amber-50/20 opacity-90' 
          : 'border-gray-100'
      }`}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={product.img} 
          alt={product.name} 
          className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOrderingBlocked ? 'grayscale-[30%]' : ''
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 max-w-[85%]">
          <span className="inline-block px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider shadow-sm border border-indigo-100 truncate max-w-full">
            {getCategoryBadge(product.category)}
          </span>

          {/* Clean Shop Status Badge */}
          {isTQStore ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg text-[10px] font-black shadow-md border border-amber-300/40">
              <Store className="w-3 h-3 shrink-0" />
              <span>👑 Shop TQ</span>
            </span>
          ) : isVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-md">
              <CheckCircle className="w-3 h-3 shrink-0" />
              <span>✓ Đã xác minh</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-900/80 backdrop-blur-md text-gray-200 rounded-lg text-[10px] font-bold shadow-sm">
              <Lock className="w-3 h-3 shrink-0 text-amber-400" />
              <span>🔒 Chưa xác minh</span>
            </span>
          )}
        </div>

        {/* PROMINENT SHOP OPEN / PAUSE / SUSPENDED CARD BADGE */}
        <div className="absolute top-3 right-3">
          {isSuspended ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600/95 text-white backdrop-blur-md rounded-xl text-[10px] font-black shadow-md border border-rose-400">
              <AlertOctagon className="w-3 h-3 shrink-0" />
              <span>🔴 Bị Sàn Khóa</span>
            </span>
          ) : isClosed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-600/95 text-white backdrop-blur-md rounded-xl text-[10px] font-black shadow-md border border-amber-300">
              <PauseCircle className="w-3 h-3 shrink-0" />
              <span>🟠 Tạm Nghỉ</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/95 text-white backdrop-blur-md rounded-xl text-[10px] font-black shadow-md border border-emerald-300">
              <Clock className="w-3 h-3 shrink-0" />
              <span>🟢 Đang Mở Cửa</span>
            </span>
          )}
        </div>

        {/* Lodging Business License Badge */}
        {isLodging && (
          <div className="absolute bottom-3 left-3 right-3 max-w-full">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/95 text-white backdrop-blur-md rounded-lg text-[10px] font-bold shadow-md border border-emerald-400/30 max-w-full">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{product.licenseNo || 'Đã xác minh GPKD đầy đủ'}</span>
            </span>
          </div>
        )}

        {/* Quick Delete action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteProduct(product.id);
          }}
          title="Xóa mục tiện ích này"
          className="absolute bottom-3 right-3 p-1.5 bg-white/80 hover:bg-rose-500 text-gray-400 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 min-w-0">
        <div className="min-w-0">
          
          {/* Rating Stars & Reviews Count & Total Sales Count */}
          <div className="flex items-center justify-between gap-1 mb-1 text-xs">
            {!isUnverified ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="ml-1 font-black text-gray-900 text-xs">
                    {product.rating ? product.rating.toFixed(1) : '5.0'}
                  </span>
                </div>
                <span className="text-gray-400 text-[11px]">
                  ({product.reviewCount || 48})
                </span>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Chưa xác minh</span>
              </div>
            )}

            {/* Total Units Sold Badge */}
            <span className="text-[11px] font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full shrink-0 border border-slate-200/80">
              🛒 Đã bán {product.soldCount !== undefined ? (product.soldCount >= 1000 ? `${(product.soldCount / 1000).toFixed(1)}k+` : product.soldCount) : '150+'}
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug break-words">
            {product.name}
          </h3>

          {/* Location & Google Maps Link */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-gray-500 mt-1 min-w-0">
            <span className="flex items-center gap-1 truncate font-medium" title={fullAddress}>
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">{fullAddress}</span>
            </span>

            {product.distanceKm !== undefined && (
              <span className="text-indigo-600 font-extrabold shrink-0 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                {product.distanceKm} km
              </span>
            )}
          </div>

          {/* Contact / License Info */}
          {product.contactName && (
            <p className="text-[11px] font-semibold text-indigo-600 mt-1 flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 shrink-0" />
              <span className="truncate">{product.contactName}</span>
            </p>
          )}

          {/* TEMPORARY CLOSED OR SUSPENDED STATUS BANNER IN CARD BODY */}
          {isClosed && (
            <div className="mt-2 p-2 bg-amber-100/90 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">⏸️ {product.shopCloseReason || 'Shop tạm nghỉ - Tạm ngưng nhận đơn'}</span>
            </div>
          )}

          {isSuspended && (
            <div className="mt-2 p-2 bg-rose-100/90 border border-rose-300 rounded-xl text-[11px] font-bold text-rose-900 flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">🔴 Shop bị Sàn tạm khóa (Quá hạn công nợ)</span>
            </div>
          )}

          {product.description && !isClosed && !isSuspended && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2 min-w-0">
          <div className="min-w-0 flex-1">
            <span className="text-rose-600 font-extrabold text-xs sm:text-sm block truncate" title={formatPrice(product.price, product.category)}>
              {formatPrice(product.price, product.category)}
            </span>
          </div>

          {/* Special CTA for Lodging & Transport: Direct Phone Call */}
          {isLodging || isTransport ? (
            <a
              href={isOrderingBlocked ? undefined : `tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              onClick={(e) => {
                if (isOrderingBlocked) {
                  e.preventDefault();
                  e.stopPropagation();
                  alert(isSuspended ? '🔴 Shop hiện bị khóa do nợ công nợ!' : '🟠 Shop tạm nghỉ!');
                } else {
                  e.stopPropagation();
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition shrink-0 max-w-[55%] truncate ${
                isOrderingBlocked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
              title={`Gọi ngay ${phoneNumber}`}
            >
              <PhoneCall className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isOrderingBlocked ? 'Tạm Ngưng' : `Gọi (${phoneNumber})`}</span>
            </a>
          ) : (
            <button 
              onClick={handleAddToCart} 
              disabled={isOrderingBlocked}
              className={`p-2 rounded-xl font-bold text-xs transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer ${
                isOrderingBlocked
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                  : added 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm'
              }`}
              title={isOrderingBlocked ? 'Shop đang tạm nghỉ - Tạm ngưng nhận đơn' : 'Thêm vào giỏ hàng'}
            >
              {isOrderingBlocked ? (
                <span>Tạm nghỉ</span>
              ) : added ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
