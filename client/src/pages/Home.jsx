
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products?limit=8');
        setFeaturedProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-orange-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                GroceryGo: Freshness You Can Trust, Savings You Will Love!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Order fresh groceries online and get them delivered to your doorstep in just 30 minutes!
              </p>
              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90"
                >
                  Shop now
                </Link>
                <Link
                  to="/products"
                  className="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white"
                >
                  Explore deals →
                </Link>
              </div>
              
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <div className="text-3xl font-bold text-primary">30 min</div>
                  <div className="text-gray-600">Fast Delivery</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-gray-600">Fresh Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://wallpaperaccess.com/full/1624873.jpg"
                alt="Grocery Shopping"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <CategorySection />

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your groceries delivered in just 30 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Products</h3>
              <p className="text-gray-600">100% fresh and quality assured products</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive prices and amazing deals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;