import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, CartItem, Category, UserActivity, CoinTransaction } from '../types';
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
  ) => Promise<void>;

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

// Initial fallback transactions
const DEFAULT_INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'tx-tq-welcome-1',
    user_id: 'guest',
    amount: 50000,
    type: 'bonus',
    coin_category: 'tq',
    description: '🎁 Thưởng đăng ký tài khoản mới (Xu TQ)',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'tx-reg-checkin-2',
    user_id: 'guest',
    amount: 5000,
    type: 'earn',
    coin_category: 'regular',
    description: '📅 Điểm danh hàng ngày nhận Xu Thường',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// Default demo purchased product IDs
const DEFAULT_PURCHASED_IDS: string[] = ['1', '2', '3', '7', '10', '13', '15'];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [loadingCart, setLoadingCart] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Dual Currency Wallet states
  const [regularCoins, setRegularCoins] = useState<number>(5000);
  const [tqCoins, setTqCoins] = useState<number>(50000);
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(DEFAULT_INITIAL_TRANSACTIONS);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

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

  // 1. Fetch public products list
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

  // 2. Fetch Isolated Cart & Dual Coins for Logged-in Account
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
      } else {
        setRegularCoins(5000);
        setTqCoins(50000);
      }

      const { data: txData } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (txData && txData.length > 0) {
        setCoinTransactions(txData as CoinTransaction[]);

        const todayStr = new Date().toISOString().split('T')[0];
        const checkedToday = txData.some(
          (tx: any) =>
            tx.description.includes('Điểm danh') &&
            tx.created_at.startsWith(todayStr)
        );
        setHasCheckedInToday(checkedToday);
      } else {
        setCoinTransactions(DEFAULT_INITIAL_TRANSACTIONS);
      }
    } catch (err) {
      console.warn('Error fetching account data:', err);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // Isolated Account Sync Effect
  useEffect(() => {
    if (user) {
      fetchUserCartAndCoins(user.id);
    } else {
      setCartItems([]);
      setUserActivities([]);
      setRegularCoins(5000);
      setTqCoins(50000);
      setCoinTransactions(DEFAULT_INITIAL_TRANSACTIONS);
      setHasCheckedInToday(false);
    }
  }, [user, fetchUserCartAndCoins]);

  // Realtime Products Listener
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addCoinTransaction = async (
    amount: number,
    description: string,
    type: 'earn' | 'spend' | 'bonus',
    coinCategory: 'regular' | 'tq'
  ) => {
    let updatedReg = regularCoins;
    let updatedTQ = tqCoins;

    if (coinCategory === 'tq') {
      updatedTQ = Math.max(0, tqCoins + amount);
      setTqCoins(updatedTQ);
    } else {
      updatedReg = Math.max(0, regularCoins + amount);
      setRegularCoins(updatedReg);
    }

    const newTx: CoinTransaction = {
      id: String(Date.now()),
      user_id: user?.id || 'guest',
      amount,
      type,
      coin_category: coinCategory,
      description,
      created_at: new Date().toISOString(),
    };

    setCoinTransactions((prev) => [newTx, ...prev]);

    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({
            regular_coins: updatedReg,
            tq_coins: updatedTQ,
          })
          .eq('id', user.id);

        await supabase.from('coin_transactions').insert([
          {
            user_id: user.id,
            amount,
            type,
            coin_category: coinCategory,
            description,
          },
        ]);
      } catch (err) {
        console.warn('Error recording coin transaction to DB:', err);
      }
    }
  };

  const dailyCheckIn = async (): Promise<{ success: boolean; message: string }> => {
    if (hasCheckedInToday) {
      return { success: false, message: 'Bạn đã điểm danh nhận Xu hôm nay rồi. Vui lòng quay lại vào ngày mai!' };
    }

    await addCoinTransaction(
      5000,
      '📅 Điểm danh hàng ngày nhận Xu Thường (Áp dụng các cửa hàng đã xác minh)',
      'earn',
      'regular'
    );
    setHasCheckedInToday(true);
    return { success: true, message: 'Chúc mừng! Bạn đã nhận thành công +5,000 Xu Thường thưởng điểm danh.' };
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

  const filteredProducts = products.filter((product) => {
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
          10000,
          '⭐ Tặng Xu Thường thưởng đăng tin / đánh giá thành công',
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
          10000,
          '⭐ Tặng Xu Thường thưởng đăng tin / đánh giá thành công',
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
