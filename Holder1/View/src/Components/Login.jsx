import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../config/axiosConfig';
import '../styles/login-page.css';

const Login = ({ onOTPVerification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // First, attempt to login
      const response = await api.post('/user/login', { email, password });
      
      if (response.data.token) {
        // Store token temporarily before OTP verification
        localStorage.setItem('temp_token', response.data.token);
        localStorage.setItem('temp_user', JSON.stringify(response.data.user));
        
        // Send OTP for verification
        await api.post('/otp/send-otp', { email, purpose: 'signin' });
        
        // Trigger OTP verification
        onOTPVerification(email, 'signin');
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="login-content">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">Welcome back! Please enter your credentials</p>
            
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    {' Loading...'}
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
