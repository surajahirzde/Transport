import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import RootLayout from './Helper/RootLayout'
import { RouterProvider } from 'react-router-dom'
import ErrorPage from './Helper/ErrorPage'
import Tracking from './Components/Additional/Tracking';


const Home = React.lazy(() => import('./Components/Home'))
const About = React.lazy(() => import('./Components/About'))
const Contact = React.lazy(() => import('./Components/Contact'))
const Services = React.lazy(() => import('./Components/Services'))
const Login = React.lazy(() => import('./Components/Login'))


const ShippingPage = React.lazy(() => import('./Components/Additional/ShippingPage'))  

const routes = createBrowserRouter(createRoutesFromElements(
  <Route errorElement={<ErrorPage />} path="/" element={<RootLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="/services" element={<Services />} />
    <Route path="/login" element={<Login />} />
    <Route path="/tracking" element={<Tracking />} />
    
    {/* ✅ Use ShippingPage as element */}
    <Route path="/shipping" element={<ShippingPage/>} />
  </Route>
))

const App = () => {
  return (
    <Suspense fallback={<div className="loading-screen">Loading...</div>}>
      <RouterProvider router={routes} />
    </Suspense>
  )
}

export default App