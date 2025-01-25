import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuth';
import { LoaderCircle } from 'lucide-react';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import { useThemeStore } from './store/useTheme';
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoaderCircle size={70} className='animate-spin' />
      </div>
    )
  }


  return (
    <>
    <Analytics/>
      <div data-theme={theme} className='min-h-screen'>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

          <Route path='/verifyemail' element={<VerifyEmail />} />
          <Route path='/forgot' element={<ForgotPassword />} />
          <Route path='/changepassword' element={<ChangePassword />} />

        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App