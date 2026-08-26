import React, { useState } from 'react';
import { X, MapPin, Plus, Trash2, Home } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleSubmitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !detailAddress.trim()) {
      alert('Vui lòng nhập đầy đủ Tên người nhận, Số điện thoại và Địa chỉ chi tiết!');
      return;
    }

    onAddAddress?.({
      user_id: 'current-user',
      recipient_name: recipientName,
      phone,
      province,
      district,
      detail_address: detailAddress,
      is_default: addresses.length === 0 ? true : isDefault,
    });

    // Reset form
    setRecipientName('');
    setPhone('');
    setDetailAddress('');
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
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 relative shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition absolute right-4 top-4 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>Sổ Địa Chỉ Giao Hàng Của Khách</span>
          </div>

          <h2 className="text-xl font-black text-white flex items-center justify-between">
            <span>Sổ Địa Chỉ Nhận Hàng</span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Hủy' : 'Thêm mới'}</span>
            </button>
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Add New Address Form */}
          {isAdding && (
            <form onSubmit={handleSubmitNewAddress} className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3 text-xs">
              <h3 className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                <Home className="w-4 h-4 text-indigo-600" />
                <span>Thêm Địa Chỉ Giao Hàng Mới</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tên người nhận *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0987654321"
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Tỉnh / Thành phố</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hưng Yên">Hưng Yên</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Quận / Huyện</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Cầu Giấy / Khoái Châu..."
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
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
                Lưu Địa Chỉ Mới
              </button>
            </form>
          )}

          {/* Saved Addresses List */}
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                Chưa có địa chỉ nào trong sổ địa chỉ. Hãy thêm địa chỉ mới để đặt hàng nhanh chóng!
              </div>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 rounded-2xl border transition relative space-y-2 text-xs ${
                    addr.is_default
                      ? 'border-indigo-500 bg-indigo-50/40 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-gray-900">{addr.recipient_name}</span>
                      <span className="text-gray-500 text-xs">({addr.phone})</span>
                      {addr.is_default && (
                        <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onSelectAddress && (
                        <button
                          onClick={() => {
                            onSelectAddress(addr);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          Chọn địa chỉ này
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteAddress?.(addr.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        title="Xóa địa chỉ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 font-medium">
                    {addr.detail_address}, {addr.district}, {addr.province}
                  </p>

                  {!addr.is_default && (
                    <button
                      onClick={() => onSetDefaultAddress?.(addr.id)}
                      className="text-indigo-600 hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Thiết lập làm mặc định
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
