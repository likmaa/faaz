import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit, Loader2, Users } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

export default function Equipe() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);

  // Form states
  const [newTeam, setNewTeam] = useState({ first_name: '', last_name: '', role: '', order: 0 });
  const [teamFile, setTeamFile] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const res = await api.get('/team/');
      const list = Array.isArray(res.data) 
        ? res.data 
        : (Array.isArray(res.data?.results) 
            ? res.data.results 
            : (res.data?.data || []));
      setTeam(list);
    } catch (err) {
      console.error("Erreur lors de la récupération des membres de l'équipe.", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitTeam(e) {
    e.preventDefault();
    setAdding(true);
    const formData = new FormData();
    formData.append('first_name', newTeam.first_name);
    formData.append('last_name', newTeam.last_name);
    formData.append('role', newTeam.role);
    formData.append('order', newTeam.order);
    if (teamFile) {
      formData.append('photo', teamFile);
    }
    try {
      if (editingTeamId) {
        const res = await api.put(`/team/${editingTeamId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTeam(team.map(t => t.id === editingTeamId ? res.data : t));
        setEditingTeamId(null);
      } else {
        const res = await api.post('/team/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setTeam([...team, res.data]);
      }
      setNewTeam({ first_name: '', last_name: '', role: '', order: 0 });
      setTeamFile(null);
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setAdding(false);
    }
  }

  function handleEditClick(member) {
    setEditingTeamId(member.id);
    setNewTeam({
      first_name: member.first_name,
      last_name: member.last_name,
      role: member.role,
      order: member.order || 0
    });
    setTeamFile(null);
    // Scroll to top where the form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingTeamId(null);
    setNewTeam({ first_name: '', last_name: '', role: '', order: 0 });
    setTeamFile(null);
  }

  async function handleDeleteTeam(id) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce membre de l'équipe ?")) return;
    try {
      await api.delete(`/team/${id}/`);
      setTeam(team.filter(t => t.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Chargement de l'équipe…</span>
      </div>
    );
  }

  // Sort team members by order
  const sortedTeam = [...team].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-title">Membres de l'équipe</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez le trombinoscope officiel de la fondation FAAZ affiché sur le site public.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              Trombinoscope actuel
            </h2>

            {sortedTeam.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Aucun membre enregistré.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sortedTeam.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/80 hover:shadow-md transitionduration-300">
                    <div className="flex items-center gap-4 min-w-0">
                      {member.photo ? (
                        <img 
                          src={getImageUrl(member.photo)} 
                          alt={member.first_name} 
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200/50" 
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-extrabold rounded-xl text-sm border border-white/20">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{member.first_name} {member.last_name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{member.role}</p>
                        <span className="inline-block text-[9px] font-bold bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded-md mt-1">Ordre : {member.order}</span>
                      </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditClick(member)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition flex-shrink-0"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeam(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 font-title mb-6">
              {editingTeamId ? 'Modifier un membre' : 'Ajouter un membre'}
            </h2>

            <form onSubmit={handleSubmitTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Prénom</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Koffi"
                  value={newTeam.first_name}
                  onChange={(e) => setNewTeam({ ...newTeam, first_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Nom de famille</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Gnamey"
                  value={newTeam.last_name}
                  onChange={(e) => setNewTeam({ ...newTeam, last_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Rôle</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Président de la fondation"
                  value={newTeam.role}
                  onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newTeam.order}
                  onChange={(e) => setNewTeam({ ...newTeam, order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-550 uppercase mb-2">Photo de profil</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTeamFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {teamFile && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                      <img src={URL.createObjectURL(teamFile)} alt="Prévisualisation" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {editingTeamId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl text-sm transition"
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="submit"
                  disabled={adding}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm transition disabled:opacity-60 ${!editingTeamId ? 'w-full' : ''}`}
                >
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingTeamId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                  <span>{editingTeamId ? 'Enregistrer' : "Ajouter à l'équipe"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
