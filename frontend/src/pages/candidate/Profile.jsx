import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Save, Plus, Trash2 } from 'lucide-react';

const NIVEAU_OPTIONS = ['Bac+2', 'Bac+3', 'Bac+5', 'PhD', 'Autre'];

const StarRating = ({ level, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          style={{ background: 'none', border: 'none', padding: '2px', cursor: onChange ? 'pointer' : 'default' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`star-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4C1E95" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={i <= (hovered || level) ? `url(#star-grad-${i})` : '#E5E7EB'}
              stroke={i <= (hovered || level) ? 'none' : '#D1D5DB'}
              strokeWidth="1"
            />
          </svg>
        </button>
      ))}
    </div>
  );
};

const CandidateProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfileData] = useState({
    nom: '', prenom: '', telephone: '', ville: '', dateNaissance: '',
    ecole: '', diplome: '', specialite: '', niveauEtude: '', bio: ''
  });
  const [skills, setSkills] = useState([]);
  const [globalCompetences, setGlobalCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newSkillId, setNewSkillId] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [resProf, resSkills, resDict] = await Promise.all([
          api.get('/candidate/profile'),
          api.get('/candidate/skills'),
          api.get('/competences'),
        ]);
        if (resProf.data) setProfileData(prev => ({ ...prev, ...resProf.data }));
        // Backend returns skills with competence_id and competenceNom
        if (resSkills.data) setSkills(resSkills.data.map(s => ({
          competence_id: s.competence_id,
          niveau: s.niveau,
          nom: s.competenceNom || s.nom,
        })));
        if (resDict.data) setGlobalCompetences(resDict.data);
      } catch (err) {
        console.error('Error fetching profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = e => setProfileData({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(''); setError('');
    try {
      await api.put('/candidate/profile', profile);
      await api.post('/candidate/skills', {
        skills: skills.map(s => ({ competence_id: s.competence_id, niveau: s.niveau }))
      });
      setUser({ ...user, nom: profile.nom, prenom: profile.prenom });
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillId) return;
    const comp = globalCompetences.find(c => c.id.toString() === newSkillId);
    if (!comp) return;
    if (skills.find(s => s.competence_id.toString() === newSkillId)) return;
    setSkills([...skills, { competence_id: parseInt(newSkillId), niveau: newSkillLevel, nom: comp.nom }]);
    setNewSkillId('');
    setNewSkillLevel(3);
  };

  const handleUpdateLevel = (competence_id, niveau) => {
    setSkills(skills.map(s => s.competence_id === competence_id ? { ...s, niveau } : s));
  };

  const handleRemoveSkill = competence_id => setSkills(skills.filter(s => s.competence_id !== competence_id));

  const availableCompetences = globalCompetences.filter(c => !skills.find(s => s.competence_id === c.id));

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
      <p>Chargement du profil...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Mon Profil</h1>
          <p style={{ color: 'var(--texte-moyen)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Gérez vos informations pour améliorer votre matching</p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem' }}
          disabled={saving}
        >
          {saving ? <>Sauvegarde...</> : <><Save size={16} /> Sauvegarder</>}
        </button>
      </div>

      {success && <div className="alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}
      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* === Column 1: Personal Info + Education === */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Personal Info Card */}
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid', borderImage: 'linear-gradient(90deg, #4C1E95, #2563EB) 1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                👤 Informations Personnelles
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label">Prénom</label>
                    <input type="text" name="prenom" className="input-field-no-icon" value={profile.prenom || ''} onChange={handleChange} placeholder="Prénom" />
                  </div>
                  <div>
                    <label className="label">Nom</label>
                    <input type="text" name="nom" className="input-field-no-icon" value={profile.nom || ''} onChange={handleChange} placeholder="Nom" />
                  </div>
                </div>
                <div>
                  <label className="label">Ville</label>
                  <input type="text" name="ville" className="input-field-no-icon" value={profile.ville || ''} onChange={handleChange} placeholder="Ex: Paris, Lyon..." />
                </div>
                <div>
                  <label className="label">Bio / Présentation</label>
                  <textarea name="bio" className="input-field-no-icon" rows="4" value={profile.bio || ''} onChange={handleChange} placeholder="Parlez-nous de vous, vos projets, vos passions téchniques..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="card">
              <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid', borderImage: 'linear-gradient(90deg, #2563EB, #7C3AED) 1' }}>
                🎓 Formation & Éducation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="label">École / Université</label>
                  <input type="text" name="ecole" className="input-field-no-icon" value={profile.ecole || ''} onChange={handleChange} placeholder="Ex: ENSIAS, Université Paris-Saclay..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label className="label">Diplôme</label>
                    <input type="text" name="diplome" className="input-field-no-icon" value={profile.diplome || ''} onChange={handleChange} placeholder="Ex: Master, Licence..." />
                  </div>
                  <div>
                    <label className="label">Spécialité</label>
                    <input type="text" name="specialite" className="input-field-no-icon" value={profile.specialite || ''} onChange={handleChange} placeholder="Ex: Data Science..." />
                  </div>
                </div>
                <div>
                  <label className="label">Niveau d'étude</label>
                  <select name="niveauEtude" className="input-field-no-icon" value={profile.niveauEtude || ''} onChange={handleChange}>
                    <option value="">Sélectionnez...</option>
                    {NIVEAU_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* === Column 2: Skills === */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid', borderImage: 'linear-gradient(90deg, #7C3AED, #4C1E95) 1' }}>
              ⚡ Compétences Techniques
              <span className="badge badge-primary" style={{ marginLeft: '0.75rem', fontSize: '0.7rem' }}>{skills.length} compétence{skills.length !== 1 ? 's' : ''}</span>
            </h2>

            {/* Add skill form */}
            <div style={{ background: 'var(--fond-page)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(76,30,149,0.08)' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--texte-moyen)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ajouter une compétence</p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: '160px' }}>
                  <select className="input-field-no-icon" value={newSkillId} onChange={e => setNewSkillId(e.target.value)}>
                    <option value="">Choisir une compétence...</option>
                    {availableCompetences.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '110px' }}>
                  <select className="input-field-no-icon" value={newSkillLevel} onChange={e => setNewSkillLevel(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>Niveau {n}</option>)}
                  </select>
                </div>
                <button type="button" onClick={handleAddSkill} className="btn-primary" style={{ height: '42px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                  <Plus size={16} /> Ajouter
                </button>
              </div>
            </div>

            {/* Skills list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '440px', overflowY: 'auto' }}>
              {skills.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--texte-moyen)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</p>
                  <p style={{ fontSize: '0.875rem' }}>Aucune compétence ajoutée.<br />Commencez par en ajouter une ci-dessus.</p>
                </div>
              ) : skills.map(skill => (
                <div key={skill.competence_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', border: '1.5px solid rgba(76,30,149,0.08)', borderRadius: 'var(--radius-md)', background: 'white', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(76,30,149,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(76,30,149,0.08)'}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.35rem', color: 'var(--texte-fonce)' }}>{skill.nom}</p>
                    <StarRating level={skill.niveau} onChange={niveau => handleUpdateLevel(skill.competence_id, niveau)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Niv. {skill.niveau}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.competence_id)}
                      style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', border: '1px solid #DC2626', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={14} color="#DC2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CandidateProfile;
