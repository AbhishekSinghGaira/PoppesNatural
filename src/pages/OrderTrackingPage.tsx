import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { Order } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderTrackingPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'packed': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'packed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'packed': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your order status and delivery information</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600">You haven't placed any orders yet. Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                {/* Order Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h2>
                    <p className="text-gray-600">
                      Placed on {order.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Order Progress</span>
                    <span className="text-sm text-gray-500">{getProgressPercentage(order.status)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="flex justify-between items-center mb-6">
                  {['pending', 'packed', 'shipped', 'delivered'].map((status, index) => {
                    const isActive = ['pending', 'packed', 'shipped', 'delivered'].indexOf(order.status) >= index;
                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {getStatusIcon(status as Order['status'])}
                        </div>
                        <span className={`text-xs mt-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-600">Qty: {item.cartQuantity}</p>
                          <p className="text-xs font-medium text-gray-900">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="border-t pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                      <p className="text-gray-600">{order.customerInfo.address}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Contact Information</p>
                      <p className="text-gray-600">{order.customerInfo.phone}</p>
                      <p className="text-gray-600">{order.customerInfo.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;