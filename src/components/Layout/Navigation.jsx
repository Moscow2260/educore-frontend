import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          <h1 className="sitename">Educore</h1>
        </Link>

        <nav id="navmenu" className="navmenu">
          <ul>
            <li><Link to="/admin-login">Admin</Link></li>
            <li><Link to="/lecturer-login">Lecturer</Link></li>
            <li><Link to="/student-login">Student</Link></li>
            {user && (
              <li>
                <button 
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={logout}
                >
                  Logout ({user.role})
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;