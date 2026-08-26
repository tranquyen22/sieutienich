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
import { StaffPermissionModal } from './components/StaffPermissionModal';
import { MerchantReconciliationModal } from './components/MerchantReconciliationModal';
import { CustomerAddressBookModal } from './components/CustomerAddressBookModal';
import { DirectMessagingModal } from './components/DirectMessagingModal';
import { BuyerDashboardModal } from './components/BuyerDashboardModal';
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import type { Product, CustomerAddress } from './types';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [adminReviewModalOpen, setAdminReviewModalOpen] = useState(false);
  const [coinWalletModalOpen, setCoinWalletModalOpen] = useState(false);
  const [orderTrackingModalOpen, setOrderTrackingModalOpen] = useState(false);
  const [staffPermissionModalOpen, setStaffPermissionModalOpen] = useState(false);
  const [merchantReconciliationModalOpen, setMerchantReconciliationModalOpen] = useState(false);
  const [customerAddressBookModalOpen, setCustomerAddressBookModalOpen] = useState(false);
  const [directMessagingModalOpen, setDirectMessagingModalOpen] = useState(false);
  const [buyerDashboardModalOpen, setBuyerDashboardModalOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Customer Saved Addresses State
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([
    {
      id: 'addr-1',
      user_id: 'current-user',
      recipient_name: 'Nguyễn Văn Hùng',
      phone: '0912345678',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      detail_address: 'Số 18 ngõ 20 đường Trần Thái Tông',
      is_default: true,
    },
    {
      id: 'addr-2',
      user_id: 'current-user',
      recipient_name: 'Trần Thị Thu Hải',
      phone: '0987654321',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      detail_address: 'Chợ Thị trấn Khoái Châu',
      is_default: false,
    },
  ]);

  const handleAddAddress = (newAddr: Omit<CustomerAddress, 'id'>) => {
    const created: CustomerAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };

    if (created.is_default) {
      setCustomerAddresses((prev) =>
        prev.map((a) => ({ ...a, is_default: false })).concat(created)
      );
    } else {
      setCustomerAddresses((prev) => [...prev, created]);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setCustomerAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setCustomerAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER */}
      <Header 
        onOpenAuthModal={() => setAuthModalOpen(true)} 
        onOpenAddProductModal={() => setAddProductModalOpen(true)} 
        onOpenAdminReviewModal={() => setAdminReviewModalOpen(true)}
        onOpenCoinWalletModal={() => setCoinWalletModalOpen(true)}
        onOpenOrderTrackingModal={() => setOrderTrackingModalOpen(true)}
        onOpenStaffPermissionModal={() => setStaffPermissionModalOpen(true)}
        onOpenMerchantReconciliationModal={() => setMerchantReconciliationModalOpen(true)}
        onOpenCustomerAddressBookModal={() => setCustomerAddressBookModalOpen(true)}
        onOpenDirectMessagingModal={() => setDirectMessagingModalOpen(true)}
        onOpenBuyerDashboardModal={() => setBuyerDashboardModalOpen(true)}
      />

      {/* BANNER Carousel & Side Cards & Homepage Daily Check-in */}
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
                <h4 className="font-bold text-sm text-gray-900">Đối Soát Công Nợ Sàn ⇄ Shop</h4>
                <p className="text-xs text-gray-500 mt-0.5">Chốt sổ ngày 1 hàng tháng • Cấn trừ hai chiều 7 ngày.</p>
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

      <StaffPermissionModal
        isOpen={staffPermissionModalOpen}
        onClose={() => setStaffPermissionModalOpen(false)}
      />

      <MerchantReconciliationModal
        isOpen={merchantReconciliationModalOpen}
        onClose={() => setMerchantReconciliationModalOpen(false)}
      />

      <CustomerAddressBookModal
        isOpen={customerAddressBookModalOpen}
        onClose={() => setCustomerAddressBookModalOpen(false)}
        addresses={customerAddresses}
        onAddAddress={handleAddAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
      />

      <DirectMessagingModal
        isOpen={directMessagingModalOpen}
        onClose={() => setDirectMessagingModalOpen(false)}
      />

      <BuyerDashboardModal
        isOpen={buyerDashboardModalOpen}
        onClose={() => setBuyerDashboardModalOpen(false)}
        addresses={customerAddresses}
        onOpenAddressBook={() => {
          setBuyerDashboardModalOpen(false);
          setCustomerAddressBookModalOpen(true);
        }}
        onOpenMessaging={() => {
          setBuyerDashboardModalOpen(false);
          setDirectMessagingModalOpen(true);
        }}
        onOpenOrderTracking={() => {
          setBuyerDashboardModalOpen(false);
          setOrderTrackingModalOpen(true);
        }}
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
