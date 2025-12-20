'use client';

import { useState } from 'react';
import { CompanyMatchRequest } from '@/lib/types';
import { apiClient } from '@/lib/api';
import ResultsDisplay from './ResultsDisplay';

export default function CompanyForm() {
  const [formData, setFormData] = useState<CompanyMatchRequest>({
    friction_point: '',
    company_size: '',
    industry: '',
    technical_constraints: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiClient.matchCompany(formData);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zd-text mb-2">
            Friction Point *
          </label>
          <textarea
            required
            minLength={10}
            value={formData.friction_point}
            onChange={(e) => setFormData({ ...formData, friction_point: e.target.value })}
            placeholder="Describe your specific business problem (e.g., 'Customer support latency', 'Manual data entry processes')"
            className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none min-h-32"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zd-text mb-2">
              Company Size
            </label>
            <select
              value={formData.company_size}
              onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
              className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none"
            >
              <option value="">Select size</option>
              <option value="startup">Startup (1-10)</option>
              <option value="small">Small (11-50)</option>
              <option value="medium">Medium (51-200)</option>
              <option value="enterprise">Enterprise (200+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zd-text mb-2">
              Industry
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zd-accent text-zd-dark font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Match AI Solution'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <ResultsDisplay results={results} type="company" />
      )}
    </div>
  );
}
