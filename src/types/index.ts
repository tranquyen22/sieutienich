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
  // Ratings & Reviews
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
  quantity: number;
  created_at?: string;
}

export type OrderStatus = 
  | 'pending_seller_confirm' // Shop xác nhận đơn
  | 'preparing'              // Đang chuẩn bị
  | 'delivering'             // Đang giao
  | 'completed'              // Đã giao thành công
  | 'cancelled';

export interface OrderItem {
  product_id: string | number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_phone?: string;
  items: OrderItem[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  payment_method: 'direct_with_seller'; // Sàn trung gian hiển thị, Shop và Khách tự thanh toán & tự giao hàng
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
}

export interface MerchantApplication {
  id: string;
  user_id: string;
  user_email: string;
  full_name: string;
  phone: string;
  shop_name?: string;
  status: 'pending_review' | 'approved' | 'rejected';
  created_at: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  iconName: string;
}
