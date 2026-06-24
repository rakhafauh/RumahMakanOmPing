/**
 * CartContext - Konteks untuk mengelola keranjang belanja pelanggan
 * Menyimpan item keranjang di localStorage agar persisten
 */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Key localStorage
const CART_STORAGE_KEY = 'omping_cart';

// Initial state
const initialState = {
  items: [], // Array of { menu, qty }
};

// Action types
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

/**
 * Reducer untuk keranjang belanja
 */
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existingIndex = state.items.findIndex(
        (item) => item.menu.Id_Menu === action.payload.Id_Menu
      );
      if (existingIndex >= 0) {
        // Tambah qty jika sudah ada
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + 1,
        };
        return { ...state, items: updated };
      }
      // Tambah item baru
      return {
        ...state,
        items: [...state.items, { menu: action.payload, qty: 1 }],
      };
    }

    case ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.menu.Id_Menu !== action.payload
        ),
      };
    }

    case ACTIONS.UPDATE_QTY: {
      const { menuId, qty } = action.payload;
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.menu.Id_Menu !== menuId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.menu.Id_Menu === menuId ? { ...item, qty } : item
        ),
      };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    case ACTIONS.LOAD_CART:
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

// Buat context
const CartContext = createContext(null);

/**
 * CartProvider - Membungkus aplikasi dengan konteks keranjang
 */
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart dari localStorage saat pertama kali mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: ACTIONS.LOAD_CART, payload: parsed });
        }
      }
    } catch (e) {
      console.error('Gagal memuat keranjang:', e);
    }
  }, []);

  // Simpan ke localStorage setiap kali items berubah
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  }, [state.items]);

  // Hitung total harga
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.menu.Harga_Menu * item.qty,
    0
  );

  // Hitung total item
  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);

  // Cek apakah menu ada di keranjang
  const getItemQty = (menuId) => {
    const item = state.items.find((i) => i.menu.Id_Menu === menuId);
    return item ? item.qty : 0;
  };

  // Fungsi aksi
  const addItem = (menu) => dispatch({ type: ACTIONS.ADD_ITEM, payload: menu });
  const removeItem = (menuId) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: menuId });
  const updateQty = (menuId, qty) =>
    dispatch({ type: ACTIONS.UPDATE_QTY, payload: { menuId, qty } });
  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  const value = {
    items: state.items,
    totalPrice,
    totalItems,
    addItem,
    removeItem,
    updateQty,
    getItemQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook useCart - Akses keranjang belanja dari komponen manapun
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
}

export default CartContext;
