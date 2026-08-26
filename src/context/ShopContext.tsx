import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, CartItem, Category, UserActivity, CoinTransaction, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { removeVietnameseAccents } from '../utils/vietnamese';

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
  toggleShopOpenStatus: (isClosed: boolean, reason?: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  dailyCheckIn: () => Promise<{ success: boolean; message: string }>;
  addCoinTransaction: (
    amount: number,
    type: 'earn' | 'spend' | 'bonus',
    description: string,
    coinCategory?: 'regular' | 'tq'
  ) => Promise<void>;

  // GPS & Location Filter States
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  selectedDistance: number | 'all';
  setSelectedDistance: (dist: number | 'all') => void;
  userCoords: { lat: number; lng: number } | null;
  userLocationText: string | null;
  isLocating: boolean;
  handleGetGPSLocation: () => void;
  resetLocationFilter: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [userActivities] = useState<UserActivity[]>([]);

  // Dual Coins State
  const [regularCoins, setRegularCoins] = useState<number>(125000);
  const [tqCoins, setTQCoins] = useState<number>(50000);
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>([
    {
      id: 'tx-1',
      user_id: 'current-user',
      amount: 50,
      type: 'bonus',
      coin_category: 'regular',
      description: '🎁 Thưởng điểm danh Ngày 1/7 hàng ngày',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'tx-2',
      user_id: 'current-user',
      amount: 10000,
      type: 'earn',
      coin_category: 'regular',
      description: '🌟 Thưởng 2% Hoàn Xu khi đánh giá gian hàng đã mua',
      created_at: new Date(Date.now() - 43200000).toISOString(),
    },
  ]);

  // Check-in State
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [checkInStreak, setCheckInStreak] = useState<number>(1);
  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(null);

  // Admin Coins Rules Configuration
  const [reviewCashbackRate, setReviewCashbackRate] = useState<number>(2); // 2%
  const [monthlyDistributedCoins] = useState<number>(185000); // 185k / 500k monthly emission limit

  // Orders State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9812',
      user_id: user?.id || 'guest',
      user_name: 'Nguyễn Văn Hùng',
      user_phone: '0912345678',
      shipping_address: 'Số 18 ngõ 20 đường Trần Thái Tông, Cầu Giấy, Hà Nội',
      items: [
        {
          product_id: 1,
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          price: INITIAL_PRODUCTS[0].price,
        },
      ],
      total_amount: INITIAL_PRODUCTS[0].price,
      discount_amount: 0,
      final_amount: INITIAL_PRODUCTS[0].price,
      status: 'preparing',
      delivery_method: 'seller_delivery',
      payment_method: 'direct_with_seller',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  // Purchased Products Tracker for Verified Buyer Reviews
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>(['1', '2', '3']);

  // GPS Location Filter States
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<number | 'all'>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationText, setUserLocationText] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);

  const recordPurchase = (productIds: (string | number)[]) => {
    const stringIds = productIds.map(String);
    setPurchasedProductIds((prev) => Array.from(new Set([...prev, ...stringIds])));
  };

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
        .single();

      if (profile) {
        if (profile.regular_coins !== undefined) setRegularCoins(profile.regular_coins);
        if (profile.tq_coins !== undefined) setTQCoins(profile.tq_coins);
      }
    } catch (err) {
      console.warn('Using local cart state fallback:', err);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (user) {
      const savedUserData = localStorage.getItem(`sieutienich_user_data_${user.id}`);
      if (savedUserData) {
        try {
          const parsed = JSON.parse(savedUserData);
          if (parsed.orders) setOrders(parsed.orders);
          if (parsed.regularCoins !== undefined) setRegularCoins(parsed.regularCoins);
          if (parsed.tqCoins !== undefined) setTQCoins(parsed.tqCoins);
          if (parsed.coinTransactions) setCoinTransactions(parsed.coinTransactions);
          if (parsed.cartItems) setCartItems(parsed.cartItems);
        } catch (e) {
          console.warn('Failed to parse per-user isolated data:', e);
        }
      } else {
        // Initialize fresh default isolated data for new account
        setOrders([]);
        setCartItems([]);
        setRegularCoins(125000);
        setTQCoins(50000);
        setCoinTransactions([]);
      }
      fetchUserCartAndCoins(user.id);
    } else {
      // CLEAR ALL DATA TO COMPLETELY BLANK / EMPTY FOR GUEST MODE (UNAUTHENTICATED)
      setOrders([]);
      setCartItems([]);
      setRegularCoins(0);
      setTQCoins(0);
      setCoinTransactions([]);
    }
  }, [user, fetchUserCartAndCoins]);

  // AUTO-SAVE PER-USER ISOLATED DATA TO LOCAL STORAGE
  useEffect(() => {
    if (user) {
      const userDataToSave = {
        orders,
        regularCoins,
        tqCoins,
        coinTransactions,
        cartItems,
      };
      localStorage.setItem(`sieutienich_user_data_${user.id}`, JSON.stringify(userDataToSave));
    }
  }, [user, orders, regularCoins, tqCoins, coinTransactions, cartItems]);

  const addCoinTransaction = async (
    amount: number,
    type: 'earn' | 'spend' | 'bonus',
    description: string,
    coinCategory: 'regular' | 'tq' = 'regular'
  ) => {
    if (coinCategory === 'regular') {
      setRegularCoins((prev) => Math.max(0, type === 'spend' ? prev - amount : prev + amount));
    } else {
      setTQCoins((prev) => Math.max(0, type === 'spend' ? prev - amount : prev + amount));
    }

    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}`,
      user_id: user?.id || 'demo-user',
      amount,
      type,
      coin_category: coinCategory,
      description,
      created_at: new Date().toISOString(),
    };

    setCoinTransactions((prev) => [newTx, ...prev]);
  };

  const dailyCheckIn = async (): Promise<{ success: boolean; message: string }> => {
    const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
    if (completedOrdersCount === 0) {
      return {
        success: false,
        message: '❌ Điều kiện điểm danh: Bạn phải có ít nhất 1 đơn hàng đã hoàn thành để kích hoạt tính năng điểm danh nhận xu (Chống tài khoản ảo).',
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (lastCheckInDate === todayStr) {
      return { success: false, message: 'Bạn đã hoàn thành điểm danh hôm nay rồi. Hãy quay lại vào ngày mai nhé!' };
    }

    let newStreak = checkInStreak;
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const diffDays = Math.floor((new Date(todayStr).getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        newStreak = checkInStreak >= 7 ? 1 : checkInStreak + 1;
      } else {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const rewardXu = newStreak === 7 ? 300 : 50;

    if (monthlyDistributedCoins + rewardXu <= 500000) {
      await addCoinTransaction(rewardXu, 'bonus', `🎁 Thưởng điểm danh hàng ngày Ngày ${newStreak}/7 (+${rewardXu} Xu)`, 'regular');
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
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserCoords({ lat, lng });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const prov = addr.state || addr.city || addr.province || 'Hà Nội';
            const dist = addr.county || addr.district || addr.suburb || addr.city_district || addr.town || 'Cầu Giấy';
            const road = addr.road || addr.quarter || addr.suburb || '';

            const cleanProv = prov.replace(/Tỉnh |Thành phố |TP\. /g, '').trim();
            const cleanDist = dist.replace(/Quận |Huyện |Thị xã |TP\. /g, '').trim();

            setSelectedProvince(cleanProv);
            setSelectedDistrict(cleanDist);
            setUserLocationText(`${road ? `${road}, ` : ''}${cleanDist}, ${cleanProv}`);
          } else {
            setUserLocationText(`GPS (${lat.toFixed(5)}°, ${lng.toFixed(5)}°)`);
          }
        } catch {
          setUserLocationText(`GPS chuẩn (${lat.toFixed(5)}°, ${lng.toFixed(5)}°)`);
        }

        setSelectedDistance(5);
        setIsLocating(false);
      },
      (error) => {
        console.warn('GPS location error:', error);
        alert(`Không thể xác định vị trí vệ tinh GPS chính xác (${error.message}). Vui lòng chọn Tỉnh/Thành thủ công!`);
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  const resetLocationFilter = () => {
    setSelectedProvince('all');
    setSelectedDistrict('all');
    setSelectedDistance('all');
    setUserCoords(null);
    setUserLocationText(null);
  };

  const toggleShopOpenStatus = (isClosed: boolean, reason?: string) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        isShopTemporarilyClosed: isClosed,
        shopCloseReason: isClosed ? reason : undefined,
      }))
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      const cleanQuery = removeVietnameseAccents(searchQuery);

      const matchesSearch =
        !cleanQuery ||
        removeVietnameseAccents(product.name).includes(cleanQuery) ||
        removeVietnameseAccents(product.category).includes(cleanQuery) ||
        (product.description &&
          removeVietnameseAccents(product.description).includes(cleanQuery)) ||
        (product.locationName &&
          removeVietnameseAccents(product.locationName).includes(cleanQuery));

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
      // Rule 1: Active Open Shops come BEFORE Temporarily Closed or Suspended Shops
      const isClosedA = a.isShopTemporarilyClosed || a.isShopSuspended ? 1 : 0;
      const isClosedB = b.isShopTemporarilyClosed || b.isShopSuspended ? 1 : 0;
      if (isClosedA !== isClosedB) {
        return isClosedA - isClosedB; // Open (0) before Closed (1)
      }

      // Rule 2: Priority Boost for Verified Shops & TQ Stores
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
        return [...prev, { id: `local-${Date.now()}`, product, quantity: quantityToAdd }];
      });
      return;
    }

    try {
      const existing = cartItems.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantityToAdd;
        await supabase
          .from('cart_items')
          .update({ quantity: newQty })
          .eq('id', existing.id);

        setCartItems((prev) =>
          prev.map((item) =>
            item.id === existing.id ? { ...item, quantity: newQty } : item
          )
        );
      } else {
        const { data } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: product.id,
              quantity: quantityToAdd,
            },
          ])
          .select('*, product:products(*)')
          .single();

        if (data) {
          setCartItems((prev) => [
            ...prev,
            {
              id: data.id,
              user_id: data.user_id,
              product_id: data.product_id,
              quantity: data.quantity,
              product: data.product || product,
            },
          ]);
        } else {
          setCartItems((prev) => [
            ...prev,
            { id: `local-${Date.now()}`, user_id: user.id, product, quantity: quantityToAdd },
          ]);
        }
      }
    } catch (err) {
      console.warn('Fallback adding to local cart state:', err);
      setCartItems((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, user_id: user.id, product, quantity: quantityToAdd },
      ]);
    }
  };

  const updateCartItemQuantity = async (productId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    if (user) {
      const target = cartItems.find((item) => item.product.id === productId);
      if (target && !target.id.startsWith('local-')) {
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', target.id);
      }
    }
  };

  const removeFromCart = async (productId: number | string) => {
    const target = cartItems.find((item) => item.product.id === productId);
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));

    if (user && target && !target.id.startsWith('local-')) {
      await supabase.from('cart_items').delete().eq('id', target.id);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    recordPurchase(newOrder.items.map((it) => it.product.id));
    await clearCart();

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
          return {
            ...ord,
            status: newStatus,
            cancel_reason: options?.cancelReason || ord.cancel_reason,
            cancelled_by: options?.cancelledBy || ord.cancelled_by,
            completed_by: options?.completedBy || ord.completed_by,
            updated_at: new Date().toISOString(),
          };
        }
        return ord;
      })
    );
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...productData,
            user_id: user?.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProducts((prev) => [data, ...prev]);
      } else {
        const localNewProduct: Product = {
          ...productData,
          id: Date.now(),
          user_id: user?.id,
          created_at: new Date().toISOString(),
        };
        setProducts((prev) => [localNewProduct, ...prev]);
      }

      return { error: null };
    } catch (err: any) {
      console.warn('Local fallback insert:', err);
      const localNewProduct: Product = {
        ...productData,
        id: Date.now(),
        user_id: user?.id,
        created_at: new Date().toISOString(),
      };
      setProducts((prev) => [localNewProduct, ...prev]);
      return { error: null };
    }
  };

  const deleteProduct = async (id: number | string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Deleted locally:', err);
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalAmount = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

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
        toggleShopOpenStatus,
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
