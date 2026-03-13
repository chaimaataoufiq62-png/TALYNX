import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Target, FileCheck, Award, Zap, TrendingUp, ArrowRight, Briefcase } from 'lucide-react';

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: bgColor, opacity: 0.15 }} />
    <div style={{ padding: '0.875rem', background: bgColor, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {React.cloneElement(icon, { size: 26, color })}
    </div>
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--texte-moyen)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--texte-fonce)', lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_soumissions: 0, evaluees: 0, score_moyen: 0, qualifications: 0 });
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, matchesRes] = await Promise.all([
          api.get('/stats'),
          api.get('/candidate/matches'),
        ]);
        if (statsRes.data) setStats(statsRes.data);
        const validMatches = (matchesRes.data || []).filter(m => m.score >= 30).sort((a, b) => b.score - a.score).slice(0, 3);
        setMatches(validMatches);
      } catch (err) {
        console.error('Dashboard fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-loading">
      <div className="spinner" style={{ border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', width: '32px', height: '32px' }} />
      <p>Chargement du dashboard...</p>
    </div>
  );

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          Bonjour, <span style={{ background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.prenom || 'Candidat'}</span> ! 👋
        </h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem' }}>Voici un résumé de votre activité sur Talynx.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard icon={<FileCheck />} label="Soumissions" value={stats.total_soumissions || 0} color="#2563EB" bgColor="rgba(37,99,235,0.1)" />
        <StatCard icon={<Award />} label="Qualifications" value={stats.qualifications || 0} color="#7C3AED" bgColor="rgba(124,58,237,0.1)" />
        <StatCard icon={<Target />} label="Score Moyen" value={stats.score_moyen ? `${Math.round(stats.score_moyen)}%` : 'N/A'} color="#D97706" bgColor="rgba(217,119,6,0.1)" />
        <StatCard icon={<TrendingUp />} label="Évaluées" value={stats.evaluees || 0} color="#16A34A" bgColor="rgba(22,163,74,0.1)" />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Matches */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
              <Briefcase size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--btn-primaire)' }} />
              Challenges Matchés
            </h2>
            <Link to="/candidate/matches" style={{ fontSize: '0.8rem', color: 'var(--btn-primaire)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tous <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {matches.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--texte-moyen)' }}>
                <Briefcase size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem' }}>Mettez à jour votre profil pour voir vos matchs</p>
              </div>
            ) : matches.map(m => (
              <div key={m.id_challenge} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{m.challenge?.titre || 'Défi Technique'}</p>
                  <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>{m.entreprise?.nom || 'Entreprise'}</p>
                </div>
                <span className="badge badge-primary">{Math.round(m.score)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>
            <Zap size={18} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--bleu-accent)' }} />
            Actions Rapides
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/candidate/matches" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(76,30,149,0.1)', background: 'rgba(76,30,149,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--btn-primaire)'; e.currentTarget.style.background = 'rgba(76,30,149,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(76,30,149,0.1)'; e.currentTarget.style.background = 'rgba(76,30,149,0.02)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-btn)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--texte-fonce)' }}>Explorer les opportunités</p>
                  <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>Découvrez les challenges qui vous correspondent</p>
                </div>
                <ArrowRight size={16} color="var(--texte-moyen)" style={{ marginLeft: 'auto' }} />
              </div>
            </Link>
            <Link to="/candidate/profile" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(37,99,235,0.1)', background: 'rgba(37,99,235,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bleu-accent)'; e.currentTarget.style.background = 'rgba(37,99,235,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.1)'; e.currentTarget.style.background = 'rgba(37,99,235,0.02)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--texte-fonce)' }}>Mettre à jour mon profil</p>
                  <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>Ajouter des compétences pour booster vos matchs</p>
                </div>
                <ArrowRight size={16} color="var(--texte-moyen)" style={{ marginLeft: 'auto' }} />
              </div>
            </Link>
            <Link to="/candidate/submissions" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(22,163,74,0.1)', background: 'rgba(22,163,74,0.02)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-success)'; e.currentTarget.style.background = 'rgba(22,163,74,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(22,163,74,0.1)'; e.currentTarget.style.background = 'rgba(22,163,74,0.02)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #16A34A, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileCheck size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--texte-fonce)' }}>Mes candidatures</p>
                  <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>Suivre vos soumissions et évaluations</p>
                </div>
                <ArrowRight size={16} color="var(--texte-moyen)" style={{ marginLeft: 'auto' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
