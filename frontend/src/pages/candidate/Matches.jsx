import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Briefcase, Building, Calendar, X, Upload, Github, Send, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const ScoreGauge = ({ score }) => {
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#2563EB';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--texte-moyen)', fontWeight: 600 }}>Compatibilité</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>
          {Math.round(score)}%
        </span>
      </div>
      <div className="score-gauge-bar">
        <div className="score-gauge-fill" style={{ width: `${Math.min(score, 100)}%`, background: `linear-gradient(90deg, #4C1E95, ${color})` }} />
      </div>
    </div>
  );
};

const SubmissionModal = ({ challenge, onClose, onSuccess }) => {
  const [form, setForm] = useState({ contenu_reponse: '', lien_github: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      const formData = new FormData();
      formData.append('contenu_reponse', form.contenu_reponse);
      if (form.lien_github) formData.append('lien_github', form.lien_github);
      if (file) formData.append('fichier', file);
      await api.post(`/candidate/challenges/${challenge.id_challenge}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission. Vérifiez votre éligibilité et les dates.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>
        {/* Modal Header */}
        <div style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, #4C1E95, #7C3AED)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: 'white', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Soumettre ma réponse</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>{challenge.challenge?.titre || 'Défi Technique'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && <div className="alert-error">{error}</div>}
          
          <div>
            <label className="label">Description de votre solution *</label>
            <textarea
              className="input-field-no-icon"
              rows="4"
              required
              value={form.contenu_reponse}
              onChange={e => setForm({ ...form, contenu_reponse: e.target.value })}
              placeholder="Expliquez votre approche, les technologies utilisées, les choix architecturaux..."
            />
          </div>

          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Github size={14} /> Lien GitHub (optionnel)
            </label>
            <input
              type="url"
              className="input-field-no-icon"
              value={form.lien_github}
              onChange={e => setForm({ ...form, lien_github: e.target.value })}
              placeholder="https://github.com/votre-repo"
            />
          </div>

          <div>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Upload size={14} /> Fichier joint (PDF, ZIP, DOCX — max 10 Mo)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${file ? 'var(--btn-primaire)' : '#D1D5DB'}`, borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(76,30,149,0.03)' : '#FAFAFA', transition: 'all 0.2s' }}
            >
              <Upload size={22} color={file ? 'var(--btn-primaire)' : '#9CA3AF'} style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.875rem', color: file ? 'var(--btn-primaire)' : 'var(--texte-moyen)', fontWeight: file ? 600 : 400 }}>
                {file ? file.name : 'Cliquez pour choisir un fichier'}
              </p>
              <input ref={fileRef} type="file" style={{ display: 'none' }} accept=".pdf,.zip,.docx" onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {submitting ? 'Envoi...' : <><Send size={16} /> Soumettre</>}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

const CandidateMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(30);
  const [search, setSearch] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [toast, setToast] = useState('');

  const fetchMatches = async () => {
    try {
      const res = await api.get('/candidate/matches');
      const valid = (res.data || []).filter(m => m.score >= 30).sort((a, b) => b.score - a.score);
      setMatches(valid);
    } catch (err) {
      console.error('Error fetching matches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  const filtered = matches.filter(m => {
    const scoreOk = Math.round(m.score) >= minScore;
    const searchOk = !search || (m.challenge?.titre || '').toLowerCase().includes(search.toLowerCase()) || (m.entreprise?.nom || '').toLowerCase().includes(search.toLowerCase());
    return scoreOk && searchOk;
  });

  const handleSuccess = () => {
    setToast('Soumission envoyée avec succès ! ✅');
    setTimeout(() => setToast(''), 4000);
    fetchMatches();
  };

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
      <p>Recherche de vos opportunités...</p>
    </div>
  );

  return (
    <div className="container page-wrapper">
      {toast && (
        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', zIndex: 3000, background: '#DCFCE7', border: '1px solid #16A34A', color: '#16A34A', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.5rem', fontWeight: 600, boxShadow: '0 8px 20px rgba(22,163,74,0.2)', animation: 'slideUp 0.3s ease' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          Mes <span style={{ background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Opportunités</span>
        </h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem' }}>Challenges éligibles avec un score de compatibilité ≥ 30%</p>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', padding: '1rem 1.25rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Rechercher par titre, entreprise..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SlidersHorizontal size={16} color="var(--texte-moyen)" />
          <label style={{ fontSize: '0.875rem', color: 'var(--texte-moyen)', whiteSpace: 'nowrap', fontWeight: 500 }}>Score min:</label>
          <select className="input-field-no-icon" value={minScore} onChange={e => setMinScore(Number(e.target.value))} style={{ width: 'auto' }}>
            <option value={30}>30%</option>
            <option value={50}>50%</option>
            <option value={70}>70%+</option>
          </select>
        </div>
        <span className="badge badge-primary">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Aucune opportunité trouvée</h3>
          <p style={{ color: 'var(--texte-moyen)', marginBottom: '1.5rem' }}>Enrichissez vos compétences pour débloquer de nouveaux matchings.</p>
          <Link to="/candidate/profile"><button className="btn-primary">Mettre à jour mon profil</button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(match => (
            <div key={match.id_challenge} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Color top bar */}
              <div style={{ height: '5px', background: 'linear-gradient(90deg, #4C1E95, #2563EB)' }} />
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Title + level badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontFamily: 'var(--font-heading)', lineHeight: 1.3, color: 'var(--texte-fonce)' }}>{match.challenge?.titre || 'Défi Technique'}</h3>
                  <span className="badge badge-blue" style={{ flexShrink: 0, fontSize: '0.7rem' }}>{match.challenge?.niveau || 'Intermédiaire'}</span>
                </div>

                {/* Score gauge */}
                <div style={{ marginBottom: '1rem' }}>
                  <ScoreGauge score={match.score} />
                </div>

                {/* Description */}
                <p style={{ color: 'var(--texte-moyen)', fontSize: '0.875rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {match.challenge?.description || 'Description non disponible'}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--texte-moyen)', flexWrap: 'wrap' }}>
                  {match.entreprise?.nom && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Building size={13} /> {match.entreprise.nom}</span>
                  )}
                  {match.challenge?.date_fin && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> Clôture: {new Date(match.challenge.date_fin).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>

                {/* Action */}
                <button
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  onClick={() => setSelectedMatch(match)}
                >
                  <Send size={15} /> Postuler à ce défi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <SubmissionModal match={selectedMatch} challenge={selectedMatch} onClose={() => setSelectedMatch(null)} onSuccess={handleSuccess} />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CandidateMatches;
