import React, { useState } from 'react';
import { ShoppingCart, Star, Heart, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price}/{product.unit}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{Math.round(product.price * 1.2)}/{product.unit}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Stock: {product.quantity} {product.unit}
          </span>
        </div>

        {/* Quantity Selector */}
        {product.inStock && (
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">Quantity:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.quantity}
                className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-500 ml-2">{product.unit}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full"
          size="md"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? `Add ${quantity} ${product.unit} to Cart` : 'Out of Stock'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;