import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('poppes-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poppes-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.inStock) {
      toast.error('Product is out of stock');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.cartQuantity + quantity > product.quantity) {
          toast.error('Not enough stock available');
          return prev;
        }
        
        const updated = prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + quantity }
            : item
        );
        toast.success('Quantity updated in cart');
        return updated;
      } else {
        if (quantity > product.quantity) {
          toast.error('Not enough stock available');
          return prev;
        }
        
        toast.success('Added to cart');
        return [...prev, { ...product, cartQuantity: quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          if (quantity > item.quantity) {
            toast.error('Not enough stock available');
            return item;
          }
          return { ...item, cartQuantity: quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('poppes-cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};