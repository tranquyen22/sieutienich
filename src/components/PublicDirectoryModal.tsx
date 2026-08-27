import React, { useState } from 'react';
import { 
  X, Phone, MapPin, Navigation, AlertTriangle, Plus, Search, 
  CheckCircle2, ExternalLink, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { DirectoryCategory, DirectoryEntry } from '../types';

interface PublicDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDirectMessagingModal?: (targetShopName?: string, productName?: string, productPrice?: number, targetUserId?: string) => void;
}

export const PublicDirectoryModal: React.FC<PublicDirectoryModalProps> = ({
  isOpen,
  onClose,
  onOpenDirectMessagingModal,
}) => {
  const { isAdmin } = useAuth();

  // Dynamic Categories List (Admin & Authorized Staff Can Add/Edit)
  const [categories, setCategories] = useState<DirectoryCategory[]>([
    { id: 'all', name: 'Tất cả danh mục SOS' },
    { id: 'cong_an', name: '👮 Công An', description: 'Tổng đài cảnh sát 113 & Công an địa phương khẩn cấp' },
    { id: 'pccc_cuu_ho', name: '🚒 Phòng Cháy Chữa Cháy & Cứu Hộ', description: 'Cảnh sát PCCC & Cứu nạn cứu hộ 114 khẩn cấp' },
    { id: 'cap_cuu', name: '🚑 Cấp Cứu', description: 'Cấp cứu y tế 115, xe cứu thương, bệnh viện trực 24/7' },
    { id: 'cuu_ho_xe_may', name: '🛵 Cứu Hộ Xe Máy', description: 'Sửa xe máy lưu động, vá lốp, hết xăng, kích bình 24/7' },
    { id: 'cuu_ho_oto', name: '🚗 Cứu Hộ Ô Tô', description: 'Xe cứu hộ giao thông ô tô, cẩu kéo, kích bình 24/7' },
    { id: 'quan_ly_thi_truong', name: '🛡️ Quản Lý Thị Trường', description: 'Tổng đài phản ánh hàng giả, ép giá, gian lận thương mại' },
  ]);

  // Initial Sample Directory Entries
  const [entries, setEntries] = useState<DirectoryEntry[]>([
    {
      id: 'SOS-001',
      title: 'Tổng Đài Cảnh Sát Trật Tự & Công An Khẩn Cấp (113)',
      category_id: 'cong_an',
      phone: '113',
      address: 'Toàn quốc / Công An Huyện & Khu Vực Hưng Yên - Hà Nội',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Thị trấn Khoái Châu',
      distance_km: 0.1,
      is_verified: true,
      verified_by: 'Hệ Thống SOS Quốc Gia',
      verified_at: '2026-08-15T10:00:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-10T00:00:00.000Z',
    },
    {
      id: 'SOS-002',
      title: 'Cảnh Sát Phòng Cháy Chữa Cháy & Cứu Nạn Cứu Hộ (114)',
      category_id: 'pccc_cuu_ho',
      phone: '114',
      address: 'Đội Cảnh Sát PCCC & CNCH Khu Vực 24/7',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Thị trấn Khoái Châu',
      distance_km: 0.2,
      is_verified: true,
      verified_by: 'Hệ Thống SOS Quốc Gia',
      verified_at: '2026-08-15T10:00:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-10T00:00:00.000Z',
    },
    {
      id: 'SOS-003',
      title: 'Cấp Cứu Y Tế Khẩn Cấp & Bệnh Viện Trực 24/7 (115)',
      category_id: 'cap_cuu',
      phone: '115',
      address: 'Trung Tâm Cấp Cứu Y Tế 115 & Bệnh Viện Đa Khoa Khoái Châu',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Thị trấn Khoái Châu',
      distance_km: 0.5,
      is_verified: true,
      verified_by: 'Hệ Thống SOS Quốc Gia',
      verified_at: '2026-08-15T10:00:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-10T00:00:00.000Z',
    },
    {
      id: 'SOS-004',
      title: 'Đội Cứu Hộ Xe Máy Lưu Động 24/7 (Vá Lốp, Sửa Xe, Hết Xăng)',
      category_id: 'cuu_ho_xe_may',
      phone: '0912345678',
      address: 'Số 18 Thị trấn Khoái Châu, Hưng Yên (Cứu hộ 24/24)',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Thị trấn Khoái Châu',
      distance_km: 1.2,
      is_verified: true,
      verified_by: 'Admin Tổng',
      verified_at: '2026-08-15T10:00:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-10T00:00:00.000Z',
    },
    {
      id: 'SOS-005',
      title: 'Xe Cứu Hộ Giao Thông Ô Tô & Cẩu Kéo Khẩn Cấp 24/7',
      category_id: 'cuu_ho_oto',
      phone: '0987654321',
      address: 'Đường 39A, Huyện Khoái Châu, Hưng Yên',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Đông Kết',
      distance_km: 2.5,
      is_verified: true,
      verified_by: 'Admin Tổng',
      verified_at: '2026-08-18T14:30:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-12T00:00:00.000Z',
    },
    {
      id: 'SOS-006',
      title: 'Tổng Đài Cục Quản Lý Thị Trường (Phản Ánh Hàng Giả, Ép Giá)',
      category_id: 'quan_ly_thi_truong',
      phone: '1900888655',
      address: 'Cục Quản Lý Thị Trường & Đội QLTT Số 4 Hưng Yên',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      ward: 'Thị trấn Khoái Châu',
      distance_km: 0.8,
      is_verified: true,
      verified_by: 'Admin Tổng',
      verified_at: '2026-08-20T00:00:00.000Z',
      report_wrong_number_count: 0,
      created_at: '2026-08-20T00:00:00.000Z',
    },
  ]);

  // Location & Radius Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [userGpsText, setUserGpsText] = useState<string>('');

  // Sub-modal states for Admin & Staff CRUD
  const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  // Add New Entry Form States
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('cong_an');
  const [newPhone, setNewPhone] = useState('');
  const [newLinkedPhone, setNewLinkedPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newProvince, setNewProvince] = useState('Hưng Yên');
  const [newDistrict, setNewDistrict] = useState('Khoái Châu');
  const [newDistance] = useState(2.5);

  // Add New Category Form States
  const [newCategoryName, setNewCategoryName] = useState('');

  if (!isOpen) return null;

  // Filtered Entries Logic
  const filteredEntries = entries.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesProvince = selectedProvince === 'all' || item.province === selectedProvince;
    const matchesDistrict = selectedDistrict === 'all' || item.district.includes(selectedDistrict);
    
    let matchesRadius = true;
    if (maxDistanceKm !== 'all' && item.distance_km !== undefined) {
      matchesRadius = item.distance_km <= Number(maxDistanceKm);
    }

    return matchesSearch && matchesCategory && matchesProvince && matchesDistrict && matchesRadius;
  });

  // GPS Location Trigger
  const handleTriggerGPS = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ xin quyền GPS!');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingGPS(false);
        setUserGpsText(`Vị trí GPS thực tế: Lat ${pos.coords.latitude.toFixed(4)}, Long ${pos.coords.longitude.toFixed(4)}`);
        setSelectedProvince('Hưng Yên');
        setSelectedDistrict('Khoái Châu');
        setMaxDistanceKm('5');
        alert('🎯 Đã lấy vị trí GPS thành công! Đã tự động lọc danh bạ tiện ích xung quanh bán kính 5km.');
      },
      (err) => {
        setIsLocatingGPS(false);
        alert(`Không thể lấy vị trí GPS: ${err.message}. Khách hàng có thể chọn Tỉnh / Huyện bằng tay bên dưới!`);
      }
    );
  };

  // Toggle Verified Badge Action (Only Super Admin)
  const handleToggleVerified = (id: string, currentStatus: boolean) => {
    if (!isAdmin) {
      alert('⛔ Chỉ duy nhất Admin Tổng mới có quyền Gắn và gỡ nhãn Đã Xác Minh!');
      return;
    }

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !currentStatus;
          return {
            ...item,
            is_verified: nextState,
            verified_by: nextState ? 'Admin Tổng (Trần Văn Quyền)' : undefined,
            verified_at: nextState ? new Date().toISOString() : undefined,
          };
        }
        return item;
      })
    );

    alert(currentStatus ? '⚪ Đã GỠ nhãn đã xác minh!' : '✅ Đã GẮN nhãn "ĐÃ XÁC MINH THỰC ĐỊA" cho mục danh bạ này!');
  };

  // Report Wrong Number Action (For Buyers - ONLY REPORT, CANNOT EDIT NUMBER)
  const handleReportWrongNumber = (item: DirectoryEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, report_wrong_number_count: e.report_wrong_number_count + 1 } : e))
    );

    alert(`⚠️ Đã gửi Báo Số Sai cho mục "${item.title}"!\nBáo cáo đã được chuyển về Hàng đợi Admin rà soát kiểm tra. Cảm ơn bạn đã phản hồi!`);
  };

  // Create New Directory Entry (Admin Only)
  const handleCreateEntry = () => {
    if (!isAdmin) {
      alert('⛔ Chỉ duy nhất Admin Tổng mới có quyền Thêm mục danh bạ mới!');
      return;
    }

    if (!newTitle || !newPhone || !newAddress) {
      alert('Vui lòng điền Tên dịch vụ, Số điện thoại và Địa chỉ!');
      return;
    }

    const newEntryItem: DirectoryEntry = {
      id: `SOS-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      category_id: newCategory,
      phone: newPhone,
      linked_user_phone: newLinkedPhone.trim() || newPhone.trim(),
      address: newAddress,
      province: newProvince,
      district: newDistrict,
      distance_km: newDistance,
      is_verified: false,
      report_wrong_number_count: 0,
      created_at: new Date().toISOString(),
    };

    setEntries((prev) => [newEntryItem, ...prev]);
    setAddEntryModalOpen(false);
    setNewTitle('');
    setNewPhone('');
    setNewLinkedPhone('');
    setNewAddress('');

    alert(`🎉 Đã thêm mục danh bạ mới "${newEntryItem.title}"!\n📌 Nhãn mặc định: CHƯA XÁC MINH (Cần Admin kiểm tra thực địa để gắn nhãn ✅).`);
  };

  // Create New Category (Admin Only)
  const handleCreateCategory = () => {
    if (!isAdmin) {
      alert('⛔ Chỉ duy nhất Admin Tổng mới có quyền Thêm danh mục mới!');
      return;
    }

    if (!newCategoryName.trim()) return;

    const newCatObj: DirectoryCategory = {
      id: `cat-${Date.now()}`,
      name: `📁 ${newCategoryName}`,
      description: 'Danh mục mới tạo bởi Quản trị',
    };

    setCategories([...categories, newCatObj]);
    setAddCategoryModalOpen(false);
    setNewCategoryName('');

    alert(`✅ Đã thêm danh mục mới "${newCatObj.name}" vào cây danh bạ!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">SOS</span>
            <span>SOS Tiện Ích Trực Tuyến & Cứu Hộ / Tìm Thợ / Xe 24/7</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-white">🆘 SOS Tiện Ích & Cứu Hộ Dịch Vụ 24/7</h2>

            {/* Action Buttons for Super Admin Only */}
            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setAddCategoryModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-bold text-xs border border-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Thêm Danh Mục (Chỉ Admin)</span>
                </button>

                <button
                  onClick={() => setAddEntryModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Mục Danh Bạ Mới (Chỉ Admin)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GPS Location & Radius Toolbar */}
        <div className="bg-indigo-50/80 p-3.5 border-b border-indigo-100 space-y-2 shrink-0 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* GPS Location Trigger */}
            <button
              onClick={handleTriggerGPS}
              disabled={isLocatingGPS}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
              <span>{isLocatingGPS ? 'Đang xin quyền định vị...' : '📡 Định vị vị trí hiện tại (GPS)'}</span>
            </button>

            {userGpsText && (
              <span className="text-[11px] font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                {userGpsText}
              </span>
            )}
          </div>

          {/* Search & Location Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-bold text-xs">
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm dịch vụ, thợ, xe, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Province / District Filter */}
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5"
            >
              <option value="all">Tất cả Tỉnh / Thành</option>
              <option value="Hưng Yên">Hưng Yên</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP. Hồ Chí Minh</option>
            </select>

            {/* Radius Filter */}
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-2.5 py-1.5 text-indigo-950 font-black"
            >
              <option value="all">Tất cả bán kính</option>
              <option value="3">Bán kính &lt; 3 km</option>
              <option value="5">Bán kính &lt; 5 km</option>
              <option value="10">Bán kính &lt; 10 km</option>
              <option value="20">Bán kính &lt; 20 km</option>
            </select>
          </div>
        </div>

        {/* Scrollable Directory Entries Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 text-xs">
          
          <div className="flex items-center justify-between font-black text-gray-700">
            <span>Hiển thị {filteredEntries.length} mục danh bạ phù hợp:</span>
            <span className="text-[10px] text-gray-400 font-bold">Bấm số điện thoại để gọi trực tiếp</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredEntries.map((item) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.title} ${item.address}`)}`;

              return (
                <div 
                  key={item.id}
                  className={`p-4 bg-white border rounded-2xl shadow-sm transition space-y-3 flex flex-col justify-between ${
                    item.is_verified ? 'border-emerald-200 hover:border-emerald-400' : 'border-gray-200'
                  }`}
                >
                  {/* Card Header: Title & Verification Badge */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <strong className="text-sm font-black text-gray-900 leading-snug">{item.title}</strong>
                      
                      {/* Verification Status Badge */}
                      {item.is_verified ? (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-black text-[10px] shrink-0 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đã xác minh ✅</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold text-[10px] shrink-0 border border-gray-200">
                          ⚪ Chưa xác minh (Tự khai)
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-gray-500 font-medium flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-gray-700 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{item.address}</span>
                      </span>
                      {item.distance_km !== undefined && (
                        <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-black text-[10px]">
                          {item.distance_km} km
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Wrong Number Report Counter if reported */}
                  {item.report_wrong_number_count > 0 && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Đã có {item.report_wrong_number_count} khách bấm báo số sai (Đang trong hàng đợi rà soát)</span>
                    </div>
                  )}

                  {/* Call & Maps Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 font-extrabold">
                    
                    {/* Direct Call Button (tel:) */}
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer text-xs font-black"
                      title={`Bấm để chuyển sang cuộc gọi điện thoại tự động nhập số ${item.phone}`}
                    >
                      <Phone className="w-4 h-4 fill-white" />
                      <span>Gọi Ngay</span>
                    </a>

                    {/* Direct SOS Messaging Button */}
                    {onOpenDirectMessagingModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenDirectMessagingModal(item.title, undefined, undefined, item.linked_user_phone || item.phone);
                        }}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer text-xs font-black"
                      >
                        <MessageSquare className="w-4 h-4 text-indigo-200" />
                        <span>💬 Nhắn Tin Cứu Hộ</span>
                      </button>
                    )}

                    {/* Google Maps Directions Button */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition flex items-center gap-1 cursor-pointer text-xs border border-blue-200"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Chỉ đường Maps</span>
                    </a>

                    {/* Buyer Action: Report Wrong Number (Report only, no edit) */}
                    <button
                      type="button"
                      onClick={() => handleReportWrongNumber(item)}
                      className="px-2.5 py-1.5 text-gray-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      title="Báo số sai cho Admin rà soát (Không tự sửa)"
                    >
                      ⚠️ Báo số sai
                    </button>

                    {/* Admin Verification Toggle Button */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleToggleVerified(item.id, item.is_verified)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition cursor-pointer ${
                          item.is_verified 
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' 
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {item.is_verified ? 'Gỡ nhãn xác minh' : '✓ Gắn nhãn Đã Xác Minh'}
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Màn Hình
          </button>
        </div>
      </div>

      {/* SUB-MODAL 1: ADD NEW DIRECTORY ENTRY (STAFF & ADMIN ONLY) */}
      {addEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-indigo-900">Thêm Mục Danh Bạ Mới</h3>
              <button onClick={() => setAddEntryModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Tên dịch vụ / Thợ / Cửa hàng *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Thợ sửa khóa & làm chìa Khoái Châu"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Chọn danh mục:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                >
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Số điện thoại gọi thẳng *</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-900 mb-1">📱 SĐT / Tài khoản dịch vụ cứu hộ liên kết (Để nhận tin nhắn SOS)</label>
                <input
                  type="text"
                  value={newLinkedPhone}
                  onChange={(e) => setNewLinkedPhone(e.target.value)}
                  placeholder="Nhập SĐT / User ID tài khoản nhận tin (Để trống sẽ lấy SĐT gọi thẳng)"
                  className="w-full p-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl font-bold text-indigo-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Địa chỉ chi tiết *</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Số 88 Đường Thị trấn Khoái Châu"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Tỉnh / Thành</label>
                  <input
                    type="text"
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Huyện / Quận</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-bold">
                📌 <strong>Nhãn xác minh:</strong> Mục mới đăng mặc định là <strong>Chưa xác minh (⚪)</strong>. Quản trị sẽ đi kiểm tra thực địa rồi mới bấm gắn nhãn ✅.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button onClick={() => setAddEntryModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleCreateEntry} className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer">Thêm Mục Danh Bạ</button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL 2: ADD NEW CATEGORY (ADMIN & STAFF ONLY) */}
      {addCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 text-xs font-medium shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-indigo-900">Thêm Danh Mục Mới</h3>
              <button onClick={() => setAddCategoryModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Tên danh mục mới *</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="VD: 🏗️ Vật Liệu Xây Dựng & Xây Dân Dụng"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 font-extrabold">
              <button onClick={() => setAddCategoryModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Hủy</button>
              <button onClick={handleCreateCategory} className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md cursor-pointer">Thêm Danh Mục</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
