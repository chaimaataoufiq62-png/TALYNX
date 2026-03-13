import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Save, Globe, Phone, MapPin, Building } from 'lucide-react';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({ nom: '', secteur: '', description: '', ville: '', telephone: '', site_web: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/company/profile')
      .then(res => { if (res.data) setProfile(prev => ({ ...prev, ...res.data })); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSuccess(''); setError('');
    try {
      await api.put('/company/profile', profile);
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => setSuccess(''), 3500);
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );

  const SECTEURS = ['Technologies', 'Finance', 'Santé', 'E-commerce', 'Industrie', 'Conseil', 'Éducation', 'Autre'];

  return (
    <div className="container page-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Profil Entreprise</h1>
          <p style={{ color: 'var(--texte-moyen)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Informations visibles par les candidats</p>
        </div>
        <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={saving}>
          {saving ? 'Sauvegarde...' : <><Save size={16} /> Sauvegarder</>}
        </button>
      </div>

      {success && <div className="alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}
      {error && <div className="alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {/* Identity */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid', borderImage: 'linear-gradient(90deg, #4C1E95, #2563EB) 1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={16} /> Identité
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Nom de l'entreprise *</label>
                <input type="text" name="nom" className="input-field-no-icon" value={profile.nom || ''} onChange={handleChange} required placeholder="Ex: TechCorp SAS" />
              </div>
              <div>
                <label className="label">Secteur d'activité</label>
                <select name="secteur" className="input-field-no-icon" value={profile.secteur || ''} onChange={handleChange}>
                  <option value="">Sélectionnez...</option>
                  {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description / Présentation</label>
                <textarea name="description" className="input-field-no-icon" rows="5" value={profile.description || ''} onChange={handleChange} placeholder="Présentez votre entreprise, votre culture, vos projets..." style={{ resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card">
            <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid', borderImage: 'linear-gradient(90deg, #2563EB, #7C3AED) 1' }}>
              📍 Coordonnées
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} /> Ville</label>
                <input type="text" name="ville" className="input-field-no-icon" value={profile.ville || ''} onChange={handleChange} placeholder="Ex: Paris, Casablanca..." />
              </div>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={13} /> Téléphone</label>
                <input type="tel" name="telephone" className="input-field-no-icon" value={profile.telephone || ''} onChange={handleChange} placeholder="+33 1 23 45 67 89" />
              </div>
              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe size={13} /> Site Web</label>
                <input type="url" name="site_web" className="input-field-no-icon" value={profile.site_web || ''} onChange={handleChange} placeholder="https://www.votresite.com" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CompanyProfile;
