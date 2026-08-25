import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Briefcase, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Banner: React.FC = () => {
  const { setSelectedCategory } = useShop();

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
      badge: "Danh Bạ Trực Tiếp 24/7",
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

  const activeSlide = slides[currentSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        
        {/* KHU VỰC BANNER QUẢNG CÁO LỚN CHÍNH (BÊN TRÁI) */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 min-h-[300px] sm:min-h-[340px] flex flex-col justify-between group">
          {/* Background Image Carousel with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={activeSlide.img} 
              alt={activeSlide.title} 
              className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/80 to-transparent"></div>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between h-full">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                {activeSlide.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight max-w-xl drop-shadow-sm">
                {activeSlide.title}
              </h1>
              <p className="mt-2 text-indigo-100 text-xs sm:text-sm max-w-lg leading-relaxed line-clamp-2">
                {activeSlide.subtitle}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button 
                onClick={() => {
                  setSelectedCategory(activeSlide.catId);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl text-xs sm:text-sm shadow-lg hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 group/btn"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Left/Right Manual Arrow Controls */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={prevSlide}
              className="p-2 bg-white/30 hover:bg-white/80 text-white hover:text-gray-900 backdrop-blur-md rounded-full transition shadow"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={nextSlide}
              className="p-2 bg-white/30 hover:bg-white/80 text-white hover:text-gray-900 backdrop-blur-md rounded-full transition shadow"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator góc dưới Banner (Slide Pagination Dots) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                title={`Chuyển sang slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide 
                    ? 'w-7 bg-white shadow-md' 
                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KHỐI KHUYẾN MÃI LỐI TẮT BÊN CẠNH BANNER (BÊN PHẢI) */}
        <div className="flex flex-col gap-4 sm:gap-5 justify-between">
          
          {/* THẺ XANH (BÊN PHẢI TRÊN) - TIÊU ĐỀ: "Việc làm", NÚT: "Tìm việc ngay" */}
          <div className="flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all border border-emerald-500/20">
            <Briefcase className="w-24 h-24 text-white/10 absolute -right-2 -bottom-2 shrink-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-extrabold tracking-wider mb-2 border border-white/20">
                Tuyển dụng & Tìm việc
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">Việc làm</h3>
              <p className="text-emerald-100 text-xs mt-1 max-w-[210px] leading-snug">
                Hàng ngàn cơ hội việc làm thu nhập hấp dẫn đang chờ bạn khám phá.
              </p>
            </div>
            <button 
              onClick={() => { 
                setSelectedCategory('jobs'); 
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              className="mt-4 inline-flex items-center justify-between px-4 py-2.5 bg-white text-emerald-900 font-extrabold rounded-2xl text-xs shadow-md hover:bg-emerald-50 transition-all w-full group/btn cursor-pointer"
            >
              <span>Tìm việc ngay</span>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* THẺ CAM (BÊN PHẢI DƯỚI) - TIÊU ĐỀ: "Giao ngay" - Đồ ăn-Đồ uống, NÚT: "Đặt món ngay" */}
          <div className="flex-1 bg-gradient-to-br from-orange-500 via-amber-600 to-orange-700 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all border border-orange-400/20">
            <Utensils className="w-24 h-24 text-white/10 absolute -right-2 -bottom-2 shrink-0 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] uppercase font-extrabold tracking-wider mb-2 border border-white/20">
                Giao siêu tốc 30 phút
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                "Giao ngay" <span className="text-xs font-semibold text-amber-100 block">Đồ ăn - Đồ uống</span>
              </h3>
              <p className="text-orange-100 text-xs mt-1 max-w-[210px] leading-snug">
                Thỏa thích đặt các món ăn ngon nóng hổi giao tận nhà.
              </p>
            </div>
            <button 
              onClick={() => { 
                setSelectedCategory('food'); 
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); 
              }}
              className="mt-4 inline-flex items-center justify-between px-4 py-2.5 bg-white text-amber-900 font-extrabold rounded-2xl text-xs shadow-md hover:bg-orange-50 transition-all w-full group/btn cursor-pointer"
            >
              <span>Đặt món ngay</span>
              <ArrowRight className="w-4 h-4 text-amber-700 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
