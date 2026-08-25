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
  isTQStore?: boolean; // Cửa hàng TQ Official (Áp dụng cả Xu TQ & Xu Thường, hiển thị Đánh giá)
  isLicensed?: boolean; // Cửa hàng đã xác minh / có GPKD (Chỉ áp dụng Xu Thường, hiển thị Đánh giá)
  licenseNo?: string;
  contactName?: string;
  phone?: string;
  // Ratings & Reviews (Chỉ hiển thị cho Shop đã xác minh & Shop TQ)
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

export interface UserActivity {
  id: string;
  user_id: string;
  action_type: 'view_product' | 'search' | 'add_cart' | 'post_product';
  details: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  regular_coins?: number; // Xu Thường (Áp dụng cho các cửa hàng đã xác minh)
  tq_coins?: number; // Xu TQ (Được tặng khi đăng ký mới, áp dụng cho cửa hàng TQ)
  role?: 'buyer' | 'merchant' | 'admin';
  merchant_status?: 'pending_review' | 'approved' | 'rejected' | null;
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
