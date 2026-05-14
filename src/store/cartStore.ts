import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === newItem.id && i.size === newItem.size);
          if (existingItem) {
            return {
              items: state.items.map(i => 
                (i.id === newItem.id && i.size === newItem.size) 
                  ? { ...i, quantity: i.quantity + 1 } 
                  : i
              )
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter(i => i.id !== id) }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'shreeganesh-cart' // unique name for localStorage key
    }
  )
);
