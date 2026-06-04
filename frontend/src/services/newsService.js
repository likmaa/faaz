import mockData from '../mocks/news.json';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const newsService = {
  async getAll({ categorie } = {}) {
    await delay();
    let data = [...mockData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (categorie && categorie !== 'toutes') data = data.filter(n => n.categorie === categorie);
    return data;
  },

  async getById(id) {
    await delay();
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
