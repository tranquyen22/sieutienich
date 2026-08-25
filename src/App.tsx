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
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [adminReviewModalOpen, setAdminReviewModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER */}
      <Header 
        onOpenAuthModal={() => setAuthModalOpen(true)} 
        onOpenAddProductModal={() => setAddProductModalOpen(true)} 
        onOpenAdminReviewModal={() => setAdminReviewModalOpen(true)}
      />

      {/* BANNER Carousel & Side Cards */}
      <Banner />

      {/* THANH LỌC & ĐỊNH VỊ GPS (BÊN DƯỚI BANNER) */}
      <LocationFilterBar />

      {/* DANH MỤC & LƯỚI SẢN PHẨM */}
      <main id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full">
        <CategoryFilter />
        <ProductGrid />
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
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Supabase Auth Security</h4>
                <p className="text-xs text-gray-500 mt-0.5">Xác thực người dùng bảo mật chuẩn OAuth2 / JWT.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Giao diện chuẩn Responsive</h4>
                <p className="text-xs text-gray-500 mt-0.5">Tối ưu mượt mà trên mọi thiết bị với Tailwind CSS.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Siêu Tiện Ích. Nền tảng Đa Dịch Vụ Realtime với React & Supabase.
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AddProductModal isOpen={addProductModalOpen} onClose={() => setAddProductModalOpen(false)} />
      <AdminMerchantReviewModal isOpen={adminReviewModalOpen} onClose={() => setAdminReviewModalOpen(false)} />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </AuthProvider>
  );
}
