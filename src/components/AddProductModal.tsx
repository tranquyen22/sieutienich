import React, { useState, useMemo } from 'react';
import { X, PlusCircle, Image as ImageIcon, Tag, DollarSign, FileText, Loader2, Phone, ShieldCheck, AlertTriangle, MapPin, Lock, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { VIETNAM_PROVINCES } from '../data/vietnamLocations';
import type { Category } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, products } = useShop();
  const { user, merchantApplication } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('rental');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [district, setDistrict] = useState('Cầu Giấy');
  
  // Image URLs list up to max limit (3 for unverified, 6 for verified)
  const [images, setImages] = useState<string[]>(['']);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isVerifiedShop = merchantApplication?.status === 'approved';

  // Rule 1: Product posting limit (10 for unverified, Unlimited for verified)
  const userProductsCount = products.filter((p) => p.user_id === user?.id).length;
  const maxProductsLimit = isVerifiedShop ? Infinity : 10;
  const isProductLimitReached = userProductsCount >= maxProductsLimit;

  // Rule 2: Max images count per product (3 for unverified, 6 for verified)
  const maxImagesLimit = isVerifiedShop ? 6 : 3;

  const isLodging = category === 'lodging';
  const isTransport = category === 'transport';

  const currentDistricts = useMemo(() => {
    const found = VIETNAM_PROVINCES.find((p) => p.id === province);
    if (found) {
      return found.districts.filter((d) => !d.includes('Tất cả'));
    }
    return ['Trung tâm'];
  }, [province]);

  const handleAddImageField = () => {
    if (images.length < maxImagesLimit) {
      setImages([...images, '']);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleRemoveImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isProductLimitReached) {
      setErrorMsg(`⚠️ Shop chưa xác minh chỉ được đăng tối đa 10 sản phẩm (Hiện tại: ${userProductsCount}/10). Vui lòng xác minh Cửa hàng để đăng không giới hạn!`);
      return;
    }

    if (!name || price === '') return;

    if (isLodging && !licenseNo.trim()) {
      setErrorMsg('Vui lòng nhập Số Giấy phép kinh doanh (GPKD) để đăng gian hàng lưu trú.');
      return;
    }

    if ((isLodging || isTransport) && !phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại liên hệ trực tiếp.');
      return;
    }

    setLoading(true);

    const firstImage = images[0] || (isLodging 
      ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80' 
      : isTransport
      ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&q=80'
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80');

    const { error } = await addProduct({
      name,
      category,
      price: parseFloat(price) || 0,
      img: firstImage,
      description,
      isLicensed: isVerifiedShop,
      isTQStore: isVerifiedShop,
      licenseNo: licenseNo.trim() || undefined,
      phone: phone.trim() || undefined,
      province,
      district,
      locationName: `${district}, ${province}`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-wider mb-1">
            <PlusCircle className="w-4 h-4 text-indigo-300" />
            <span>Đăng Sản Phẩm / Dịch Vụ Mới</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Đăng Tiện Ích Lên Siêu Thị TQ
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Quy định phân quyền hiển thị minh bạch cho Cửa hàng Chưa xác minh & Đã xác minh.
          </p>
        </div>

        {/* COMPARISON MATRIX BOX */}
        <div className="bg-slate-900 text-white p-3 text-[11px] shrink-0 space-y-1.5">
          <div className="flex items-center justify-between font-extrabold text-slate-300 border-b border-slate-700 pb-1">
            <span>Trạng thái shop của bạn:</span>
            {isVerifiedShop ? (
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-black flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>✓ ĐÃ XÁC MINH (Đăng không giới hạn • Tối đa 6 ảnh)</span>
              </span>
            ) : (
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-black flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>🔒 CHƯA XÁC MINH (Đăng tối đa 10 sản phẩm • Tối đa 3 ảnh)</span>
              </span>
            )}
          </div>

          {/* 9 Rules Matrix Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] text-slate-300">
            <div className="bg-slate-800 p-1 rounded">
              <span className="text-gray-400 block">Số sp đăng:</span>
              <strong className={isVerifiedShop ? 'text-emerald-400' : 'text-amber-400'}>
                {userProductsCount}/{maxProductsLimit === Infinity ? '∞' : maxProductsLimit} sp
              </strong>
            </div>
            <div className="bg-slate-800 p-1 rounded">
              <span className="text-gray-400 block">Ảnh mỗi sp:</span>
              <strong className="text-indigo-300">Tối đa {maxImagesLimit} ảnh</strong>
            </div>
            <div className="bg-slate-800 p-1 rounded">
              <span className="text-gray-400 block">Đánh giá & Xu:</span>
              <strong className={isVerifiedShop ? 'text-emerald-400' : 'text-gray-400'}>
                {isVerifiedShop ? '✓ Có đánh giá & Xu' : '× Không dùng Xu'}
              </strong>
            </div>
            <div className="bg-slate-800 p-1 rounded">
              <span className="text-gray-400 block">Phí sàn:</span>
              <strong className={isVerifiedShop ? 'text-emerald-400' : 'text-amber-300'}>
                {isVerifiedShop ? '3% (Có phí)' : '0% (Không thu phí)'}
              </strong>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isProductLimitReached && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 font-bold">
              ⚠️ Bạn đã đạt giới hạn 10 sản phẩm của Shop chưa xác minh. Hãy nộp hồ sơ xác minh cửa hàng để mở đăng không giới hạn!
            </div>
          )}

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              <span>Danh mục dịch vụ</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="rental">Shop cho thuê mặt bằng / đồ đạc</option>
              <option value="fashion">Shop Quần áo & Thời trang</option>
              <option value="food">Đồ ăn & Đồ uống</option>
              <option value="spa">Spa & Làm đẹp</option>
              <option value="groceries">Nhu yếu phẩm & Tạp hóa</option>
              <option value="transport">Dịch vụ Vận tải & Chuyển nhà</option>
              <option value="lodging">Khách sạn & Lưu trú</option>
              <option value="home_services">Gia đình & Sửa chữa</option>
              <option value="jobs">Tuyển dụng việc làm</option>
              <option value="public_utilities">Tiện ích công cộng</option>
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Tên tiện ích / Sản phẩm (*)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Gói gội đầu dưỡng sinh thảo dược Khoái Châu"
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Price & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                <span>Giá niêm yết (VNĐ) (*)</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0 = Miễn phí"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Số điện thoại liên hệ direct (*)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0988.xxx.xxx"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rule 2: Multi-image URLs (Max 3 for unverified, Max 6 for verified) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Link hình ảnh sản phẩm (Tối đa {maxImagesLimit} ảnh cho {isVerifiedShop ? 'Shop đã xác minh' : 'Shop chưa xác minh'})</span>
              </label>
              {images.length < maxImagesLimit && (
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Thêm ảnh ({images.length}/{maxImagesLimit})</span>
                </button>
              )}
            </div>

            {images.map((imgUrl, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`https://images.unsplash.com/... (Ảnh ${idx + 1})`}
                  className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Location selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tỉnh / Thành phố</span>
              </label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict('Trung tâm');
                }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Quận / Huyện</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500"
              >
                {currentDistricts.map((d, i) => (
                  <option key={i} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Business License field for Lodging */}
          {isLodging && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Số Giấy Phép Kinh Doanh (GPKD) (*)</span>
              </label>
              <input
                type="text"
                required
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="VD: GPKD-LODGING-9912/HN"
                className="w-full px-3.5 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mô tả thông tin chi tiết</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập thông tin chi tiết dịch vụ, tiện ích đi kèm, khuyến mãi..."
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Form CTA */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            
            <button
              type="submit"
              disabled={loading || isProductLimitReached}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đăng tin...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Hoàn tất Đăng sản phẩm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
