import React, { useState } from 'react';
import { X, Store, CheckCircle2, ChevronRight, ChevronLeft, FileText, Clock, Building2, Ban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { OperatingHours } from '../types';

interface MultiStepShopOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiStepShopOnboardingModal: React.FC<MultiStepShopOnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, applyForMerchantAccount } = useAuth();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [shopName, setShopName] = useState('');
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [category, setCategory] = useState('food');
  const [businessLicense, setBusinessLicense] = useState('');
  const [storePhoto, setStorePhoto] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80');
  const [agreedProhibitedRules, setAgreedProhibitedRules] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Operating hours schedule (Mon-Sun)
  const [operatingHours] = useState<OperatingHours[]>([
    { day: 'T2', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T3', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T4', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T5', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T6', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'T7', open_time: '08:00', close_time: '22:00', is_open: true },
    { day: 'CN', open_time: '08:00', close_time: '22:00', is_open: true },
  ]);

  const handleStorePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setStorePhoto(event.target.result as string);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!shopName.trim() || !fullName.trim() || !phone.trim()) {
        alert('Vui lòng điền đầy đủ Tên Shop, Họ tên chủ gian hàng và Số điện thoại!');
        return;
      }
    }
    if (currentStep === 2) {
      if (!businessLicense.trim()) {
        alert('Vui lòng điền Số Giấy phép ĐKKD hoặc CCCD để phục vụ xác minh!');
        return;
      }
    }
    setCurrentStep((prev) => (prev + 1) as any);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1) as any);
  };

  const handleSubmitApplication = async () => {
    if (!agreedProhibitedRules) {
      alert('Vui lòng đồng ý với Cam kết không kinh doanh danh mục hàng cấm!');
      return;
    }

    setSubmitting(true);
    const { error } = await applyForMerchantAccount({
      full_name: fullName,
      phone,
      shop_name: shopName,
    });

    setSubmitting(false);
    if (!error) {
      setSubmitSuccess(true);
      setCurrentStep(4);
    } else {
      alert('Gửi hồ sơ thất bại: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-indigo-400" />
            <span>Đăng Ký Mở Gian Hàng Theo Từng Bước (Wizard)</span>
          </div>

          <h2 className="text-xl font-black text-white">Quy Trình Đăng Ký Mở Shop</h2>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`h-2 rounded-full transition-all ${
                  step <= currentStep ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: BASIC SHOP INFO & OPERATING HOURS */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-indigo-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Bước 1: Thông tin cơ bản & Giờ mở cửa</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tên Gian hàng / Shop *</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="VD: Nông Sản & Lẩu Thái Khoái Châu Official"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Chủ gian hàng *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0987654321"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ngành hàng chính</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  >
                    <option value="food">🍱 Đồ ăn - Đồ uống</option>
                    <option value="fashion">👕 Quần áo - Thời trang</option>
                    <option value="lodging">🏠 Cho thuê & Lưu trú</option>
                    <option value="spa">💅 Spa - Làm đẹp - Chăm sóc sức khỏe</option>
                    <option value="groceries">🛒 Bách hóa & Đồ gia dụng</option>
                    <option value="transport">🚚 Vận tải & Chuyển nhà</option>
                    <option value="rental">🔑 Cho thuê Kiot & Đồ dùng</option>
                  </select>
                </div>

                {/* Operating hours schedule */}
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <span className="font-extrabold text-gray-900 block flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Lịch Giờ mở cửa theo từng ngày trong tuần:</span>
                  </span>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {operatingHours.map((oh, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="font-extrabold block text-[10px] text-indigo-900">{oh.day}</span>
                        <span className="text-[9px] text-gray-500 block">{oh.open_time} - {oh.close_time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VERIFICATION DOSSIER & LICENSES */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-indigo-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Bước 2: Giấy phép & Hồ sơ xác minh cửa hàng</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Số GPKD hoặc Số CCCD *</label>
                  <input
                    type="text"
                    value={businessLicense}
                    onChange={(e) => setBusinessLicense(e.target.value)}
                    placeholder="VD: 0108920192 hoặc 001098273615"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Ảnh Giấy phép GPKD / Ảnh mặt bằng thực tế</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={storePhoto}
                      onChange={(e) => setStorePhoto(e.target.value)}
                      placeholder="Dán URL ảnh hoặc chọn từ thiết bị..."
                      className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="onboarding-shop-photo-file"
                      className="hidden"
                      onChange={handleStorePhotoUpload}
                    />
                    <label
                      htmlFor="onboarding-shop-photo-file"
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-xl cursor-pointer text-xs flex items-center gap-1 border border-indigo-200 shrink-0 transition"
                      title="Chọn tệp ảnh từ bộ nhớ thiết bị / thư viện"
                    >
                      <span>📁 Chọn ảnh</span>
                    </label>
                  </div>
                  {storePhoto && (
                    <img src={storePhoto} alt="Mặt bằng cửa hàng" className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PROHIBITED ITEMS COMPLIANCE AGREEMENT */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-extrabold text-sm text-rose-950 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Bước 3: Danh sách hàng cấm & Cam kết tuân thủ</span>
              </h3>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-rose-950">
                <strong className="block text-xs font-black text-rose-900">🚫 Danh sách các mặt hàng Sàn KHÔNG tiếp nhận:</strong>
                <ul className="list-disc pl-4 space-y-1 text-[11px] font-medium">
                  <li>Vũ khí, khí nổ, công cụ hỗ trợ nguy hiểm.</li>
                  <li>Hàng hóa vi phạm bản quyền, hàng giả, hàng nhái thương hiệu.</li>
                  <li>Chất cấm, ma túy, thuốc lá điện tử không rõ nguồn gốc.</li>
                  <li>Dịch vụ cờ bạc, tín dụng đen, cho vay nặng lãi.</li>
                  <li>Đồ ăn hết hạn sử dụng, không đảm bảo an toàn thực phẩm.</li>
                </ul>
              </div>

              <label className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-2xl border border-gray-200 cursor-pointer font-extrabold text-gray-900">
                <input
                  type="checkbox"
                  checked={agreedProhibitedRules}
                  onChange={(e) => setAgreedProhibitedRules(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                />
                <span>Tôi cam kết không đăng bán các mặt hàng thuộc danh sách cấm nêu trên. Nếu vi phạm sẽ bị khóa shop và thu hồi nhãn xác minh ngay lập tức.</span>
              </label>
            </div>
          )}

          {/* STEP 4: SUBMISSION QUEUE STATUS */}
          {currentStep === 4 && submitSuccess && (
            <div className="p-6 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Gửi Hồ Sơ Mở Shop Thành Công!</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                Hồ sơ của bạn đã được đưa vào <strong>Hàng đợi duyệt Mở Shop (Khâu 1)</strong> trong trang quản trị Admin. Admin & Staff sẽ tiến hành kiểm tra thông tin và gọi điện thẩm định.
              </p>
            </div>
          )}

        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0 text-xs">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          )}

          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition flex items-center gap-1 cursor-pointer shadow-md"
            >
              <span>Tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleSubmitApplication}
              disabled={submitting || !agreedProhibitedRules}
              className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-black rounded-xl transition flex items-center gap-1 cursor-pointer shadow-md"
            >
              <span>{submitting ? 'Đang gửi...' : 'Nộp Hồ Sơ Đăng Ký'}</span>
            </button>
          )}

          {currentStep === 4 && (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-indigo-600 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
            >
              Đóng Cửa Sổ
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
