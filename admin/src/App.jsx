import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ToastContainer from './components/ui/ToastContainer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Cotisations from './pages/Cotisations';
import Donations from './pages/Donations';
import Projects from './pages/Projects';
import Axes from './pages/Axes';
import Realisations from './pages/Realisations';
import Actualites from './pages/Actualites';
import Partenaires from './pages/Partenaires';
import FAQ from './pages/FAQ';
import Parametres from './pages/Parametres';
import CMS from './pages/CMS';
import Recruitment from './pages/Recruitment';

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          {/* Communauté */}
          <Route path="members" element={<Members />} />
          <Route path="cotisations" element={<Cotisations />} />

          {/* Collecte */}
          <Route path="donations" element={<Donations />} />
          <Route path="projects" element={<Projects />} />
          <Route path="axes" element={<Axes />} />

          {/* Contenu */}
          <Route path="realisations" element={<Realisations />} />
          <Route path="actualites" element={<Actualites />} />
          <Route path="partenaires" element={<Partenaires />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="cms" element={<CMS />} />

          {/* Recrutement */}
          <Route path="recruitment" element={<Recruitment />} />

          {/* Paramètres */}
          <Route path="parametres" element={<Parametres />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
