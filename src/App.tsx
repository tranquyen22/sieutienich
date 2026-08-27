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
import { MultiStepShopOnboardingModal } from './components/MultiStepShopOnboardingModal';
import { ShopDetailPortalModal } from './components/ShopDetailPortalModal';
import { ShopStatusToggleModal } from './components/ShopStatusToggleModal';
import { AccountRoleAccessMatrixModal } from './components/AccountRoleAccessMatrixModal';
import { AdminUserManagementModal } from './components/AdminUserManagementModal';
import { AdminDashboardPortalModal } from './components/AdminDashboardPortalModal';
import { PublicDirectoryModal } from './components/PublicDirectoryModal';
import { AdminPlatformAnalyticsModal } from './components/AdminPlatformAnalyticsModal';
import { FloatingQuickChatButton } from './components/FloatingQuickChatButton';
import { OrderInvoiceModal } from './components/OrderInvoiceModal';
import { OrderReviewModal } from './components/OrderReviewModal';
import { MobileBottomNavBar } from './components/MobileBottomNavBar';
import { ImpersonationBannerBar } from './components/ImpersonationBannerBar';
import { PWAInstallPromptBar } from './components/PWAInstallPromptBar';
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap } from 'lucide-react';
import type { Product, CustomerAddress, Order } from './types';

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
  const [multiStepOnboardingModalOpen, setMultiStepOnboardingModalOpen] = useState(false);
  const [shopDetailPortalModalOpen, setShopDetailPortalModalOpen] = useState(false);
  const [shopStatusToggleModalOpen, setShopStatusToggleModalOpen] = useState(false);
  const [accountRoleMatrixModalOpen, setAccountRoleMatrixModalOpen] = useState(false);
  const [adminUserManagementModalOpen, setAdminUserManagementModalOpen] = useState(false);
  const [publicDirectoryModalOpen, setPublicDirectoryModalOpen] = useState(false);
  const [adminAnalyticsModalOpen, setAdminAnalyticsModalOpen] = useState(false);

  // Merchant Invoice Generation States
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Messaging Auto Product Asking Target Info
  const [messagingTargetInfo, setMessagingTargetInfo] = useState<{
    shopName?: string;
    productId?: string | number;
    productName?: string;
    productPrice?: number;
    targetPhone?: string;
  }>({});

  // Admin Dashboard Portal Landing Modal (Openable by Admin)
  const [adminDashboardModalOpen, setAdminDashboardModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Address Book Demo Data State
  const [customerAddresses] = useState<CustomerAddress[]>([
    {
      id: 'addr-1',
      user_id: 'usr-buyer-demo',
      recipient_name: 'Trần Văn Quyền',
      phone: '0367818343',
      province: 'Hà Nội',
      district: 'Cầu Giấy',
      detail_address: 'Số 18 Trần Thái Tông, Phường Dịch Vọng',
      is_default: true,
    },
    {
      id: 'addr-2',
      user_id: 'usr-buyer-demo',
      recipient_name: 'Trần Văn Quyền (Nhà riêng Hưng Yên)',
      phone: '0367818343',
      province: 'Hưng Yên',
      district: 'Khoái Châu',
      detail_address: 'Số 88 Đường Thị trấn Khoái Châu',
      is_default: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16 sm:pb-0">
      {/* Top Impersonation Warning Banner (If Super Admin is viewing as Shop) */}
      <ImpersonationBannerBar />

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
        onOpenAdminUserManagementModal={() => setAdminUserManagementModalOpen(true)}
        onOpenAdminDashboardModal={() => setAdminDashboardModalOpen(true)}
        onOpenPublicDirectoryModal={() => setPublicDirectoryModalOpen(true)}
        onOpenAdminPlatformAnalyticsModal={() => setAdminAnalyticsModalOpen(true)}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Banner />
        <LocationFilterBar />
        <CategoryFilter />
        <ProductGrid onSelectProduct={(prod) => setSelectedProduct(prod)} />
      </main>

      <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              <span>Siêu Tiện Ích Platform</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Hệ sinh thái kết nối Gian hàng, Nông sản, Dịch vụ & Danh bạ trực tuyến đa năng. Tối ưu hóa trải nghiệm mua sắm realtime.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Thông Tin Hỗ Trợ</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Quy chế hoạt động sàn TMĐT</li>
              <li>• Chính sách bảo vệ dữ liệu cá nhân (PDPD)</li>
              <li>• Cơ chế giải quyết khiếu nại & Tranh chấp</li>
              <li>• Tổng đài hỗ trợ 24/7: 1900 6889</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Tiêu Chuẩn Kỹ Thuật</h4>
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
              <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Bảo mật Chuẩn ISO/IEC 27001</span>
              </span>
              <span className="text-slate-400 text-[11px] block">Tích hợp PWA Standalone - Cài đặt ứng dụng trực tiếp lên màn hình điện thoại iOS & Android.</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-slate-800/80 text-center text-slate-500 text-[11px]">
          © 2026 Siêu Tiện Ích Platform. Tất cả quyền được bảo hộ.
        </div>
      </footer>

      {/* Modals Mounting */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <AddProductModal isOpen={addProductModalOpen} onClose={() => setAddProductModalOpen(false)} />
      <AdminMerchantReviewModal 
        isOpen={adminReviewModalOpen} 
        onClose={() => setAdminReviewModalOpen(false)}
      />
      <CoinWalletModal isOpen={coinWalletModalOpen} onClose={() => setCoinWalletModalOpen(false)} />
      <OrderTrackingModal 
        isOpen={orderTrackingModalOpen} 
        onClose={() => setOrderTrackingModalOpen(false)} 
        onOpenInvoiceModal={(order) => {
          setInvoiceOrder(order);
          setInvoiceModalOpen(true);
        }}
        onOpenReviewModal={(order) => {
          setReviewOrder(order);
          setReviewModalOpen(true);
        }}
      />

      {/* CUSTOMER ORDER REVIEW & REWARD COIN MODAL */}
      <OrderReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        order={reviewOrder}
      />
      <StaffPermissionModal isOpen={staffPermissionModalOpen} onClose={() => setStaffPermissionModalOpen(false)} />
      <MerchantReconciliationModal isOpen={merchantReconciliationModalOpen} onClose={() => setMerchantReconciliationModalOpen(false)} />
      <CustomerAddressBookModal 
        isOpen={customerAddressBookModalOpen} 
        onClose={() => setCustomerAddressBookModalOpen(false)}
        addresses={customerAddresses}
      />

      {/* REALTIME 2-COLUMN MESSENGER MODAL */}
      <DirectMessagingModal 
        isOpen={directMessagingModalOpen} 
        onClose={() => setDirectMessagingModalOpen(false)}
        initialTargetShopName={messagingTargetInfo.shopName}
        initialProductId={messagingTargetInfo.productId}
        initialProductName={messagingTargetInfo.productName}
        initialProductPrice={messagingTargetInfo.productPrice}
        initialTargetPhone={messagingTargetInfo.targetPhone}
      />

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
      
      {/* PUBLIC UTILITIES & SERVICES DIRECTORY MODAL */}
      <PublicDirectoryModal
        isOpen={publicDirectoryModalOpen}
        onClose={() => setPublicDirectoryModalOpen(false)}
        onOpenDirectMessagingModal={(targetShopName, productName, productPrice, targetPhone) => {
          setMessagingTargetInfo({
            shopName: targetShopName || '',
            productName: productName || '',
            productPrice: productPrice,
            targetPhone: targetPhone || '',
          });
          setDirectMessagingModalOpen(true);
        }}
      />

      {/* SUPER ADMIN PLATFORM ANALYTICS & ADVANCED EXCEL EXPORT MODAL */}
      <AdminPlatformAnalyticsModal isOpen={adminAnalyticsModalOpen} onClose={() => setAdminAnalyticsModalOpen(false)} />

      {/* SHOP ORDER INVOICE PRINT & SALES RECORDING MODAL */}
      <OrderInvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        order={invoiceOrder}
      />

      {/* SUPER ADMIN LANDING DASHBOARD MODAL (HÔM NAY CÓ GÌ CẦN LÀM & SÀN ĐANG CHẠY RA SAO) */}
      <AdminDashboardPortalModal
        isOpen={adminDashboardModalOpen}
        onClose={() => setAdminDashboardModalOpen(false)}
        onOpenAdminReviewModal={() => setAdminReviewModalOpen(true)}
        onOpenAdminUserManagementModal={() => setAdminUserManagementModalOpen(true)}
        onOpenMerchantReconciliationModal={() => setMerchantReconciliationModalOpen(true)}
        onOpenDirectMessagingModal={() => setDirectMessagingModalOpen(true)}
        onOpenAdminPlatformAnalyticsModal={() => setAdminAnalyticsModalOpen(true)}
      />

      {/* PRODUCT DETAIL MODAL (WITH AUTO MESSAGING WITH PRODUCT) */}
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onOpenDirectMessagingModal={(info) => {
          if (info) setMessagingTargetInfo(info);
          setDirectMessagingModalOpen(true);
        }}
      />

      {/* FLOATING QUICK CHAT BUTTON (NÚT BẤM NHẮN TIN NHANH NỔI Ở MÀN HÌNH) */}
      <FloatingQuickChatButton onOpenDirectMessagingModal={() => setDirectMessagingModalOpen(true)} />

      {/* MOBILE BOTTOM NAVIGATION BAR (THANH ĐIỀU HƯỚNG DÁY MÀN HÌNH ĐIỆN THOẠI) */}
      <MobileBottomNavBar 
        onOpenPublicDirectoryModal={() => setPublicDirectoryModalOpen(true)}
        onOpenDirectMessagingModal={() => setDirectMessagingModalOpen(true)}
        onOpenOrderTrackingModal={() => setOrderTrackingModalOpen(true)}
        onOpenBuyerDashboardModal={() => setBuyerDashboardModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* PWA INSTALL PROMPT BAR (CÀI APP LÊN MÀN HÌNH CHÍNH ĐIỆN THOẠI) */}
      <PWAInstallPromptBar />

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
