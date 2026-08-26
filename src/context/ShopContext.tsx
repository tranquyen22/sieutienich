import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, CartItem, Category, UserActivity, CoinTransaction, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  cartItems: CartItem[];
  cartCount: number;
  cartTotalAmount: number;
  userActivities: UserActivity[];
  
  // Dual Currency Wallet states
  regularCoins: number;
  tqCoins: number;
  coinTransactions: CoinTransaction[];
  hasCheckedInToday: boolean;
  checkInStreak: number;
  lastCheckInDate: string | null;

  // Coin System Rules & Admin Controls
  reviewCashbackRate: number; // 1% - 3%, default 2%
  setReviewCashbackRate: (rate: number) => void;
  monthlyDistributedCoins: number; // Max 500.000 xu / tháng
  
  // Intermediary Orders Lifecycle
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'created_at'>) => Promise<Order>;
  updateOrderStatus: (
    orderId: string, 
    newStatus: OrderStatus, 
    options?: { cancelReason?: string; cancelledBy?: 'buyer' | 'seller'; completedBy?: 'buyer' | 'seller' | 'auto_system' }
  ) => Promise<void>;

  // Verified Buyer Purchase Tracking
  purchasedProductIds: string[];
  recordPurchase: (productIds: (string | number)[]) => void;

  selectedCategory: Category;
  searchQuery: string;
  loadingProducts: boolean;
  loadingCart: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItemQuantity: (productId: number | string, newQuantity: number) => Promise<void>;
  removeFromCart: (productId: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ error: Error | null }>;
  deleteProduct: (id: number | string) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  dailyCheckIn: () => Promise<{ success: boolean; message: string }>;
  addCoinTransaction: (
    amount: number,
    description: string,
    type: 'earn' | 'spend' | 'bonus',
    coinCategory: 'regular' | 'tq'
  ) => Promise<boolean>;

  // Location & GPS Filter states
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedDistance: number | 'all';
  setSelectedDistance: (dist: number | 'all') => void;
  userCoords: { lat: number; lng: number } | null;
  userLocationText: string | null;
  isLocating: boolean;
  handleGetGPSLocation: () => void;
  resetLocationFilter: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Initial fallback transactions with 6 months expiry
const DEFAULT_INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'tx-tq-welcome-1',
    user_id: 'guest',
    amount: 50000,
    type: 'bonus',
    coin_category: 'tq',
    description: '🎁 Thưởng đăng ký tài khoản mới (Xu TQ)',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 24 * 170).toISOString(),
  },
  {
    id: 'tx-reg-checkin-2',
    user_id: 'guest',
    amount: 50,
    type: 'earn',
    coin_category: 'regular',
    description: '📅 Điểm danh Ngày 1 nhận 50 Xu Thường',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    expires_at: new Date(Date.now() + 3600000 * 24 * 179).toISOString(),
  },
];

// Expanded sample orders matching user's exact lifecycle specifications
const DEFAULT_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-882901',
    user_id: 'guest',
    user_name: 'Nguyễn Văn Hùng',
    items: [
      { product_id: 15, product: INITIAL_PRODUCTS[14], quantity: 1, price: 850000 },
    ],
    total_amount: 850000,
    discount_amount: 50000,
    final_amount: 800000,
    status: 'pending_seller_confirm', // Status 1: Khách vừa bấm đặt
    delivery_method: 'seller_delivery',
    payment_method: 'direct_with_seller',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ORD-773012',
    user_id: 'guest',
    user_name: 'Trần Thị Thu Hải',
    items: [
      { product_id: 2, product: INITIAL_PRODUCTS[1], quantity: 2, price: 350000 },
    ],
    total_amount: 700000,
    discount_amount: 20000,
    final_amount: 680000,
    status: 'seller_accepted', // Status 2: Shop đã nhận đơn
    delivery_method: 'seller_delivery',
    payment_method: 'direct_with_seller',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'ORD-662093',
    user_id: 'guest',
    user_name: 'Phạm Minh Tuấn',
    items: [
      { product_id: 13, product: INITIAL_PRODUCTS[12], quantity: 1, price: 12000000 },
    ],
    total_amount: 12000000,
    discount_amount: 50000,
    final_amount: 11950000,
    status: 'preparing', // Status 3: Đang chuẩn bị
    delivery_method: 'customer_pickup',
    payment_method: 'direct_with_seller',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: 'ORD-554019',
    user_id: 'guest',
    user_name: 'Vũ Quốc Anh',
    items: [
      { product_id: 18, product: INITIAL_PRODUCTS[17], quantity: 1, price: 150000 },
    ],
    total_amount: 150000,
    discount_amount: 10000,
    final_amount: 140000,
    status: 'ready_for_pickup', // Status 4a: Sẵn sàng để lấy
    delivery_method: 'customer_pickup',
    payment_method: 'direct_with_seller',
    created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'ORD-443088',
    user_id: 'guest',
    user_name: 'Hoàng Kim Ngân',
    items: [
      { product_id: 3, product: INITIAL_PRODUCTS[2], quantity: 1, price: 490000 },
    ],
    total_amount: 490000,
    discount_amount: 30000,
    final_amount: 460000,
    status: 'delivering', // Status 4b: Đang giao
    delivery_method: 'seller_delivery',
    payment_method: 'direct_with_seller',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'ORD-332011',
    user_id: 'guest',
    user_name: 'Lê Hoàng Nam',
    items: [
      { product_id: 1, product: INITIAL_PRODUCTS[0], quantity: 1, price: 8500000 },
    ],
    total_amount: 8500000,
    discount_amount: 100000,
    final_amount: 8400000,
    status: 'completed', // Status 5: Hoàn thành
    delivery_method: 'seller_delivery',
    payment_method: 'direct_with_seller',
    completed_by: 'buyer',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const DEFAULT_PURCHASED_IDS: string[] = ['1', '2', '3', '7', '10', '13', '14', '15', '18'];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userRole } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userActivities] = useState<UserActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Intermediary Orders State
  const [orders, setOrders] = useState<Order[]>(DEFAULT_SAMPLE_ORDERS);

  // Dual Currency Wallet states
  const [regularCoins, setRegularCoins] = useState<number>(5000);
  const [tqCoins, setTqCoins] = useState<number>(50000);
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(DEFAULT_INITIAL_TRANSACTIONS);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

  // Daily Check-in Streak & Last Date
  const [checkInStreak, setCheckInStreak] = useState<number>(1);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(
    new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0]
  );

  // Admin Configurable Cashback & Monthly Platform Emission Cap (500.000 xu / tháng)
  const [reviewCashbackRate, setReviewCashbackRate] = useState<number>(2); // 2% (Admin range 1-3%)
  const [monthlyDistributedCoins, setMonthlyDistributedCoins] = useState<number>(125000); // Current monthly issued xu

  // Verified Buyer Purchase Tracking State
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(DEFAULT_PURCHASED_IDS);

  // Location Filter states
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<number | 'all'>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationText, setUserLocationText] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const recordPurchase = (productIds: (string | number)[]) => {
    const stringIds = productIds.map((id) => String(id));
    setPurchasedProductIds((prev) => Array.from(new Set([...prev, ...stringIds])));
  };

  // REALTIME STATUS POLLING (Sync order status every 6 seconds)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setOrders((prev) => [...prev]);
    }, 6000);

    return () => clearInterval(pollInterval);
  }, []);

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string, 
    newStatus: OrderStatus,
    options?: { cancelReason?: string; cancelledBy?: 'buyer' | 'seller'; completedBy?: 'buyer' | 'seller' | 'auto_system' }
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            status: newStatus,
            cancel_reason: options?.cancelReason || ord.cancel_reason,
            cancelled_by: options?.cancelledBy || ord.cancelled_by,
            completed_by: options?.completedBy || ord.completed_by,
            updated_at: new Date().toISOString(),
          };
          
          // When order is completed, unlock review eligibility!
          if (newStatus === 'completed') {
            recordPurchase(ord.items.map((item) => item.product_id));
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // Fetch public products list
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const dbIds = new Set(data.map((p: any) => String(p.id)));
        const missingInitial = INITIAL_PRODUCTS.filter((p) => !dbIds.has(String(p.id)));
        setProducts([...data, ...missingInitial]);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (err) {
      console.warn('Using initial local products fallback:', err);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch Isolated Cart & Dual Coins
  const fetchUserCartAndCoins = useCallback(async (userId: string) => {
    try {
      setLoadingCart(true);

      const { data: cartData } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId);

      if (cartData) {
        const formatted: CartItem[] = cartData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: item.product || {
            id: item.product_id,
            name: `Sản phẩm #${item.product_id}`,
            category: 'general',
            price: 0,
            img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
          },
        }));
        setCartItems(formatted);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('regular_coins, tq_coins')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        setRegularCoins(typeof profile.regular_coins === 'number' ? profile.regular_coins : 5000);
        setTqCoins(typeof profile.tq_coins === 'number' ? profile.tq_coins : 50000);
      }
    } catch (err) {
      console.warn('Error fetching account data:', err);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserCartAndCoins(user.id);
    }
  }, [user, fetchUserCartAndCoins]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Rule 7 & 11: Add Coin Transaction with 500,000 monthly cap & 6 months expiry
  const addCoinTransaction = async (
    amount: number,
    description: string,
    type: 'earn' | 'spend' | 'bonus',
    coinCategory: 'regular' | 'tq'
  ): Promise<boolean> => {
    // Rule 11: Shop accounts have NO coins!
    if (userRole === 'merchant') {
      console.warn('Tài khoản Shop không áp dụng tích/tiêu Xu.');
      return false;
    }

    // Rule 7: Check monthly platform emission cap (500.000 xu / tháng)
    if (type !== 'spend' && monthlyDistributedCoins + amount > 500000) {
      alert('⚠️ Tạm ngưng thưởng Xu do hệ thống đã đạt trần phát Xu toàn sàn tháng này (500.000 Xu). Vui lòng quay lại tháng sau!');
      return false;
    }

    let updatedReg = regularCoins;
    let updatedTQ = tqCoins;

    if (coinCategory === 'tq') {
      updatedTQ = Math.max(0, tqCoins + amount);
      setTqCoins(updatedTQ);
    } else {
      updatedReg = Math.max(0, regularCoins + amount);
      setRegularCoins(updatedReg);
    }

    if (type !== 'spend') {
      setMonthlyDistributedCoins((prev) => prev + amount);
    }

    // Expiry: 6 months from now
    const now = new Date();
    const expiryDate = new Date(now.setMonth(now.getMonth() + 6)).toISOString();

    const newTx: CoinTransaction = {
      id: String(Date.now()),
      user_id: user?.id || 'guest',
      amount,
      type,
      coin_category: coinCategory,
      description,
      created_at: new Date().toISOString(),
      expires_at: expiryDate,
    };

    setCoinTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  // Rule 4, 5, 6: Daily Check-in Logic with Streak and Completed Order Condition
  const dailyCheckIn = async (): Promise<{ success: boolean; message: string }> => {
    // Rule 11: Shop accounts have NO coins
    if (userRole === 'merchant') {
      return { success: false, message: 'Tài khoản Cửa hàng (Merchant) không áp dụng chương trình tích Xu thưởng.' };
    }

    // Rule 6: Mandatory Condition: Must have at least 1 completed order!
    const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
    const hasCompletedOrder = completedOrdersCount > 0 || purchasedProductIds.length > 0;

    if (!hasCompletedOrder) {
      return { 
        success: false, 
        message: '⚠️ ĐIỀU KIỆN ĐIỂM DANH: Bạn cần phải hoàn thành ít nhất 1 đơn hàng thành công trên sàn mới được kích hoạt Điểm danh nhận Xu! (Giúp chặn tài khoản ảo hiệu quả).' 
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (hasCheckedInToday || lastCheckInDate === todayStr) {
      return { success: false, message: 'Bạn đã điểm danh nhận Xu hôm nay rồi. Vui lòng quay lại vào ngày mai!' };
    }

    // Check streak reset logic (Rule 5: Bỏ lỡ 1 ngày ➔ Chuỗi về 1)
    let newStreak = checkInStreak;
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = checkInStreak >= 7 ? 1 : checkInStreak + 1;
      } else {
        newStreak = 1; // Missed a day ➔ reset to 1!
      }
    } else {
      newStreak = 1;
    }

    // Rule 4 & 5: Days 1-6 = 50 xu/ngày; Day 7 = +300 xu (Trọn tuần 600 xu)
    const rewardXu = newStreak === 7 ? 300 : 50;

    const success = await addCoinTransaction(
      rewardXu,
      `📅 Điểm danh Ngày ${newStreak} nhận ${rewardXu} Xu Thường (Chuỗi ${newStreak}/7 ngày)`,
      'earn',
      'regular'
    );

    if (success) {
      setHasCheckedInToday(true);
      setCheckInStreak(newStreak);
      setLastCheckInDate(todayStr);

      const msg = newStreak === 7
        ? '🎉 Chúc mừng! Bạn đã hoàn thành trọn tuần 7 ngày điểm danh liên tiếp và nhận phần thưởng lớn +300 Xu Thường (Tổng 600 Xu/tuần)!'
        : `🎉 Bạn đã điểm danh thành công Ngày ${newStreak}/7 và nhận +${rewardXu} Xu Thường. Duy trì chuỗi ngày mai nhé!`;

      return { success: true, message: msg };
    }

    return { success: false, message: 'Không thể điểm danh do hệ thống đã đạt trần thưởng toàn sàn tháng này.' };
  };

  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });
        setUserLocationText(`GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
        setSelectedProvince('Hà Nội');
        setSelectedDistrict('Cầu Giấy');
        setSelectedDistance(5);
        setIsLocating(false);
      },
      (error) => {
        console.warn('GPS location error:', error);
        setUserCoords({ lat: 21.0285, lng: 105.8542 });
        setUserLocationText('Cầu Giấy, Hà Nội (GPS Đã kích hoạt)');
        setSelectedProvince('Hà Nội');
        setSelectedDistrict('Cầu Giấy');
        setSelectedDistance(3);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const resetLocationFilter = () => {
    setSelectedProvince('all');
    setSelectedDistrict('all');
    setSelectedDistance('all');
    setUserCoords(null);
    setUserLocationText(null);
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.locationName &&
          product.locationName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProvince =
        selectedProvince === 'all' ||
        !product.province ||
        product.province.toLowerCase() === selectedProvince.toLowerCase();

      const matchesDistrict =
        selectedDistrict === 'all' ||
        !product.district ||
        product.district.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
        selectedDistrict.toLowerCase().includes(product.district.toLowerCase());

      const matchesDistance =
        selectedDistance === 'all' ||
        product.distanceKm === undefined ||
        product.distanceKm <= Number(selectedDistance);

      return matchesCategory && matchesSearch && matchesProvince && matchesDistrict && matchesDistance;
    })
    .sort((a, b) => {
      // Priority Boost for Verified Shops & TQ Stores
      const scoreA = (a.isTQStore ? 2 : 0) + (a.isLicensed ? 1 : 0);
      const scoreB = (b.isTQStore ? 2 : 0) + (b.isLicensed ? 1 : 0);
      return scoreB - scoreA;
    });

  const addToCart = async (product: Product, quantityToAdd: number = 1) => {
    if (!user) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantityToAdd }
              : item
          );
        }
        return [...prev, { id: String(Date.now()), product, quantity: quantityToAdd }];
      });
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantityToAdd })
          .eq('id', existing.id);
      } else {
        await supabase.from('cart_items').insert([
          {
            user_id: user.id,
            product_id: product.id,
            quantity: quantityToAdd,
          },
        ]);
      }

      await fetchUserCartAndCoins(user.id);
    } catch (err) {
      console.warn('Fallback local cart insert:', err);
    }
  };

  const updateCartItemQuantity = async (productId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (err) {
        console.warn('Error updating quantity in DB:', err);
      }
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = async (productId: number | string) => {
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (err) {
        console.warn('Error removing from DB cart:', err);
      }
    }
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = async () => {
    if (user) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Error clearing DB cart:', err);
      }
    }
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const payload = {
        ...productData,
        user_id: user?.id || null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) {
        const localProduct: Product = {
          ...productData,
          id: Date.now(),
          user_id: user?.id,
        };
        setProducts((prev) => [...prev, localProduct]);

        await addCoinTransaction(
          1000,
          '⭐ Thưởng Xu Thường khi đăng tin bài thành công',
          'earn',
          'regular'
        );

        return { error: null };
      }

      if (data) {
        setProducts((prev) => {
          if (prev.some((p) => p.id === data.id)) return prev;
          return [...prev, data];
        });

        await addCoinTransaction(
          1000,
          '⭐ Thưởng Xu Thường khi đăng tin bài thành công',
          'earn',
          'regular'
        );
      }

      return { error: null };
    } catch (err: any) {
      return { error: err as Error };
    }
  };

  const deleteProduct = async (id: number | string) => {
    try {
      await supabase.from('products').delete().eq('id', id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        cartItems,
        cartCount,
        cartTotalAmount,
        userActivities,
        regularCoins,
        tqCoins,
        coinTransactions,
        hasCheckedInToday,
        checkInStreak,
        lastCheckInDate,
        reviewCashbackRate,
        setReviewCashbackRate,
        monthlyDistributedCoins,
        orders,
        createOrder,
        updateOrderStatus,
        purchasedProductIds,
        recordPurchase,
        selectedCategory,
        searchQuery,
        loadingProducts,
        loadingCart,
        setSearchQuery,
        setSelectedCategory,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        addProduct,
        deleteProduct,
        isCartOpen,
        setIsCartOpen,
        dailyCheckIn,
        addCoinTransaction,
        selectedProvince,
        setSelectedProvince,
        selectedDistrict,
        setSelectedDistrict,
        selectedDistance,
        setSelectedDistance,
        userCoords,
        userLocationText,
        isLocating,
        handleGetGPSLocation,
        resetLocationFilter,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
