import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">ZDX3</h1>
          <nav className="space-x-4">
            <Link to="/company" className="text-white hover:text-blue-300 transition">
              For Companies
            </Link>
            <Link to="/user" className="text-white hover:text-blue-300 transition">
              For Individuals
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            ZeroDay3 Matching AI
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-4">
            The Honesty Vector for the Synthetic Age
          </p>
          <p className="text-lg text-gray-300 mb-12">
            Enterprise workflow and product matching powered by our hybrid 65/35 logic framework
          </p>
          
          {/* Framework Explanation */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-left">
              <div className="text-4xl font-bold text-blue-400 mb-4">65%</div>
              <h3 className="text-xl font-semibold text-white mb-3">Structural Logic</h3>
              <p className="text-gray-300">
                High-fidelity skeletons of successful enterprise AI implementations and 
                market-leading product data
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-left">
              <div className="text-4xl font-bold text-purple-400 mb-4">35%</div>
              <h3 className="text-xl font-semibold text-white mb-3">Original Precision</h3>
              <p className="text-gray-300">
                Proprietary technical truth filtering to eliminate marketing noise and hallucinations
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link
              to="/company"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition shadow-lg"
            >
              Match Workflows
            </Link>
            <Link
              to="/user"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition shadow-lg"
            >
              Discover Products
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Zero Ads</h3>
            <p className="text-gray-300">
              A low-entropy zone. No ad-model trap.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Zero Data Retention</h3>
            <p className="text-gray-300">
              We don't want your data. We want your efficiency.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Gravitational Truth</h3>
            <p className="text-gray-300">
              Decisions are made on merit alone.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-20 border-t border-white/10">
        <div className="text-center text-gray-400">
          <p className="text-sm">
            "We don't patch the past; we optimize the drive."
          </p>
          <p className="text-xs mt-2">© 2024 ZeroDay3. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
