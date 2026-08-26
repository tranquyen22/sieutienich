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
  user_id?: string; // Account ownership
  name: string;
  category: Category | string;
  price: number;
  img: string;
  description?: string;
  created_at?: string;
  // Store verification & TQ status
  isTQStore?: boolean; // Cửa hàng TQ Official
  isLicensed?: boolean; // Cửa hàng đã xác minh / có GPKD
  licenseNo?: string;
  contactName?: string;
  phone?: string;
  // Dynamic Category & Variants
  variants?: ProductVariant[];
  soldCount?: number; // Tổng số lượt đã bán / đã phục vụ
  // Ratings & Reviews & Sales Volume
  rating?: number;
  reviewCount?: number;
  reviews?: ProductReview[];
  // Vietnam post-merger location fields
  province?: string;
  district?: string;
  distanceKm?: number;
  locationName?: string;
}

export interface CartItem {
  id: string;
  user_id?: string; // Account isolated cart item
  product_id?: number | string;
  product: Product;
  selected_variant?: ProductVariant;
  quantity: number;
  created_at?: string;
}

// Customer Address Book Interface
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

// Expanded Order Lifecycle Statuses according to specifications
export type OrderStatus = 
  | 'pending_seller_confirm' // 1. Chờ shop xác nhận (Khách vừa bấm đặt)
  | 'seller_accepted'         // 2. Shop đã nhận đơn (Shop đồng ý bán)
  | 'preparing'               // 3. Đang chuẩn bị (Shop đang soạn hàng)
  | 'ready_for_pickup'        // 4a. Sẵn sàng để lấy (Khách chọn đến lấy)
  | 'delivering'              // 4b. Đang giao (Shop chọn shop giao)
  | 'completed'               // 5. Hoàn thành (Shop bấm xong / Khách bấm đã nhận / Tự động sau 3 ngày)
  | 'cancelled';              // 6. Đã hủy (Shop hoặc Khách hủy kèm lý do)

export type DeliveryMethod = 
  | 'seller_delivery'   // Shop giao hàng tận nơi
  | 'customer_pickup';  // Khách đến cửa hàng lấy

export interface OrderItem {
  product_id: string | number;
  product: Product;
  selected_variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_phone?: string;
  shipping_address?: string; // Sổ địa chỉ giao hàng của khách
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  delivery_method: DeliveryMethod; // Phương thức nhận hàng
  payment_method: 'direct_with_seller'; // Sàn trung gian hiển thị, Shop và Khách tự thanh toán
  cancel_reason?: string; // Lý do hủy đơn
  cancelled_by?: 'buyer' | 'seller'; // Ai thực hiện hủy
  completed_by?: 'buyer' | 'seller' | 'auto_system'; // Ai xác nhận hoàn thành
  auto_complete_at?: string; // Tự động hoàn thành sau 3 ngày
  created_at: string;
  updated_at?: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action_type: 'view_product' | 'search' | 'add_cart' | 'post_product';
  details: string;
  created_at: string;
}

// Direct Messaging Interface (Gắn với SP hoặc Đơn hàng)
export interface DirectMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'buyer' | 'merchant' | 'system';
  receiver_id: string;
  receiver_name: string;
  product_id?: string | number;
  product_name?: string;
  order_id?: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

// Notification Bell Interface
export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'order_status_update' | 'new_order' | 'new_message' | 'system';
  order_id?: string;
  is_read: boolean;
  created_at: string;
}

// 4-Tier Role-Based Access Control (RBAC) System
export type UserRole = 
  | 'admin'    // Admin tối cao (Full quyền quản trị)
  | 'staff'    // Nhân viên cấp dưới (Được Admin phân quyền động)
  | 'merchant' // Tài khoản Shop (Như người dùng + Đăng tin & Quản lý đơn của Shop)
  | 'buyer';   // Tài khoản Người dùng (Mua sắm, sử dụng dịch vụ)

export interface StaffPermissions {
  canApproveShops: boolean;    // Quyền duyệt hồ sơ mở Shop
  canManageProducts: boolean;   // Quyền thêm / sửa / xóa sản phẩm
  canManageOrders: boolean;     // Quyền chuyển trạng thái / hủy đơn hàng
  canManageCoins: boolean;      // Quyền cộng / trừ Xu
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

export interface CategoryInfo {
  id: Category;
  name: string;
  iconName: string;
}
