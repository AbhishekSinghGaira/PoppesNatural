import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Shield, Truck, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('inStock', '==', true),
          limit(4)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[];
        
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: Leaf,
      title: 'Pure & Natural',
      description: 'All our products are 100% natural with no artificial additives or preservatives.',
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Rigorous quality checks ensure every product meets our high standards.',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure delivery to your doorstep within 2-3 business days.',
    },
    {
      icon: Star,
      title: 'Customer Loved',
      description: 'Trusted by thousands of customers who love our natural products.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      rating: 5,
      comment: 'The ghee is incredibly pure and tastes amazing. Best quality I\'ve found!',
    },
    {
      name: 'Raj Kumar',
      rating: 5,
      comment: 'Natural honey that\'s genuinely raw and unprocessed. Highly recommended!',
    },
    {
      name: 'Anita Singh',
      rating: 5,
      comment: 'Fast delivery and excellent packaging. Products arrived fresh and perfect.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Pure{' '}
                <span className="text-green-600">Natural</span>
                <br />
                Products for{' '}
                <span className="text-yellow-600">Better</span> Living
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Discover the goodness of nature with our premium collection of pure ghee, 
                raw honey, and other natural products. Crafted with love, delivered with care.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="group">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Natural Products"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -top-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-6 w-6 text-green-600" />
                  <span className="font-semibold">100% Natural</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.8 Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-green-600">Poppes Natural</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to bringing you the finest natural products with uncompromising quality and care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-green-600">Featured</span> Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Handpicked selection of our most loved natural products
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-green-600">Customers</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real reviews from real customers who love our products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Go Natural?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have made the switch to our pure, natural products.
            </p>
            <Link to="/products">
              <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-50">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;