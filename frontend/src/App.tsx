import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CompanyDashboard from './pages/CompanyDashboard';
import UserDashboard from './pages/UserDashboard';
import MatchingResults from './pages/MatchingResults';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/matches/:type/:id" element={<MatchingResults />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
