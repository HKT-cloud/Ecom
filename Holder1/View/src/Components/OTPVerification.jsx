import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import api from '../config/axiosConfig'
import './styles/login-page.css'

const OTPVerification = ({ email, purpose, onVerified }) => {
    const [otp, setOTP] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            // Verify OTP
            const response = await api.post('/otp/verify-otp', {
                email: email.trim(),
                otp: otp.trim(),
                purpose
            })

            // Check if OTP verification was successful
            if (!response.data.success) {
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
