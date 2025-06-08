import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './HomePage'; // Import HomePage from the same directory
import ShippingServices from './Navbar_Dropdowns/ShippingServices';
import Fullfilments_Services from './Navbar_Dropdowns/Fullfilments_Services';
import Sameday_Delivery from './Navbar_Dropdowns/Sameday_Delivery';
import Heavies_And_Bulkies from './Navbar_Dropdowns/Heavies_And_Bulkies';
import AboutUs from './Navbar_Dropdowns/About_Us';
import Career from './Navbar_Dropdowns/Career';
import ContactUs from './Navbar_Dropdowns/Contact_Us';
import News from './Navbar_Dropdowns/News';
import Blogs from './Navbar_Dropdowns/Blogs';
import VideoGallery from './Navbar_Dropdowns/Video_Gallery';

const AllRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/shippingservices' element={<ShippingServices/>} />
            <Route path='/fullfilments' element={<Fullfilments_Services/>} />
            <Route path='/samedaydelivery' element={<Sameday_Delivery/>} />
            <Route path='/heaviesandbulkies' element={<Heavies_And_Bulkies/>} />
            <Route path='/aboutus' element={<AboutUs/>} />
            <Route path='/career' element={<Career/>} />
            <Route path='/contactus' element={<ContactUs/>} />
            <Route path='/news' element={<News/>} />
            <Route path='/blogs' element={<Blogs/>} />
            <Route path='/videogallery' element={<VideoGallery/>} />
        </Routes>
    </div>
  )
}

export default AllRoutes