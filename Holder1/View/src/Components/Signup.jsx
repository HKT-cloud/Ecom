import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { signup, sendOTP } from '../config/axiosConfig';
import '../../../styles/signup-page.css';

const Signup = ({ onOTPVerification }) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!terms) {
      setError('Please accept the Terms and Conditions');
      setLoading(false);
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // First, attempt to register
      const response = await signup({ 
        email, 
        password,
        fullName
      });
      
      if (response.data.token) {
        // Store token temporarily before OTP verification
        localStorage.setItem('temp_token', response.data.token);
        localStorage.setItem('temp_user', JSON.stringify({
          ...response.data.user,
          fullName: fullName
        }));
        
        // Send OTP for verification
        await sendOTP({ email, purpose: 'signup' });
        
        // Trigger OTP verification
        onOTPVerification(email, 'signup');
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="login-content">
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h1 className="login-title">Create Your Account</h1>
            <p className="login-subtitle">Join our community and start your journey with us</p>
            
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="email" className="form-label">Email address</label>
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
              <div className="form-group mt-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree to the Terms and Conditions
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            <p className="login-footer mt-3">
              Already have an account? <Link to="/login" className="text-primary">Sign In Here</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
