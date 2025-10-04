import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './HomePage'
import ShippingServices from './Navbar_Dropdowns/ShippingServices'
import Fullfilments_Services from './Navbar_Dropdowns/Fullfilments_Services'
import Sameday_Delivery from './Navbar_Dropdowns/Sameday_Delivery'
import Heavies_And_Bulkies from './Navbar_Dropdowns/Heavies_And_Bulkies'
import AboutUs from './AboutUs'
import Career from './Navbar_Dropdowns/Career'
import ContactUs from './Navbar_Dropdowns/Contact_Us'
import News from './Navbar_Dropdowns/News'
import Blogs from './Navbar_Dropdowns/Blogs'
import OrderLists from './OrderLists'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/home' element={<HomePage />} />
      <Route path='/shippingservices' element={<ShippingServices />} />
      <Route path='/fullfilments' element={<Fullfilments_Services />} />
      <Route path='/samedaydelivery' element={<Sameday_Delivery />} />
      <Route path='/heaviesandbulkies' element={<Heavies_And_Bulkies />} />
      <Route path='/aboutus' element={<AboutUs />} />
      <Route path='/career' element={<Career />} />
      <Route path='/contactus' element={<ContactUs />} />
      <Route path='/news' element={<News />} />
      <Route path='/blogs' element={<Blogs />} />
      <Route path='/orderlists' element={<OrderLists />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AllRoutes