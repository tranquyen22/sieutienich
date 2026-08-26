export type Category = 
  | 'all' 
  | 'rental' 
  | 'fashion' 
  | 'food' 
  | 'spa' 
  | 'groceries' 
  | 'transport' 
  | 'lodging' 
  | 'home_services' 
  | 'jobs' 
  | 'public_utilities';

export interface ProductReview {
  id: string;
  user_name: string;
  rating: number; // 1 to 5 stars
  comment: string;
  created_at: string;
}

// Product Variant Interface (Multi-size, color, stock & price)
export interface ProductVariant {
  id: string;
  size?: string;       // Fashion: S, M, L, XL
  color?: string;      // Fashion: Đen, Trắng...
  portion?: string;    // Food: Nhỏ, Vừa, Lớn
  topping?: string;    // Food: Trân châu, Phô mai...
  room_type?: string;  // Lodging: Phòng đơn, Studio, Căn hộ
  max_guests?: number; // Lodging: 2 người, 4 người...
  price: number;
  stock: number;
}

export interface OperatingHours {
  day: string; // T2, T3, T4, T5, T6, T7, CN
  open_time: string;
  close_time: string;
  is_open: boolean;
}

export interface CategoryDocument {
  id: string;
  document_name: string;
  category: string;
  document_url?: string;
  issue_date?: string;
  expiry_date?: string;
  is_valid: boolean;
}

export interface Product {
  id: number | string;
  name: string;
  category: Category;
  price: number;
  img: string;
  description?: string;
  locationName?: string;
  contactName?: string;
  phone?: string;
  licenseNo?: string;
  province?: string;      // Tỉnh/Thành phố
  district?: string;      // Quận/Huyện
  distanceKm?: number;    // Khoảng cách GPS
  variants?: ProductVariant[]; // Danh sách nhiều Size, Màu...
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  isLicensed?: boolean;
  isTQStore?: boolean;
  isShopTemporarilyClosed?: boolean; // Shop tự gạt tạm nghỉ
  shopCloseReason?: string;          // Lý do tạm nghỉ
  isShopSuspended?: boolean;          // Bị sàn tạm khóa do nợ công nợ
  user_id?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id?: number | string;
  quantity: number;
  product: Product;
}

export interface UserActivity {
  id: string;
  type: 'search' | 'view_product' | 'view_category' | 'add_to_cart';
  query?: string;
  product_id?: number | string;
  category?: Category;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  province: string;
  district: string;
  detail_address: string;
  is_default: boolean;
}

export type UserRole = 'admin' | 'staff' | 'merchant' | 'buyer';

export interface DirectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  sender_role?: UserRole;
  receiver_id: string;
  receiver_name: string;
  shop_id?: string;
  order_id?: string;
  product_id?: number | string;
  product_name?: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  body?: string;
  order_id?: string;
  type: 'order' | 'coin' | 'message' | 'system' | 'order_status_update' | 'new_order' | 'new_message';
  is_read: boolean;
  created_at: string;
  link_url?: string;
}

export type DeliveryMethod = 'pickup' | 'seller_delivery' | 'customer_pickup';

export type OrderStatus = 
  | 'pending_approval'        // Chờ shop xác nhận (Khách vừa bấm đặt)
  | 'pending_seller_confirm'  // Fallback alias
  | 'seller_accepted'         // Shop đã nhận đơn (Shop đồng ý bán)
  | 'preparing'               // Đang chuẩn bị (Shop đang soạn hàng)
  | 'ready_for_pickup'        // Sẵn sàng để lấy (Chỉ hiện nếu khách chọn đến lấy)
  | 'delivering'              // Đang giao (Chỉ hiện nếu khách chọn shop giao)
  | 'completed'               // Hoàn thành (Shop bấm xong, khách bấm đã nhận, hoặc tự động sau 3 ngày)
  | 'cancelled';              // Đã hủy (Kèm lý do)

export interface OrderItem {
  product_id: number | string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_phone?: string;
  shipping_address?: string;
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  delivery_method?: DeliveryMethod; // Đến lấy hoặc Shop giao
  payment_method?: 'direct_with_seller' | 'online';
  cancel_reason?: string;
  cancelled_by?: 'buyer' | 'seller';
  completed_by?: 'buyer' | 'seller' | 'auto_system';
  created_at: string;
  updated_at?: string;
}

// 22-Granular Permission Matrix (Tài khoản, Danh bạ, Gian hàng, Xu/Ads, Tài chính, Hệ thống)
export interface StaffPermissions {
  // 1. Tài khoản và phân quyền
  can_manage_users: boolean;                 // Thêm, sửa tài khoản
  can_lock_unlock_users: boolean;            // Khoá và mở lại tài khoản
  can_reset_passwords: boolean;              // Bấm gửi mã đặt lại mật khẩu

  // 2. Danh bạ tiện ích
  can_manage_directory_items: boolean;       // Thêm, sửa, xoá mục danh bạ
  can_toggle_verified_badge: boolean;        // Gắn và gỡ nhãn đã xác minh
  can_manage_categories_and_regions: boolean;// Thêm danh mục và sửa cây địa giới

  // 3. Gian hàng và sản phẩm
  can_approve_shop_phase1: boolean;          // Duyệt hồ sơ mở shop — khâu 1
  can_approve_shop_phase2: boolean;          // Duyệt xác minh shop — khâu 2
  can_revoke_verification_badge: boolean;    // Thu hồi nhãn đã xác minh của shop
  can_takedown_violating_products: boolean;  // Gỡ sản phẩm vi phạm
  can_view_dispute_messages: boolean;        // Xem tin nhắn giữa khách và shop (khi có khiếu nại, ghi nhật ký)

  // 4. Xu, voucher, quảng cáo
  can_scan_qr_approve_pending_coins: boolean;// Quét mã tại quầy, duyệt xu chờ
  can_manage_vouchers_and_banners: boolean;  // Tạo voucher và đặt banner
  can_manually_adjust_coins: boolean;        // Tặng hoặc trừ xu bằng tay (bắt buộc ghi lý do)

  // 5. Tiền và báo cáo
  can_view_merchant_ledger: boolean;         // Xem sổ công nợ của shop
  can_record_shop_payments: boolean;         // Ghi nhận đã nhận tiền của shop
  can_settle_monthly_ledger: boolean;        // Chốt sổ công nợ hằng tháng (cần người thứ hai duyệt)
  can_export_financial_reports: boolean;     // Xem và xuất báo cáo thu chi

  // Aliases for backward compatibility
  canApproveShops?: boolean;
  canManageProducts?: boolean;
  canManageOrders?: boolean;
  canManageCoins?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  regular_coins?: number; // Xu Thường
  tq_coins?: number;      // Xu TQ
  role: UserRole;
  merchant_status?: 'pending_review' | 'approved' | 'rejected' | null;
  staff_permissions?: StaffPermissions;
}

export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend' | 'bonus';
  coin_category: 'regular' | 'tq'; // Xu Thường hoặc Xu TQ
  description: string;
  created_at: string;
  expires_at?: string; // Hạn dùng 6 tháng
}

export interface MerchantApplication {
  id: string;
  user_id: string;
  user_email: string;
  full_name: string;
  phone: string;
  shop_name?: string;
  category?: string;
  business_license?: string;
  store_photo?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'needs_info';
  status_reason?: string;
  verification_phase?: 'phase_1_opening' | 'phase_2_audit'; // Phase 1: Mở Shop, Phase 2: Xác minh thực địa
  is_temporarily_closed?: boolean; // Shop tự chọn tạm nghỉ
  close_reason?: string;          // Lý do tạm nghỉ
  created_at: string;
}

// Merchant Financial Ledger & Settlement System (Công nợ giữa sàn và shop)
export interface MerchantFinancials {
  shop_id: string;
  shop_name: string;
  is_verified: boolean;
  total_sales: number;
  shop_debt_fee: number;          // Shop nợ sàn: phí sàn theo % (chỉ shop đã xác minh)
  platform_debt_reimburse: number; // Sàn nợ shop: bù tiền khách dùng xu/voucher
  net_balance: number;            // Cấn trừ 2 chiều: (>0 = Shop nợ Sàn, <0 = Sàn nợ Shop)
  debt_limit: number;             // Mốc trần nợ (Mặc định 1.000.000đ, Admin chỉnh được)
  is_suspended: boolean;          // Tạm dừng shop nếu nợ quá mốc 1 triệu
  last_settled_at: string;
  settlement_status?: 'settled' | 'pending_payment' | 'overdue';
}

export interface SettlementRecord {
  id: string;
  shop_id: string;
  shop_name: string;
  period: string; // VD: 'Tháng 08/2026'
  shop_debt_fee: number;
  platform_debt_reimburse: number;
  net_amount: number;
  who_pays: 'shop_pays_platform' | 'platform_pays_shop' | 'balanced';
  deadline_date: string; // Trong vòng 7 ngày
  status: 'pending' | 'completed';
  created_at: string;
}

export interface UserAccountAuditLog {
  id: string;
  user_id: string;
  admin_name: string;
  action_type: 'create' | 'edit_profile' | 'change_roles' | 'lock' | 'unlock' | 'soft_delete' | 'reset_password_link';
  before_state?: string;
  after_state?: string;
  reason?: string;
  timestamp: string;
}

export interface AdminManagedUser {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address?: string;
  avatar_url?: string;
  roles: UserRole[]; // Can hold multiple roles e.g. ['buyer', 'merchant']
  status: 'active' | 'locked' | 'soft_deleted';
  lock_reason?: string;
  internal_notes?: string;
  must_change_password_on_first_login?: boolean;
  orders_count: number;
  regular_coins: number;
  tq_coins: number;
  reviews_written_count: number;
  report_count: number;
  active_devices: string[];
  created_at: string;
  created_by_admin?: boolean;
  audit_logs: UserAccountAuditLog[];
}

export interface CategoryInfo {
  id: Category;
  name: string;
  iconName: string;
}
