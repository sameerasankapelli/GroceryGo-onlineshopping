
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { FiShoppingCart, FiUser, FiSearch, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount, clearCart } = useContext(CartContext);
  const { clearWishlist } = useContext(WishlistContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-3xl font-bold text-primary whitespace-nowrap">
            GroceryGo
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="absolute right-3 top-2.5">
                <FiSearch className="text-gray-500" size={20} />
              </button>
            </div>
          </form>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-700 hover:text-primary hidden md:block">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-primary hidden md:block">Products</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary hidden md:block">Contact</Link>
            
            <Link to="/cart" className="relative">
              <FiShoppingCart size={24} className="text-gray-700 hover:text-primary" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-gray-700 hover:text-primary"
                  >
                    <FiUser size={24} />
                    <span className="hidden md:block">{user.name}</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          clearWishlist();
                          clearCart();
                          setShowDropdown(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;