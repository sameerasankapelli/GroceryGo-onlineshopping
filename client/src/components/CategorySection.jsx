import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    { id: 1, name: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200', link: '/products?categoryName=Fruits%20%26%20Vegetables' },
    { id: 2, name: 'Dairy & Bakery', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200', link: '/products?categoryName=Dairy%20%26%20Bakery' },
    { id: 3, name: 'Snacks & Beverages', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200', link: '/products?categoryName=Snacks%20%26%20Beverages' },
    { id: 4, name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200', link: '/products?categoryName=Personal%20Care' },
    { id: 5, name: 'Household', image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=200', link: '/products?categoryName=Household' },
    { id: 6, name: 'Baby Care', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200', link: '/products?categoryName=Baby%20Care' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={category.link}
              className="text-center group"
            >
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="text-sm font-semibold group-hover:text-primary">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
