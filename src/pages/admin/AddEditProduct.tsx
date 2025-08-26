import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import { ArrowLeft, Link as LinkIcon, X } from 'lucide-react';
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
    unit: '500 grams',
    category: '',
    inStock: true,
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  const fetchProduct = useCallback(async (productId: string) => {
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
          unit: product.unit || '500 grams',
          category: product.category || '',
          inStock: product.inStock,
        });
        setImageUrl(product.image);
        setImagePreview(product.image);
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
  }, [db, setFormData, setImageUrl, setImagePreview, setFetchLoading, toast, navigate]);

  useEffect(() => {
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [isEditing, id, fetchProduct]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    
    // Set preview for any URL (including invalid ones) so user can see what they're typing
    // Validation will happen on form submit
    setImagePreview(url);
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string) => {
    // Check for common image extensions
    const imageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp|svg|tiff|tif)$/i;
    
    // Check if URL ends with image extension
    if (imageExtensions.test(url)) {
      return true;
    }
    
    // Check for common image hosting domains that might not have extensions
    const imageHostingDomains = [
      'images.unsplash.com',
      'images.pexels.com',
      'images.pixabay.com',
      'i.imgur.com',
      'cdn.pixabay.com',
      'source.unsplash.com'
    ];
    
    try {
      const urlObj = new URL(url);
      return imageHostingDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const validateImageUrl = (url: string): { isValid: boolean; message: string } => {
    if (!url.trim()) {
      return { isValid: false, message: 'Please enter an image URL' };
    }
    
    if (!isValidUrl(url)) {
      return { isValid: false, message: 'Please enter a valid URL (must start with http:// or https://)' };
    }
    
    if (!isImageUrl(url)) {
      return { 
        isValid: false, 
        message: 'URL does not appear to be an image. Supported formats: JPG, PNG, GIF, WebP, BMP, SVG, TIFF' 
      };
    }
    
    return { isValid: true, message: 'Valid image URL' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      // When editing, allow keeping existing image
      if (!imageUrl && !isEditing) {
        toast.error('Please enter a product image URL');
        setLoading(false);
        return;
      }

      // Validate image URL only if a new one is provided
      if (imageUrl) {
        const validation = validateImageUrl(imageUrl);
        if (!validation.isValid) {
          toast.error(validation.message);
          setLoading(false);
          return;
        }
      }

      // Prepare product data, only include image if it's provided or we're adding a new product
      const productData: Partial<Product> & { updatedAt: Date } = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        inStock: formData.inStock,
        updatedAt: new Date(),
      };

      // Only include image in the data if it's provided
      if (imageUrl) {
        productData.image = imageUrl;
      } else if (!isEditing) {
        // For new products, image is required
        toast.error('Please enter a product image URL');
        setLoading(false);
        return;
      }

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
            {/* Image URL Input */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image URL
              </label>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
                        onError={() => {
                          // If the image fails to load, show a placeholder but keep the URL in input
                          setImagePreview('');
                          // Show an error message only if we had a URL
                          if (imageUrl) {
                            toast.error('Failed to load image preview. Please check the URL.');
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageUrl('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <LinkIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter a valid image URL (JPG, PNG, WebP)
                  </p>
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

            {/* Quantity and Unit */}
            <div className="flex items-center">
              <div className="flex-1">
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
              <div className="ml-4">
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="250 grams">250 grams</option>
                  <option value="500 grams">500 grams</option>
                  <option value="1 kg">1 kg</option>
                  <option value="2 kg">2 kg</option>
                  <option value="5 kg">5 kg</option>
                  <option value="250 ml">250 ml</option>
                  <option value="500 ml">500 ml</option>
                  <option value="1 liter">1 liter</option>
                  <option value="2 liters">2 liters</option>
                  <option value="1 piece">1 piece</option>
                  <option value="pack of 2">pack of 2</option>
                  <option value="pack of 5">pack of 5</option>
                  <option value="pack of 10">pack of 10</option>
                </select>
              </div>
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
