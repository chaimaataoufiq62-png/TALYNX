import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileCheck, Star, MessageSquare, Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  'qualified': { label: 'Qualifié ✓', color: '#16A34A', bg: 'rgba(22,163,74,0.1)', icon: <Trophy size={14} /> },
  'evaluated': { label: 'Évalué', color: '#2563EB', bg: 'rgba(37,99,235,0.1)', icon: <CheckCircle size={14} /> },
  'rejected': { label: 'Non qualifié', color: '#DC2626', bg: 'rgba(220,38,38,0.1)', icon: <XCircle size={14} /> },
  'pending': { label: 'En attente', color: '#D97706', bg: 'rgba(217,119,6,0.1)', icon: <Clock size={14} /> },
};

const getStatus = (sub) => {
  if (!sub.evaluation) return 'pending';
  if (sub.evaluation.est_qualifie) return 'qualified';
  if (sub.evaluation.note_finale !== undefined && sub.evaluation.note_finale !== null) {
    return sub.evaluation.est_qualifie === false ? 'rejected' : 'evaluated';
  }
  return 'evaluated';
};

const ScoreBar = ({ score }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--texte-moyen)', fontWeight: 600 }}>Score</span>
      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#DC2626' }}>{score}/100</span>
    </div>
    <div className="score-gauge-bar">
      <div className="score-gauge-fill" style={{ width: `${score}%`, background: score >= 70 ? 'linear-gradient(90deg, #16A34A, #059669)' : score >= 50 ? 'linear-gradient(90deg, #D97706, #F59E0B)' : 'linear-gradient(90deg, #DC2626, #EF4444)' }} />
    </div>
  </div>
);

const CandidateSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await api.get('/candidate/submissions');
        setSubmissions(res.data || []);
      } catch (err) {
        console.error('Error fetching submissions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
      <p>Chargement de vos candidatures...</p>
    </div>
  );

  const qualifiedCount = submissions.filter(s => s.evaluation?.est_qualifie).length;
  const evaluatedCount = submissions.filter(s => s.evaluation).length;

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          Mes <span style={{ background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Candidatures</span>
        </h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem' }}>Suivez vos soumissions et évaluations reçues</p>
      </div>

      {/* Mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total soumissions', value: submissions.length, color: '#4C1E95', bg: 'rgba(76,30,149,0.08)' },
          { label: 'Évaluées', value: evaluatedCount, color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
          { label: 'Qualifications', value: qualifiedCount, color: '#16A34A', bg: 'rgba(22,163,74,0.08)' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: `1.5px solid ${s.bg}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--texte-moyen)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Submissions list */}
      {submissions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FileCheck size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
          <h3>Aucune candidature</h3>
          <p style={{ color: 'var(--texte-moyen)', marginBottom: '1.5rem' }}>Vous n'avez pas encore soumis de réponse à un défi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map(sub => {
            const status = getStatus(sub);
            const cfg = STATUS_CONFIG[status];
            const isExpanded = expandedId === sub.id;
            return (
              <div key={sub.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Card top */}
                <div
                  style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '1rem', flexWrap: 'wrap' }}
                  onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                >
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem', fontFamily: 'var(--font-heading)' }}>{sub.challenge?.titre || 'Défi Technique'}</h3>
                    <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: 0 }}>
                      {sub.entreprise?.nom || 'Entreprise'} • Soumis le {new Date(sub.date_soumission).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '9999px', background: cfg.bg, color: cfg.color, fontSize: '0.78rem', fontWeight: 700 }}>
                      {cfg.icon} {cfg.label}
                    </span>
                    {sub.evaluation?.note_finale !== undefined && sub.evaluation?.note_finale !== null && (
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: sub.evaluation.note_finale >= 70 ? '#16A34A' : sub.evaluation.note_finale >= 50 ? '#D97706' : '#DC2626' }}>
                        {sub.evaluation.note_finale}/100
                      </span>
                    )}
                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#FAFAFA' }}>
                    {/* My response */}
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--texte-moyen)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Ma réponse</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--texte-fonce)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{sub.contenu_reponse}</p>
                      {sub.lien_github && (
                        <a href={sub.lien_github} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--bleu-accent)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                          🔗 Voir le GitHub
                        </a>
                      )}
                    </div>

                    {/* Evaluation */}
                    {sub.evaluation ? (
                      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '1.5px solid rgba(76,30,149,0.1)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--texte-moyen)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Star size={14} /> Évaluation de l'Entreprise
                        </p>
                        {sub.evaluation.note_finale !== undefined && sub.evaluation.note_finale !== null && (
                          <div style={{ marginBottom: '1rem' }}>
                            <ScoreBar score={sub.evaluation.note_finale} />
                          </div>
                        )}
                        {sub.evaluation.commentaire && (
                          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem', background: '#F9FAFB', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--btn-primaire)' }}>
                            <MessageSquare size={16} color="var(--btn-primaire)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '0.875rem', color: 'var(--texte-fonce)', lineHeight: 1.6, margin: 0 }}>{sub.evaluation.commentaire}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(217,119,6,0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(217,119,6,0.2)' }}>
                        <Clock size={18} color="#D97706" />
                        <p style={{ color: '#D97706', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>En attente d'évaluation par l'entreprise...</p>
                      </div>
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

export default CandidateSubmissions;
