
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const category = searchParams.get('category');
        const categorySlug = searchParams.get('categorySlug');
        const categoryName = searchParams.get('categoryName');
        const search = searchParams.get('search');
        
        let url = '/products?';
        if (category) url += `category=${category}&`;
        else if (categorySlug) url += `categorySlug=${categorySlug}&`;
        else if (categoryName) {
          // Fetch all, filter client-side by populated category name for reliability
        }
        if (search) url += `search=${search}&`;
        
        const res = await api.get(url);
        let items = res.data || [];
        if (categoryName) {
          const name = categoryName.toLowerCase().trim();
          items = items.filter(p => (p.category?.name || '').toLowerCase() === name);
        }
        setProducts(items);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;