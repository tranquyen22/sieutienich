import React from 'react';
import { MapPin, Navigation, Compass, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LocationFilterBar: React.FC = () => {
  const {
    selectedDistrict,
    setSelectedDistrict,
    selectedDistance,
    setSelectedDistance,
    userLocationText,
    isLocating,
    handleGetGPSLocation,
    resetLocationFilter,
  } = useShop();

  const districts = [
    { id: 'all', name: 'Tất cả Quận / Huyện' },
    { id: 'Cầu Giấy', name: 'Cầu Giấy (Hà Nội)' },
    { id: 'Quận 1', name: 'Quận 1 (TP.HCM)' },
    { id: 'Quận 3', name: 'Quận 3 (TP.HCM)' },
    { id: 'Quận 7', name: 'Quận 7 (TP.HCM)' },
    { id: 'Nam Từ Liêm', name: 'Nam Từ Liêm (Hà Nội)' },
    { id: 'Hoàn Kiếm', name: 'Hoàn Kiếm (Hà Nội)' },
    { id: 'Gia Lâm', name: 'Gia Lâm (Hà Nội)' },
    { id: 'Quận 10', name: 'Quận 10 (TP.HCM)' },
    { id: 'TP. Thủ Đức', name: 'TP. Thủ Đức (TP.HCM)' },
  ];

  const distances = [
    { id: 'all', name: 'Tất cả bán kính' },
    { id: 1, name: 'Dưới 1 km' },
    { id: 3, name: 'Dưới 3 km' },
    { id: 5, name: 'Dưới 5 km' },
    { id: 10, name: 'Dưới 10 km' },
  ];

  const isLocationActive = selectedDistrict !== 'all' || selectedDistance !== 'all' || userLocationText !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-6">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-indigo-100 shadow-lg shadow-indigo-100/40 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 relative z-10">
          
          {/* LEFT: GPS Button & Active Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGetGPSLocation}
              disabled={isLocating}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-md shrink-0 ${
                userLocationText
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }`}
              title="Định vị GPS vị trí hiện tại của bạn"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Đang tìm GPS...</span>
                </>
              ) : userLocationText ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
                  <span className="truncate max-w-[180px] sm:max-w-[220px]">{userLocationText}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>Định vị GPS trực tiếp</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Select Filters (District & Distance) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-start md:justify-end min-w-0">
            
            {/* Lọc theo Quận / Huyện */}
            <div className="relative flex-1 min-w-[150px] sm:max-w-[210px]">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer truncate box-border"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 text-indigo-600 absolute left-2.5 top-2.5 shrink-0 pointer-events-none" />
            </div>

            {/* Lọc theo Mốc Km / Bán kính */}
            <div className="relative flex-1 min-w-[130px] sm:max-w-[170px]">
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
                className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-2xl transition shrink-0 flex items-center gap-1 text-xs font-bold"
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
