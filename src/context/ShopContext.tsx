import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Product, CartItem, Category, UserActivity } from '../types';
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

  // Vietnam Post-Merger Location & GPS Filter states
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

  // 2. Fetch Isolated Cart Items for Logged-in Account
  const fetchUserCart = useCallback(async (userId: string) => {
    try {
      setLoadingCart(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId);

      if (!error && data) {
        const formatted: CartItem[] = data.map((item: any) => ({
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
    } catch (err) {
      console.warn('Error fetching account cart:', err);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // 3. Isolated Account Sync Effect on Auth Change
  useEffect(() => {
    if (user) {
      // Account Logged In: Fetch isolated cart for this specific account
      fetchUserCart(user.id);

      // Subscribe to Realtime Postgres changes ONLY for this user's cart
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
            fetchUserCart(user.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(cartChannel);
      };
    } else {
      // Account Logged Out: Reset cart & personal data for security & isolation
      setCartItems([]);
      setUserActivities([]);
    }
  }, [user, fetchUserCart]);

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

  // Filter products by Category, Search, Province, District, and Distance Radius
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

  // Account-Isolated Cart Operations
  const addToCart = async (product: Product) => {
    if (!user) {
      // Local fallback for guest
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
      // Check existing in Supabase DB for this specific user
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

      await fetchUserCart(user.id);
    } catch (err) {
      console.warn('Fallback local cart insert:', err);
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { id: String(Date.now()), user_id: user.id, product, quantity: 1 }];
      });
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
        console.warn('Supabase DB insert failed, fallback to local state broadcast:', error);
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
