import React from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
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
    return `${Number(price).toLocaleString('vi-VN')} đ`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={product.img} 
          alt={product.name} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
          }}
        />
        <div className="absolute top-3 left-3 max-w-[85%]">
          <span className="inline-block px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider shadow-sm border border-indigo-100 truncate max-w-full">
            {getCategoryBadge(product.category)}
          </span>
        </div>

        <button
          onClick={() => deleteProduct(product.id)}
          title="Xóa mục tiện ích này"
          className="absolute top-3 right-3 p-1.5 bg-white/80 hover:bg-rose-500 text-gray-400 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-rose-600 font-extrabold text-sm sm:text-base">
            {formatPrice(product.price, product.category)}
          </span>
          <button 
            onClick={handleAddToCart} 
            className={`p-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-1 ${
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
        </div>
      </div>
    </div>
  );
};
