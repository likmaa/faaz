import mockData from '../mocks/faq.json';
import achievementsMock from '../mocks/achievements.json';

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));

export const faqService = {
  async getAll() {
    await delay();
    return mockData;
  },
  getCategories() {
    return [...new Set(mockData.map(f => f.categorie))];
  },
};

export const achievementService = {
  async getAll({ axe } = {}) {
    await delay();
    let data = [...achievementsMock].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (axe && axe !== 'tous') data = data.filter(a => a.axe_slug === axe);
    return data;
  },
  async getById(id) {
    await delay();
    const item = achievementsMock.find(a => a.id === Number(id));
    if (!item) throw new Error('Réalisation introuvable');
    return item;
  },
};
