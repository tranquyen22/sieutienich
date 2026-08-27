import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Flame, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

export const Banner: React.FC = () => {
  const { setSelectedCategory, dailyCheckIn, hasCheckedInToday, checkInStreak } = useShop();
  const { userRole } = useAuth();
  const [checkInMsg, setCheckInMsg] = useState<{ success: boolean; text: string } | null>(null);

  const slides = [
    {
      id: 1,
      badge: "Siêu Ưu Đãi Tháng Này",
      title: "Siêu Tiện Ích - Nền tảng Đa Dịch Vụ Realtime",
      subtitle: "Tất cả nhu cầu Cho thuê, Quần áo, Đồ ăn, Spa, Vận tải, Lưu trú, Việc làm đều hội tụ tại một nơi.",
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
      ctaText: "Khám phá ngay",
      catId: "all" as const
    },
    {
      id: 2,
      badge: "Đã Xác Minh GPKD",
      title: "Siêu Tiện Ích - Lưu Trú & Cho Thuê Uy Tín",
      subtitle: "Căn hộ homestay, kiot mặt bằng được kiểm duyệt giấy phép kinh doanh đầy đủ, liên hệ trực tiếp chủ nhà.",
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      ctaText: "Xem gian hàng",
      catId: "lodging" as const
    },
    {
      id: 3,
      badge: "🆘 SOS Cấp Cứu & Dịch Vụ 24/7",
      title: "Siêu Tiện Ích - Vận Tải & Chuyển Đồ Nội Khu",
      subtitle: "Danh bạ liên hệ trực tiếp chủ xe ba gác, dịch vụ chuyển nhà cư dân nhanh chóng, không qua trung gian.",
      img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
      ctaText: "Gọi nhà xe",
      catId: "transport" as const
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleHomepageCheckIn = async () => {
    const res = await dailyCheckIn();
    setCheckInMsg({ success: res.success, text: res.message });
    setTimeout(() => setCheckInMsg(null), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 space-y-4">
      
      {/* PROMINENT DAILY CHECK-IN WIDGET ON HOMEPAGE */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-3.5 sm:p-4 shadow-lg border border-amber-300/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-yellow-200 shrink-0">
            <Flame className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-black text-sm text-white">🎁 ĐIỂM DANH HÀNG NGÀY TRÊN TRANG CHỦ</span>
              <span className="bg-orange-950/60 text-yellow-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-yellow-300/30">
                Day {checkInStreak}/7
              </span>
            </div>
            <p className="text-xs text-amber-100 mt-0.5">
              Tích lũy N1-6: 50 xu/ngày • N7 thưởng +300 xu (1 Xu = 1 VNĐ).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleHomepageCheckIn}
            disabled={hasCheckedInToday || userRole === 'merchant'}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              userRole === 'merchant'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : hasCheckedInToday
                ? 'bg-emerald-600 text-white shadow-emerald-200'
                : 'bg-white text-amber-900 hover:bg-amber-50 shadow-amber-200 hover:scale-105'
            }`}
          >
            {hasCheckedInToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Đã Điểm Danh Hôm Nay</span>
              </>
            ) : (
              <>
                <span>👉 Bấm Nhận +50 Xu Mới</span>
              </>
            )}
          </button>
        </div>
      </div>

      {checkInMsg && (
        <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm ${
          checkInMsg.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
        }`}>
          {checkInMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{checkInMsg.text}</span>
        </div>
      )}

      {/* MAIN FULL-WIDTH BANNER SLIDER */}
      <div className="w-full relative rounded-3xl overflow-hidden shadow-xl min-h-[240px] sm:min-h-[320px] md:min-h-[360px] flex flex-col justify-end group">
        
        {/* Background Image Carousel */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img 
              src={slide.img} 
              alt={slide.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          </div>
        ))}

        {/* Slide Content Overlay */}
        <div className="relative z-10 p-6 sm:p-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 text-white rounded-full text-xs font-extrabold shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            {slides[currentSlide].badge}
          </span>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight max-w-xl">
            {slides[currentSlide].title}
          </h1>
          
          <p className="text-gray-200 text-xs sm:text-sm max-w-lg leading-relaxed line-clamp-2">
            {slides[currentSlide].subtitle}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedCategory(slides[currentSlide].catId);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 cursor-pointer"
            >
              <span>{slides[currentSlide].ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          title="Trượt sang trái"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition opacity-0 group-hover:opacity-100 z-20 cursor-pointer"
          title="Trượt sang phải"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              title={`Chuyển đến Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
