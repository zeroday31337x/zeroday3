import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface Match {
  workflowId?: string;
  productId?: string;
  confidenceScore: number;
  structuralScore: number;
  precisionScore: number;
  explanation: string;
}

const MatchingResults: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    findMatches();
  }, [type, id]);

  const findMatches = async () => {
    setLoading(true);
    setError('');
    
    try {
      let url = '';
      if (type === 'company') {
        url = `${API_URL}/matching/company/${id}/workflows`;
      } else if (type === 'user') {
        url = `${API_URL}/matching/user/${id}/products`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        setMatches(response.data.data.matches || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.7) return 'text-blue-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 0.8) return 'bg-green-100';
    if (score >= 0.7) return 'bg-blue-100';
    if (score >= 0.6) return 'bg-yellow-100';
    return 'bg-gray-100';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 0.8) return 'EXCELLENT';
    if (score >= 0.7) return 'STRONG';
    if (score >= 0.6) return 'GOOD';
    return 'MODERATE';
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
              <Link to="/company" className="text-gray-600 hover:text-gray-900">
                Companies
              </Link>
              <Link to="/user" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matching Results</h1>
          <p className="text-gray-600">
            {type === 'company' 
              ? 'AI-powered workflow recommendations for your company'
              : 'Personalized product recommendations based on your profile'}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Analyzing matches...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              No matches found. Try adjusting your requirements or check back later.
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                {/* Score Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`${getScoreBgColor(match.confidenceScore)} px-4 py-2 rounded-lg`}>
                      <div className="text-xs text-gray-600 mb-1">Confidence Score</div>
                      <div className={`text-2xl font-bold ${getScoreColor(match.confidenceScore)}`}>
                        {(match.confidenceScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full ${getScoreBgColor(match.confidenceScore)}`}>
                      <span className={`text-sm font-semibold ${getScoreColor(match.confidenceScore)}`}>
                        {getScoreLabel(match.confidenceScore)} MATCH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Structural Logic (65%)</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${match.structuralScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {(match.structuralScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Precision Filter (35%)</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${match.precisionScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {(match.precisionScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Match Analysis</h3>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                    {match.explanation}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Framework Explanation */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            About Our 65/35 Matching Framework
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">65% Structural Logic</h3>
              <p className="text-sm text-gray-700">
                Pattern recognition from successful implementations, industry-proven workflows,
                and market-leading product data to ensure compatibility and success probability.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">35% Precision Filter</h3>
              <p className="text-sm text-gray-700">
                Proprietary technical truth validation that eliminates marketing noise,
                detects hallucinations, and verifies actual capabilities against claims.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MatchingResults;
