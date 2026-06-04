import api from './api';
import mockData from '../mocks/news.json';

export const newsService = {
  async getAll({ categorie } = {}) {
    try {
      const res = await api.get('/news/');
      if (res.data && res.data.length > 0) {
        let data = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (categorie && categorie !== 'toutes') data = data.filter(n => n.categorie === categorie);
        return data;
      }
    } catch (err) {
      console.warn("Backend API news not available, using mock data.", err);
    }

    let data = [...mockData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (categorie && categorie !== 'toutes') data = data.filter(n => n.categorie === categorie);
    return data;
  },

  async getById(id) {
    try {
      const res = await api.get(`/news/${id}/`);
      return res.data;
    } catch (err) {
      console.warn(`Backend API news detail not found for id ${id}, using mock data.`, err);
    }

    const sorted = [...mockData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const idx = sorted.findIndex(n => n.id === Number(id));
    if (idx === -1) throw new Error('Actualité introuvable');
    return {
      ...sorted[idx],
      previous: sorted[idx + 1] || null,
      next: sorted[idx - 1] || null,
    };
  },

  getCategories() {
    const cats = [...new Set(mockData.map(n => n.categorie))];
    return ['toutes', ...cats];
  },
};
