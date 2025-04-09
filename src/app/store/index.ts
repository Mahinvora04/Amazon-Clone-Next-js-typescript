import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('authToken');
      Cookies.remove('userId');
    }
    return Promise.reject(error);
  },
);

type FormDataType = FormData;
interface LoginData {
  email: string;
  password: string;
}

interface ProfilePayload {
  contact: string;
  address: string;
}

interface Product {
  product_id: string;
  category_id: string;
  product_name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: Date;
  in_stock: 0 | 1 | null;
  seller: string;
  quantity: number;
}

interface User {
  name: string;
  email: string;
  contact: string;
  address: string;
}

interface FilterOptionsType {
  sellerFilterValues: string[];
  stockFilterValues: string[];
  filterOptions: { label: string }[];
}

interface UserState {
  token: string | null;
  userId: string | null;
  fetchedUser: User;
}

interface Category {
  category_id: string;
  category_image: string;
  category_type: string;
}

interface StoreState extends UserState, FilterOptionsType {
  message: string;
  products: Product[];
  cart: Product[];
  wishlist: Product[];
  productsCount: number;
  categoryType: {
    category_type: string;
    category_image: string;
  };
  categories: Category[];

  registerUser: (
    formData: FormDataType,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  loginUser: (
    data: LoginData,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  logoutUser: () => Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (
    payload: ProfilePayload,
  ) => Promise<{ success?: boolean; message?: string; error?: string }>;
  fetchProducts: (
    categoryId?: string | null,
    payload?: object,
  ) => Promise<void>;
  getCategoryTypeById: (categoryId: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchFilterOptions: (categoryId: string) => Promise<void>;

  // Cart & Wishlist
  addToCart: (productId: string) => Promise<{ success: boolean }>;
  getCartByUserId: () => Promise<void>;
  increaseProductQuantity: (productId: string) => Promise<{ success: boolean }>;
  decreaseProductQuantity: (productId: string) => Promise<{ success: boolean }>;
  addToWishlist: (productId: string) => Promise<{ success: boolean }>;
  getWishlistByUserId: () => Promise<void>;

  // Social Logins
  loginWithGoogle: () => void;
  loginWithGithub: () => void;
  loginWithFacebook: () => void;
}

const useStore = create<StoreState>((set) => ({
  message: '',
  token: null,
  userId: null,
  productsCount: 0,
  categories: [],
  departments: [],
  products: [],
  categoryType: { category_type: '', category_image: '' },
  filterOptions: [],
  sellerFilterValues: [],
  stockFilterValues: [],
  fetchedUser: { name: '', address: '', contact: '', email: '' },
  cart: [],
  wishlist: [],

  registerUser: async (formData) => {
    set({ message: '' });

    try {
      const registerUserResponse = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (registerUserResponse?.data?.status === 200) {
        return { success: true, message: registerUserResponse?.data?.message };
      }

      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  },

  loginUser: async (data) => {
    try {
      const loginUserResponse = await api.post('/auth/login', data);
      if (loginUserResponse?.data?.status === 200) {
        return { success: true, message: loginUserResponse?.data?.message };
      }

      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  logoutUser: async () => {
    try {
      const logoutResponse = await api.post('/auth/logout');
      if (logoutResponse?.data?.status === 200) {
        return { success: true, message: logoutResponse?.data?.message };
      }

      return {
        success: false,
        error: 'Failed to logout. Please try again.',
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  fetchUserProfile: async () => {
    try {
      const fetchUserProfileResponse = await api.get(`/users`);
      if (fetchUserProfileResponse?.data?.status === 200) {
        const userData = fetchUserProfileResponse?.data?.userResult;
        set({ fetchedUser: userData });
      }
    } catch (error) {
      console.error('Error fetching user profile:', (error as Error).message);
    }
  },

  updateUserProfile: async (payload) => {
    try {
      const updateUserProfileResponse = await api.put('/users', payload);
      if (updateUserProfileResponse?.data?.status === 200) {
        return {
          success: true,
          message: updateUserProfileResponse?.data?.message,
        };
      }
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    } catch (error) {
      return { error: (error as Error).message };
    }
  },

  fetchProducts: async (categoryId = null, payload = {}) => {
    let url = '/products';
    if (categoryId) {
      url += `/${categoryId}`;
    }

    try {
      const fetchProductsResponse = await api.post(url, payload);
      if (fetchProductsResponse?.data?.status === 200) {
        set({
          products: fetchProductsResponse?.data?.products,
          productsCount: fetchProductsResponse?.data?.count,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', (error as Error).message);
    }
  },

  getCategoryTypeById: async (categoryId: string) => {
    try {
      const getCategoryTypeByIdResponse = await api.get(
        `category-type/${categoryId}`,
      );
      if (getCategoryTypeByIdResponse?.data?.status === 200) {
        set({
          categoryType: getCategoryTypeByIdResponse?.data?.categoryType,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', (error as Error).message);
    }
  },

  fetchCategories: async () => {
    try {
      const fetchCategoriesResponse = await api.get('/categories');
      if (fetchCategoriesResponse?.data?.status === 200) {
        set({
          categories: fetchCategoriesResponse?.data?.categories,
        });
      }
    } catch (error) {
      console.error('Failed to fetch categories!', (error as Error).message);
    }
  },

  fetchFilterOptions: async (categoryId: string) => {
    let url = '/filter-options';
    if (categoryId) {
      url += `/${categoryId}`;
    }

    try {
      const fetchFilterOptionsResponse = await api.get(url);
      if (fetchFilterOptionsResponse?.data?.status === 200) {
        set({
          filterOptions: fetchFilterOptionsResponse?.data?.data,
          sellerFilterValues: fetchFilterOptionsResponse?.data?.sellerArray,
          stockFilterValues:
            fetchFilterOptionsResponse?.data?.stockFilterValues,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', (error as Error).message);
    }
  },

  addToCart: async (productId: string) => {
    try {
      const addToCartResponse = await axios.post('/api/cart/add', {
        productId: productId,
      });
      if (addToCartResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to cart:', (error as Error).message);
    }
    return { success: false };
  },

  getCartByUserId: async () => {
    try {
      const getCartByUserIdResponse = await api.get('/cart');
      if (getCartByUserIdResponse?.data?.status === 200) {
        set({
          cart: getCartByUserIdResponse?.data?.cart,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart data!', (error as Error).message);
    }
  },

  increaseProductQuantity: async (productId: string) => {
    try {
      const increaseProductQuantityResponse = await axios.put(
        '/api/cart/update-quantity/increase',
        {
          productId: productId,
        },
      );
      if (increaseProductQuantityResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', (error as Error).message);
    }
    return { success: false };
  },

  decreaseProductQuantity: async (productId: string) => {
    try {
      const decreaseProductQuantityResponse = await axios.put(
        '/api/cart/update-quantity/decrease',
        {
          productId: productId,
        },
      );
      if (decreaseProductQuantityResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', (error as Error).message);
    }
    return { success: false };
  },

  addToWishlist: async (productId: string) => {
    try {
      const addToWishlistResponse = await axios.post('/api/wishlist/add', {
        productId: productId,
      });
      if (addToWishlistResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', (error as Error).message);
    }
    return { success: false };
  },

  getWishlistByUserId: async () => {
    try {
      const getWishlistByUserIdResponse = await api.get('/wishlist');
      if (getWishlistByUserIdResponse?.data?.status === 200) {
        set({
          wishlist: getWishlistByUserIdResponse?.data?.wishlist,
        });
      }
    } catch (error) {
      console.error('Failed to fetch wishlist data!', (error as Error).message);
    }
  },

  loginWithGoogle: () => {
    window.location.href = '/api/auth/google';
  },

  loginWithGithub: () => {
    window.location.href = '/api/auth/github';
  },

  loginWithFacebook: () => {
    window.location.href = '/api/auth/facebook';
  },
}));

export default useStore;
