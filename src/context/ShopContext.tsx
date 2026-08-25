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
  userCoins: number;
  coinTransactions: CoinTransaction[];
  hasCheckedInToday: boolean;
  selectedCategory: Category;
  searchQuery: string;
  loadingProducts: boolean;
  loadingCart: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category) => void;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: number | string) => Promise<void>;
  clearCart: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<{ error: Error | null }>;
  deleteProduct: (id: number | string) => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  dailyCheckIn: () => Promise<{ success: boolean; message: string }>;
  addCoinTransaction: (amount: number, description: string, type: 'earn' | 'spend' | 'bonus') => Promise<void>;

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

// Initial fallback transactions for newly registered user / demo mode
const DEFAULT_INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'tx-welcome-1',
    user_id: 'guest',
    amount: 50000,
    type: 'bonus',
    description: '🎁 Thưởng chào mừng tài khoản mới',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'tx-checkin-2',
    user_id: 'guest',
    amount: 5000,
    type: 'earn',
    description: '📅 Điểm danh hàng ngày nhận Xu',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

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

  // Coin Wallet & History states
  const [userCoins, setUserCoins] = useState<number>(55000);
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(DEFAULT_INITIAL_TRANSACTIONS);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);

  // Location Filter states
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<number | 'all'>('all');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [userLocationText, setUserLocationText] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // 1. Fetch public products list
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        setProducts(data);
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

  // 2. Fetch Isolated Cart & Coins for Logged-in Account
  const fetchUserCartAndCoins = useCallback(async (userId: string) => {
    try {
      setLoadingCart(true);

      // Fetch Cart
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

      // Fetch Coins balance from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', userId)
        .maybeSingle();

      if (profile && typeof profile.coins === 'number') {
        setUserCoins(profile.coins);
      } else {
        setUserCoins(55000);
      }

      // Fetch Coin Transactions history
      const { data: txData } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (txData && txData.length > 0) {
        setCoinTransactions(txData as CoinTransaction[]);

        // Check if user checked in today
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

  // 3. Isolated Account Sync Effect on Auth Change
  useEffect(() => {
    if (user) {
      fetchUserCartAndCoins(user.id);

      const cartChannel = supabase
        .channel(`realtime_cart_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchUserCartAndCoins(user.id);
          }
        )
        .subscribe();

      const coinChannel = supabase
        .channel(`realtime_coins_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'coin_transactions',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchUserCartAndCoins(user.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(cartChannel);
        supabase.removeChannel(coinChannel);
      };
    } else {
      setCartItems([]);
      setUserActivities([]);
      setUserCoins(55000);
      setCoinTransactions(DEFAULT_INITIAL_TRANSACTIONS);
      setHasCheckedInToday(false);
    }
  }, [user, fetchUserCartAndCoins]);

  // Realtime Products Listener
  useEffect(() => {
    fetchProducts();

    const productsChannel = supabase
      .channel('realtime_products_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProduct = payload.new as Product;
            setProducts((prev) => {
              if (prev.some((p) => p.id === newProduct.id)) return prev;
              return [...prev, newProduct];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = payload.new as Product;
            setProducts((prev) =>
              prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      )
      .on('broadcast', { event: 'new_product' }, ({ payload }) => {
        const newProduct = payload as Product;
        setProducts((prev) => {
          if (prev.some((p) => p.id === newProduct.id)) return prev;
          return [...prev, newProduct];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
    };
  }, [fetchProducts]);

  // Add Coin Transaction & Update Balance
  const addCoinTransaction = async (
    amount: number,
    description: string,
    type: 'earn' | 'spend' | 'bonus'
  ) => {
    const newCoins = Math.max(0, userCoins + amount);
    setUserCoins(newCoins);

    const newTx: CoinTransaction = {
      id: String(Date.now()),
      user_id: user?.id || 'guest',
      amount,
      type,
      description,
      created_at: new Date().toISOString(),
    };

    setCoinTransactions((prev) => [newTx, ...prev]);

    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ coins: newCoins })
          .eq('id', user.id);

        await supabase.from('coin_transactions').insert([
          {
            user_id: user.id,
            amount,
            type,
            description,
          },
        ]);
      } catch (err) {
        console.warn('Error recording coin transaction to DB:', err);
      }
    }
  };

  // Daily Check-in (+5,000 Xu)
  const dailyCheckIn = async (): Promise<{ success: boolean; message: string }> => {
    if (hasCheckedInToday) {
      return { success: false, message: 'Bạn đã điểm danh nhận Xu hôm nay rồi. Vui lòng quay lại vào ngày mai!' };
    }

    await addCoinTransaction(5000, '📅 Điểm danh hàng ngày nhận Xu thưởng', 'earn');
    setHasCheckedInToday(true);
    return { success: true, message: 'Chúc mừng! Bạn đã nhận thành công +5,000 Xu thưởng điểm danh.' };
  };

  // GPS Geolocation Handler
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
        console.warn('GPS location error, simulating location:', error);
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

  // Filter products
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
      product.district.toLowerCase() === selectedDistrict.toLowerCase();

    const matchesDistance =
      selectedDistance === 'all' ||
      product.distanceKm === undefined ||
      product.distanceKm <= Number(selectedDistance);

    return matchesCategory && matchesSearch && matchesProvince && matchesDistrict && matchesDistance;
  });

  // Cart Operations
  const addToCart = async (product: Product) => {
    if (!user) {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { id: String(Date.now()), product, quantity: 1 }];
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
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
      } else {
        await supabase.from('cart_items').insert([
          {
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          },
        ]);
      }

      await fetchUserCartAndCoins(user.id);
    } catch (err) {
      console.warn('Fallback local cart insert:', err);
    }
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

        const channel = supabase.channel('realtime_products_changes');
        channel.send({
          type: 'broadcast',
          event: 'new_product',
          payload: localProduct,
        });

        // Award +10,000 Xu for posting a new utility/service
        await addCoinTransaction(10000, '🌟 Tặng Xu thưởng đăng tin tiện ích mới thành công', 'earn');

        return { error: null };
      }

      if (data) {
        setProducts((prev) => {
          if (prev.some((p) => p.id === data.id)) return prev;
          return [...prev, data];
        });

        const channel = supabase.channel('realtime_products_changes');
        channel.send({
          type: 'broadcast',
          event: 'new_product',
          payload: data,
        });

        // Award +10,000 Xu for posting a new utility/service
        await addCoinTransaction(10000, '🌟 Tặng Xu thưởng đăng tin tiện ích mới thành công', 'earn');
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
        userCoins,
        coinTransactions,
        hasCheckedInToday,
        selectedCategory,
        searchQuery,
        loadingProducts,
        loadingCart,
        setSearchQuery,
        setSelectedCategory,
        addToCart,
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
