import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Check, X, MessageSquare, Download, Star, ChevronDown, ChevronUp } from 'lucide-react';

const EvaluationForm = ({ submission, onEvaluated }) => {
  const [form, setForm] = useState({ note_finale: 70, commentaire: '', est_qualifie: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await api.post(`/company/submissions/${submission.id}/evaluate`, {
        note_finale: parseInt(form.note_finale),
        commentaire: form.commentaire,
        est_qualifie: form.est_qualifie,
      });
      onEvaluated();
    } catch {
      setError('Erreur lors de l\'évaluation.');
      setSaving(false);
    }
  };

  const noteColor = form.note_finale >= 70 ? '#16A34A' : form.note_finale >= 50 ? '#D97706' : '#DC2626';

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1.5px solid rgba(76,30,149,0.15)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h4 style={{ margin: 0, fontSize: '0.9rem', fontFamily: 'var(--font-heading)', color: 'var(--btn-primaire)' }}>📝 Évaluer cette soumission</h4>

      {error && <div className="alert-error">{error}</div>}

      {/* Note slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label className="label" style={{ margin: 0 }}>Note finale</label>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: noteColor }}>{form.note_finale}/100</span>
        </div>
        <input
          type="range" min="0" max="100" step="1"
          value={form.note_finale}
          onChange={e => setForm({ ...form, note_finale: e.target.value })}
          style={{ width: '100%', accentColor: 'var(--btn-primaire)', cursor: 'pointer' }}
        />
        <div style={{ height: '6px', borderRadius: '9999px', background: '#E5E7EB', marginTop: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${form.note_finale}%`, height: '100%', background: `linear-gradient(90deg, #4C1E95, ${noteColor})`, transition: 'all 0.2s' }} />
        </div>
      </div>

      {/* Commentaire */}
      <div>
        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MessageSquare size={13} /> Commentaire</label>
        <textarea
          className="input-field-no-icon"
          rows="3"
          value={form.commentaire}
          onChange={e => setForm({ ...form, commentaire: e.target.value })}
          placeholder="Feedback pour le candidat (points forts, axes d'amélioration...)"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Qualifié toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-md)', background: form.est_qualifie ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.04)', border: `1.5px solid ${form.est_qualifie ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.15)'}`, transition: 'all 0.2s' }}>
        <button
          type="button"
          onClick={() => setForm({ ...form, est_qualifie: !form.est_qualifie })}
          style={{
            width: '44px', height: '24px', borderRadius: '9999px',
            background: form.est_qualifie ? '#16A34A' : '#D1D5DB',
            border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0
          }}
        >
          <span style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: 'white', top: '3px', left: form.est_qualifie ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </button>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: form.est_qualifie ? '#16A34A' : 'var(--texte-fonce)' }}>
            {form.est_qualifie ? '✅ Qualifié(e)' : '❌ Non qualifié(e)'}
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--texte-moyen)' }}>Le candidat sera notifié du résultat.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saving ? 'Envoi...' : <><Star size={15} /> Valider l'évaluation</>}
        </button>
      </div>
    </form>
  );
};

const CompanySubmissions = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/company/challenges')
      .then(res => {
        setChallenges(res.data || []);
        const params = new URLSearchParams(window.location.search);
        const ch = params.get('challenge');
        if (ch) setSelectedChallengeId(ch);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingChallenges(false));
  }, []);

  useEffect(() => {
    if (!selectedChallengeId) { setSubmissions([]); return; }
    setLoadingSubmissions(true);
    api.get(`/company/challenges/${selectedChallengeId}/submissions`)
      .then(res => setSubmissions(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingSubmissions(false));
  }, [selectedChallengeId]);

  const handleEvaluated = () => {
    // Refresh submissions
    setLoadingSubmissions(true);
    api.get(`/company/challenges/${selectedChallengeId}/submissions`)
      .then(res => setSubmissions(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingSubmissions(false));
    setExpandedId(null);
  };

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>
          Évaluer les <span style={{ background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Réponses</span>
        </h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem', fontSize: '0.9rem' }}>Consultez et évaluez les soumissions reçues pour chaque défi</p>
      </div>

      {/* Challenge selector */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Star size={20} color="var(--btn-primaire)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label" style={{ marginBottom: '0.4rem' }}>Sélectionner un défi</label>
          <select className="input-field-no-icon" value={selectedChallengeId} onChange={e => setSelectedChallengeId(e.target.value)} disabled={loadingChallenges}>
            <option value="">--- Choisissez un défi ---</option>
            {challenges.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
          </select>
        </div>
        {selectedChallengeId && (
          <span className="badge badge-primary">{submissions.length} soumission{submissions.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Content */}
      {!selectedChallengeId ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '2px dashed #E5E7EB' }}>
          <Star size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
          <h3>Sélectionnez un défi</h3>
          <p style={{ color: 'var(--texte-moyen)', fontSize: '0.9rem' }}>Choisissez un challenge pour voir et évaluer les réponses reçues.</p>
        </div>
      ) : loadingSubmissions ? (
        <div className="page-loading">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: '3rem' }}>📭</p>
          <h3>Aucune soumission</h3>
          <p style={{ color: 'var(--texte-moyen)' }}>Aucun candidat n'a encore répondu à ce défi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map(sub => {
            const isEvaluated = !!sub.evaluation;
            const isExpanded = expandedId === sub.id;
            return (
              <div key={sub.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Header */}
                <div
                  style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap', justifyContent: 'space-between' }}
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                    {/* Avatar */}
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>
                      {(sub.candidat?.prenom || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-heading)' }}>
                        {sub.candidat?.prenom} {sub.candidat?.nom}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--texte-moyen)' }}>
                        Soumis le {new Date(sub.date_soumission).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    {isEvaluated ? (
                      <span className={`badge ${sub.evaluation.est_qualifie ? 'badge-success' : 'badge-danger'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {sub.evaluation.est_qualifie ? <Check size={12} /> : <X size={12} />}
                        {sub.evaluation.est_qualifie ? 'Qualifié' : 'Non qualifié'}
                      </span>
                    ) : (
                      <span className="badge badge-warning">À évaluer</span>
                    )}
                    {isEvaluated && sub.evaluation.note_finale !== undefined && (
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: sub.evaluation.note_finale >= 70 ? '#16A34A' : sub.evaluation.note_finale >= 50 ? '#D97706' : '#DC2626' }}>
                        {sub.evaluation.note_finale}/100
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={18} color="var(--texte-moyen)" /> : <ChevronDown size={18} color="var(--texte-moyen)" />}
                  </div>
                </div>

                {/* Expanded body */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '1.5rem', background: '#FAFAFA', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Response */}
                    <div>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--texte-moyen)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Réponse du candidat</p>
                      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid #E5E7EB', fontSize: '0.9rem', color: 'var(--texte-fonce)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {sub.contenu_reponse}
                      </div>
                    </div>

                    {/* Links */}
                    {(sub.lien_github || sub.fichier_path) && (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {sub.lien_github && (
                          <a href={sub.lien_github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#24292e', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                            GitHub → Voir le code
                          </a>
                        )}
                        {sub.fichier_path && (
                          <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/uploads/submissions/${sub.fichier_path}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(37,99,235,0.1)', color: 'var(--bleu-accent)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(37,99,235,0.2)' }}>
                            <Download size={14} /> Télécharger le fichier
                          </a>
                        )}
                      </div>
                    )}

                    {/* Evaluation */}
                    {isEvaluated ? (
                      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1px solid rgba(22,163,74,0.2)' }}>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--texte-moyen)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Évaluation soumise</p>
                        <p style={{ color: 'var(--texte-fonce)', fontSize: '0.9rem', lineHeight: 1.6 }}>{sub.evaluation.commentaire || 'Aucun commentaire.'}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)', marginTop: '0.75rem', fontStyle: 'italic' }}>Le candidat a été notifié.</p>
                      </div>
                    ) : (
                      <EvaluationForm submission={sub} onEvaluated={handleEvaluated} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CompanySubmissions;
