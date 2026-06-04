import mockData from '../mocks/projects.json';

// Quand l'API sera prête, remplacer les fonctions mock par des appels axios :
// import api from './api';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const projectService = {
  async getAll({ axe } = {}) {
    await delay();
    let data = [...mockData];
    if (axe && axe !== 'tous') data = data.filter(p => p.axe_slug === axe);
    return data;
  },

  async getById(id) {
    await delay();
    const project = mockData.find(p => p.id === Number(id));
    if (!project) throw new Error('Projet introuvable');
    return project;
  },

  async getRelated(id, limit = 3) {
    await delay(150);
    return mockData.filter(p => p.id !== Number(id)).slice(0, limit);
  },
};
