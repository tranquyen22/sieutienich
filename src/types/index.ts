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
  // Location & GPS positioning fields
  district?: string;
  distanceKm?: number;
  locationName?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  iconName: string;
}
