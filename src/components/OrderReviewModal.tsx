import React, { useState } from 'react';
import { X, Star, CheckCircle2, Coins, Sparkles, Trash2, Camera } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Order } from '../types';

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({ isOpen, onClose, order }) => {
  const { addCoinTransaction } = useShop();

  const [rating, setRating] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const firstItemName = order.items[0]?.product.name || 'Sản phẩm Siêu Tiện Ích';
  const firstItemImg = order.items[0]?.product.img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';

  // Handle Photo Upload From Device Gallery / Photo Library
  const handlePhotoUploadFromLibrary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotoUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotoUrls.push(url);
    });

    setUploadedPhotos((prev) => [...prev, ...newPhotoUrls].slice(0, 5));
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const textLength = commentText.trim().length;
  const hasEnoughText = textLength >= 15;
  const hasUploadedPhoto = uploadedPhotos.length > 0;
  const isEligibleForCoinReward = hasEnoughText && hasUploadedPhoto;

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return '⭐⭐⭐⭐⭐ Rất tuyệt vời';
      case 4: return '⭐⭐⭐⭐ Hài lòng';
      case 3: return '⭐⭐⭐ Bình thường';
      case 2: return '⭐⭐ Chưa hài lòng';
      case 1: return '⭐ Rất tệ';
      default: return '';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) {
      alert('Vui lòng nhập nội dung đánh giá của bạn!');
      return;
    }

    setIsSubmitting(true);

    if (isEligibleForCoinReward) {
      // Award +100 Regular Coins for valid review with text >= 15 chars AND gallery photo
      await addCoinTransaction(100, 'earn', `🎁 Thưởng Đánh Giá Đơn hàng #${order.id} (Kèm chữ & ảnh từ thư viện)`, 'regular');
      alert(`🎉 ĐÃ ĐÁNH GIÁ THÀNH CÔNG!\n\n🎁 Bạn vừa nhận +100 Xu Thường vào ví vì đã viết bình luận (≥15 chữ) VÀ tải lên hình ảnh sản phẩm từ thư viện thiết bị!`);
    } else {
      let missingReason = '';
      if (!hasEnoughText) missingReason += '• Cần viết bình luận tối thiểu 15 ký tự chữ.\n';
      if (!hasUploadedPhoto) missingReason += '• Cần tải lên ít nhất 1 ảnh chụp sản phẩm từ thư viện thiết bị.\n';

      alert(`✅ Đã ghi nhận đánh giá của bạn!\n\n⚠️ LƯU Ý CHƯA ĐỦ ĐIỀU KIỆN NHẬN XU:\n${missingReason}\nHãy đánh giá kèm đủ chữ VÀ ảnh từ thư viện ở các đơn sau để nhận xu thưởng nhé!`);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-amber-200 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-300 animate-bounce" />
            <div>
              <h3 className="font-black text-base text-white">Đánh Giá Nhận +100 Xu Thường</h3>
              <p className="text-[11px] text-amber-100">Cần có chữ (≥15 ký tự) VÀ ảnh tải lên từ thư viện</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitReview} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs font-medium">
          
          {/* Order Item Preview */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3">
            <img src={firstItemImg} alt={firstItemName} className="w-12 h-12 rounded-xl object-cover border shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-extrabold text-indigo-700 text-[10px]">Đơn hàng #{order.id}</span>
              <h4 className="font-extrabold text-gray-900 text-xs truncate">{firstItemName}</h4>
              <span className="text-[10px] text-gray-400">Tổng tiền: {order.final_amount.toLocaleString()} đ</span>
            </div>
          </div>

          {/* COIN CASHBACK ELIGIBILITY RULE CHECKBOX BOX */}
          <div className={`p-3.5 rounded-2xl border transition space-y-1.5 ${
            isEligibleForCoinReward 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center justify-between font-black">
              <span className="flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Điều kiện nhận +100 Xu Thường:</span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                isEligibleForCoinReward ? 'bg-emerald-600 text-white font-extrabold' : 'bg-amber-200 text-amber-900 font-bold'
              }`}>
                {isEligibleForCoinReward ? '✓ ĐỦ ĐIỀU KIỆN NHẬN XU' : '⏳ CHƯA ĐỦ ĐIỀU KIỆN'}
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className={hasEnoughText ? 'text-emerald-700 font-bold' : 'text-amber-800'}>
                  {hasEnoughText ? '✓' : '⚪'} 1. Nhận xét có chữ tối thiểu 15 ký tự ({textLength}/15 ký tự)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={hasUploadedPhoto ? 'text-emerald-700 font-bold' : 'text-amber-800'}>
                  {hasUploadedPhoto ? '✓' : '⚪'} 2. Có ít nhất 1 hình ảnh tải lên từ thư viện thiết bị ({uploadedPhotos.length} ảnh)
                </span>
              </div>
            </div>
          </div>

          {/* 1. STAR RATING SELECTOR */}
          <div className="space-y-2 text-center">
            <label className="block font-black text-gray-900 text-xs">1. Chọn chất lượng dịch vụ / sản phẩm *</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition cursor-pointer"
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-700 block">{getRatingLabel(rating)}</span>
          </div>

          {/* 2. TEXT COMMENT AREA */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-black text-gray-900">
                2. Nhập bình luận chi tiết * <span className="text-amber-600 font-bold">(Cần ≥15 chữ để nhận xu)</span>
              </label>
              <span className={`text-[10px] font-bold ${hasEnoughText ? 'text-emerald-600' : 'text-gray-400'}`}>
                {textLength}/15 ký tự
              </span>
            </div>

            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="VD: Đồ ăn cực kỳ tươi ngon, giao nhanh trong 20 phút, đóng gói cẩn thận. Rất hài lòng với dịch vụ của shop!"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-2xl font-medium text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
            />
          </div>

          {/* 3. LOCAL FILE IMAGE UPLOADER FROM GALLERY */}
          <div className="space-y-2">
            <label className="block font-black text-gray-900">
              3. Tải ảnh từ thư viện thiết bị * <span className="text-amber-600 font-bold">(Bắt buộc ảnh để nhận xu)</span>
            </label>

            {/* Upload Area */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <label className="w-20 h-20 bg-amber-50 hover:bg-amber-100 border-2 border-dashed border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center p-1">
                <Camera className="w-5 h-5 text-amber-600" />
                <span className="text-[9px] font-black text-amber-900 leading-none">Thư viện ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUploadFromLibrary}
                  className="hidden"
                />
              </label>

              {/* Uploaded Thumbnails Preview */}
              {uploadedPhotos.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-300 shadow-2xs group">
                  <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-rose-600 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-400">
              📌 Hỗ trợ định dạng JPG, PNG. Có thể chọn tối đa 5 ảnh trực tiếp từ bộ nhớ điện thoại hoặc máy tính.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isEligibleForCoinReward 
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-200 hover:scale-[1.01]' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isEligibleForCoinReward ? '🎁 Gửi Đánh Giá & Nhận +100 Xu Thường' : 'Gửi Đánh Giá Sản Phẩm'}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};
