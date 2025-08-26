import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { db } from '../../lib/firebase';
import { Product } from '../../types';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AddEditProduct: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    inStock: true,
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [isEditing, id]);

  const fetchProduct = async (productId: string) => {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const product = docSnap.data() as Product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
          category: product.category || '',
          inStock: product.inStock,
        });
        setImageUrl(product.image);
      } else {
        toast.error('Product not found');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!imageUrl.trim()) {
        toast.error('Please provide a product image URL');
        setLoading(false);
        return;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        inStock: formData.inStock,
        image: imageUrl,
        updatedAt: new Date(),
      };

      if (isEditing && id) {
        await updateDoc(doc(db, 'products', id), productData);
        toast.success('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date(),
        });
        toast.success('Product added successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditing ? 'Update product information' : 'Add a new product to your inventory'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image URL
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                {imageUrl && (
                  <div className="mt-4">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Provide a direct URL to a high-quality product image. You can use images from Pexels, Unsplash, or your own hosting.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Suggested sources:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline">Pexels.com</a> - Free stock photos</li>
                    <li>• <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash.com</a> - High-quality images</li>
                    <li>• Your own image hosting service</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select category</option>
                <option value="Dairy">Dairy</option>
                <option value="Honey">Honey</option>
                <option value="Oils">Oils</option>
                <option value="Spices">Spices</option>
                <option value="Organic">Organic</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="0.00"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter detailed product description"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  Product is in stock and available for purchase
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;