import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pure A2 Cow Ghee',
    description: 'Premium quality A2 cow ghee made from grass-fed cows. Rich in nutrients and perfect for cooking, religious ceremonies, and Ayurvedic treatments. Made using traditional bilona method.',
    price: 899,
    image: 'https://images.pexels.com/photos/6544373/pexels-photo-6544373.jpeg?auto=compress&cs=tinysrgb&w=800',
    quantity: 25,
    inStock: true,
    category: 'Dairy',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Raw Forest Honey',
    description: 'Unprocessed, raw honey sourced directly from forest hives. Contains natural enzymes, antioxidants, and minerals. Perfect for boosting immunity and natural sweetening.',
    price: 649,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    quantity: 30,
    inStock: true,
    category: 'Honey',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Organic Turmeric Powder',
    description: 'Pure organic turmeric powder with high curcumin content. Naturally grown without any chemicals or pesticides. Great for cooking and health benefits.',
    price: 299,
    image: 'https://images.pexels.com/photos/161556/spice-turmeric-cooking-ingredient-161556.jpeg?auto=compress&cs=tinysrgb&w=800',
    quantity: 0,
    inStock: false,
    category: 'Spices',
    createdAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Cold Pressed Coconut Oil',
    description: 'Virgin coconut oil extracted using traditional cold-pressed method. Retains all natural nutrients and has a rich coconut aroma. Perfect for cooking and skin care.',
    price: 450,
    image: 'https://images.pexels.com/photos/4198543/pexels-photo-4198543.jpeg?auto=compress&cs=tinysrgb&w=800',
    quantity: 20,
    inStock: true,
    category: 'Oils',
    createdAt: new Date('2024-02-01'),
  }
];