import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { Package, ShoppingCart, Users, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { Product, Order } from '../../types';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Product[];

        // Fetch orders
        const ordersSnapshot = await getDocs(
          query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        );
        const orders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Order[];

        // Calculate stats
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const lowStock = products.filter(product => product.quantity <= 5 && product.inStock);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders,
          totalRevenue,
        });

        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Users,
      color: 'bg-yellow-500',
      link: '/admin/orders?status=pending',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
          </div>
          <Link to="/admin/products/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <Link key={index} to={card.link} className="block">
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders yet</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                      <p className="text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.total.toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'packed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Manage Stock
              </Link>
            </div>
            <div className="space-y-4">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">All products are well stocked</p>
              ) : (
                lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Stock: {product.quantity} units</p>
                      </div>
                    </div>
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Update Stock
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;