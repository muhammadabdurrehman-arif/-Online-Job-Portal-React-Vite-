import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PrivateRoute } from './components/ui/PrivateRoute';
import { FloatingChatAssistant } from './components/ai/FloatingChatAssistant';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Seeker Pages
import Dashboard from './pages/seeker/Dashboard';
import Profile from './pages/seeker/Profile';
import ApplicationTracker from './pages/seeker/ApplicationTracker';
import ResumeBuilder from './pages/seeker/ResumeBuilder';

// Job Pages
import JobSearch from './pages/jobs/JobSearch';

// Email
import EmailSimulation from './pages/email/EmailSimulation';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Navigate to="/jobs" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/jobs" element={<JobSearch />} />
                    <Route path="/email-simulation" element={<EmailSimulation />} />

                    {/* Seeker Routes */}
                    <Route path="/seeker/dashboard" element={
                      <PrivateRoute allowedRoles={['seeker']}>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    <Route path="/seeker/profile" element={
                      <PrivateRoute allowedRoles={['seeker']}>
                        <Profile />
                      </PrivateRoute>
                    } />
                    <Route path="/seeker/applications" element={
                      <PrivateRoute allowedRoles={['seeker']}>
                        <ApplicationTracker />
                      </PrivateRoute>
                    } />
                    <Route path="/seeker/resume-builder" element={
                      <PrivateRoute allowedRoles={['seeker']}>
                        <ResumeBuilder />
                      </PrivateRoute>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/jobs" replace />} />
                  </Routes>
                </main>
                <Footer />
                <FloatingChatAssistant />
              </div>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;
