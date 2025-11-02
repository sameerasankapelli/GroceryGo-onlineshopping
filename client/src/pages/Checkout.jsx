
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [qrStep, setQrStep] = useState(false);
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const handleAddressChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  const totalWithDelivery = () => getCartTotal() + 40;

  const startOnlinePayment = async (dbOrderId) => {
    const amount = totalWithDelivery();
    try {
      const res = await api.post('/payment/create-order', { amount });
      setRazorpayOrder(res.data);
    } catch (e) {
      // Fallback: proceed with QR without Razorpay order if backend not configured
      setRazorpayOrder({ id: `qr_${Date.now()}`, amount });
    }
    setCreatedOrderId(dbOrderId);
    setQrStep(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.discountPrice || item.price
        })),
        totalAmount: totalWithDelivery(),
        deliveryAddress,
        paymentMethod
      };

      // Create order in DB first
      const { data: created } = await api.post('/orders', orderData);

      if (paymentMethod === 'online') {
        await startOnlinePayment(created._id);
        toast.info('Scan the QR to pay');
      } else {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async () => {
    try {
      await api.post('/payment/verify', {
        razorpay_order_id: razorpayOrder?.id,
        razorpay_payment_id: 'qr',
        orderId: createdOrderId,
      });
      clearCart();
      toast.success('Payment verified and order confirmed!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {!qrStep ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={deliveryAddress.street}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryAddress.city}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Guntur"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={deliveryAddress.state}
                        onChange={handleAddressChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        placeholder="Andhra Pradesh"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={deliveryAddress.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      placeholder="522001"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-semibold">Online Payment</div>
                      <div className="text-sm text-gray-600">UPI, Cards, Net Banking</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </form>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Pay via UPI</h2>
                <p className="text-gray-600 mb-4">Scan this QR with your UPI app to pay.</p>
                <div className="flex justify-center mb-4">
                  {import.meta.env.VITE_UPI_STATIC_QR_IMAGE ? (
                    <img src={import.meta.env.VITE_UPI_STATIC_QR_IMAGE} alt="UPI QR" style={{ width: 220, height: 220 }} />
                  ) : (
                    <QRCode value={`upi://pay?pa=${encodeURIComponent(import.meta.env.VITE_UPI_ID || 'test@upi')}&pn=${encodeURIComponent(import.meta.env.VITE_UPI_NAME || 'GroceryGo')}&am=${totalWithDelivery()}&tn=${encodeURIComponent('GroceryGo Order')}&cu=INR&tr=${encodeURIComponent(razorpayOrder?.id || '')}`} size={220} />
                  )}
                </div>
                <div className="space-y-3">
                  <button onClick={confirmPayment} className="w-full bg-primary text-white py-3 rounded-lg font-semibold">I have paid</button>
                  <button onClick={() => setQrStep(false)} className="w-full border border-gray-300 py-3 rounded-lg font-semibold">Back</button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹40.00</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-primary">
                  ₹{(getCartTotal() + 40).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;