'use client';

import { CompanyMatchResponse, IndividualMatchResponse } from '@/lib/types';

interface ResultsDisplayProps {
  results: CompanyMatchResponse | IndividualMatchResponse;
  type: 'company' | 'individual';
}

export default function ResultsDisplay({ results, type }: ResultsDisplayProps) {
  if (type === 'company') {
    const companyResults = results as CompanyMatchResponse;
    
    return (
      <div className="mt-8 space-y-6">
        <div className="p-6 bg-zd-gray border border-gray-700 rounded-lg">
          <h3 className="text-xl font-bold text-zd-accent mb-4">Analysis Complete</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-zd-text mb-2">Deployment Strategy</h4>
              <p className="text-gray-300">{companyResults.deployment_strategy}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-zd-text mb-2">Estimated Impact</h4>
              <p className="text-gray-300">{companyResults.estimated_impact}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-zd-text">Recommended AI Tools</h3>
          
          {companyResults.recommendations.map((rec, idx) => (
            <div key={rec.tool_id} className="p-6 bg-zd-gray border border-gray-700 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-zd-accent">
                    #{idx + 1} {rec.tool_name}
                  </h4>
                  <p className="text-sm text-gray-400">{rec.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-zd-accent">
                    {Math.round(rec.match_score * 100)}%
                  </div>
                  <div className="text-xs text-gray-400">Match Score</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-300">Why This Tool:</p>
                  <p className="text-gray-400">{rec.reasoning}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-green-400">✓ Strength:</p>
                  <p className="text-gray-400">{rec.technical_truth.strength}</p>
                </div>
                
                <div>
                  <p className="text-sm font-semibold text-yellow-400">⚠ Limitation:</p>
                  <p className="text-gray-400">{rec.technical_truth.limitation}</p>
                </div>
                
                {rec.deployment_guide.setup_steps.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-zd-text mb-2">Setup Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-400 text-sm">
                      {rec.deployment_guide.setup_steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {rec.deployment_guide.custom_instructions.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-zd-text mb-2">Custom Instructions:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
                      {rec.deployment_guide.custom_instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Individual results
  const individualResults = results as IndividualMatchResponse;
  
  return (
    <div className="mt-8 space-y-6">
      <div className="p-6 bg-zd-gray border border-gray-700 rounded-lg">
        <h3 className="text-xl font-bold text-zd-accent mb-4">Recommendation Ready</h3>
        <p className="text-gray-300">{individualResults.buying_guide}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-zd-text">Product Recommendations</h3>
        
        {individualResults.recommendations.map((rec, idx) => (
          <div key={rec.product_id} className="p-6 bg-zd-gray border border-gray-700 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-zd-accent">
                  #{idx + 1} {rec.product_name}
                </h4>
                <p className="text-sm text-gray-400">{rec.category}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-zd-accent">
                  {Math.round(rec.match_score * 100)}%
                </div>
                <div className="text-xs text-gray-400">Match Score</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-300">Why This Product:</p>
                <p className="text-gray-400">{rec.reasoning}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-green-400">✓ Strength:</p>
                <p className="text-gray-400">{rec.technical_truth.strength}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-yellow-400">⚠ Limitation:</p>
                <p className="text-gray-400">{rec.technical_truth.limitation}</p>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-blue-400">→ Ideal For:</p>
                <p className="text-gray-400">{rec.technical_truth.ideal_for}</p>
              </div>
              
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-semibold text-zd-text hover:text-zd-accent">
                  Technical Specifications
                </summary>
                <div className="mt-2 p-3 bg-zd-dark rounded border border-gray-800">
                  <pre className="text-xs text-gray-400 overflow-x-auto">
                    {JSON.stringify(rec.technical_specs, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
