import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import AddEditProduct from './pages/admin/AddEditProduct';
import OrderManagement from './pages/admin/OrderManagement';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Layout component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Main App component
const AppContent: React.FC = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading Poppes Natural...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes with layout */}
      <Route path="/" element={
        <Layout>
          <HomePage />
        </Layout>
      } />
      <Route path="/products" element={
        <Layout>
          <ProductsPage />
        </Layout>
      } />
      <Route path="/cart" element={
        <Layout>
          <CartPage />
        </Layout>
      } />
      
      {/* Checkout and Order routes */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Layout>
            <CheckoutPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/order-confirmation/:orderId" element={
        <ProtectedRoute>
          <Layout>
            <OrderConfirmationPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout>
            <OrderTrackingPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <ProductManagement />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products/new" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AddEditProduct />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products/:id/edit" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AddEditProduct />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <OrderManagement />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;