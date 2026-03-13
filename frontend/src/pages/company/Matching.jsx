import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, GraduationCap, MapPin, Trophy } from 'lucide-react';

const ScoreBar = ({ score }) => {
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#D97706' : '#2563EB';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--texte-moyen)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score de compatibilité</span>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color }}>{Math.round(score)}%</span>
      </div>
      <div className="score-gauge-bar">
        <div className="score-gauge-fill" style={{ width: `${Math.min(score, 100)}%`, background: `linear-gradient(90deg, #4C1E95, ${color})` }} />
      </div>
    </div>
  );
};

const CompanyMatching = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    api.get('/company/challenges')
      .then(res => {
        setChallenges(res.data || []);
        // Check URL param
        const params = new URLSearchParams(window.location.search);
        const challengeParam = params.get('challenge');
        if (challengeParam) setSelectedChallengeId(challengeParam);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingChallenges(false));
  }, []);

  useEffect(() => {
    if (!selectedChallengeId) { setCandidates([]); return; }
    setLoadingCandidates(true);
    api.get(`/company/challenges/${selectedChallengeId}/matches`)
      .then(res => {
        const sorted = (res.data || []).sort((a, b) => b.score - a.score);
        setCandidates(sorted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingCandidates(false));
  }, [selectedChallengeId]);

  const MEDAL_COLORS = ['#F59E0B', '#9CA3AF', '#B45309'];

  return (
    <div className="container page-wrapper">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Candidats Matchés</h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem', fontSize: '0.9rem' }}>Classement de compatibilité des candidats pour chaque défi</p>
      </div>

      {/* Challenge Selector */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Users size={20} color="var(--btn-primaire)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label className="label" style={{ marginBottom: '0.4rem' }}>Sélectionner un défi</label>
          <select
            className="input-field-no-icon"
            value={selectedChallengeId}
            onChange={e => setSelectedChallengeId(e.target.value)}
            disabled={loadingChallenges}
          >
            <option value="">--- Choisissez un défi ---</option>
            {challenges.map(c => <option key={c.id} value={c.id}>{c.titre}</option>)}
          </select>
        </div>
        {selectedChallengeId && (
          <span className="badge badge-primary">{candidates.length} candidat{candidates.length !== 1 ? 's' : ''} matché{candidates.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Results */}
      {!selectedChallengeId ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '2px dashed #E5E7EB' }}>
          <Users size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Sélectionnez un défi</h3>
          <p style={{ color: 'var(--texte-moyen)', fontSize: '0.9rem' }}>Choisissez un challenge ci-dessus pour voir les candidats correspondants.</p>
        </div>
      ) : loadingCandidates ? (
        <div className="page-loading">
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
          <p style={{ color: 'var(--texte-moyen)' }}>Chargement des candidats...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: 'var(--radius-xl)', border: '1px solid #E5E7EB' }}>
          <Trophy size={48} color="#E5E7EB" style={{ marginBottom: '1rem' }} />
          <h3>Aucun candidat éligible</h3>
          <p style={{ color: 'var(--texte-moyen)', fontSize: '0.9rem' }}>Aucun profil ne correspond encore aux critères de ce défi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {candidates.map((candidate, idx) => (
            <div key={candidate.id_candidat || idx} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap', padding: '1.5rem' }}>
              {/* Rank + Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: idx < 3 ? MEDAL_COLORS[idx] : '#E5E7EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'white',
                  fontSize: '0.875rem', boxShadow: idx < 3 ? `0 4px 12px ${MEDAL_COLORS[idx]}60` : 'none'
                }}>
                  #{idx + 1}
                </div>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: 'var(--gradient-btn)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '1.1rem',
                }}>
                  {(candidate.candidat?.prenom || candidate.prenom || '?').charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Candidate Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.35rem', fontFamily: 'var(--font-heading)' }}>
                  {candidate.candidat?.prenom || candidate.prenom || ''} {candidate.candidat?.nom || candidate.nom || 'Candidat'}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--texte-moyen)', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {(candidate.candidat?.ecole || candidate.ecole) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <GraduationCap size={13} /> {candidate.candidat?.ecole || candidate.ecole}
                    </span>
                  )}
                  {(candidate.candidat?.ville || candidate.ville) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={13} /> {candidate.candidat?.ville || candidate.ville}
                    </span>
                  )}
                  {(candidate.candidat?.niveau_etude || candidate.niveau_etude) && (
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                      {candidate.candidat?.niveau_etude || candidate.niveau_etude}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {(candidate.competences_communes || []).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(candidate.competences_communes).map((comp, i) => (
                      <span key={i} className="skill-badge">{comp.nom || comp}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Score */}
              <div style={{ width: '200px', flexShrink: 0 }}>
                <ScoreBar score={candidate.score} />
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CompanyMatching;
