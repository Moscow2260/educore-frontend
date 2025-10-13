import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { useAuth } from '../../Auth/AuthContext';
import LecturersManagement from './LecturersManagement';
import StudentsManagement from './StudentManagement';
import CoursesManagement from './CourseManagement';
import AssignLecturers from './AssignLecturers';
import AssignStudents from './AssignStudents';
import '../../../styles/AdminPortal.css';
import UserListing from './UserListing';


const AdminPortal = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('lecturers');

const renderSection = () => {
  switch (activeSection) {
    case 'lecturers':
      return <LecturersManagement />;
    case 'students':
      return <StudentsManagement />;
    case 'courses':
      return <CoursesManagement />;
    case 'assign-lecturers':
      return <AssignLecturers />;
    case 'assign-students':
      return <AssignStudents />;
    case 'users-listing':           // new tab
      return <UserListing />;       // list-only component
    default:
      return <LecturersManagement />;
  }
};
  return (
    <div className="admin-portal">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark p-3">
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-speedometer2 me-2"></i>
            Educore Admin Portal
          </span>
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Welcome, Admin</span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Container fluid>
        <Row>
          {/* Sidebar */}
<Col md={3} className="bg-light sidebar p-3">
  <h6 className="fw-bold text-uppercase mb-3">Management</h6>
  <Nav className="flex-column">
    <Nav.Link 
      className={activeSection === 'lecturers' ? 'active' : ''}
      onClick={() => setActiveSection('lecturers')}
    >
      <i className="bi bi-person-badge me-2"></i>
      Manage Lecturers
    </Nav.Link>
    <Nav.Link 
      className={activeSection === 'students' ? 'active' : ''}
      onClick={() => setActiveSection('students')}
    >
      <i className="bi bi-people me-2"></i>
      Manage Students
    </Nav.Link>
    <Nav.Link 
      className={activeSection === 'courses' ? 'active' : ''}
      onClick={() => setActiveSection('courses')}
    >
      <i className="bi bi-book me-2"></i>
      Manage Courses
    </Nav.Link>
    <Nav.Link 
      className={activeSection === 'assign-lecturers' ? 'active' : ''}
      onClick={() => setActiveSection('assign-lecturers')}
    >
      <i className="bi bi-person-plus me-2"></i>
      Assign Lecturers
    </Nav.Link>
    <Nav.Link 
      className={activeSection === 'assign-students' ? 'active' : ''}
      onClick={() => setActiveSection('assign-students')}
    >
      <i className="bi bi-people-fill me-2"></i>
      Assign Students
    </Nav.Link>
      <Nav.Link 
  className={activeSection === 'users-listing' ? 'active' : ''}
  onClick={() => setActiveSection('users-listing')}
>
  <i className="bi bi-list-ul me-2"></i>
  User Listing
</Nav.Link>

    
  </Nav>
</Col>


          {/* Main Content */}
          <Col md={9} className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="mb-0">Admin Dashboard</h3>
              <div className="text-muted">
                <small>Manage your educational institution</small>
              </div>
            </div>
            
            {renderSection()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPortal;