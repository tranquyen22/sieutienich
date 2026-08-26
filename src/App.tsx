import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { MultiStepShopOnboardingModal } from './components/MultiStepShopOnboardingModal';
import { ShopDetailPortalModal } from './components/ShopDetailPortalModal';
import { ShopStatusToggleModal } from './components/ShopStatusToggleModal';
import { AccountRoleAccessMatrixModal } from './components/AccountRoleAccessMatrixModal';
import { AdminUserManagementModal } from './components/AdminUserManagementModal';
import { AdminDashboardPortalModal } from './components/AdminDashboardPortalModal';
import { ImpersonationBannerBar } from './components/ImpersonationBannerBar';
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import type { Product, CustomerAddress } from './types';

function AppContent() {
  const { userRole } = useAuth();

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
  const [multiStepOnboardingModalOpen, setMultiStepOnboardingModalOpen] = useState(false);
  const [shopDetailPortalModalOpen, setShopDetailPortalModalOpen] = useState(false);
  const [shopStatusToggleModalOpen, setShopStatusToggleModalOpen] = useState(false);
  const [accountRoleMatrixModalOpen, setAccountRoleMatrixModalOpen] = useState(false);
  const [adminUserManagementModalOpen, setAdminUserManagementModalOpen] = useState(false);

  // Admin Dashboard Portal Landing Modal (Openable by default for Admin)
  const [adminDashboardModalOpen, setAdminDashboardModalOpen] = useState(userRole === 'admin');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Address Book Demo Data State
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([
    {
      id: 'addr-1',
      user_id: 'usr-buyer-demo',
      recipient_name: 'Trần Văn Quyền',
      phone: '0912345678',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      detail_address: 'Số 18 Trần Thái Tông, Dịch Vọng Hậu',
      is_default: true,
    },
    {
      id: 'addr-2',
      user_id: 'usr-buyer-demo',
      recipient_name: 'Nguyễn Thị Hoa',
      phone: '0987654321',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      detail_address: 'Chợ Thị trấn Khoái Châu, Hưng Yên',
      is_default: false,
    },
  ]);

  const handleSaveAddress = (created: Omit<CustomerAddress, "id"> | CustomerAddress) => {
    const fullAddr: CustomerAddress = 'id' in created ? created : { ...created, id: `addr-${Date.now()}` };
    const existingIndex = customerAddresses.findIndex((a) => a.id === fullAddr.id);
    if (existingIndex >= 0) {
      setCustomerAddresses((prev) =>
        prev.map((a) => (a.id === fullAddr.id ? fullAddr : a))
      );
    } else {
      setCustomerAddresses((prev) => [...prev, fullAddr]);
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
      
      {/* IMPERSONATION TOP WARNING BANNER BAR */}
      <ImpersonationBannerBar />

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
        onOpenMultiStepOnboardingModal={() => setMultiStepOnboardingModalOpen(true)}
        onOpenShopDetailPortalModal={() => setShopDetailPortalModalOpen(true)}
        onOpenShopStatusToggleModal={() => setShopStatusToggleModalOpen(true)}
        onOpenAccountRoleAccessMatrixModal={() => setAccountRoleMatrixModalOpen(true)}
        onOpenAdminUserManagementModal={() => setAdminUserManagementModalOpen(true)}
        onOpenAdminDashboardModal={() => setAdminDashboardModalOpen(true)}
      />

      {/* BANNER Carousel & Side Cards & Homepage Daily Check-in */}
      <Banner />

      {/* THANH LỌC & ĐỊNH VỊ GPS (BÊN DƯỚI BANNER) */}
      <div className="bg-white border-b border-gray-200 shadow-sm py-2 sticky top-[64px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LocationFilterBar />
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 w-full">
        {/* Category List */}
        <section className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <span>Danh Mục Ngành Hàng Tuỳ Biến Form</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">Tự động gợi ý Form</span>
            </h2>
          </div>
          <CategoryFilter />
        </section>

        {/* Product Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900">Khám Phá Gian Hàng Tiện Ích Gần Bạn</h2>
              <p className="text-xs text-gray-500">Tự động tìm kiếm gõ không dấu & gợi ý khoảng cách GPS thực tế</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-100">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span className="hidden sm:inline">Cập nhật thời gian thực</span>
            </div>
          </div>

          <ProductGrid onSelectProduct={(prod) => setSelectedProduct(prod)} />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-400 py-10 border-t border-slate-800 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>SIÊU TIỆN ÍCH</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Nền tảng danh bạ đa dịch vụ & thương mại điện tử kết nối thông minh khách hàng và các gian hàng xác minh địa phương.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Hệ Thống Tiện Ích</h3>
            <ul className="space-y-2">
              <li className="hover:text-white transition cursor-pointer">Danh bạ tiện ích & dịch vụ</li>
              <li className="hover:text-white transition cursor-pointer">Nông sản & Lẩu Thái Khoái Châu</li>
              <li className="hover:text-white transition cursor-pointer">Cho thuê kiot & Homestay</li>
              <li className="hover:text-white transition cursor-pointer">Điểm danh tích Xu Siêu Tiện Ích</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Hỗ Trợ & Chính Sách</h3>
            <ul className="space-y-2">
              <li className="hover:text-white transition cursor-pointer">Quy trình xác minh Khâu 1 & 2</li>
              <li className="hover:text-white transition cursor-pointer">Quy tắc tích & đổi Xu TQ</li>
              <li className="hover:text-white transition cursor-pointer">Chính sách bảo vệ dữ liệu cá nhân</li>
              <li className="hover:text-white transition cursor-pointer">Yêu cầu xoá tài khoản tự động</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Tài Khoản & Quản Trị</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-center"
              >
                Đăng Nhập / Đăng Ký
              </button>
              <p className="text-[11px] text-gray-500 text-center">Hỗ trợ 4 loại tài khoản: Khách, Chủ shop, Nhân viên & Admin tổng</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Siêu Tiện Ích. Bản quyền thuộc về Antigravity System.</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <RefreshCw className="w-3.5 h-3.5" /> Đồng bộ hai chiều real-time
          </span>
        </div>
      </footer>

      {/* ALL MODALS & DRAWERS */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AddProductModal isOpen={addProductModalOpen} onClose={() => setAddProductModalOpen(false)} />
      <AdminMerchantReviewModal isOpen={adminReviewModalOpen} onClose={() => setAdminReviewModalOpen(false)} />
      <CoinWalletModal isOpen={coinWalletModalOpen} onClose={() => setCoinWalletModalOpen(false)} />
      <OrderTrackingModal isOpen={orderTrackingModalOpen} onClose={() => setOrderTrackingModalOpen(false)} />
      <StaffPermissionModal isOpen={staffPermissionModalOpen} onClose={() => setStaffPermissionModalOpen(false)} />
      <MerchantReconciliationModal isOpen={merchantReconciliationModalOpen} onClose={() => setMerchantReconciliationModalOpen(false)} />
      <CustomerAddressBookModal 
        isOpen={customerAddressBookModalOpen} 
        onClose={() => setCustomerAddressBookModalOpen(false)} 
        addresses={customerAddresses}
        onAddAddress={handleSaveAddress}
        onDeleteAddress={handleDeleteAddress}
        onSetDefaultAddress={handleSetDefaultAddress}
      />
      <DirectMessagingModal isOpen={directMessagingModalOpen} onClose={() => setDirectMessagingModalOpen(false)} />
      <BuyerDashboardModal 
        isOpen={buyerDashboardModalOpen} 
        onClose={() => setBuyerDashboardModalOpen(false)}
        addresses={customerAddresses}
        onOpenMessaging={() => {
          setBuyerDashboardModalOpen(false);
          setDirectMessagingModalOpen(true);
        }}
        onOpenOrderTracking={() => {
          setBuyerDashboardModalOpen(false);
          setOrderTrackingModalOpen(true);
        }}
        onOpenAddressBook={() => {
          setBuyerDashboardModalOpen(false);
          setCustomerAddressBookModalOpen(true);
        }}
      />
      <MultiStepShopOnboardingModal isOpen={multiStepOnboardingModalOpen} onClose={() => setMultiStepOnboardingModalOpen(false)} />
      <ShopDetailPortalModal isOpen={shopDetailPortalModalOpen} onClose={() => setShopDetailPortalModalOpen(false)} />
      <ShopStatusToggleModal isOpen={shopStatusToggleModalOpen} onClose={() => setShopStatusToggleModalOpen(false)} />
      <AccountRoleAccessMatrixModal isOpen={accountRoleMatrixModalOpen} onClose={() => setAccountRoleMatrixModalOpen(false)} />
      <AdminUserManagementModal isOpen={adminUserManagementModalOpen} onClose={() => setAdminUserManagementModalOpen(false)} />

      {/* SUPER ADMIN LANDING DASHBOARD MODAL (HÔM NAY CÓ GÌ CẦN LÀM & SÀN ĐANG CHẠY RA SAO) */}
      <AdminDashboardPortalModal
        isOpen={adminDashboardModalOpen}
        onClose={() => setAdminDashboardModalOpen(false)}
        onOpenAdminReviewModal={() => setAdminReviewModalOpen(true)}
        onOpenAdminUserManagementModal={() => setAdminUserManagementModalOpen(true)}
        onOpenMerchantReconciliationModal={() => setMerchantReconciliationModalOpen(true)}
        onOpenDirectMessagingModal={() => setDirectMessagingModalOpen(true)}
      />

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
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
