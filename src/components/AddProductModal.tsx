import React, { useState } from 'react';
import { X, PlusCircle, Image as ImageIcon, Tag, DollarSign, FileText, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Category } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('rental');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '') return;

    setLoading(true);

    const imageUrl = img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';

    await addProduct({
      name,
      category,
      price: Number(price),
      img: imageUrl,
      description,
    });

    setLoading(false);
    setName('');
    setPrice('');
    setImg('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-gray-900">Đăng tiện ích / dịch vụ mới</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên dịch vụ / tiện ích / sản phẩm *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Cho thuê xe tự lái 4 chỗ / Spa da mặt"
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Danh mục *</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="rental">Shop cho thuê</option>
                  <option value="fashion">Shop Quần áo</option>
                  <option value="food">Đồ ăn - Đồ uống</option>
                  <option value="spa">Spa làm đẹp</option>
                  <option value="groceries">Nhu yếu phẩm</option>
                  <option value="transport">Vận tải</option>
                  <option value="lodging">Lưu trú</option>
                  <option value="home_services">Dịch vụ gia đình & sửa chữa</option>
                  <option value="jobs">Việc làm</option>
                  <option value="public_utilities">Tiện ích công cộng</option>
                </select>
                <Tag className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giá / Lương (VNĐ) *</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 (nếu Miễn phí)"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL hình ảnh (Unsplash / Online Image)</label>
            <div className="relative">
              <input 
                type="url" 
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả ngắn</label>
            <div className="relative">
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Thông tin liên hệ, chi tiết dịch vụ..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đăng lên Supabase...</span>
              </>
            ) : (
              <span>Đăng ngay</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
