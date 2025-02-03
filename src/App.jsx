import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingError from './components/RoutingError'
import RootLayout from './RootLayout'
import Home from './components/home/Home'
import Login from './components/login/Login';
import Register from './components/register/Register';
import EmployerDashboard from './components/employerdashboard/EmployerDashboard';
import FreelancerDashboard from './components/freelancerdashboard/Freelancerdashboard';


import './App.css'
import EmployerProfile from './components/employerprofile/EmployerProfile';
import FreelancerProfile from './components/freelancerprofile/FreelancerProfile';

function App() {
  const browserRouter=createBrowserRouter([
    {
      path: "",
      element:<RootLayout />,
      errorElement: <RoutingError />,
      children:[
        {
          path:'',
          element:<Home />
        },
        {
          path:'/login',
          element:<Login />
        },
        {
          path:'/register',
          element:<Register />
        },
        {
          path:'/employerdashboard',
          element:<EmployerDashboard />
        },
        {
          path:'/freelancerdashboard',
          element:<FreelancerDashboard />
        },
        {
          path:'/employerprofile',
          element:<EmployerProfile />
        },
        {
          path:'/freelancerprofile',
          element:<FreelancerProfile />
        }
      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={browserRouter}/>
    </div>
  )
}

export default App
