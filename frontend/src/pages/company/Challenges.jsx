import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Users, Calendar, ChevronRight, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

const CompanyChallenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    titre: '', description: '', niveau: 'Intermédiaire',
    dateDebut: new Date().toISOString().split('T')[0], dateFin: ''
  });

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await api.get('/company/challenges');
      setChallenges(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChallenges(); }, []);

  const handleChange = e => setNewChallenge({ ...newChallenge, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/company/challenges', newChallenge);
      setShowForm(false);
      setNewChallenge({ titre: '', description: '', niveau: 'Intermédiaire', dateDebut: new Date().toISOString().split('T')[0], dateFin: '' });
      fetchChallenges();
    } catch {
      alert('Erreur lors de la création du défi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce défi ?')) return;
    try {
      await api.delete(`/company/challenges/${id}`);
      setChallenges(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const NIVEAU_COLORS = { Débutant: '#16A34A', Intermédiaire: '#2563EB', Avancé: '#D97706', Expert: '#DC2626' };

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestion des Défis</h1>
          <p style={{ color: 'var(--texte-moyen)', marginTop: '0.25rem', fontSize: '0.9rem' }}>{challenges.length} défi{challenges.length !== 1 ? 's' : ''} publié{challenges.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Annuler' : 'Créer un défi'}
        </button>
      </div>

      {/* Creation Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem', border: '2px solid rgba(76,30,149,0.2)', animation: 'slideDown 0.3s ease' }}>
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gradient-btn)' }} />
            Nouveau Défi Technique
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Titre du défi *</label>
              <input type="text" name="titre" className="input-field-no-icon" value={newChallenge.titre} onChange={handleChange} required placeholder="Ex: Développer un API REST en Node.js" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label">Niveau attendu</label>
                <select name="niveau" className="input-field-no-icon" value={newChallenge.niveau} onChange={handleChange}>
                  {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Date de début *</label>
                <input type="date" name="dateDebut" className="input-field-no-icon" value={newChallenge.dateDebut} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Date de clôture *</label>
                <input type="date" name="dateFin" className="input-field-no-icon" value={newChallenge.dateFin} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label">Description complète & directives *</label>
              <textarea name="description" className="input-field-no-icon" rows="5" value={newChallenge.description} onChange={handleChange} required placeholder="Décrivez clairement le challenge, les livrables attendus, les contraintes techniques..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {submitting ? 'Publication...' : <><Plus size={16} /> Publier le défi</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challenges list */}
      {challenges.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed #E5E7EB', borderRadius: 'var(--radius-xl)', background: 'white' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ marginBottom: '0.75rem' }}>Aucun défi publié</h3>
          <p style={{ color: 'var(--texte-moyen)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Créez votre premier défi technique pour commencer à recevoir des candidatures qualifiées.
          </p>
          <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Créer mon premier défi
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {challenges.map(c => {
            const niveauColor = NIVEAU_COLORS[c.niveau] || '#4C1E95';
            const isActive = new Date(c.dateFin) >= new Date();
            return (
              <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>{c.titre}</h3>
                      <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, background: `${niveauColor}18`, color: niveauColor }}>{c.niveau}</span>
                      {isActive
                        ? <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Actif</span>
                        : <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>Clôturé</span>
                      }
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--texte-moyen)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={13} /> {new Date(c.dateDebut).toLocaleDateString('fr-FR')} → {new Date(c.dateFin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link to={`/company/matching?challenge=${c.id}`}>
                      <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                        <Users size={14} /> Candidats
                      </button>
                    </Link>
                    <Link to={`/company/submissions?challenge=${c.id}`}>
                      <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}>
                        <Eye size={14} /> Réponses
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn-danger"
                      style={{ padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-danger)', background: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {c.description && (
                  <div style={{ padding: '0 1.5rem 1.25rem', color: 'var(--texte-moyen)', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CompanyChallenges;
