'use client';

import { useState } from 'react';
import { IndividualMatchRequest } from '@/lib/types';
import { apiClient } from '@/lib/api';
import ResultsDisplay from './ResultsDisplay';

export default function IndividualForm() {
  const [formData, setFormData] = useState<IndividualMatchRequest>({
    need: '',
    budget_range: '',
    ecosystem_preference: '',
    primary_use_cases: [],
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
      const response = await apiClient.matchIndividual(formData);
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
            What do you need? *
          </label>
          <textarea
            required
            minLength={10}
            value={formData.need}
            onChange={(e) => setFormData({ ...formData, need: e.target.value })}
            placeholder="Describe what you're looking for (e.g., 'Best laptop for high-end AI development', 'Portable device for video editing')"
            className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none min-h-32"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zd-text mb-2">
              Budget Range
            </label>
            <select
              value={formData.budget_range}
              onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
              className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none"
            >
              <option value="">Select range</option>
              <option value="budget">Budget ($500-$1000)</option>
              <option value="mid-range">Mid-Range ($1000-$2000)</option>
              <option value="premium">Premium ($2000-$4000)</option>
              <option value="unlimited">Unlimited ($4000+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zd-text mb-2">
              Ecosystem Preference
            </label>
            <select
              value={formData.ecosystem_preference}
              onChange={(e) => setFormData({ ...formData, ecosystem_preference: e.target.value })}
              className="w-full px-4 py-3 bg-zd-gray border border-gray-700 rounded-lg text-zd-text focus:border-zd-accent focus:outline-none"
            >
              <option value="">No preference</option>
              <option value="apple">Apple</option>
              <option value="windows">Windows</option>
              <option value="samsung">Samsung</option>
              <option value="linux">Linux</option>
              <option value="agnostic">Agnostic</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zd-accent text-zd-dark font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Finding Match...' : 'Find Perfect Product'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <ResultsDisplay results={results} type="individual" />
      )}
    </div>
  );
}
