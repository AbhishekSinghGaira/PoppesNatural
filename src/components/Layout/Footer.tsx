import React from 'react';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">
                Poppes <span className="text-green-400">Natural</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4">
              Pure, natural products crafted with love. Experience the goodness of nature in every product.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-green-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Pure Ghee</li>
              <li className="text-gray-300">Natural Honey</li>
              <li className="text-gray-300">Organic Products</li>
              <li className="text-gray-300">Natural Remedies</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@poppesnatural.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Poppes Natural. All rights reserved. Made with ♥ for nature lovers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;