import React, { useState, useMemo } from 'react';
import {
  Store, Phone, MapPin, MessageSquare, ShoppingBag, ArrowLeft,
  CheckCircle2, Search, Sparkles
} from 'lucide-react';
import type { Product, ShopSubwebConfig } from '../types';
import { useSubShopPWA } from '../hooks/useSubShopPWA';
import { ProductCard } from './ProductCard';

interface SubStorefrontLayoutProps {
  subwebConfig: ShopSubwebConfig;
  allProducts: Product[];
  onBackToMarketplace: () => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenDirectMessaging: (targetPhone?: string, shopName?: string) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const SubStorefrontLayout: React.FC<SubStorefrontLayoutProps> = ({
  subwebConfig,
  allProducts,
  onBackToMarketplace,
  onOpenProductDetail,
  onOpenDirectMessaging,
  onOpenCart,
  cartCount,
}) => {
  const { subweb_theme, shop_name, custom_slug } = subwebConfig;
  const brandColor = subweb_theme?.brand_color || '#4f46e5';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Dynamic PWA Hook for Sub-shop
  const { isInstallable, isStandalone, promptInstallPWA } = useSubShopPWA({
    shopName: shop_name,
    slug: custom_slug,
    iconUrl: subweb_theme?.banner_url,
    theme: subweb_theme,
  });

  // 2. ISOLATED PRODUCT FILTERING: Strictly include only products belonging to this shop
  const shopProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (p.user_id && subwebConfig.user_id && p.user_id === subwebConfig.user_id) return true;
      if (p.contactName && p.contactName.toLowerCase() === shop_name.toLowerCase()) return true;
      return false;
    });
  }, [allProducts, subwebConfig.user_id, shop_name]);

  // Filtered by internal search & category
  const filteredProducts = useMemo(() => {
    return shopProducts.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [shopProducts, selectedCategory, searchQuery]);

  // Extract unique shop categories
  const shopCategories = useMemo(() => {
    const cats = new Set(shopProducts.map((p) => p.category));
    return Array.from(cats);
  }, [shopProducts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20">
      
      {/* 1. DYNAMIC PWA INSTALL PROMPT BAR FOR SUB-SHOP */}
      {isInstallable && !isStandalone && (
        <div
          style={{ backgroundColor: brandColor }}
          className="text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-bold shrink-0 animate-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Store className="w-4 h-4 shrink-0 animate-bounce" />
            <span className="truncate">
              📲 Cài đặt App <strong>{shop_name}</strong> vào điện thoại để xem hàng 1-chạm!
            </span>
          </div>

          <button
            type="button"
            onClick={promptInstallPWA}
            className="px-3 py-1 bg-white text-gray-900 rounded-full text-[11px] font-black shrink-0 hover:bg-gray-100 transition shadow-xs cursor-pointer active:scale-95"
          >
            Tải App Ngay
          </button>
        </div>
      )}

      {/* 2. ISOLATED BRANDED HEADER */}
      <header
        style={{ backgroundColor: brandColor }}
        className="text-white shadow-xl sticky top-0 z-40 transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
          
          {/* Back to main marketplace */}
          <button
            type="button"
            onClick={onBackToMarketplace}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition text-white shrink-0 cursor-pointer flex items-center gap-1 text-xs font-extrabold"
            title="Quay lại Sàn Siêu Tiện Ích"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Trang Chủ Sàn</span>
          </button>

          {/* Shop Brand Identity & Verification Badge */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-center sm:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-1 shrink-0 flex items-center justify-center border border-white/30 shadow-inner">
              {subweb_theme?.banner_url ? (
                <img
                  src={subweb_theme.banner_url}
                  alt={shop_name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Store className="w-6 h-6 text-white" />
              )}
            </div>

            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-black text-white truncate">{shop_name}</h1>
                <CheckCircle2 className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              </div>
              <span className="text-[10px] text-white/80 font-bold block truncate">
                {subweb_theme?.address || 'Gian hàng chính hãng Web Con Độc Lập'}
              </span>
            </div>
          </div>

          {/* Right Action Icons (Hotline, Chat, Cart) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Hotline Direct Call */}
            {subweb_theme?.hotline && (
              <a
                href={`tel:${subweb_theme.hotline}`}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition flex items-center gap-1 text-xs font-black shadow-sm no-underline cursor-pointer"
                title="Gọi Hotline Shop"
              >
                <Phone className="w-4 h-4 animate-pulse" />
                <span className="hidden md:inline">{subweb_theme.hotline}</span>
              </a>
            )}

            {/* Direct Messaging SOS / CSKH */}
            <button
              type="button"
              onClick={() => onOpenDirectMessaging(subweb_theme?.hotline, shop_name)}
              className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-bold"
              title="Nhắn tin với Shop"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Nhắn Tiêu Dùng</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-2.5 bg-white text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer font-black shadow-md shrink-0 flex items-center gap-1 text-xs"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-indigo-600" />
              {cartCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 3. STORE HERO BANNER & WELCOME NOTICE */}
      <section className="bg-white border-b border-gray-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="space-y-2 text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-extrabold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gian Hàng Chuẩn O2O • Đặt Hàng Trực Tiếp</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                {subweb_theme?.welcome_message || `Chào mừng bạn đến với Gian Hàng ${shop_name}!`}
              </h2>

              <p className="text-xs text-slate-300 font-medium max-w-xl">
                Cung cấp sản phẩm chính hãng, hỗ trợ giao hàng tận nơi và khách đến quầy lấy hàng 1-chạm.
              </p>
            </div>

            {/* Google Maps Location Button */}
            {subweb_theme?.google_maps_url && (
              <a
                href={subweb_theme.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black transition flex items-center gap-2 shadow-md shrink-0 cursor-pointer no-underline group"
              >
                <MapPin className="w-4 h-4 text-white animate-bounce" />
                <span>Vị Trí Google Maps Quầy Gian Hàng ➔</span>
              </a>
            )}

          </div>
        </div>
      </section>

      {/* 4. ISOLATED PRODUCT SEARCH & CATEGORY FILTER */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 space-y-6">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs">
          
          {/* Internal Shop Product Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Tìm sản phẩm tại ${shop_name}...`}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Shop Categories Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất Cả ({shopProducts.length})
            </button>

            {shopCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* 5. ISOLATED PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-6 space-y-3">
            <Store className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-extrabold text-gray-800">Chưa tìm thấy sản phẩm nào</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Gian hàng hiện chưa cập nhật sản phẩm thuộc danh mục này hoặc từ khóa tìm kiếm không khớp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onOpenProductDetail}
              />
            ))}
          </div>
        )}

      </main>

      {/* 6. SUB-STOREFRONT FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-10 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-bold text-gray-800">
            © {new Date().getFullYear()} Gian Hàng {shop_name} • Web Con Độc Lập PWA
          </p>
          <p className="text-[11px] text-gray-400">
            Vận hành trên nền tảng Thương mại Điện tử Siêu Tiện Ích Platform (sieutienich.vn)
          </p>
        </div>
      </footer>

    </div>
  );
};
