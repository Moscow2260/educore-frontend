import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    const loginPaths = {
      'Admin': '/admin-login',
      'Lecturer': '/lecturer-login', 
      'Student': '/student-login'
    };
    return <Navigate to={loginPaths[requiredRole] || '/admin-login'} replace />;
  }

  if (user.role !== requiredRole) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access the {requiredRole} portal.</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;