
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img
                src={product.images[0] || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">₹{price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="mb-6">
                <p className="text-sm text-gray-600">Unit: {product.unit}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock} available</p>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-6 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-opacity-90 flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={20} /> Add to Cart
                </button>
              ) : (
                <button disabled className="w-full bg-gray-400 text-white py-4 rounded-lg font-semibold">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;