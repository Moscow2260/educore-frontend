import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { showLoading, updateToast } from '../../utils/toast';
import '../../styles/Auth.css';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = showLoading('Logging in...');

    try {
      const result = await login(formData);
      
      // Check if the logged-in user is a Student
      if (result.user.role !== 'Student') {
        updateToast(toastId, 'error', 'Access denied. Student privileges required.');
        setLoading(false);
        return; // Stay on the same page
      }

      updateToast(toastId, 'success', 'Login successful! Redirecting to student portal...');
      setTimeout(() => {
        window.location.href = '/student-portal';
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          'Login failed. Please check your credentials and try again.';
      updateToast(toastId, 'error', errorMessage);
      setLoading(false);
      // Stay on the same page - user can try again
    }
  };

  return (
    <div className="auth-background">
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={4} sm={8} xs={12}>
            <Card className="auth-card shadow">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="auth-title">Student Login</h2>
                  <p className="text-muted">Access the student portal</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                      className="auth-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="auth-input"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="auth-button"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Logging in...
                        </>
                      ) : (
                        'Login to Student Portal'
                      )}
                    </Button>
                  </div>
                </Form>

                <div className="text-center mt-3">
                  <a href="/" className="text-decoration-none back-link">
                    ← Back to Home
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentLogin;