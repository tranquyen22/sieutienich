import React, { useState, useMemo } from 'react';
import { 
  X, PlusCircle, Loader2, ShieldCheck, AlertTriangle, Lock, Sparkles, Sliders
} from 'lucide-react';
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
  const [licenseNo] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [district, setDistrict] = useState('Cầu Giấy');
  
  // DYNAMIC INDUSTRY-SPECIFIC FIELDS STATES
  // 1. Fashion Fields
  const [fashionSizes, setFashionSizes] = useState<string[]>(['M', 'L']);
  const [fashionColors, setFashionColors] = useState('Đen, Trắng, Kem');
  const [fashionMaterial, setFashionMaterial] = useState('Cotton 100% thoáng mát');
  const [fashionGender, setFashionGender] = useState('Unisex');

  // 2. Food & Drinks Fields
  const [foodPortion, setFoodPortion] = useState('Suất lớn (2 người ăn)');
  const [foodToppings, setFoodToppings] = useState('Trân châu phô mai, Thạch dừa');
  const [foodSpiceLevel, setFoodSpiceLevel] = useState('Cay vừa');
  const [foodShelfLife, setFoodShelfLife] = useState('Dùng tốt nhất trong ngày (24 giờ)');

  // 3. Lodging Fields
  const [lodgingRoomType, setLodgingRoomType] = useState('Studio Căn hộ ban công');
  const [lodgingMaxGuests, setLodgingMaxGuests] = useState('2 người');
  const [lodgingCheckinTimes, setLodgingCheckinTimes] = useState('Nhận phòng 14:00 - Trả phòng 12:00');
  const [lodgingAmenities, setLodgingAmenities] = useState<string[]>(['Điều hòa', 'Wifi 5G', 'Tủ lạnh']);

  // 4. Rental Fields
  const [rentalUnit, setRentalUnit] = useState('Theo ngày (đ/ngày)');
  const [rentalDeposit, setRentalDeposit] = useState('500000');
  const [rentalGrade, setRentalGrade] = useState('Mới 99% (Hoạt động hoàn hảo)');

  // 5. Transport Fields
  const [transportVehicleType, setTransportVehicleType] = useState('Xe 7 chỗ chỗ rộng');
  const [transportScope, setTransportScope] = useState('Nội tỉnh & Đi các Tỉnh');
  const [transportHasDriver, setTransportHasDriver] = useState('Có tài xế lịch sự đi kèm');

  // 6. Jobs Fields
  const [jobSalaryRange, setJobSalaryRange] = useState('8 - 12 Triệu/Tháng');
  const [jobWorkType, setJobWorkType] = useState('Toàn thời gian (Full-time)');
  const [jobExperience, setJobExperience] = useState('Không yêu cầu kinh nghiệm (Được đào tạo)');

  // Image URLs list up to max limit (3 for unverified, 6 for verified)
  const [images, setImages] = useState<string[]>(['']);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentDistricts = useMemo(() => {
    const found = VIETNAM_PROVINCES.find((p) => p.id === province);
    if (found) {
      return found.districts.filter((d) => !d.includes('Tất cả'));
    }
    return ['Trung tâm'];
  }, [province]);

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

  const handleLocalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file, i) => {
      const targetIdx = index + i;
      if (targetIdx < maxImagesLimit) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => {
              const updated = [...prev];
              while (updated.length <= targetIdx) updated.push('');
              updated[targetIdx] = event.target!.result as string;
              return updated;
            });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImageField = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleToggleFashionSize = (sz: string) => {
    if (fashionSizes.includes(sz)) {
      setFashionSizes(fashionSizes.filter(s => s !== sz));
    } else {
      setFashionSizes([...fashionSizes, sz]);
    }
  };

  const handleToggleLodgingAmenity = (am: string) => {
    if (lodgingAmenities.includes(am)) {
      setLodgingAmenities(lodgingAmenities.filter(a => a !== am));
    } else {
      setLodgingAmenities([...lodgingAmenities, am]);
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

    // Build dynamic description payload from industry-specific fields
    let dynamicDescText = description;

    if (category === 'fashion') {
      dynamicDescText += `\n\n📌 THÔNG TIN THỜI TRANG:\n• Size có sẵn: ${fashionSizes.join(', ')}\n• Màu sắc: ${fashionColors}\n• Chất liệu: ${fashionMaterial}\n• Dành cho: ${fashionGender}`;
    } else if (category === 'food' || category === 'groceries') {
      dynamicDescText += `\n\n📌 THÔNG TIN ẨM THỰC / NÔNG SẢN:\n• Khẩu phần: ${foodPortion}\n• Topping/Đi kèm: ${foodToppings}\n• Hương vị: ${foodSpiceLevel}\n• Hạn dùng: ${foodShelfLife}`;
    } else if (category === 'lodging') {
      dynamicDescText += `\n\n📌 THÔNG TIN PHÒNG LƯU TRÚ:\n• Loại phòng: ${lodgingRoomType}\n• Số khách tối đa: ${lodgingMaxGuests}\n• Giờ Checkin: ${lodgingCheckinTimes}\n• Tiện ích: ${lodgingAmenities.join(', ')}`;
    } else if (category === 'rental') {
      dynamicDescText += `\n\n📌 THÔNG TIN CHO THUÊ:\n• Tính giá: ${rentalUnit}\n• Tiền cọc: ${Number(rentalDeposit).toLocaleString()} đ\n• Tình trạng đồ: ${rentalGrade}`;
    } else if (category === 'transport') {
      dynamicDescText += `\n\n📌 THÔNG TIN VẬN TẢI XE:\n• Loại xe: ${transportVehicleType}\n• Phạm vi: ${transportScope}\n• Tài xế: ${transportHasDriver}`;
    } else if (category === 'jobs') {
      dynamicDescText += `\n\n📌 THÔNG TIN TUYỂN DỤNG:\n• Mức lương: ${jobSalaryRange}\n• Hình thức: ${jobWorkType}\n• Yêu cầu: ${jobExperience}`;
    }

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
      description: dynamicDescText,
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
      alert(`🎉 Đã đăng bài thành công lên Ngành hàng [${category.toUpperCase()}]! Các trường đặc thù của ngành hàng đã được tự động lưu.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-900 to-purple-800 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-wider mb-1">
            <PlusCircle className="w-4 h-4 text-indigo-300" />
            <span>Đăng Sản Phẩm & Form Tự Đổi Theo Ngành Hàng</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Đăng Sản Phẩm / Dịch Vụ Mới
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Chọn Ngành hàng ➔ Form tự động xuất hiện các trường đặc thù tương ứng.
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
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs font-medium">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. PRODUCT NAME & CATEGORY (SELECTING CATEGORY DYNAMICALLY CHANGES THE FORM BELOW) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-gray-900 mb-1">1. Tên Sản Phẩm / Tiện Ích *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Căn hộ Studio Homestay ban công Khoái Châu"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-black text-indigo-900 mb-1 flex items-center gap-1">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>2. Chọn Ngành Hàng (Form sẽ tự thay đổi) *</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-2.5 bg-indigo-50 border border-indigo-300 rounded-xl font-black text-xs text-indigo-950 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="fashion">👗 1. Thời Trang & May Mặc (Size, Màu sắc, Chất liệu)</option>
                <option value="food">🍲 2. Đồ Ăn & Ẩm Thực (Khẩu phần, Topping, Độ cay)</option>
                <option value="groceries">🌾 3. Nông Sản & Nhu Yếu Phẩm (Đóng gói, Hạn dùng)</option>
                <option value="lodging">🏨 4. Lưu Trú & Homestay (Loại phòng, Khách max, Amenities)</option>
                <option value="rental">🏠 5. Cho Thuê Đồ & Kiot (Giá thuê, Tiền cọc, Tình trạng)</option>
                <option value="transport">🚗 6. Vận Tải & Xe Cộ (Loại xe, Phạm vi, Tài xế)</option>
                <option value="jobs">💼 7. Tuyển Dụng & Việc Làm (Lương, Hình thức, Kinh nghiệm)</option>
                <option value="spa">💆 8. Spa, Làm Đẹp & Sức Khỏe</option>
                <option value="home_services">🔧 9. Sửa Chữa & Tiện Ích Gia Đình</option>
                <option value="public_utilities">🏢 10. Danh Bạ Tiện Ích Công Cộng</option>
              </select>
            </div>
          </div>

          {/* ⚡ DYNAMIC FORM FIELDS CHANGED BY INDUSTRY CATEGORY ⚡ */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-indigo-50/80 border border-indigo-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950 border-b border-indigo-200/80 pb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Các Trường Đặc Thù Riêng Cho Ngành Hàng [{category.toUpperCase()}]:</span>
            </div>

            {/* DYNAMIC CASE 1: FASHION */}
            {category === 'fashion' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-extrabold text-gray-800 mb-1">Chọn danh sách Size có sẵn:</label>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL', 'Freesize'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleFashionSize(sz)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                          fashionSizes.includes(sz)
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {sz} {fashionSizes.includes(sz) ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Các màu sắc có sẵn:</label>
                    <input
                      type="text"
                      value={fashionColors}
                      onChange={(e) => setFashionColors(e.target.value)}
                      placeholder="Trắng, Đen, Kem"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Chất liệu vải:</label>
                    <input
                      type="text"
                      value={fashionMaterial}
                      onChange={(e) => setFashionMaterial(e.target.value)}
                      placeholder="Cotton 100%"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Dành cho giới tính:</label>
                    <select
                      value={fashionGender}
                      onChange={(e) => setFashionGender(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Unisex">Unisex (Cả nam & nữ)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 2: FOOD & GROCERIES */}
            {(category === 'food' || category === 'groceries') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Khẩu phần / Đóng gói:</label>
                  <input
                    type="text"
                    value={foodPortion}
                    onChange={(e) => setFoodPortion(e.target.value)}
                    placeholder="VD: Suất vừa, Suất 2 người..."
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Danh sách Topping / Ăn kèm:</label>
                  <input
                    type="text"
                    value={foodToppings}
                    onChange={(e) => setFoodToppings(e.target.value)}
                    placeholder="VD: Trân châu, Phô mai, Rau..."
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Khẩu vị / Độ cay:</label>
                  <select
                    value={foodSpiceLevel}
                    onChange={(e) => setFoodSpiceLevel(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Không cay">Không cay</option>
                    <option value="Cay vừa">Cay vừa</option>
                    <option value="Siêu cay">Siêu cay</option>
                    <option value="Món ăn nóng">Món ăn nóng</option>
                    <option value="Đồ uống lạnh">Đồ uống lạnh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Hạn sử dụng tốt nhất:</label>
                  <input
                    type="text"
                    value={foodShelfLife}
                    onChange={(e) => setFoodShelfLife(e.target.value)}
                    placeholder="Dùng trong ngày (24 giờ)"
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 3: LODGING */}
            {category === 'lodging' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Loại phòng:</label>
                    <select
                      value={lodgingRoomType}
                      onChange={(e) => setLodgingRoomType(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    >
                      <option value="Phòng đơn (1 giường)">Phòng đơn (1 giường)</option>
                      <option value="Phòng đôi (2 giường)">Phòng đôi (2 giường)</option>
                      <option value="Studio Căn hộ ban công">Studio Căn hộ ban công</option>
                      <option value="Villa Nguyên căn">Villa Nguyên căn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Số khách tối đa:</label>
                    <input
                      type="text"
                      value={lodgingMaxGuests}
                      onChange={(e) => setLodgingMaxGuests(e.target.value)}
                      placeholder="2 người"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Giờ Check-in / Check-out:</label>
                    <input
                      type="text"
                      value={lodgingCheckinTimes}
                      onChange={(e) => setLodgingCheckinTimes(e.target.value)}
                      placeholder="Checkin 14h - Checkout 12h"
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tiện ích phòng tắm & Giường:</label>
                  <div className="flex flex-wrap gap-2">
                    {['Điều hòa', 'Wifi 5G', 'Tủ lạnh', 'Bể bơi', 'Ban công', 'Bãi đỗ xe', 'Thang máy'].map((am) => (
                      <button
                        key={am}
                        type="button"
                        onClick={() => handleToggleLodgingAmenity(am)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer border ${
                          lodgingAmenities.includes(am)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                      >
                        {am} {lodgingAmenities.includes(am) ? '✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 4: RENTAL */}
            {category === 'rental' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tính giá thuê theo:</label>
                  <select
                    value={rentalUnit}
                    onChange={(e) => setRentalUnit(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Theo giờ (đ/giờ)">Theo giờ (đ/giờ)</option>
                    <option value="Theo ngày (đ/ngày)">Theo ngày (đ/ngày)</option>
                    <option value="Theo tháng (đ/tháng)">Theo tháng (đ/tháng)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tiền cọc cọc giữ đồ (đ):</label>
                  <input
                    type="number"
                    value={rentalDeposit}
                    onChange={(e) => setRentalDeposit(e.target.value)}
                    placeholder="500000"
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tình trạng đồ thuê:</label>
                  <select
                    value={rentalGrade}
                    onChange={(e) => setRentalGrade(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Mới 100%">Mới 100%</option>
                    <option value="Mới 99% (Hoạt động hoàn hảo)">Mới 99% (Hoạt động hoàn hảo)</option>
                    <option value="Đã qua sử dụng tốt">Đã qua sử dụng tốt</option>
                  </select>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 5: TRANSPORT */}
            {category === 'transport' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Loại xe vận tải:</label>
                  <select
                    value={transportVehicleType}
                    onChange={(e) => setTransportVehicleType(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Xe 4 chỗ">Xe 4 chỗ</option>
                    <option value="Xe 7 chỗ">Xe 7 chỗ</option>
                    <option value="Xe bán tải">Xe bán tải</option>
                    <option value="Xe tải 2 tấn">Xe tải 2 tấn</option>
                    <option value="Xe tải 5 tấn">Xe tải 5 tấn</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Phạm vi phục vụ:</label>
                  <select
                    value={transportScope}
                    onChange={(e) => setTransportScope(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Nội tỉnh Hưng Yên">Nội tỉnh Hưng Yên</option>
                    <option value="Nội tỉnh & Đi các Tỉnh">Nội tỉnh & Đi các Tỉnh</option>
                    <option value="Toàn quốc 24/7">Toàn quốc 24/7</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Kèm tài xế:</label>
                  <select
                    value={transportHasDriver}
                    onChange={(e) => setTransportHasDriver(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Có tài xế lịch sự đi kèm">Có tài xế lịch sự đi kèm</option>
                    <option value="Xe tự lái">Xe tự lái</option>
                  </select>
                </div>
              </div>
            )}

            {/* DYNAMIC CASE 6: JOBS */}
            {category === 'jobs' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Mức lương chi trả:</label>
                  <input
                    type="text"
                    value={jobSalaryRange}
                    onChange={(e) => setJobSalaryRange(e.target.value)}
                    placeholder="8 - 12 Triệu/Tháng"
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Hình thức làm việc:</label>
                  <select
                    value={jobWorkType}
                    onChange={(e) => setJobWorkType(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Toàn thời gian (Full-time)">Toàn thời gian (Full-time)</option>
                    <option value="Bán thời gian (Part-time)">Bán thời gian (Part-time)</option>
                    <option value="Làm tại nhà (Remote)">Làm tại nhà (Remote)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Kinh nghiệm yêu cầu:</label>
                  <select
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-xl font-bold"
                  >
                    <option value="Không yêu cầu kinh nghiệm (Được đào tạo)">Không yêu cầu kinh nghiệm</option>
                    <option value="Từ 1 năm kinh nghiệm">Từ 1 năm kinh nghiệm</option>
                    <option value="Từ 2 - 5 năm kinh nghiệm">Từ 2 - 5 năm kinh nghiệm</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* 3. PRICE & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-gray-900 mb-1">3. Giá Niêm Yết (VNĐ) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập 0 nếu miễn phí hoặc thương lượng"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-black text-gray-900 mb-1">
                4. Số Điện Thoại Liên Hệ {isLodging || isTransport ? '*' : ''}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 4. ADDRESS / LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-black text-gray-900 mb-1">5. Tỉnh / Thành Phố *</label>
              <select
                value={province}
                onChange={(e) => {
                  setProvince(e.target.value);
                  setDistrict('Trung tâm');
                }}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
              >
                {VIETNAM_PROVINCES.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-black text-gray-900 mb-1">6. Quận / Huyện / TP *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
              >
                {currentDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. DYNAMIC IMAGES URL & LOCAL FILE PICKER LIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-black text-gray-900">
                7. Hình Ảnh Sản Phẩm ({images.filter(Boolean).length}/{maxImagesLimit} ảnh)
              </label>
              {images.length < maxImagesLimit && (
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  + Thêm ô ảnh
                </button>
              )}
            </div>

            {images.map((imgUrl, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Thumbnail Preview */}
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-9 h-9 rounded-lg object-cover border border-indigo-200 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-dashed border-gray-300 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {idx + 1}
                  </div>
                )}

                {/* URL Input */}
                <input
                  type="text"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`Dán link ảnh ${idx + 1} hoặc chọn từ thiết bị...`}
                  className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />

                {/* Local Storage Device File Picker Button */}
                <input
                  type="file"
                  accept="image/*"
                  id={`add-prod-file-${idx}`}
                  className="hidden"
                  onChange={(e) => handleLocalImageUpload(idx, e)}
                />
                <label
                  htmlFor={`add-prod-file-${idx}`}
                  className="px-2.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-xl cursor-pointer text-xs flex items-center gap-1 border border-indigo-200 shrink-0 transition"
                  title="Chọn tệp ảnh trực tiếp từ bộ nhớ máy tính/thư viện điện thoại"
                >
                  <span>📁 Chọn ảnh</span>
                </label>

                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(idx)}
                    className="text-rose-500 font-bold p-2 hover:bg-rose-50 rounded-xl cursor-pointer shrink-0"
                    title="Xóa ô ảnh"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 6. DESCRIPTION */}
          <div>
            <label className="block font-black text-gray-900 mb-1">8. Mô Tả Chi Tiết Bài Đăng</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập thông tin chi tiết dịch vụ, ưu đãi..."
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100 font-black">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang Đăng Bài...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Hoàn Tất Đăng Sản Phẩm</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
