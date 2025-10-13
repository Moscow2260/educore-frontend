import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import Home from '../pages/Home';
import AdminLogin from './Auth/AdminLogin';
import LecturerLogin from './Auth/LecturerLogin';
import StudentLogin from './Auth/StudentLogin';
import AdminPortal from './Portals/AdminPortal/AdminPortal';
import LecturerPortal from './Portals/LecturerPortal/LecturerPortal';
import StudentPortal from './Portals/StudentPortal/StudentPortal';
import ProtectedRoute from './Auth/ProtectedRoute';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Login Routes - redirect if already logged in */}
      <Route 
        path="/admin-login" 
        element={
          user ? 
            <Navigate to={user.role === 'Admin' ? '/admin-portal' : '/'} /> : 
            <AdminLogin />
        } 
      />
      <Route 
        path="/lecturer-login" 
        element={
          user ? 
            <Navigate to={user.role === 'Lecturer' ? '/lecturer-portal' : '/'} /> : 
            <LecturerLogin />
        } 
      />
      <Route 
        path="/student-login" 
        element={
          user ? 
            <Navigate to={user.role === 'Student' ? '/student-portal' : '/'} /> : 
            <StudentLogin />
        } 
      />

      {/* Protected Portal Routes */}
      <Route 
        path="/admin-portal" 
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminPortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/lecturer-portal" 
        element={
          <ProtectedRoute requiredRole="Lecturer">
            <LecturerPortal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-portal" 
        element={
          <ProtectedRoute requiredRole="Student">
            <StudentPortal />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;