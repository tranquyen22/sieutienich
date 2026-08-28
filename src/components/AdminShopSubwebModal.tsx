import React, { useState, useEffect, useRef } from 'react';
import {
  X, Globe, QrCode, Download, Save, Copy, ExternalLink,
  Palette, Loader2, Phone, MapPin
} from 'lucide-react';
import type { MerchantApplication, ShopSubwebConfig, SubwebTheme } from '../types';
import { supabase } from '../lib/supabase';

interface AdminShopSubwebModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: MerchantApplication | null;
}

export const AdminShopSubwebModal: React.FC<AdminShopSubwebModalProps> = ({
  isOpen,
  onClose,
  merchant,
}) => {
  const [slug, setSlug] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [welcomeMsg, setWelcomeMsg] = useState('');
  const [bannerUrl] = useState('');
  const [hotline, setHotline] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'qr' | 'preview'>('config');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize form from merchant data
  useEffect(() => {
    if (merchant) {
      const generatedSlug = (merchant.shop_name || 'shop')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      setSlug(generatedSlug);
      setHotline(merchant.phone || '');
      setWelcomeMsg(`Chào mừng quý khách đến với Gian hàng ${merchant.shop_name || ''}!`);
    }
  }, [merchant]);

  // Render QR Code onto Canvas
  useEffect(() => {
    if (activeTab === 'qr' && canvasRef.current && slug) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 300);

      // Draw outer border card
      ctx.strokeStyle = brandColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(10, 10, 280, 280);

      // Draw QR Grid Simulation
      ctx.fillStyle = '#0f172a';
      const size = 20;
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 12; j++) {
          if ((i + j) % 2 === 0 || (i * j) % 3 === 0) {
            ctx.fillRect(30 + i * 20, 30 + j * 20, size - 2, size - 2);
          }
        }
      }

      // Draw Center Shop Badge
      ctx.fillStyle = brandColor;
      ctx.beginPath();
      ctx.arc(150, 150, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SIÊU TIỆN ÍCH', 150, 144);
      ctx.fillText('STORE', 150, 158);
    }
  }, [activeTab, slug, brandColor]);

  if (!isOpen || !merchant) return null;

  const subwebFullUrl = `https://sieutienich.vn/shop/${slug}`;

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) {
      alert('Vui lòng nhập URL Slug cho Web con!');
      return;
    }

    setSaving(true);

    try {
      const themeConfig: SubwebTheme = {
        brand_color: brandColor,
        welcome_message: welcomeMsg.trim(),
        banner_url: bannerUrl.trim() || merchant.store_photo,
        hotline: hotline.trim(),
        google_maps_url: mapsUrl.trim(),
      };

      const subwebRecord: Partial<ShopSubwebConfig> = {
        id: `subweb-${merchant.id}`,
        shop_id: merchant.id,
        shop_name: merchant.shop_name || 'Gian Hàng',
        user_id: merchant.user_id,
        custom_slug: slug.trim().toLowerCase(),
        is_subweb_active: isActive,
        subweb_theme: themeConfig,
        updated_at: new Date().toISOString(),
      };

      // Save into Supabase shop_subwebs table
      await supabase.from('shop_subwebs').upsert([subwebRecord]);

      alert(`🎉 ĐÃ CẤU HÌNH WEB CON THÀNH CÔNG!\nURL: ${subwebFullUrl}\nTrạng thái: ${isActive ? '🟢 Đang hoạt động' : '🔴 Tạm ẩn'}`);
      onClose();
    } catch (err: any) {
      alert(`Đã xảy ra lỗi khi lưu cấu hình Web con: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `QR-Standee-${slug}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(subwebFullUrl);
    alert('📋 Đã chép liên kết Web con vào khay nhớ tạm!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative border border-indigo-100 max-h-[92vh] flex flex-col min-w-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 relative shrink-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Quản Lý Web Con Độc Lập & QR Hub</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{merchant.shop_name}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 pt-2 gap-2 text-xs font-black shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-t-2xl transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'bg-white border-indigo-600 text-indigo-700 shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Cấu Hình Tên Miền & Giao Diện</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2.5 rounded-t-2xl transition border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-white border-indigo-600 text-indigo-700 shadow-2xs'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>Mã QR Hub Standee 1-Chạm</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs font-medium">
          {activeTab === 'config' ? (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              {/* Active Subweb Toggle Switch */}
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <strong className="block text-gray-900 text-xs font-black">
                    Trạng Thái Kích Hoạt Web Con (Sub-Storefront Status)
                  </strong>
                  <span className="text-[11px] text-gray-600 block">
                    Cho phép khách hàng truy cập trực tiếp qua URL riêng và cài đặt PWA App độc lập.
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Custom Slug Input */}
              <div className="space-y-1">
                <label className="block font-black text-gray-900">
                  URL Slug Tên Miền Phụ Độc Lập *
                </label>
                <div className="flex items-center gap-2">
                  <span className="p-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 font-bold shrink-0 text-xs">
                    sieutienich.vn/shop/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="nong-lam-store"
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-black text-xs text-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer text-gray-700 shrink-0"
                    title="Chép liên kết"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Brand Color Picker & Presets */}
              <div className="space-y-1.5">
                <label className="block font-black text-gray-900 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mã Màu Thương Hiệu Shop (Brand Theme Color) *</span>
                </label>

                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-300 cursor-pointer p-0.5"
                  />

                  {/* Preset Colors */}
                  <div className="flex items-center gap-2">
                    {['#4f46e5', '#16a34a', '#dc2626', '#d97706', '#0284c7', '#7c3aed'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBrandColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          brandColor === c ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-1">
                <label className="block font-black text-gray-900">Thông Điệp Chào Mừng Khách Hàng</label>
                <input
                  type="text"
                  value={welcomeMsg}
                  onChange={(e) => setWelcomeMsg(e.target.value)}
                  placeholder="VD: Gian hàng nông sản sạch hữu cơ chính hãng..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs"
                />
              </div>

              {/* Hotline & Google Maps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-800 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hotline Trực Shop:</span>
                  </label>
                  <input
                    type="text"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    placeholder="0912345678"
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>Link Google Maps Định Vị Quầy:</span>
                  </label>
                  <input
                    type="url"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0 font-extrabold">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl shadow-md cursor-pointer font-black flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-indigo-200" />
                      <span>💾 Lưu Cấu Hình Web Con</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* QR CODE HUB STANDEE TAB */
            <div className="space-y-5 text-center py-2 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-bold">
                Mã QR Động chứa thương hiệu shop dùng để in ấn Standee đặt tại quầy hoặc chia sẻ Zalo/Facebook:
              </div>

              {/* Canvas QR Rendering Container */}
              <div className="inline-block p-4 bg-white rounded-3xl shadow-xl border border-gray-200">
                <canvas ref={canvasRef} width={300} height={300} className="mx-auto rounded-2xl" />
                <span className="block text-xs font-black text-gray-900 mt-2 truncate">
                  {merchant.shop_name}
                </span>
                <span className="block text-[11px] font-bold text-indigo-600 truncate">{subwebFullUrl}</span>
              </div>

              <div className="flex items-center justify-center gap-3 font-black">
                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-2 text-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span> Tải Mã QR In Standee (PNG)</span>
                </button>

                <a
                  href={subwebFullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl cursor-pointer flex items-center gap-1.5 text-xs transition border border-indigo-200 no-underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở Trực Tiếp Web Con</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
