import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Projects from './pages/Projects';
import CMS from './pages/CMS';
import Recruitment from './pages/Recruitment';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="projects" element={<Projects />} />
          <Route path="cms" element={<CMS />} />
          <Route path="recruitment" element={<Recruitment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
