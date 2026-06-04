import mockData from '../mocks/jobs.json';

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const recruitmentService = {
  async getJobs()        { await delay(); return mockData.emploi; },
  async getVolunteering(){ await delay(); return mockData.benevolat; },
  async getInternships() { await delay(); return mockData.stage; },

  async getById(id) {
    await delay();
    const all = [...mockData.emploi, ...mockData.benevolat, ...mockData.stage];
    const item = all.find(x => x.id === Number(id));
    if (!item) throw new Error('Offre introuvable');
    return item;
  },
};
