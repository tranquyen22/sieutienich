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
      icon: <Store className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-blue-50/80 border-blue-100 hover:bg-blue-100/80',
      textColor: 'text-blue-600',
    },
    {
      id: 'fashion',
      name: 'Shop Quần áo',
      category: 'fashion',
      icon: <Shirt className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-pink-50/80 border-pink-100 hover:bg-pink-100/80',
      textColor: 'text-pink-600',
    },
    {
      id: 'food',
      name: 'Đồ ăn - Đồ uống',
      category: 'food',
      icon: <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-orange-50/80 border-orange-100 hover:bg-orange-100/80',
      textColor: 'text-orange-600',
    },
    {
      id: 'spa',
      name: 'Spa làm đẹp',
      category: 'spa',
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-purple-50/80 border-purple-100 hover:bg-purple-100/80',
      textColor: 'text-purple-600',
    },
    {
      id: 'groceries',
      name: 'Nhu yếu phẩm',
      category: 'groceries',
      icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-emerald-50/80 border-emerald-100 hover:bg-emerald-100/80',
      textColor: 'text-emerald-600',
    },
    {
      id: 'transport',
      name: 'Vận tải',
      category: 'transport',
      icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-indigo-50/80 border-indigo-100 hover:bg-indigo-100/80',
      textColor: 'text-indigo-600',
    },
    {
      id: 'lodging',
      name: 'Lưu trú',
      category: 'lodging',
      icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-rose-50/80 border-rose-100 hover:bg-rose-100/80',
      textColor: 'text-rose-600',
    },
    {
      id: 'home_services',
      name: 'Gia đình & Sửa chữa',
      category: 'home_services',
      icon: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-amber-50/80 border-amber-100 hover:bg-amber-100/80',
      textColor: 'text-amber-600',
    },
    // Extended Items (Row 3 - shown on expand)
    {
      id: 'jobs',
      name: 'Việc làm',
      category: 'jobs',
      icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-teal-50/80 border-teal-100 hover:bg-teal-100/80',
      textColor: 'text-teal-600',
    },
    {
      id: 'public_utilities',
      name: 'Tiện ích công cộng',
      category: 'public_utilities',
      icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-cyan-50/80 border-cyan-100 hover:bg-cyan-100/80',
      textColor: 'text-cyan-600',
    },
    {
      id: 'post_new',
      name: 'Đăng tiện ích',
      action: onOpenAddProductModal,
      icon: <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-violet-50/80 border-violet-100 hover:bg-violet-100/80',
      textColor: 'text-violet-600',
    },
    {
      id: 'cart',
      name: 'Mục đã lưu',
      action: () => setIsCartOpen(true),
      icon: <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />,
      bgColor: 'bg-rose-50/80 border-rose-100 hover:bg-rose-100/80',
      textColor: 'text-rose-600',
    },
  ];

  // Display initial 8 items (2 rows x 4 cols) or all 12 items when expanded
  const visibleUtilities = isExpanded ? utilities : utilities.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="bg-white rounded-3xl py-4 px-5 sm:py-5 sm:px-6 shadow-sm border border-gray-100/80">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-gray-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-4.5 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-full inline-block"></span>
              Dịch vụ & Tiện ích Nổi bật
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Truy cập nhanh 1 chạm (2 Hàng x 4 Cột)
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/80 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 text-xs font-bold rounded-xl transition-all cursor-pointer shrink-0 border border-gray-200 hover:border-indigo-200 shadow-xs"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng (Xem tất cả)'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 2 Rows x 4 Columns Grid - Compact & Sleek Footprint */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 transition-all duration-300">
          {visibleUtilities.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.category, item.action)}
              className="flex flex-col items-center justify-center py-3.5 px-3 sm:py-4 sm:px-4 bg-gradient-to-b from-gray-50/80 to-white hover:from-white hover:to-indigo-50/30 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-all duration-200 group hover:shadow-md hover:-translate-y-0.5 cursor-pointer text-center min-w-0"
            >
              <div className={`w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center border shadow-xs ${item.bgColor} ${item.textColor} group-hover:scale-105 transition-transform duration-200 mb-2 shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight w-full truncate px-0.5">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
