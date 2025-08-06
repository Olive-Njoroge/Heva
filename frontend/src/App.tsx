import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
// Remove this line: import { Register } from './pages/Register';

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

// Loading Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading HEVA...</p>
        <p className="mt-2 text-sm text-gray-500">Connecting to backend...</p>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: { 
  children: React.ReactNode; 
  requireAdmin?: boolean 
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check admin requirements
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
}

// Public Route Component (for login/register)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
      />
      
      <Route 
        path="/login" 
        element={
            <Login />
        } 
      />
      
      {/* Remove the register route since it's handled in Login component */}
      {/* 
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      */}

      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/applications" 
        element={
          <ProtectedRoute requireAdmin>
            <Applications />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute requireAdmin>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requireAdmin>
            <Users />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/risk-management" 
        element={
          <ProtectedRoute requireAdmin>
            <RiskManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/reports" 
        element={
          <ProtectedRoute requireAdmin>
            <Reports />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/settings" 
        element={
          <ProtectedRoute requireAdmin>
            <Settings />
          </ProtectedRoute>
        } 
      />

      {/* User Routes */}
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/apply" 
        element={
          <ProtectedRoute>
            <Apply />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/documents" 
        element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/score" 
        element={
          <ProtectedRoute>
            <Score />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/help" 
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
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