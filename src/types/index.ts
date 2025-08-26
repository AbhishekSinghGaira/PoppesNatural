export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  inStock: boolean;
  category?: string;
  createdAt: Date;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'packed' | 'shipped' | 'delivered';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  name?: string;
}