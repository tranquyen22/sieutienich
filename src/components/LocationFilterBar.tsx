import React, { useMemo } from 'react';
import { MapPin, Navigation, Compass, Loader2, RotateCcw, CheckCircle2, Building2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const LocationFilterBar: React.FC = () => {
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

  // Vietnam Post-Merger Administrative Data (Tỉnh/Thành phố & Quận/Huyện/Thành phố thuộc tỉnh)
  const provinces = [
    { id: 'all', name: 'Tất cả Tỉnh / Thành phố' },
    { id: 'TP. Hồ Chí Minh', name: 'TP. Hồ Chí Minh' },
    { id: 'Hà Nội', name: 'TP. Hà Nội' },
    { id: 'Hải Phòng', name: 'TP. Hải Phòng' },
    { id: 'Đà Nẵng', name: 'TP. Đà Nẵng' },
    { id: 'Cần Thơ', name: 'TP. Cần Thơ' },
    { id: 'Bình Dương', name: 'Tỉnh Bình Dương' },
    { id: 'Đồng Nai', name: 'Tỉnh Đồng Nai' },
    { id: 'Quảng Ninh', name: 'Tỉnh Quảng Ninh' },
    { id: 'Bắc Ninh', name: 'Tỉnh Bắc Ninh' },
    { id: 'Khánh Hòa', name: 'Tỉnh Khánh Hòa' },
    { id: 'Lâm Đồng', name: 'Tỉnh Lâm Đồng' },
  ];

  // Dynamic District options based on selected Province (Including latest merged administrative units)
  const districtsMap: Record<string, { id: string; name: string }[]> = useMemo(() => ({
    'TP. Hồ Chí Minh': [
      { id: 'all', name: 'Tất cả Quận/Huyện TP.HCM' },
      { id: 'TP. Thủ Đức', name: 'TP. Thủ Đức (Sáp nhập Q2, Q9, Thủ Đức)' },
      { id: 'Quận 1', name: 'Quận 1' },
      { id: 'Quận 3', name: 'Quận 3' },
      { id: 'Quận 7', name: 'Quận 7' },
      { id: 'Quận 10', name: 'Quận 10' },
      { id: 'Bình Thạnh', name: 'Quận Bình Thạnh' },
      { id: 'Gò Vấp', name: 'Quận Gò Vấp' },
      { id: 'Tân Bình', name: 'Quận Tân Bình' },
      { id: 'Bình Chánh', name: 'Huyện Bình Chánh' },
      { id: 'Hóc Môn', name: 'Huyện Hóc Môn' },
    ],
    'Hà Nội': [
      { id: 'all', name: 'Tất cả Quận/Huyện Hà Nội' },
      { id: 'Cầu Giấy', name: 'Quận Cầu Giấy' },
      { id: 'Hoàn Kiếm', name: 'Quận Hoàn Kiếm' },
      { id: 'Ba Đình', name: 'Quận Ba Đình' },
      { id: 'Đống Đa', name: 'Quận Đống Đa' },
      { id: 'Hai Bà Trưng', name: 'Quận Hai Bà Trưng' },
      { id: 'Nam Từ Liêm', name: 'Quận Nam Từ Liêm' },
      { id: 'Bắc Từ Liêm', name: 'Quận Bắc Từ Liêm' },
      { id: 'Gia Lâm', name: 'Huyện Gia Lâm (Đô thị mới)' },
      { id: 'Đông Anh', name: 'Huyện Đông Anh (Đô thị mới)' },
      { id: 'Thanh Trì', name: 'Huyện Thanh Trì' },
    ],
    'Hải Phòng': [
      { id: 'all', name: 'Tất cả Quận/Huyện Hải Phòng' },
      { id: 'TP. Thủy Nguyên', name: 'TP. Thủy Nguyên (Thành phố mới sáp nhập)' },
      { id: 'Hồng Bàng', name: 'Quận Hồng Bàng' },
      { id: 'Lê Chân', name: 'Quận Lê Chân' },
      { id: 'Ngô Quyền', name: 'Quận Ngô Quyền' },
      { id: 'Hải An', name: 'Quận Hải An' },
      { id: 'An Dương', name: 'Huyện An Dương' },
    ],
    'Đà Nẵng': [
      { id: 'all', name: 'Tất cả Quận/Huyện Đà Nẵng' },
      { id: 'Hải Châu', name: 'Quận Hải Châu' },
      { id: 'Thanh Khê', name: 'Quận Thanh Khê' },
      { id: 'Sơn Trà', name: 'Quận Sơn Trà' },
      { id: 'Ngũ Hành Sơn', name: 'Quận Ngũ Hành Sơn' },
      { id: 'Cẩm Lệ', name: 'Quận Cẩm Lệ' },
      { id: 'Liên Chiểu', name: 'Quận Liên Chiểu' },
    ],
    'Bình Dương': [
      { id: 'all', name: 'Tất cả TP/Huyện Bình Dương' },
      { id: 'TP. Thủ Dầu Một', name: 'TP. Thủ Dầu Một' },
      { id: 'TP. Dĩ An', name: 'TP. Dĩ An' },
      { id: 'TP. Thuận An', name: 'TP. Thuận An' },
      { id: 'TP. Bến Cát', name: 'TP. Bến Cát' },
      { id: 'TP. Tân Uyên', name: 'TP. Tân Uyên' },
    ],
  }), []);

  const currentDistrictOptions = useMemo(() => {
    if (selectedProvince === 'all' || !districtsMap[selectedProvince]) {
      return [
        { id: 'all', name: 'Tất cả Quận / Huyện' },
        { id: 'TP. Thủ Đức', name: 'TP. Thủ Đức (TP.HCM)' },
        { id: 'Cầu Giấy', name: 'Cầu Giấy (Hà Nội)' },
        { id: 'Quận 1', name: 'Quận 1 (TP.HCM)' },
        { id: 'Quận 3', name: 'Quận 3 (TP.HCM)' },
        { id: 'Quận 7', name: 'Quận 7 (TP.HCM)' },
        { id: 'Nam Từ Liêm', name: 'Nam Từ Liêm (Hà Nội)' },
        { id: 'Hoàn Kiếm', name: 'Hoàn Kiếm (Hà Nội)' },
        { id: 'TP. Thủy Nguyên', name: 'TP. Thủy Nguyên (Hải Phòng)' },
        { id: 'Gia Lâm', name: 'Gia Lâm (Hà Nội)' },
      ];
    }
    return districtsMap[selectedProvince];
  }, [selectedProvince, districtsMap]);

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
          
          {/* LEFT: GPS Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleGetGPSLocation}
              disabled={isLocating}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer shadow-md shrink-0 ${
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

          {/* RIGHT: Select Filters (Province, District & Distance) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 justify-start md:justify-end min-w-0">
            
            {/* Lọc theo Tỉnh / Thành phố */}
            <div className="relative flex-1 min-w-[140px] sm:max-w-[190px]">
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict('all');
                }}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-2xl text-xs font-bold text-gray-800 bg-gray-50/80 hover:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition cursor-pointer truncate box-border"
              >
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Building2 className="w-4 h-4 text-indigo-600 absolute left-2.5 top-2.5 shrink-0 pointer-events-none" />
            </div>

            {/* Lọc theo Quận / Huyện sau sáp nhập */}
            <div className="relative flex-1 min-w-[140px] sm:max-w-[210px]">
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
            <div className="relative flex-1 min-w-[120px] sm:max-w-[150px]">
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
