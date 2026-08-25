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

export interface Product {
  id: number | string;
  user_id?: string; // Account ownership
  name: string;
  category: Category | string;
  price: number;
  img: string;
  description?: string;
  created_at?: string;
  // Compliance fields for Lodging & Transport
  phone?: string;
  isLicensed?: boolean;
  licenseNo?: string;
  contactName?: string;
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
  role?: 'buyer' | 'merchant' | 'admin';
  merchant_status?: 'pending_review' | 'approved' | 'rejected' | null;
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
