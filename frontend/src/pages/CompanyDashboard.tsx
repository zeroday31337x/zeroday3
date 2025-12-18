import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  requirements: string[];
}

const CompanyDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: 'medium',
    description: '',
    requirements: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      if (response.data.success) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()),
      };
      
      const response = await axios.post(`${API_URL}/companies`, payload);
      
      if (response.data.success) {
        setShowForm(false);
        setFormData({
          name: '',
          industry: '',
          size: 'medium',
          description: '',
          requirements: '',
        });
        fetchCompanies();
      }
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleFindMatches = (companyId: string) => {
    window.location.href = `/matches/company/${companyId}`;
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
              <Link to="/user" className="text-gray-600 hover:text-gray-900">
                User Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">
            Submit your workflow requirements and discover AI-powered matching recommendations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            {showForm ? 'Cancel' : '+ Add Company Profile'}
          </button>
        </div>

        {/* Company Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Create Company Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-500)</option>
                  <option value="large">Large (501-5000)</option>
                  <option value="enterprise">Enterprise (5000+)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe your company and business needs..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., API integration, Scalability, Security"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Create Profile
              </button>
            </form>
          </div>
        )}

        {/* Companies List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Companies</h2>
          
          {companies.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No companies yet. Create your first company profile to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {company.industry} • {company.size}
                      </p>
                      <p className="text-gray-700 mt-2">{company.description}</p>
                      {company.requirements && company.requirements.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {company.requirements.map((req, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleFindMatches(company.id)}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Find Matches
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
