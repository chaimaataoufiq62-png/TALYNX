import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';
import CandidateMatches from './pages/candidate/Matches';
import CandidateSubmissions from './pages/candidate/Submissions';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';
import CompanyChallenges from './pages/company/Challenges';
import CompanyMatching from './pages/company/Matching';
import CompanySubmissions from './pages/company/Submissions';

const AUTH_ROUTES = ['/login', '/register'];

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div style={!isAuthPage ? { minHeight: 'calc(100vh - 61px)', backgroundColor: 'var(--fond-page)' } : {}}>
        <Routes>
          {/* ===== PUBLIC ===== */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===== CANDIDAT (Protected) ===== */}
          <Route element={<ProtectedRoute allowedRoles={['candidat']} />}>
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/candidate/matches" element={<CandidateMatches />} />
            <Route path="/candidate/submissions" element={<CandidateSubmissions />} />
          </Route>

          {/* ===== ENTREPRISE (Protected) ===== */}
          <Route element={<ProtectedRoute allowedRoles={['entreprise']} />}>
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/challenges" element={<CompanyChallenges />} />
            <Route path="/company/matching" element={<CompanyMatching />} />
            <Route path="/company/submissions" element={<CompanySubmissions />} />
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
