import React, { useState } from 'react';
import { 
  Store, 
  Shirt, 
  Utensils, 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  Home, 
  Wrench, 
  Briefcase, 
  Landmark, 
  ChevronDown, 
  ChevronUp,
  PlusCircle,
  Bookmark
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Category } from '../types';

interface QuickUtilityGridProps {
  onOpenAddProductModal: () => void;
}

interface UtilityItem {
  id: string;
  name: string;
  category?: Category;
  action?: () => void;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export const QuickUtilityGrid: React.FC<QuickUtilityGridProps> = ({ onOpenAddProductModal }) => {
  const { setSelectedCategory, setIsCartOpen } = useShop();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleItemClick = (cat?: Category, customAction?: () => void) => {
    if (customAction) {
      customAction();
      return;
    }
    if (cat) {
      setSelectedCategory(cat);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const utilities: UtilityItem[] = [
    {
      id: 'rental',
      name: 'Shop cho thuê',
      category: 'rental',
      icon: <Store className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-blue-50/80 border-blue-100 hover:bg-blue-100/80',
      textColor: 'text-blue-600',
    },
    {
      id: 'fashion',
      name: 'Shop Quần áo',
      category: 'fashion',
      icon: <Shirt className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-pink-50/80 border-pink-100 hover:bg-pink-100/80',
      textColor: 'text-pink-600',
    },
    {
      id: 'food',
      name: 'Đồ ăn - Đồ uống',
      category: 'food',
      icon: <Utensils className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-orange-50/80 border-orange-100 hover:bg-orange-100/80',
      textColor: 'text-orange-600',
    },
    {
      id: 'spa',
      name: 'Spa làm đẹp',
      category: 'spa',
      icon: <Sparkles className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-purple-50/80 border-purple-100 hover:bg-purple-100/80',
      textColor: 'text-purple-600',
    },
    {
      id: 'groceries',
      name: 'Nhu yếu phẩm',
      category: 'groceries',
      icon: <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-emerald-50/80 border-emerald-100 hover:bg-emerald-100/80',
      textColor: 'text-emerald-600',
    },
    {
      id: 'transport',
      name: 'Vận tải',
      category: 'transport',
      icon: <Truck className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-indigo-50/80 border-indigo-100 hover:bg-indigo-100/80',
      textColor: 'text-indigo-600',
    },
    {
      id: 'lodging',
      name: 'Lưu trú',
      category: 'lodging',
      icon: <Home className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-rose-50/80 border-rose-100 hover:bg-rose-100/80',
      textColor: 'text-rose-600',
    },
    {
      id: 'home_services',
      name: 'Gia đình & Sửa chữa',
      category: 'home_services',
      icon: <Wrench className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-amber-50/80 border-amber-100 hover:bg-amber-100/80',
      textColor: 'text-amber-600',
    },
    // Extended Items (Row 3 - shown on expand)
    {
      id: 'jobs',
      name: 'Việc làm',
      category: 'jobs',
      icon: <Briefcase className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-teal-50/80 border-teal-100 hover:bg-teal-100/80',
      textColor: 'text-teal-600',
    },
    {
      id: 'public_utilities',
      name: 'Tiện ích công cộng',
      category: 'public_utilities',
      icon: <Landmark className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-cyan-50/80 border-cyan-100 hover:bg-cyan-100/80',
      textColor: 'text-cyan-600',
    },
    {
      id: 'post_new',
      name: 'Đăng tiện ích',
      action: onOpenAddProductModal,
      icon: <PlusCircle className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-violet-50/80 border-violet-100 hover:bg-violet-100/80',
      textColor: 'text-violet-600',
    },
    {
      id: 'cart',
      name: 'Mục đã lưu',
      action: () => setIsCartOpen(true),
      icon: <Bookmark className="w-7 h-7 sm:w-8 sm:h-8" />,
      bgColor: 'bg-rose-50/80 border-rose-100 hover:bg-rose-100/80',
      textColor: 'text-rose-600',
    },
  ];

  // Display initial 8 items (2 rows x 4 cols) or all 12 items when expanded
  const visibleUtilities = isExpanded ? utilities : utilities.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100/80">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-full inline-block"></span>
              Dịch vụ & Tiện ích Nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Truy cập nhanh các dịch vụ thiết yếu với không gian thoáng đãng (2 Hàng x 4 Cột)
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100/80 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer shrink-0 border border-gray-200 hover:border-indigo-200 shadow-xs"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng (Xem tất cả)'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 2 Rows x 4 Columns Grid with Spacious Gaps & Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transition-all duration-300">
          {visibleUtilities.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.category, item.action)}
              className="flex flex-col items-center justify-center py-6 px-4 sm:py-8 sm:px-6 bg-gradient-to-b from-gray-50/80 to-white hover:from-white hover:to-indigo-50/30 rounded-3xl border border-gray-100 hover:border-indigo-200 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 cursor-pointer text-center min-w-0"
            >
              <div className={`w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center border shadow-xs ${item.bgColor} ${item.textColor} group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 mb-3 sm:mb-4 shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug w-full truncate px-1">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
