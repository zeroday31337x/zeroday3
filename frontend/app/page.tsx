'use client';

import { useState } from 'react';
import Link from 'next/link';
import CompanyForm from '@/components/CompanyForm';
import IndividualForm from '@/components/IndividualForm';

export default function Home() {
  const [activeTrack, setActiveTrack] = useState<'company' | 'individual'>('company');

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Admin Link */}
        <div className="flex justify-end mb-4">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-zd-accent transition-all"
          >
            Admin Dashboard →
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zd-accent mb-4">
            ZeroDay3 Matching AI
          </h1>
          <p className="text-lg text-gray-400 mb-2">
            Technical Truth. No Marketing Noise.
          </p>
          <p className="text-sm text-gray-500">
            65% Structural Logic + 35% Original Precision
          </p>
        </div>

        {/* Track Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTrack('company')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeTrack === 'company'
                ? 'bg-zd-accent text-zd-dark'
                : 'bg-zd-gray text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="text-lg mb-1">For Companies</div>
            <div className="text-xs opacity-80">Match AI Workflows</div>
          </button>
          
          <button
            onClick={() => setActiveTrack('individual')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all ${
              activeTrack === 'individual'
                ? 'bg-zd-accent text-zd-dark'
                : 'bg-zd-gray text-gray-400 hover:bg-gray-800'
            }`}
          >
            <div className="text-lg mb-1">For Individuals</div>
            <div className="text-xs opacity-80">Find Perfect Products</div>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-zd-dark border border-gray-800 rounded-lg p-8">
          {activeTrack === 'company' ? (
            <div>
              <h2 className="text-2xl font-bold text-zd-text mb-2">
                Company Workflow Matching
              </h2>
              <p className="text-gray-400 mb-6">
                Describe your business friction point, and we'll match you with the optimal AI solution.
              </p>
              <CompanyForm />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-zd-text mb-2">
                Individual Product Matching
              </h2>
              <p className="text-gray-400 mb-6">
                Tell us what you need, and we'll cut through the marketing to find your perfect match.
              </p>
              <IndividualForm />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>ZeroDay3 © 2024 | The Honesty Vector for the Synthetic Age</p>
          <p className="mt-2">No ads. No data retention. Gravitational truth only.</p>
        </div>
      </div>
    </main>
  );
}
