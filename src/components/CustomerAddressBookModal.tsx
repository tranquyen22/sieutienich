import React, { useState } from 'react';
import { X, MapPin, Plus, Trash2, Navigation, ExternalLink, Compass } from 'lucide-react';
import type { CustomerAddress } from '../types';

interface CustomerAddressBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: CustomerAddress[];
  onSelectAddress?: (addr: CustomerAddress) => void;
  onAddAddress?: (newAddr: Omit<CustomerAddress, 'id'>) => void;
  onDeleteAddress?: (id: string) => void;
  onSetDefaultAddress?: (id: string) => void;
}

export const CustomerAddressBookModal: React.FC<CustomerAddressBookModalProps> = ({
  isOpen,
  onClose,
  addresses,
  onSelectAddress,
  onAddAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [district, setDistrict] = useState('Cầu Giấy');
  const [detailAddress, setDetailAddress] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // GPS Auto-Pinning & Google Maps Link States
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  if (!isOpen) return null;

  // GPS Auto-location trigger
  const handleTriggerGPS = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ xin quyền GPS!');
      return;
    }

    setIsLocatingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setGpsCoords({ lat, lng });

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        setGoogleMapsUrl(mapsUrl);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const prov = (addr.state || addr.city || addr.province || 'Hà Nội').replace(/Tỉnh |Thành phố |TP\. /g, '').trim();
            const dist = (addr.county || addr.district || addr.suburb || addr.city_district || addr.town || 'Cầu Giấy').replace(/Quận |Huyện |Thị xã |TP\. /g, '').trim();
            const road = addr.road || addr.quarter || addr.suburb || '';
            const houseNo = addr.house_number ? `Số ${addr.house_number} ` : '';

            setProvince(prov);
            setDistrict(dist);
            if (houseNo || road) {
              setDetailAddress(`${houseNo}${road}`.trim());
            }

            alert(`🎯 Đã định vị GPS vệ tinh chính xác 100%!\n📍 Vị trí: ${houseNo}${road}, ${dist}, ${prov}\nLat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}\nLiên kết Google Maps đã được ghim trực tiếp!`);
          } else {
            alert(`🎯 Đã lấy tọa độ GPS thực tế chuẩn xác!\nLat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
          }
        } catch {
          alert(`🎯 Đã lấy tọa độ GPS phần cứng chuẩn xác!\nLat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
        } finally {
          setIsLocatingGPS(false);
        }
      },
      (err) => {
        setIsLocatingGPS(false);
        alert(`Không thể lấy định vị GPS: ${err.message}. Bạn vui lòng dán link Google Maps hoặc nhập địa chỉ thủ công!`);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const handleSubmitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !detailAddress.trim()) {
      alert('Vui lòng nhập đầy đủ Tên người nhận, Số điện thoại và Địa chỉ chi tiết!');
      return;
    }

    const generatedMapsUrl = googleMapsUrl.trim() || 
      (gpsCoords 
        ? `https://www.google.com/maps/search/?api=1&query=${gpsCoords.lat},${gpsCoords.lng}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${detailAddress}, ${district}, ${province}`)}`);

    onAddAddress?.({
      user_id: 'current-user',
      recipient_name: recipientName,
      phone,
      province,
      district,
      detail_address: detailAddress,
      is_default: addresses.length === 0 ? true : isDefault,
      latitude: gpsCoords?.lat,
      longitude: gpsCoords?.lng,
      google_maps_url: generatedMapsUrl,
    });

    // Reset form
    setRecipientName('');
    setPhone('');
    setDetailAddress('');
    setGpsCoords(null);
    setGoogleMapsUrl('');
    setIsDefault(false);
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[90vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-900 to-purple-800 text-white p-4 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Sổ Địa Chỉ Giao Hàng & Ghim Vị Trí Google Maps</h3>
              <p className="text-[11px] text-indigo-200">
                Ghim định vị GPS chính xác để Shop & Shipper giao tới tận tay.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900 text-xs uppercase tracking-wider">Danh Sách Địa Chỉ Đã Lưu ({addresses.length})</h4>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold rounded-xl border border-indigo-200 transition flex items-center gap-1 cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Hủy Thêm' : '+ Thêm Địa Chỉ Mới'}</span>
            </button>
          </div>

          {/* ADD NEW ADDRESS FORM */}
          {isAdding && (
            <form onSubmit={handleSubmitNewAddress} className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
              <h5 className="font-black text-indigo-950 text-xs">Khai Báo Địa Chỉ Mới & Ghim GPS Google Maps:</h5>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tên người nhận *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0987654321"
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tỉnh / Thành phố</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Quận / Huyện</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Cầu Giấy / Khoái Châu..."
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Địa chỉ chi tiết (Số nhà, đường, ngõ) *</label>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                  placeholder="Số 12 ngõ 45 đường Trần Thái Tông"
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl font-bold"
                  required
                />
              </div>

              {/* 📌 GOOGLE MAPS DIRECT GPS PINNING FEATURE */}
              <div className="p-3 bg-white border border-indigo-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-indigo-950 text-[11px] flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Định Vị Google Maps Trực Tiếp:</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleTriggerGPS}
                    disabled={isLocatingGPS}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Navigation className={`w-3 h-3 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                    <span>{isLocatingGPS ? 'Đang lấy GPS...' : '📡 Định vị vị trí hiện tại (GPS)'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="Hoặc dán liên kết Google Maps / Tọa độ (Lat, Lng)..."
                  className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-[11px] font-medium"
                />

                {gpsCoords && (
                  <span className="text-[10px] text-emerald-700 font-extrabold block">
                    ✓ Đã ghim tọa độ thực: Lat {gpsCoords.lat.toFixed(5)}, Lng {gpsCoords.lng.toFixed(5)}
                  </span>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Đặt làm địa chỉ nhận hàng mặc định</span>
              </label>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
              >
                Lưu Địa Chỉ Kèm Vị Trí Maps
              </button>
            </form>
          )}

          {/* Saved Addresses List */}
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                Chưa có địa chỉ nào trong sổ địa chỉ. Hãy thêm địa chỉ mới để ghim định vị Maps!
              </div>
            ) : (
              addresses.map((addr) => {
                const mapsLink = addr.google_maps_url || 
                  (addr.latitude && addr.longitude 
                    ? `https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr.detail_address}, ${addr.district}, ${addr.province}`)}`);

                return (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition relative space-y-2 text-xs ${
                      addr.is_default
                        ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-gray-900 font-extrabold text-xs">{addr.recipient_name}</strong>
                          <span className="text-gray-500 font-bold">({addr.phone})</span>
                          {addr.is_default && (
                            <span className="px-2 py-0.5 bg-indigo-600 text-white font-black text-[9px] rounded-full">
                              Mặc định
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mt-1 font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{addr.detail_address}, {addr.district}, {addr.province}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onDeleteAddress?.(addr.id)}
                        className="text-gray-400 hover:text-rose-600 p-1 transition cursor-pointer"
                        title="Xóa địa chỉ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* GOOGLE MAPS DIRECT PIN LINK BUTTON */}
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 font-extrabold">
                      <a
                        href={mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition flex items-center gap-1 text-[11px] border border-rose-200"
                      >
                        <ExternalLink className="w-3 h-3 text-rose-600" />
                        <span>🗺️ Xem định vị Google Maps trực tiếp</span>
                      </a>

                      {!addr.is_default && (
                        <button
                          onClick={() => onSetDefaultAddress?.(addr.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold cursor-pointer"
                        >
                          Thiết lập làm mặc định
                        </button>
                      )}

                      {onSelectAddress && (
                        <button
                          onClick={() => {
                            onSelectAddress(addr);
                            onClose();
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] shadow-sm cursor-pointer"
                        >
                          Giao tới địa chỉ này
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0 text-xs font-extrabold">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl shadow-md cursor-pointer"
          >
            Đóng Hộp Thoại
          </button>
        </div>

      </div>
    </div>
  );
};
