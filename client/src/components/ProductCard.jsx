
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => {
            const cat = (product.category && product.category.name) || '';
            const fallbackByCat = {
              'Fruits & Vegetables': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
              'Dairy & Bakery': 'https://images.unsplash.com/photo-1550592704-6c76defa9987?w=600',
              'Snacks & Beverages': 'https://images.unsplash.com/photo-1585238342022-5eeb0b2f9312?w=600',
              'Personal Care': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600',
              'Household': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600',
              'Baby Care': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600'
            };
            e.currentTarget.src = fallbackByCat[cat] || 'https://via.placeholder.com/600';
          }}
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mt-1">{product.unit}</p>
        
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-xl font-bold text-gray-900">₹{price}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ₹{product.price}
              </span>
            )}
          </div>
          
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
            >
              <FiShoppingCart /> Add
            </button>
          ) : (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;