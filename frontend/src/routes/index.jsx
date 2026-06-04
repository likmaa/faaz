import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Projects from '../pages/Projects.jsx';
import ProjectDetail from '../pages/ProjectDetail.jsx';
import News from '../pages/News.jsx';
import NewsDetail from '../pages/NewsDetail.jsx';
import Donate from '../pages/Donate.jsx';
import DonateProject from '../pages/DonateProject.jsx';
import About from '../pages/About.jsx';
import Achievements from '../pages/Achievements.jsx';
import FAQ from '../pages/FAQ.jsx';
import JobOffers from '../pages/JobOffers.jsx';
import JobDetail from '../pages/JobDetail.jsx';
import VolunteerOffers from '../pages/VolunteerOffers.jsx';
import VolunteerDetail from '../pages/VolunteerDetail.jsx';
import InternshipOffers from '../pages/InternshipOffers.jsx';
import InternshipDetail from '../pages/InternshipDetail.jsx';
import JoinUs from '../pages/JoinUs.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import NotFound from '../pages/NotFound.jsx';

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetail />} />
  <Route path="/donate" element={<Donate />} />
  <Route path="/donate/project/:id" element={<DonateProject />} />
  <Route path="/about" element={<About />} />
  <Route path="/achievements" element={<Achievements />} />
  <Route path="/faq" element={<FAQ />} />
  <Route path="/jobs" element={<JobOffers />} />
  <Route path="/jobs/:id" element={<JobDetail />} />
  <Route path="/volunteering" element={<VolunteerOffers />} />
  <Route path="/volunteering/:id" element={<VolunteerDetail />} />
  <Route path="/internships" element={<InternshipOffers />} />
  <Route path="/internships/:id" element={<InternshipDetail />} />
  <Route path="/join-us" element={<JoinUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
