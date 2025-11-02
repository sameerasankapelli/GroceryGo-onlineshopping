
import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">GroceryGo</h3>
            <p className="text-gray-400">
              Your trusted online grocery store. Fresh products delivered to your doorstep in 30 minutes.
            </p>
            <div className="flex gap-4 mt-4">
              <FiFacebook className="cursor-pointer hover:text-primary" size={24} />
              <FiTwitter className="cursor-pointer hover:text-primary" size={24} />
              <FiInstagram className="cursor-pointer hover:text-primary" size={24} />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-gray-400 hover:text-white">Fruits & Vegetables</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Dairy & Bakery</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Snacks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <FiPhone /> +91 6302347685
              </p>
              <p className="flex items-center gap-2">
                <FiMail /> sameerasankapelli@gmail.com
              </p>
              <p>Guntur, Andhra Pradesh</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 GroceryGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;