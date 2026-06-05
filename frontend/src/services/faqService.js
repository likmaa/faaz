import api from './api';
import mockData from '../mocks/faq.json';
import achievementsMock from '../mocks/achievements.json';

const matchAxeName = (axeName, searchAxe) => {
  if (!axeName || !searchAxe) return false;
  const name = axeName.toLowerCase();
  const search = searchAxe.toLowerCase();
  if (name.includes(search)) return true;
  if (search === 'ages' && (name.includes('âge') || name.includes('3'))) return true;
  return false;
};

export const faqService = {
  async getAll() {
    try {
      const res = await api.get('/faq/');
      if (res.data && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn("Backend API FAQ not available, using mock data.", err);
    }
    return mockData;
  },
  getCategories() {
    const data = mockData;
    return [...new Set(data.map(f => f.categorie || 'Général'))];
  },
};

export const achievementService = {
  async getAll({ axe } = {}) {
    try {
      const res = await api.get('/realisations/');
      if (res.data && res.data.length > 0) {
        let data = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        if (axe && axe !== 'tous') data = data.filter(a => String(a.axe) === String(axe) || matchAxeName(a.axe_name, axe));
        return data;
      }
    } catch (err) {
      console.warn("Backend API realisations not available, using mock data.", err);
    }

    let data = [...achievementsMock].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (axe && axe !== 'tous') data = data.filter(a => a.axe_slug === axe);
    return data;
  },
  async getById(id) {
    try {
      const res = await api.get(`/realisations/${id}/`);
      return res.data;
    } catch (err) {
      console.warn(`Backend API realisation detail not found for id ${id}, using mock data.`, err);
    }

    const item = achievementsMock.find(a => a.id === Number(id));
    if (!item) throw new Error('Réalisation introuvable');
    return item;
  },
};
