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
      icon: <Store className="w-6 h-6" />,
      bgColor: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      id: 'fashion',
      name: 'Shop Quần áo',
      category: 'fashion',
      icon: <Shirt className="w-6 h-6" />,
      bgColor: 'bg-pink-50 border-pink-100 hover:bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      id: 'food',
      name: 'Đồ ăn - Đồ uống',
      category: 'food',
      icon: <Utensils className="w-6 h-6" />,
      bgColor: 'bg-orange-50 border-orange-100 hover:bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      id: 'spa',
      name: 'Spa làm đẹp',
      category: 'spa',
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      id: 'groceries',
      name: 'Nhu yếu phẩm',
      category: 'groceries',
      icon: <ShoppingBag className="w-6 h-6" />,
      bgColor: 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100',
      textColor: 'text-emerald-600',
    },
    {
      id: 'transport',
      name: 'Vận tải',
      category: 'transport',
      icon: <Truck className="w-6 h-6" />,
      bgColor: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
      textColor: 'text-indigo-600',
    },
    {
      id: 'lodging',
      name: 'Lưu trú',
      category: 'lodging',
      icon: <Home className="w-6 h-6" />,
      bgColor: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
      textColor: 'text-rose-600',
    },
    {
      id: 'home_services',
      name: 'Gia đình & Sửa chữa',
      category: 'home_services',
      icon: <Wrench className="w-6 h-6" />,
      bgColor: 'bg-amber-50 border-amber-100 hover:bg-amber-100',
      textColor: 'text-amber-600',
    },
    // Extended Items (Row 3 - shown on expand)
    {
      id: 'jobs',
      name: 'Việc làm',
      category: 'jobs',
      icon: <Briefcase className="w-6 h-6" />,
      bgColor: 'bg-teal-50 border-teal-100 hover:bg-teal-100',
      textColor: 'text-teal-600',
    },
    {
      id: 'public_utilities',
      name: 'Tiện ích công cộng',
      category: 'public_utilities',
      icon: <Landmark className="w-6 h-6" />,
      bgColor: 'bg-cyan-50 border-cyan-100 hover:bg-cyan-100',
      textColor: 'text-cyan-600',
    },
    {
      id: 'post_new',
      name: 'Đăng tiện ích',
      action: onOpenAddProductModal,
      icon: <PlusCircle className="w-6 h-6" />,
      bgColor: 'bg-violet-50 border-violet-100 hover:bg-violet-100',
      textColor: 'text-violet-600',
    },
    {
      id: 'cart',
      name: 'Mục đã lưu',
      action: () => setIsCartOpen(true),
      icon: <Bookmark className="w-6 h-6" />,
      bgColor: 'bg-rose-50 border-rose-100 hover:bg-rose-100',
      textColor: 'text-rose-600',
    },
  ];

  // Display initial 8 items (2 rows x 4 cols) or all 12 items when expanded
  const visibleUtilities = isExpanded ? utilities : utilities.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-5 bg-indigo-600 rounded-full inline-block"></span>
              Dịch vụ & Tiện ích Nổi bật
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Truy cập nhanh các dịch vụ thiết yếu 2 hàng x 4 cột
            </p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 text-xs font-bold rounded-xl transition cursor-pointer shrink-0 border border-gray-200 hover:border-indigo-200"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Mở rộng (Xem tất cả)'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 2 Rows x 4 Columns Grid (8 items initial, 12 items on expand) */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 transition-all duration-300">
          {visibleUtilities.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.category, item.action)}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gray-50/60 hover:bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 transition-all duration-200 group hover:shadow-md cursor-pointer text-center min-w-0"
            >
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border ${item.bgColor} ${item.textColor} group-hover:scale-110 transition-transform duration-300 shadow-xs mb-2 shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight w-full truncate">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
