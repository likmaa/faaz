import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Save, Plus, Trash2, Loader2, Image, Link, HelpCircle, Users } from 'lucide-react';

export default function CMS() {
  const [settings, setSettings] = useState({
    slogan: '',
    mission: '',
    vision: '',
    about_text: ''
  });
  const [team, setTeam] = useState([]);
  const [faq, setFaq] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // Modals / forms states
  const [newTeam, setNewTeam] = useState({ first_name: '', last_name: '', role: '', order: 0 });
  const [teamFile, setTeamFile] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', order: 0 });
  const [newPartner, setNewPartner] = useState({ name: '', link: '' });
  const [partnerFile, setPartnerFile] = useState(null);

  useEffect(() => {
    fetchCMSData();
  }, []);

  async function fetchCMSData() {
    setLoading(true);
    try {
      const [settingsRes, teamRes, faqRes, partnersRes] = await Promise.all([
        api.get('/cms/').catch(() => ({ data: [] })),
        api.get('/team/').catch(() => ({ data: [] })),
        api.get('/faq/').catch(() => ({ data: [] })),
        api.get('/partners/').catch(() => ({ data: [] }))
      ]);

      // Parse key-value settings
      const settingsMap = { slogan: '', mission: '', vision: '', about_text: '' };
      settingsRes.data.forEach(item => {
        if (item.key in settingsMap) {
          settingsMap[item.key] = item.value;
        }
      });

      setSettings(settingsMap);
      setTeam(teamRes.data);
      setFaq(faqRes.data);
      setPartners(partnersRes.data);
    } catch (err) {
      console.error("Erreur lors de la récupération du CMS.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      // Save each key one by one or create if they don't exist
      await Promise.all(
        Object.entries(settings).map(([key, value]) =>
          api.put(`/cms/${key}/`, { key, value }).catch(() =>
            api.post('/cms/', { key, value })
          )
        )
      );
      alert("Paramètres généraux enregistrés !");
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleAddTeam(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', newTeam.first_name);
    formData.append('last_name', newTeam.last_name);
    formData.append('role', newTeam.role);
    formData.append('order', newTeam.order);
    if (teamFile) {
      formData.append('photo', teamFile);
    }
    try {
      const res = await api.post('/team/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTeam([...team, res.data]);
      setNewTeam({ first_name: '', last_name: '', role: '', order: 0 });
      setTeamFile(null);
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  }

  async function handleDeleteTeam(id) {
    try {
      await api.delete(`/team/${id}/`);
      setTeam(team.filter(t => t.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  async function handleAddFaq(e) {
    e.preventDefault();
    try {
      const res = await api.post('/faq/', newFaq);
      setFaq([...faq, res.data]);
      setNewFaq({ question: '', answer: '', order: 0 });
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  }

  async function handleDeleteFaq(id) {
    try {
      await api.delete(`/faq/${id}/`);
      setFaq(faq.filter(f => f.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  async function handleAddPartner(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newPartner.name);
    formData.append('link', newPartner.link);
    if (partnerFile) {
      formData.append('logo', partnerFile);
    }
    try {
      const res = await api.post('/partners/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPartners([...partners, res.data]);
      setNewPartner({ name: '', link: '' });
      setPartnerFile(null);
    } catch (err) {
      alert("Erreur lors de l'ajout.");
    }
  }

  async function handleDeletePartner(id) {
    try {
      await api.delete(`/partners/${id}/`);
      setPartners(partners.filter(p => p.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement des modules CMS…</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Gestion CMS</h1>
        <p className="text-slate-500 text-sm mt-1">Configurez le contenu dynamique affiché sur le site public.</p>
      </div>

      {/* 1. General Settings Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          Textes généraux
        </h2>
        <form onSubmit={handleSaveSettings} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Slogan officiel</label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Mission</label>
              <textarea
                rows={3}
                value={settings.mission}
                onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vision</label>
              <textarea
                rows={3}
                value={settings.vision}
                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Présentation globale (À propos)</label>
            <textarea
              rows={5}
              value={settings.about_text}
              onChange={(e) => setSettings({ ...settings, about_text: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-sm shadow-md transition disabled:opacity-60"
          >
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* 2. Team list & add form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Membres de l'équipe
            </h2>

            {/* List */}
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {team.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      <img src={member.photo} alt={member.first_name} className="w-10 h-10 object-cover rounded-xl" />
                    ) : (
                      <div className="w-10 h-10 bg-primary-50 text-primary-600 flex items-center justify-center font-bold rounded-xl text-sm border border-primary-100">
                        {member.first_name[0]}{member.last_name[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-800">{member.first_name} {member.last_name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTeam(member.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddTeam} className="space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Prénom"
                value={newTeam.first_name}
                onChange={(e) => setNewTeam({ ...newTeam, first_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <input
                required
                type="text"
                placeholder="Nom"
                value={newTeam.last_name}
                onChange={(e) => setNewTeam({ ...newTeam, last_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                required
                type="text"
                placeholder="Rôle (Ex: Président)"
                value={newTeam.role}
                onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                className="col-span-2 w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <input
                type="number"
                placeholder="Ordre"
                value={newTeam.order}
                onChange={(e) => setNewTeam({ ...newTeam, order: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-center gap-3 justify-between">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setTeamFile(e.target.files[0])}
                className="text-[10px] text-slate-500 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </form>
        </div>

        {/* 3. Partners list & add form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
              <Link className="w-5 h-5 text-primary-600" />
              Partenaires
            </h2>

            {/* List */}
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {partners.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    {part.logo ? (
                      <img src={part.logo} alt={part.name} className="w-12 h-8 object-contain bg-white border border-slate-100 rounded-lg px-1" />
                    ) : (
                      <div className="w-12 h-8 bg-slate-100 flex items-center justify-center rounded-lg">
                        <Image className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-800">{part.name}</p>
                      <a href={part.link} target="_blank" rel="noreferrer" className="text-[10px] text-primary-600 hover:underline">{part.link || 'Aucun lien'}</a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePartner(part.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAddPartner} className="space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="text"
                placeholder="Nom du partenaire"
                value={newPartner.name}
                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              <input
                type="url"
                placeholder="Lien site web (Ex: https://...)"
                value={newPartner.link}
                onChange={(e) => setNewPartner({ ...newPartner, link: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-center gap-3 justify-between">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPartnerFile(e.target.files[0])}
                className="text-[10px] text-slate-500 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 4. FAQ list & add form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            Foire Aux Questions (FAQ)
          </h2>

          {/* List */}
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {faq.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-bold text-slate-800">Q : {item.question}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">R : {item.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAddFaq} className="space-y-4 border-t border-slate-100 pt-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              required
              type="text"
              placeholder="Question..."
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
              className="md:col-span-3 w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <input
              type="number"
              placeholder="Ordre"
              value={newFaq.order}
              onChange={(e) => setNewFaq({ ...newFaq, order: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-end gap-3 justify-between">
            <textarea
              required
              rows={2}
              placeholder="Réponse..."
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
