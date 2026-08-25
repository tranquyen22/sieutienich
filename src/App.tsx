import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { LocationFilterBar } from './components/LocationFilterBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { AuthModal } from './components/AuthModal';
import { AddProductModal } from './components/AddProductModal';
import { AdminMerchantReviewModal } from './components/AdminMerchantReviewModal';
import { CoinWalletModal } from './components/CoinWalletModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import type { Product } from './types';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [adminReviewModalOpen, setAdminReviewModalOpen] = useState(false);
  const [coinWalletModalOpen, setCoinWalletModalOpen] = useState(false);
  const [orderTrackingModalOpen, setOrderTrackingModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER */}
      <Header 
        onOpenAuthModal={() => setAuthModalOpen(true)} 
        onOpenAddProductModal={() => setAddProductModalOpen(true)} 
        onOpenAdminReviewModal={() => setAdminReviewModalOpen(true)}
        onOpenCoinWalletModal={() => setCoinWalletModalOpen(true)}
        onOpenOrderTrackingModal={() => setOrderTrackingModalOpen(true)}
      />

      {/* BANNER Carousel & Side Cards */}
      <Banner />

      {/* THANH LỌC & ĐỊNH VỊ GPS (BÊN DƯỚI BANNER) */}
      <LocationFilterBar />

      {/* DANH MỤC & LƯỚI SẢN PHẨM */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        <CategoryFilter />
        <ProductGrid onSelectProduct={(product) => setSelectedProductDetail(product)} />
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Realtime Synchronization</h4>
                <p className="text-xs text-gray-500 mt-0.5">Dữ liệu cập nhật tức thì qua Supabase Pub/Sub.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Mạng Lưới Tiện Ích Đã Xác Minh</h4>
                <p className="text-xs text-gray-500 mt-0.5">Shop TQ & Shop Xác minh minh bạch thông tin GPKD.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Sàn Giao Dịch Trung Gian</h4>
                <p className="text-xs text-gray-500 mt-0.5">Hiển thị tiện ích, Shop và Khách tự giao dịch & tự thanh toán.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2026 Siêu Tiện Ích TQ Network. Bản quyền đã được bảo hộ.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-indigo-600 transition">Điều khoản sử dụng</a>
              <a href="#" className="hover:text-indigo-600 transition">Chính sách bảo mật</a>
              <a href="#" className="hover:text-indigo-600 transition">Hỗ trợ khách hàng</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWER */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AddProductModal isOpen={addProductModalOpen} onClose={() => setAddProductModalOpen(false)} />
      <AdminMerchantReviewModal isOpen={adminReviewModalOpen} onClose={() => setAdminReviewModalOpen(false)} />
      <CoinWalletModal isOpen={coinWalletModalOpen} onClose={() => setCoinWalletModalOpen(false)} />
      
      <OrderTrackingModal 
        isOpen={orderTrackingModalOpen} 
        onClose={() => setOrderTrackingModalOpen(false)} 
      />

      <ProductDetailModal 
        product={selectedProductDetail} 
        onClose={() => setSelectedProductDetail(null)} 
      />
      
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
