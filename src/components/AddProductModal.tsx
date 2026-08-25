import React, { useState } from 'react';
import { X, PlusCircle, Image as ImageIcon, Tag, DollarSign, FileText, Loader2, Phone, ShieldCheck, AlertTriangle } from 'lucide-react';
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
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [contactName, setContactName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLodging = category === 'lodging';
  const isTransport = category === 'transport';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

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

    const imageUrl = img || (isLodging 
      ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80' 
      : isTransport 
        ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80'
        : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80');

    await addProduct({
      name,
      category,
      price: Math.max(0, Number(price)),
      img: imageUrl,
      description,
      phone: phone || undefined,
      licenseNo: isLodging ? (licenseNo.startsWith('GPKD:') ? licenseNo : `GPKD: ${licenseNo}`) : undefined,
      isLicensed: isLodging ? true : undefined,
      contactName: contactName || undefined,
    });

    setLoading(false);
    setName('');
    setPrice('');
    setImg('');
    setDescription('');
    setPhone('');
    setLicenseNo('');
    setContactName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gray-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 shrink-0 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <PlusCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">Đăng tiện ích / dịch vụ mới</h2>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 min-w-0">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 break-words">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tên dịch vụ / tiện ích / sản phẩm *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isLodging ? "VD: Homestay OceanPark Villa" : isTransport ? "VD: Xe ba gác chuyển đồ nội khu" : "VD: Cho thuê xe tự lái / Spa da mặt"}
              className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition truncate box-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Danh mục *</label>
              <div className="relative min-w-0">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 bg-white truncate box-border"
                >
                  <option value="rental">Shop cho thuê</option>
                  <option value="fashion">Shop Quần áo</option>
                  <option value="food">Đồ ăn - Đồ uống</option>
                  <option value="spa">Spa làm đẹp</option>
                  <option value="groceries">Nhu yếu phẩm</option>
                  <option value="transport">Vận tải (Danh bạ)</option>
                  <option value="lodging">Lưu trú (Có GPKD)</option>
                  <option value="home_services">Gia đình & sửa chữa</option>
                  <option value="jobs">Việc làm</option>
                  <option value="public_utilities">Tiện ích công cộng</option>
                </select>
                <Tag className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 shrink-0" />
              </div>
            </div>

            <div className="min-w-0">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Giá / Cước (VNĐ) *</label>
              <div className="relative min-w-0">
                <input 
                  type="number" 
                  required
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 (nếu Miễn phí)"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 truncate box-border"
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5 shrink-0" />
              </div>
            </div>
          </div>

          {/* Compliance Info Banners */}
          {isLodging && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1 min-w-0">
              <div className="font-bold flex items-center gap-1 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Yêu cầu Giấy phép kinh doanh Lưu trú</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-snug">
                Sàn chỉ hiển thị quảng bá. Cơ sở phải có GPKD đầy đủ. Đặt phòng liên hệ trực tiếp chủ nhà.
              </p>
            </div>
          )}

          {isTransport && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 min-w-0">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quy định Danh bạ Vận tải</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-snug">
                Danh bạ kết nối điện thoại trực tiếp. Sàn KHÔNG thu cước vận chuyển hộ.
              </p>
            </div>
          )}

          {/* Mandatory Phone & License fields */}
          {(isLodging || isTransport) && (
            <div className="space-y-3 pt-1 border-t border-gray-100 min-w-0">
              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại liên hệ trực tiếp *
                </label>
                <div className="relative min-w-0">
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="VD: 0988.123.456"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 truncate box-border"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 shrink-0" />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {isLodging ? "Tên chủ cơ sở / Lễ tân" : "Tên nhà xe / Tên tài xế xe ba gác"}
                </label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={isLodging ? "VD: Lễ tân Sunshine Hotel" : "VD: Chú Hùng (Chủ xe Ba gác)"}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 truncate box-border"
                />
              </div>

              {isLodging && (
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">
                    Số Giấy phép kinh doanh (GPKD) *
                  </label>
                  <div className="relative min-w-0">
                    <input 
                      type="text" 
                      required
                      value={licenseNo}
                      onChange={(e) => setLicenseNo(e.target.value)}
                      placeholder="VD: 0108928374"
                      className="w-full pl-9 pr-3 py-2 border border-emerald-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-emerald-50/20 truncate box-border"
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5 shrink-0" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-700 mb-1">URL hình ảnh (Unsplash / Online Image)</label>
            <div className="relative min-w-0">
              <input 
                type="url" 
                value={img}
                onChange={(e) => setImg(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 truncate box-border"
              />
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 shrink-0" />
            </div>
          </div>

          <div className="min-w-0">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mô tả chi tiết</label>
            <div className="relative min-w-0">
              <textarea 
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả thông tin chi tiết về tiện ích..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 resize-none box-border"
              />
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3 shrink-0" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 transition text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Đang đăng tin...</span>
              </>
            ) : (
              <span>Xác nhận đăng tin</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
