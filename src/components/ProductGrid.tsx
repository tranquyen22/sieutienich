import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { PackageSearch } from 'lucide-react';
import type { Product } from '../types';

interface ProductGridProps {
  onSelectProduct?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onSelectProduct }) => {
  const { filteredProducts, loadingProducts, searchQuery } = useShop();

  if (loadingProducts) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-72 w-full"></div>
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center my-8 shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <PackageSearch className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Không tìm thấy sản phẩm hoặc tiện ích nào</h3>
        <p className="text-gray-500 text-sm mt-1">
          {searchQuery 
            ? `Không có kết quả cho từ khóa "${searchQuery}".` 
            : 'Khu vực hoặc danh mục này hiện chưa có tiện ích phù hợp.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
      ))}
    </div>
  );
};
