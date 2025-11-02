import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="mx-auto text-gray-400 mb-4" size={80} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
          <Link
            to="/products"
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.map(item => {
                const price = item.discountPrice || item.price;
                return (
                  <div key={item._id} className="flex gap-4 p-6 border-b last:border-b-0">
                    <img
                      src={item.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.unit}</p>
                      <p className="text-lg font-bold text-primary mt-2">₹{price}</p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={20} />
                      </button>

                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <FiMinus />
                        </button>
                        <span className="px-4 py-1 border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <p className="text-lg font-bold">₹{(price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹40.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ₹{(getCartTotal() + 40).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-primary hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;