import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import AddCourse from './pages/AddCourse';
import CoursesPage from './pages/CoursesPage';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Nested routes will render inside Outlet */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/" element={<HomePage />} />
            <Route path='/add-course' element={<AddCourse />} />
            <Route path='/courses' element={<CoursesPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
