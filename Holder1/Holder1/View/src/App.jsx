import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Footer from './Components/Footer';
import OTPVerification from './Components/OTPVerification';
import ShippingServices from './Components/Navbar_Dropdowns/ShippingServices';
import Fullfilments_Services from './Components/Navbar_Dropdowns/Fullfilments_Services';
import Sameday_Delivery from './Components/Navbar_Dropdowns/Sameday_Delivery';
import Heavies_And_Bulkies from './Components/Navbar_Dropdowns/Heavies_And_Bulkies';
import AboutUs from './Components/AboutUs';
import Career from './Components/Navbar_Dropdowns/Career';
import ContactUs from './Components/Navbar_Dropdowns/Contact_Us';
import News from './Components/Navbar_Dropdowns/News';
import Blogs from './Components/Navbar_Dropdowns/Blogs';
import OrderLists from './Components/OrderLists';
import PageTransition from './Components/PageTransition';
import './App.css';

function App() {
  const [otpVerification, setOtpVerification] = useState(null)
  const navigate = useNavigate()

  // Get authentication state
  const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return !!token && !!user
  }

  // Handle OTP verification completion
  const handleOTPVerificationComplete = () => {
    setOtpVerification(null)
    navigate('/home', { replace: true })
  }

  const handleOTPVerification = (email, purpose) => {
    setOtpVerification({ email, purpose })
  }

  if (otpVerification) {
    return (
      <div className="app-container">
        <Navbar onOTPVerification={handleOTPVerification} />
        <OTPVerification 
          email={otpVerification.email} 
          purpose={otpVerification.purpose} 
          onVerified={handleOTPVerificationComplete} 
        />
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    )
  }

  return (
    <div className="app-container">
      <Navbar onOTPVerification={handleOTPVerification} />
      <Routes>
        <Route path="/login" element={
          <PageTransition>
            <Login onOTPVerification={handleOTPVerification} />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Signup onOTPVerification={handleOTPVerification} />
          </PageTransition>
        } />
        <Route path="/" element={
          <PageTransition>
            {isAuthenticated() ? <HomePage /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/home" element={
          <PageTransition>
            {isAuthenticated() ? <HomePage /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/shippingservices" element={
          <PageTransition>
            {isAuthenticated() ? <ShippingServices /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/fullfilments" element={
          <PageTransition>
            {isAuthenticated() ? <Fullfilments_Services /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/samedaydelivery" element={
          <PageTransition>
            {isAuthenticated() ? <Sameday_Delivery /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/heaviesandbulkies" element={
          <PageTransition>
            {isAuthenticated() ? <Heavies_And_Bulkies /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/aboutus" element={
          <PageTransition>
            {isAuthenticated() ? <AboutUs /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/career" element={
          <PageTransition>
            {isAuthenticated() ? <Career /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/contactus" element={
          <PageTransition>
            {isAuthenticated() ? <ContactUs /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/news" element={
          <PageTransition>
            {isAuthenticated() ? <News /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/blogs" element={
          <PageTransition>
            {isAuthenticated() ? <Blogs /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="/orderlists" element={
          <PageTransition>
            {isAuthenticated() ? <OrderLists /> : <Navigate to="/login" replace />}
          </PageTransition>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App
