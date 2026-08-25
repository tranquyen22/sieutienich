import React, { useMemo } from 'react';
import { MapPin, Navigation, Compass, Loader2, RotateCcw, CheckCircle2, Building2, Bot, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { VIETNAM_PROVINCES } from '../data/vietnamLocations';

interface LocationFilterBarProps {
  onOpenAIFilterModal?: () => void;
}

export const LocationFilterBar: React.FC<LocationFilterBarProps> = ({ onOpenAIFilterModal }) => {
  const {
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedDistance,
    setSelectedDistance,
    userLocationText,
    isLocating,
    handleGetGPSLocation,
    resetLocationFilter,
  } = useShop();

  const provinceOptions = useMemo(() => {
    return [
      { id: 'all', name: 'Tất cả Tỉnh / Thành phố' },
      ...VIETNAM_PROVINCES.map((p) => ({ id: p.id, name: p.name }))
    ];
  }, []);

  const currentDistrictOptions = useMemo(() => {
    if (selectedProvince === 'all') {
      return [
        { id: 'all', name: 'Tất cả Quận / Huyện / TP' },
        { id: 'TP. Thủ Đức', name: 'TP. Thủ Đức (TP.HCM)' },
        { id: 'Cầu Giấy', name: 'Cầu Giấy (Hà Nội)' },
        { id: 'Quận 1', name: 'Quận 1 (TP.HCM)' },
        { id: 'Quận 3', name: 'Quận 3 (TP.HCM)' },
        { id: 'Quận 7', name: 'Quận 7 (TP.HCM)' },
        { id: 'Nam Từ Liêm', name: 'Nam Từ Liêm (Hà Nội)' },
        { id: 'Hoàn Kiếm', name: 'Hoàn Kiếm (Hà Nội)' },
        { id: 'TP. Thủy Nguyên', name: 'TP. Thủy Nguyên (Hải Phòng)' },
        { id: 'TP. Dĩ An', name: 'TP. Dĩ An (Bình Dương)' },
        { id: 'TP. Phú Quốc', name: 'TP. Phú Quốc (Kiên Giang)' }
      ];
    }
    const found = VIETNAM_PROVINCES.find((p) => p.id === selectedProvince);
    if (found) {
      return found.districts.map((d) => ({
        id: d.includes('Tất cả') ? 'all' : d.replace(/Quận |Huyện |Thị xã |TP\. /g, '').trim(),
        name: d
      }));
    }
    return [{ id: 'all', name: 'Tất cả Quận / Huyện' }];
  }, [selectedProvince]);

  const distances = [
    { id: 'all', name: 'Tất cả bán kính' },
    { id: 1, name: 'Dưới 1 km' },
    { id: 3, name: 'Dưới 3 km' },
    { id: 5, name: 'Dưới 5 km' },
    { id: 10, name: 'Dưới 10 km' },
  ];

  const isLocationActive = selectedProvince !== 'all' || selectedDistrict !== 'all' || selectedDistance !== 'all' || userLocationText !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-6">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-lg shadow-indigo-100/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 relative z-10">
          
          {/* LEFT: GPS & AI Assistant Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* AI Assistant Button */}
            {onOpenAIFilterModal && (
              <button
                onClick={onOpenAIFilterModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-200 transition cursor-pointer shrink-0"
                title="Trợ lý AI hỗ trợ tìm kiếm & chọn lọc tự động bằng câu lệnh"
              >
                <Bot className="w-4 h-4 text-violet-200 animate-bounce" />
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Trợ lý AI Smart Filter</span>
              </button>
            )}

            {/* GPS Positioning Button */}
            <button
              onClick={handleGetGPSLocation}
              disabled={isLocating}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-md shrink-0 ${
                userLocationText
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
              title="Định vị GPS trực tiếp vị trí hiện tại"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Đang tìm GPS...</span>
                </>
              ) : userLocationText ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">{userLocationText}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>GPS Trực tiếp</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Select Filters (Province, District & Distance) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-start md:justify-end min-w-0">
            
            {/* Lọc theo Tỉnh / Thành phố (Full 63 Tỉnh/Thành Việt Nam) */}
            <div className="relative flex-1 min-w-[140px] sm:max-w-[190px]">
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict('all');
                }}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer truncate box-border"
              >
                {provinceOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-indigo-600 absolute left-2.5 top-2.5 shrink-0 pointer-events-none" />
            </div>

            {/* Lọc theo Quận / Huyện sau sáp nhập */}
            <div className="relative flex-1 min-w-[140px] sm:max-w-[200px]">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer truncate box-border"
              >
                {currentDistrictOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-indigo-600 absolute left-2.5 top-2.5 shrink-0 pointer-events-none" />
            </div>

            {/* Lọc theo Mốc Km / Bán kính */}
            <div className="relative flex-1 min-w-[120px] sm:max-w-[140px]">
              <select
                value={selectedDistance}
                onChange={(e) => setSelectedDistance(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer truncate box-border"
              >
                {distances.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
                  </option>
                ))}
              </select>
              <Compass className="w-4 h-4 text-indigo-600 absolute left-2.5 top-2.5 shrink-0 pointer-events-none" />
            </div>

            {/* Reset Location Filter button */}
            {isLocationActive && (
              <button
                onClick={resetLocationFilter}
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-2xl transition shrink-0 flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Bỏ lọc vị trí"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa lọc</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
