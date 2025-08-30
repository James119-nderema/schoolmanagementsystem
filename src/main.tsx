import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingLayout from './layout/LandingLayout'
import MainLayout from './layout/MainLayout'
import StaffMainLayout from './layout/StaffMainLayout'
import SchoolRegistration from './components/SchoolRegistration'
import SchoolLogin from './components/SchoolLogin'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import StaffRegistration from './components/StaffRegistration'
import StaffLogin from './components/StaffLogin'
import StaffForgotPassword from './components/StaffForgotPassword'
import StaffResetPassword from './components/StaffResetPassword'
import StaffDashboard from './components/StaffDashboard'
import StaffStudents from './components/staff/StaffStudents'
import StaffClasses from './components/staff/StaffClasses'
import StaffSubjects from './components/staff/StaffSubjects'
import StaffResults from './components/staff/StaffResults'
import StaffProfile from './components/staff/StaffProfile'
import ParentRegistration from './components/parents/ParentRegistration'
import ParentLogin from './components/parents/ParentLogin'
import ParentForgotPassword from './components/parents/ParentForgotPassword'
import ParentDashboard from './components/parents/ParentDashboard'
import ParentProtectedRoute from './components/ParentProtectedRoute'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Students from './pages/Students'
import Subjects from './pages/Subjects'
import Results from './pages/Results'
import Classes from './pages/Classes'
import Staff from './pages/Staff'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <SchoolRegistration /> },
      { path: 'login', element: <SchoolLogin /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'parent-register', element: <ParentRegistration /> },
      { path: 'parent-login', element: <ParentLogin /> },
      { path: 'parent-forgot-password', element: <ParentForgotPassword /> },
      { 
        path: 'parent-dashboard', 
        element: (
          <ParentProtectedRoute>
            <ParentDashboard />
          </ParentProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: '/staff',
    children: [
      { path: 'register', element: <StaffRegistration /> },
      { path: 'login', element: <StaffLogin /> },
      { path: 'forgot-password', element: <StaffForgotPassword /> },
      { path: 'reset-password', element: <StaffResetPassword /> },
      {
        path: '',
        element: <StaffMainLayout />,
        children: [
          { path: 'dashboard', element: <StaffDashboard /> },
          { path: 'students', element: <StaffStudents /> },
          { path: 'classes', element: <StaffClasses /> },
          { path: 'subjects', element: <StaffSubjects /> },
          { path: 'results', element: <StaffResults /> },
          { path: 'profile', element: <StaffProfile /> },
        ],
      },
    ],
  },
  {
    path: '/parent',
    children: [
      { path: 'register', element: <ParentRegistration /> },
      { path: 'login', element: <ParentLogin /> },
      { 
        path: 'dashboard', 
        element: (
          <ParentProtectedRoute>
            <ParentDashboard />
          </ParentProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: '/school',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'students', element: <Students /> },
      { path: 'subjects', element: <Subjects /> },
      { path: 'results', element: <Results /> },
      { path: 'classes', element: <Classes /> },
      { path: 'staff', element: <Staff /> },
      { path: '*', element: <div className="p-6">Not Found</div> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)