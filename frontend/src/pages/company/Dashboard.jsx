import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, Award, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total_challenges: 0, total_soumissions: 0, evaluations: 0, qualifies: 0 });
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, challengesRes] = await Promise.all([
          api.get('/stats'),
          api.get('/company/challenges'),
        ]);
        if (statsRes.data) setStats(statsRes.data);
        setChallenges((challengesRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="page-loading">
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid rgba(76,30,149,0.2)', borderTopColor: 'var(--btn-primaire)', animation: 'spin 0.7s linear infinite' }} />
      <p>Chargement...</p>
    </div>
  );

  const statCards = [
    { icon: <Briefcase size={24} color="#4C1E95" />, label: 'Défis Actifs', value: stats.total_challenges || 0, bg: 'rgba(76,30,149,0.1)' },
    { icon: <Users size={24} color="#2563EB" />, label: 'Soumissions Reçues', value: stats.total_soumissions || 0, bg: 'rgba(37,99,235,0.1)' },
    { icon: <Award size={24} color="#16A34A" />, label: 'Candidats Qualifiés', value: stats.qualifies || 0, bg: 'rgba(22,163,74,0.1)' },
    { icon: <TrendingUp size={24} color="#D97706" />, label: 'Évaluations faites', value: stats.evaluations || 0, bg: 'rgba(217,119,6,0.1)' },
  ];

  return (
    <div className="container page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
          Tableau de bord — <span style={{ background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.nomEntreprise || 'Entreprise'}</span>
        </h1>
        <p style={{ color: 'var(--texte-moyen)', marginTop: '0.3rem' }}>Gérez vos défis et suivez les candidats.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {statCards.map((s, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: s.bg, opacity: 0.4 }} />
            <div style={{ padding: '0.875rem', background: s.bg, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.78rem', color: 'var(--texte-moyen)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{s.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Challenges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-heading)' }}>
              <Briefcase size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--btn-primaire)' }} />
              Défis Récents
            </h2>
            <Link to="/company/challenges" style={{ fontSize: '0.8rem', color: 'var(--btn-primaire)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Voir tous <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {challenges.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--texte-moyen)' }}>
                <Briefcase size={36} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem' }}>Aucun défi publié</p>
              </div>
            ) : challenges.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{c.titre}</p>
                  <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>Clôture: {new Date(c.date_fin).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{c.niveau}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <h2 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>Actions Rapides</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { to: '/company/challenges', icon: <Plus size={18} color="white" />, color: 'var(--gradient-btn)', title: 'Créer un nouveau défi', desc: 'Publiez un challenge technique' },
              { to: '/company/matching', icon: <Users size={18} color="white" />, color: 'linear-gradient(135deg, #2563EB, #7C3AED)', title: 'Voir les candidats matchés', desc: 'Classement de compatibilité' },
              { to: '/company/submissions', icon: <Award size={18} color="white" />, color: 'linear-gradient(135deg, #16A34A, #059669)', title: 'Évaluer les réponses', desc: 'Notez les soumissions reçues' },
            ].map((action, i) => (
              <Link key={i} to={action.to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #F3F4F6', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(76,30,149,0.2)'; e.currentTarget.style.background = '#FAFAFA'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{action.icon}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, color: 'var(--texte-fonce)' }}>{action.title}</p>
                    <p style={{ color: 'var(--texte-moyen)', fontSize: '0.8rem', margin: '0.1rem 0 0' }}>{action.desc}</p>
                  </div>
                  <ArrowRight size={16} color="var(--texte-moyen)" style={{ marginLeft: 'auto' }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CompanyDashboard;
