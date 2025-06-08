import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar'
import AllRoutes from './Components/AllRoutes'

function App() {


  return (
    <>
     <Navbar></Navbar>
     <AllRoutes></AllRoutes>
    </>
  )
}

export default App
