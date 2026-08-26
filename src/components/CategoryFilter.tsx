import React from 'react';
import type { Category } from '../types';
import { useShop } from '../context/ShopContext';
import { 
  LayoutGrid, 
  Store, 
  Shirt, 
  Utensils, 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  Home, 
  Wrench, 
  Briefcase, 
  Landmark 
} from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, filteredProducts } = useShop();

  const categories: { id: Category; name: string; icon: React.ReactNode }[] = [
    { id: 'all', name: 'Tất cả', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'rental', name: 'Shop cho thuê', icon: <Store className="w-4 h-4" /> },
    { id: 'fashion', name: 'Shop Quần áo', icon: <Shirt className="w-4 h-4" /> },
    { id: 'food', name: 'Đồ ăn - Đồ uống', icon: <Utensils className="w-4 h-4" /> },
    { id: 'spa', name: 'Spa làm đẹp', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'groceries', name: 'Nhu yếu phẩm', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'transport', name: 'Vận tải', icon: <Truck className="w-4 h-4" /> },
    { id: 'lodging', name: 'Lưu trú', icon: <Home className="w-4 h-4" /> },
    { id: 'home_services', name: 'Dịch vụ gia đình & sửa chữa', icon: <Wrench className="w-4 h-4" /> },
    { id: 'jobs', name: 'Việc làm', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'public_utilities', name: 'Tiện ích công cộng', icon: <Landmark className="w-4 h-4" /> },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-indigo-200">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap border shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.02]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
        <span>Danh mục dịch vụ tiện ích phong phú</span>
        <span>
          Hiển thị <strong className="text-gray-900 font-bold">{(filteredProducts || []).length}</strong> kết quả
        </span>
      </div>
    </div>
  );
};
