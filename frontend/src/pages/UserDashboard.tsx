import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  verified_features: string[];
}

const UserDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [userId] = useState('demo-user-123'); // In real app, get from auth

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleFindMatches = () => {
    window.location.href = `/matches/user/${userId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              ZDX3
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link to="/company" className="text-gray-600 hover:text-gray-900">
                Company Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Discovery</h1>
          <p className="text-gray-600">
            Discover AI-matched products tailored to your skills and needs
          </p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={handleFindMatches}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Get Personalized Recommendations
          </button>
        </div>

        {/* Product Catalog */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Available Products</h2>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No products available yet. Check back soon!
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-purple-600 mb-3">{product.category}</p>
                  <p className="text-gray-700 text-sm mb-4">{product.description}</p>
                  
                  {product.verified_features && product.verified_features.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-gray-600">Verified Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {product.verified_features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Precision Matching
            </h3>
            <p className="text-gray-600 text-sm">
              Our 35% precision filter eliminates marketing noise to show you what truly matters
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Structural Analysis
            </h3>
            <p className="text-gray-600 text-sm">
              65% structural logic based on proven patterns and successful implementations
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Marketing Fluff
            </h3>
            <p className="text-gray-600 text-sm">
              Only verified technical features and real capabilities, no hallucinations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
