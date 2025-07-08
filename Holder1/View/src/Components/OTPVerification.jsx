import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import api from '../config/axiosConfig'
import './styles/login-page.css'

const OTPVerification = ({ email, purpose, onVerified }) => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()

    // Ensure OTP is always a string and handle input
    const handleOTPChange = (e) => {
        const value = e.target.value;
        // Remove any non-digit characters and ensure string format
        const cleanedValue = value.replace(/\D/g, '').trim(); // Explicitly trim spaces
        setOTP(cleanedValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            // Debug log before sending OTP
            console.log('Sending OTP for verification:', {
                email: email.trim(),
                otp: otp, // Log the exact OTP value
                purpose,
                timestamp: new Date().toISOString(),
                otpType: typeof otp,
                otpLength: otp.length
            });

            setIsSubmitting(true);
            try {
                // Verify OTP
                const response = await api.post('/otp/verify-otp', {
                    email: email.trim().toLowerCase(), // Ensure lowercase email
                    otp: otp.trim(), // Ensure no spaces
                    purpose
                });

                console.log('OTP verification response:', response.data);

                // Check if OTP verification was successful
                if (response.data.error) {
                    console.error('OTP verification failed:', response.data);
                    setError(response.data.error);
                    return;
                }

                // Get temporary token and user data
                const tempToken = localStorage.getItem('temp_token');
                const tempUser = localStorage.getItem('temp_user');
                
                if (!tempToken || !tempUser) {
                    console.error('No temporary data found after OTP verification');
                    setError('Failed to retrieve user data');
                    return;
                }

                // Parse and store user data
                const userData = JSON.parse(tempUser);
                
                // Move from temp to permanent storage
                localStorage.setItem('token', tempToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.removeItem('temp_token');
                localStorage.removeItem('temp_user');

                // Clear form and error
                setOTP('');
                setError('');

                // Redirect to home page
                navigate('/', { replace: true });

                // Call onVerified callback
                if (onVerified) {
                    onVerified(userData);
                }
            } catch (error) {
                console.error('OTP verification error:', error);
                setError(error.response?.data?.error || 'Failed to verify OTP');
            } finally {
                setIsSubmitting(false);
            }

            // Check if OTP verification was successful
            if (!response.data.success) {
                // Log error response from backend
                console.error('OTP verification failed:', {
                    error: response.data.error,
                    debug: response.data.debug
                });
                
                const errorMessage = response.data.error || 'Invalid OTP';
                // Add more specific error handling
                if (errorMessage.includes('expired')) {
                    setError('OTP has expired. Please request a new one.')
                    return;
                }
                throw new Error(errorMessage)
            }

            // Get temporary token and user data
            const tempToken = localStorage.getItem('temp_token')
            const tempUser = localStorage.getItem('temp_user')
            
            if (!tempToken || !tempUser) {
                console.error('No temporary data found after OTP verification')
                throw new Error('Failed to retrieve user data')
            }

            // Parse and store user data
            const userData = JSON.parse(tempUser)
            
            // Move from temp to permanent storage
            localStorage.setItem('token', tempToken)
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.removeItem('temp_token')
            localStorage.removeItem('temp_user')
            
            // Notify parent component that verification is complete
            onVerified()
        } catch (error) {
            console.error('OTP verification error:', error)
            setError(error.response?.data?.error || error.message || 'Failed to verify OTP')
        }
    }

    return (
        <Container className="login-container">
            <Row className="align-items-center">
                <Col md={6} className="text-center text-md-start">
                    <h1 className="login-title">Verify OTP</h1>
                    <p className="login-subtitle">Please enter the OTP sent to your email</p>
                    
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-group">
                            <label htmlFor="otp" className="form-label">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 mt-4">
                            Verify OTP
                        </button>
                    </form>
                </Col>
            </Row>
        </Container>
    )
}

export default OTPVerification
