import api from './api';
import mockData from '../mocks/projects.json';

const matchAxeName = (axeName, searchAxe) => {
  if (!axeName || !searchAxe) return false;
  const name = axeName.toLowerCase();
  const search = searchAxe.toLowerCase();
  if (name.includes(search)) return true;
  if (search === 'ages' && (name.includes('âge') || name.includes('3'))) return true;
  return false;
};

export const projectService = {
  async getAll({ axe } = {}) {
    try {
      const res = await api.get('/projects/');
      if (res.data && res.data.length > 0) {
        let data = res.data;
        if (axe && axe !== 'tous') {
          data = data.filter(p => String(p.axe) === String(axe) || matchAxeName(p.axe_name, axe));
        }
        return data;
      }
    } catch (err) {
      console.warn("Backend API not available or empty, using mock data for projects.", err);
    }
    
    // Fallback to mock data
    let data = [...mockData];
    if (axe && axe !== 'tous') data = data.filter(p => p.axe_slug === axe);
    return data;
  },

  async getById(id) {
    try {
      const res = await api.get(`/projects/${id}/`);
      return res.data;
    } catch (err) {
      console.warn(`Backend API project detail not found for id ${id}, using mock data.`, err);
    }

    const project = mockData.find(p => p.id === Number(id));
    if (!project) throw new Error('Projet introuvable');
    return project;
  },

  async getRelated(id, limit = 3) {
    try {
      const res = await api.get('/projects/');
      if (res.data && res.data.length > 0) {
        return res.data.filter(p => p.id !== Number(id)).slice(0, limit);
      }
    } catch (err) {
      // ignore
    }
    return mockData.filter(p => p.id !== Number(id)).slice(0, limit);
  },
};
