import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { Package, Eye, Filter } from 'lucide-react';
import { db } from '../../lib/firebase';
import { Order } from '../../types';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'packed' | 'shipped' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === filterStatus));
    }
  }, [orders, filterStatus]);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
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
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
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

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'pending': return 'packed';
      case 'packed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-2">Track and manage customer orders</p>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerInfo.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerInfo.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} item(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {getNextStatus(order.status) && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                            >
                              Mark as {getNextStatus(order.status)}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{selectedOrder.id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                    <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.cartQuantity}</p>
                          <p className="text-sm font-medium text-gray-900">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total: ₹{selectedOrder.total.toFixed(2)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Ordered on {selectedOrder.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;