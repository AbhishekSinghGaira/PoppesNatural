import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Search, Filter, Grid, List } from 'lucide-react';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterInStock, setFilterInStock] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[];
        
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Stock filter
    if (filterInStock !== null) {
      filtered = filtered.filter(product => product.inStock === filterInStock);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterInStock, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-green-600">Natural</span> Products
          </h1>
          <p className="text-lg text-gray-600">
            Discover our collection of pure, natural products made with love and care
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Stock Filter */}
            <select
              value={filterInStock === null ? '' : filterInStock.toString()}
              onChange={(e) => setFilterInStock(e.target.value === '' ? null : e.target.value === 'true')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Products</option>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'newest')}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price Low-High</option>
            </select>

            {/* View Mode */}
            <div className="flex rounded-md border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 px-4 rounded-l-md ${
                  viewMode === 'grid'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 px-4 rounded-r-md ${
                  viewMode === 'list'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mt-8 text-center text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;