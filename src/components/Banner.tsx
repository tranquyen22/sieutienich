import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white py-10 px-4 shadow-inner relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Nền tảng Siêu Tiện Ích Đa Dịch Vụ Realtime
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight">
            Tất cả dịch vụ & tiện ích bạn cần trong một nền tảng
          </h1>
          <p className="mt-2 text-indigo-100 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed">
            Kết nối cho thuê, quần áo, ẩm thực, làm đẹp, nhu yếu phẩm, vận tải, lưu trú, sửa chữa gia đình, việc làm và tiện ích cộng đồng theo thời gian thực.
          </p>
        </div>
        <a 
          href="#products" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition whitespace-nowrap group shrink-0"
        >
          <span>Khám phá dịch vụ</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
