import React from 'react';
import { Plus, Trash2, Check, PhoneCall, ShieldCheck, Phone, Info, MapPin, Store, CheckCircle } from 'lucide-react';
import type { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, deleteProduct } = useShop();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const isLodging = product.category === 'lodging';
  const isTransport = product.category === 'transport';

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative w-full min-w-0">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={product.img} 
          alt={product.name} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
          }}
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[85%]">
          <span className="inline-block px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider shadow-sm border border-indigo-100 truncate max-w-full">
            {getCategoryBadge(product.category)}
          </span>

          {/* TQ Store Badge vs Verified Store Badge */}
          {product.isTQStore ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-500 text-white rounded-lg text-[10px] font-black shadow-sm">
              <Store className="w-3 h-3" />
              <span>Cửa hàng TQ (Dùng Xu TQ)</span>
            </span>
          ) : product.isLicensed ? (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-sm">
              <CheckCircle className="w-3 h-3" />
              <span>Đã xác minh (Dùng Xu Thường)</span>
            </span>
          ) : null}
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
          onClick={() => deleteProduct(product.id)}
          title="Xóa mục tiện ích này"
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-rose-500 text-gray-400 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 min-w-0">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors break-words">
            {product.name}
          </h3>

          {/* Location Badge (District & Distance) */}
          {(product.district || product.locationName) && (
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-gray-600 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">
                {product.district ? product.district : ''} 
                {product.distanceKm !== undefined ? ` • cách ${product.distanceKm} km` : ''}
              </span>
            </div>
          )}

          {/* Contact / License Info */}
          {product.contactName && (
            <p className="text-[11px] font-semibold text-indigo-600 mt-1 flex items-center gap-1 truncate">
              <Phone className="w-3 h-3 shrink-0" />
              <span className="truncate">{product.contactName}</span>
            </p>
          )}

          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words">
              {product.description}
            </p>
          )}

          {/* Compliance Disclaimer Notice */}
          {isLodging && (
            <div className="mt-2.5 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-700 flex items-start gap-1.5 min-w-0">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span className="leading-tight break-words">Quảng bá cơ sở. Đặt phòng & thanh toán trực tiếp với chủ nhà.</span>
            </div>
          )}

          {isTransport && (
            <div className="mt-2.5 p-2 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-start gap-1.5 min-w-0">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
              <span className="leading-tight break-words">Danh bạ kết nối trực tiếp. Sàn không thu cước vận chuyển hộ.</span>
            </div>
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
              href={`tel:${phoneNumber.replace(/[^0-9]/g, '')}`}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition shrink-0 max-w-[55%] truncate"
              title={`Gọi ngay ${phoneNumber}`}
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span className="truncate">Gọi ({phoneNumber})</span>
            </a>
          ) : (
            <button 
              onClick={handleAddToCart} 
              className={`p-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-1 shrink-0 ${
                added 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm'
              }`}
              title="Thêm vào danh sách tiện ích của bạn"
            >
              {added ? (
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
