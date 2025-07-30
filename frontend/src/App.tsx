import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Applications } from './pages/admin/Applications';
import { Analytics } from './pages/admin/Analytics';
import { Users } from './pages/admin/Users';
import { RiskManagement } from './pages/admin/RiskManagement';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { Profile } from './pages/user/Profile';
import { Apply } from './pages/user/Apply';
import { Documents } from './pages/user/Documents';
import { Score } from './pages/user/Score';
import { Help } from './pages/user/Help';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />
            : <Login />
        } 
      />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/applications" element={
        <ProtectedRoute requireAdmin>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute requireAdmin>
          <Analytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requireAdmin>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/risk-management" element={
        <ProtectedRoute requireAdmin>
          <RiskManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requireAdmin>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requireAdmin>
          <Settings />
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/user/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/user/apply" element={
        <ProtectedRoute>
          <Apply />
        </ProtectedRoute>
      } />
      <Route path="/user/documents" element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      } />
      <Route path="/user/score" element={
        <ProtectedRoute>
          <Score />
        </ProtectedRoute>
      } />
      <Route path="/user/help" element={
        <ProtectedRoute>
          <Help />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;