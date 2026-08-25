import React, { useState } from 'react';
import { X, Bot, Sparkles, Search, CheckCircle2, ArrowRight, Compass, MapPin, Tag, RefreshCw, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Category } from '../types';

interface AISmartFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISmartFilterModal: React.FC<AISmartFilterModalProps> = ({ isOpen, onClose }) => {
  const {
    setSelectedCategory,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedDistance,
    setSearchQuery,
  } = useShop();

  const [promptInput, setPromptInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedResult, setParsedResult] = useState<{
    category: Category;
    province: string;
    district: string;
    distance: number | 'all';
    keyword: string;
    explanation: string;
  } | null>(null);

  if (!isOpen) return null;

  // Smart Natural Language Intent Parsing Engine for Vietnamese Prompts
  const analyzePrompt = (input: string) => {
    const text = input.toLowerCase();
    let matchedCategory: Category = 'all';
    let matchedProvince = 'all';
    let matchedDistrict = 'all';
    let matchedDistance: number | 'all' = 'all';
    let extractedKeyword = '';

    // 1. Parse Category Intent
    if (text.includes('lẩu') || text.includes('ăn') || text.includes('uống') || text.includes('cơm') || text.includes('trà') || text.includes('quán')) {
      matchedCategory = 'food';
    } else if (text.includes('thuê') || text.includes('mặt bằng') || text.includes('kiot') || text.includes('văn phòng')) {
      matchedCategory = 'rental';
    } else if (text.includes('áo') || text.includes('quần') || text.includes('thời trang') || text.includes('sơ mi')) {
      matchedCategory = 'fashion';
    } else if (text.includes('spa') || text.includes('da mặt') || text.includes('làm đẹp') || text.includes('massage')) {
      matchedCategory = 'spa';
    } else if (text.includes('gạo') || text.includes('dầu ăn') || text.includes('nhu yếu phẩm') || text.includes('chợ')) {
      matchedCategory = 'groceries';
    } else if (text.includes('xe') || text.includes('ba gác') || text.includes('vận tải') || text.includes('chuyển đồ') || text.includes('cẩu')) {
      matchedCategory = 'transport';
    } else if (text.includes('homestay') || text.includes('khách sạn') || text.includes('lưu trú') || text.includes('đặt phòng')) {
      matchedCategory = 'lodging';
    } else if (text.includes('điện nước') || text.includes('sửa chữa') || text.includes('máy lạnh') || text.includes('vệ sinh')) {
      matchedCategory = 'home_services';
    } else if (text.includes('việc làm') || text.includes('tuyển dụng') || text.includes('tư vấn') || text.includes('lương')) {
      matchedCategory = 'jobs';
    } else if (text.includes('pin') || text.includes('cộng đồng') || text.includes('công cộng') || text.includes('rác')) {
      matchedCategory = 'public_utilities';
    }

    // 2. Parse Province & District Intent
    if (text.includes('cầu giấy')) {
      matchedProvince = 'Hà Nội';
      matchedDistrict = 'Cầu Giấy';
    } else if (text.includes('quận 1') || text.includes('q1')) {
      matchedProvince = 'TP. Hồ Chí Minh';
      matchedDistrict = 'Quận 1';
    } else if (text.includes('quận 3') || text.includes('q3')) {
      matchedProvince = 'TP. Hồ Chí Minh';
      matchedDistrict = 'Quận 3';
    } else if (text.includes('quận 7') || text.includes('q7')) {
      matchedProvince = 'TP. Hồ Chí Minh';
      matchedDistrict = 'Quận 7';
    } else if (text.includes('thủ đức')) {
      matchedProvince = 'TP. Hồ Chí Minh';
      matchedDistrict = 'TP. Thủ Đức';
    } else if (text.includes('hoàn kiếm')) {
      matchedProvince = 'Hà Nội';
      matchedDistrict = 'Hoàn Kiếm';
    } else if (text.includes('nam từ liêm')) {
      matchedProvince = 'Hà Nội';
      matchedDistrict = 'Nam Từ Liêm';
    } else if (text.includes('gia lâm')) {
      matchedProvince = 'Hà Nội';
      matchedDistrict = 'Gia Lâm';
    } else if (text.includes('thủy nguyên')) {
      matchedProvince = 'Hải Phòng';
      matchedDistrict = 'TP. Thủy Nguyên';
    }

    // 3. Parse Distance Intent
    if (text.includes('1km') || text.includes('1 km') || text.includes('gần đây')) {
      matchedDistance = 1;
    } else if (text.includes('3km') || text.includes('3 km')) {
      matchedDistance = 3;
    } else if (text.includes('5km') || text.includes('5 km')) {
      matchedDistance = 5;
    } else if (text.includes('10km') || text.includes('10 km')) {
      matchedDistance = 10;
    }

    // 4. Extract search keywords
    if (text.includes('gần')) {
      extractedKeyword = text.split('gần')[0].trim();
    } else {
      extractedKeyword = input.trim();
    }

    return {
      category: matchedCategory,
      province: matchedProvince,
      district: matchedDistrict,
      distance: matchedDistance,
      keyword: extractedKeyword,
      explanation: `Hệ thống AI đã phân tích câu lệnh: Nhận diện danh mục [${matchedCategory !== 'all' ? matchedCategory : 'Tất cả'}], địa bàn [${matchedDistrict !== 'all' ? matchedDistrict : 'Toàn quốc'}], bán kính [${matchedDistance !== 'all' ? '<=' + matchedDistance + 'km' : 'Tất cả'}].`,
    };
  };

  const handleRunAI = (queryText?: string) => {
    const textToRun = queryText || promptInput;
    if (!textToRun.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzePrompt(textToRun);
      setParsedResult(result);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleApplyFilter = () => {
    if (!parsedResult) return;

    // Apply parsed AI parameters to ShopContext
    setSelectedCategory(parsedResult.category);
    if (parsedResult.province !== 'all') setSelectedProvince(parsedResult.province);
    if (parsedResult.district !== 'all') setSelectedDistrict(parsedResult.district);
    if (parsedResult.distance !== 'all') setSelectedDistance(parsedResult.distance);
    if (parsedResult.keyword) setSearchQuery(parsedResult.keyword);

    onClose();

    // Smooth scroll down to product grid
    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  const samplePrompts = [
    "🍲 Tìm quán lẩu hải sản ngon gần Cầu Giấy dưới 3km",
    "🏡 Tìm homestay lưu trú ở Gia Lâm có xác minh GPKD",
    "🚚 Thuê xe ba gác chuyển đồ nội khu khu vực Cầu Giấy",
    "💼 Tìm việc làm tư vấn thu nhập cao tại TP. Thủ Đức",
    "👗 Shop quần áo sơ mi nam đẹp ở Cầu Giấy",
    "💅 Tìm Spa chăm sóc da mặt tại Quận 7 TP.HCM",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-200 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 text-indigo-300 animate-bounce" />
            <span>Trợ Lý AI Tìm Kiếm Smart Filter</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Nhập yêu cầu bằng giọng nói hoặc văn bản
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            Trợ lý AI tự động phân tích nhu cầu, vị trí, khoảng cách và tự động chọn lọc tiện ích chính xác nhất cho bạn.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Input box */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-gray-900">
              Nhập câu hỏi / yêu cầu tìm kiếm của bạn:
            </label>
            
            <div className="relative">
              <textarea 
                rows={3}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="VD: Tìm cho tôi quán lẩu thái hải sản ngon quanh Cầu Giấy bán kính dưới 3km..."
                className="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none box-border"
              />
              <Bot className="w-5 h-5 text-indigo-600 absolute left-3.5 top-3.5" />

              <button
                type="button"
                onClick={() => handleRunAI()}
                disabled={isAnalyzing || !promptInput.trim()}
                className="absolute right-3 bottom-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Phân tích AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Suggestion Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-500 block">
              💡 Hoặc chọn nhanh mẫu gợi ý phổ biến:
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptInput(sample);
                    handleRunAI(sample);
                  }}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100 transition text-left cursor-pointer truncate max-w-full"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Output Result Card */}
          {parsedResult && (
            <div className="bg-gradient-to-br from-indigo-50/90 to-violet-50/90 border border-indigo-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-black text-indigo-900 border-b border-indigo-100 pb-2">
                <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kết quả Phân tích Trí tuệ Nhân tạo (AI Smart Parser):</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-800">
                <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-gray-400 block font-bold">DANH MỤC</span>
                  <span className="font-extrabold text-indigo-700 capitalize flex items-center gap-1 mt-0.5">
                    <Tag className="w-3 h-3 text-indigo-500" />
                    {parsedResult.category !== 'all' ? parsedResult.category : 'Tất cả danh mục'}
                  </span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-gray-400 block font-bold">ĐỊA BÀN VỊ TRÍ</span>
                  <span className="font-extrabold text-indigo-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {parsedResult.district !== 'all' ? `${parsedResult.district}, ${parsedResult.province}` : 'Toàn quốc'}
                  </span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-gray-400 block font-bold">BÁN KÍNH TÌM KIẾM</span>
                  <span className="font-extrabold text-indigo-700 flex items-center gap-1 mt-0.5">
                    <Compass className="w-3 h-3 text-emerald-500" />
                    {parsedResult.distance !== 'all' ? `< ${parsedResult.distance} km` : 'Tất cả bán kính'}
                  </span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-gray-400 block font-bold">TỪ KHÓA TÌM KIẾM</span>
                  <span className="font-extrabold text-indigo-700 flex items-center gap-1 mt-0.5 truncate">
                    <Search className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="truncate">{parsedResult.keyword || 'Không có từ khóa'}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Áp dụng Lọc AI & Xem Kết Quả</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
