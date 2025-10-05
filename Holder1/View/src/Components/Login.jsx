import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { login, sendOTP } from '../config/axiosConfig';
import './styles/login-page.css';

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
    
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      // First, attempt to login
      const response = await login({ 
        email: email.trim().toLowerCase(), 
        password 
      });
      
      if (response?.data?.token) {
        // Store token temporarily before OTP verification
        localStorage.setItem('temp_token', response.data.token);
        localStorage.setItem('temp_user', JSON.stringify(response.data.user));
        
        // Send OTP for verification
        try {
          await sendOTP({ 
            email: email.trim().toLowerCase(), 
            purpose: 'login' 
          });
          
          // Trigger OTP verification UI
          onOTPVerification(email.trim().toLowerCase(), 'login');
        } catch (otpError) {
          console.error('OTP sending failed:', otpError);
          setError(otpError.message || 'Failed to send OTP. Please try again.');
        }
      } else {
        throw new Error(response?.data?.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="login-form">
              <h2 className="text-center mb-4">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : 'Login'}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{' '}
                  <a href="/signup" className="text-decoration-none">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
