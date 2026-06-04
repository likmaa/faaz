import api from './api';
import mockData from '../mocks/jobs.json';

export const recruitmentService = {
  async getJobs() {
    try {
      const res = await api.get('/recruitment/');
      if (res.data && res.data.length > 0) {
        return res.data.filter(r => r.offer_type === 'emploi' && r.status === 'ouvert');
      }
    } catch (err) {
      console.warn("Backend API recruitment not available, using mock jobs.", err);
    }
    return mockData.emploi;
  },

  async getVolunteering() {
    try {
      const res = await api.get('/recruitment/');
      if (res.data && res.data.length > 0) {
        return res.data.filter(r => r.offer_type === 'bénévolat' && r.status === 'ouvert');
      }
    } catch (err) {
      console.warn("Backend API recruitment not available, using mock volunteering.", err);
    }
    return mockData.benevolat;
  },

  async getInternships() {
    try {
      const res = await api.get('/recruitment/');
      if (res.data && res.data.length > 0) {
        return res.data.filter(r => r.offer_type === 'stage' && r.status === 'ouvert');
      }
    } catch (err) {
      console.warn("Backend API recruitment not available, using mock internships.", err);
    }
    return mockData.stage;
  },

  async getById(id) {
    try {
      const res = await api.get(`/recruitment/${id}/`);
      return res.data;
    } catch (err) {
      console.warn(`Backend API recruitment offer not found for id ${id}, using mock data.`, err);
    }

    const all = [...mockData.emploi, ...mockData.benevolat, ...mockData.stage];
    const item = all.find(x => x.id === Number(id));
    if (!item) throw new Error('Offre introuvable');
    return item;
  },
};
