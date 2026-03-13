import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Users, Award, ArrowRight, Code, Target, Star, ChevronRight } from 'lucide-react';

const FEATURES = [
  {
    icon: <Zap size={28} color="white" />,
    color: '#4C1E95',
    title: 'Matching Intelligent',
    desc: 'Notre algorithme analyse vos compétences et vous propose les défis les plus adaptés à votre profil.',
  },
  {
    icon: <Code size={28} color="white" />,
    color: '#2563EB',
    title: 'Challenges Techniques',
    desc: 'Résolvez des problèmes réels posés par des entreprises innovantes et faites valoir votre expertise.',
  },
  {
    icon: <Target size={28} color="white" />,
    color: '#7C3AED',
    title: 'Score de Compatibilité',
    desc: 'Un score personnel calculé pour chaque offre, vous aidant à maximiser vos chances de réussite.',
  },
  {
    icon: <Award size={28} color="white" />,
    color: '#6D4BC1',
    title: 'Évaluations Certifiées',
    desc: 'Recevez des retours détaillés de professionnels sur vos soumissions et qualifiez-vous.',
  },
];

const STEPS = [
  { number: '01', title: 'Créez votre profil', desc: 'Renseignez vos compétences techniques, votre formation et vos expériences.' },
  { number: '02', title: 'Matching automatique', desc: 'Notre algorithme vous associe aux défis correspondant à votre profil.' },
  { number: '03', title: 'Soumettez & Brillez', desc: 'Répondez aux challenges et recevez une évaluation personnalisée des entreprises.' },
];

const STATS = [
  { value: '500+', label: 'Candidats actifs' },
  { value: '120+', label: 'Entreprises partenaires' },
  { value: '800+', label: 'Challenges publiés' },
  { value: '92%', label: 'Taux de satisfaction' },
];

const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ background: '#F9FAFB' }}>
      {/* ======================================================
          HERO SECTION
         ====================================================== */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a0a40 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '7rem 1.5rem 6rem',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`, backgroundSize: '50px 50px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '9999px', padding: '0.4rem 1.2rem', marginBottom: '2rem' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#c084fc', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 600 }}>Plateforme de recrutement tech de nouvelle génération</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.15,
            letterSpacing: '-0.5px'
          }}>
            Connectez Talent &<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Innovation
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.15rem', maxWidth: '620px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
            Talynx met en relation les meilleurs profils tech avec des entreprises innovantes grâce à des challenges techniques et un algorithme de matching intelligent.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{
                background: 'linear-gradient(135deg, #4C1E95, #7C3AED)',
                color: 'white', border: 'none', borderRadius: '9999px',
                padding: '0.875rem 2.25rem', fontSize: '1rem', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 8px 25px rgba(124,58,237,0.45)',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(124,58,237,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(124,58,237,0.45)'; }}
              >
                Commencer gratuitement <ArrowRight size={18} />
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                background: 'rgba(255,255,255,0.08)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: '9999px',
                padding: '0.875rem 2.25rem', fontSize: '1rem', fontWeight: 600,
                cursor: 'pointer', backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          STATS BAR
         ====================================================== */}
      <section style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '2rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {STATS.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-btn)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
                <div style={{ color: 'var(--texte-moyen)', fontSize: '0.875rem', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FEATURES SECTION
         ====================================================== */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(76,30,149,0.08)', color: 'var(--btn-primaire)', borderRadius: '9999px', padding: '0.35rem 1.1rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase' }}>Fonctionnalités</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--texte-fonce)', marginBottom: '1rem' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ color: 'var(--texte-moyen)', maxWidth: '520px', margin: '0 auto', fontSize: '1rem' }}>
              Une expérience premium de bout en bout pour les candidats et les recruteurs tech.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: 'white', borderRadius: '16px', padding: '2rem',
                  border: hoveredCard === i ? '1.5px solid rgba(76,30,149,0.3)' : '1.5px solid #F3F4F6',
                  boxShadow: hoveredCard === i ? '0 12px 40px rgba(76,30,149,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: hoveredCard === i ? 'translateY(-4px)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
              >
                <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: `0 6px 16px ${f.color}40` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--texte-fonce)', marginBottom: '0.75rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--texte-moyen)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          HOW IT WORKS SECTION
         ====================================================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(37,99,235,0.08)', color: 'var(--bleu-accent)', borderRadius: '9999px', padding: '0.35rem 1.1rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase' }}>Comment ça marche</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--texte-fonce)' }}>
              3 étapes vers votre prochain défi
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4C1E95, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 20px rgba(76,30,149,0.3)'
                }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '36px', left: 'calc(50% + 50px)', right: 'calc(-50% + 50px)', height: '2px', background: 'linear-gradient(90deg, rgba(76,30,149,0.3), rgba(37,99,235,0.3))', display: 'none' }} className="step-arrow" />
                )}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--texte-fonce)', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--texte-moyen)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '260px', margin: '0 auto' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          WHO IS IT FOR SECTION
         ====================================================== */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Candidat card */}
            <div style={{ borderRadius: '20px', padding: '2.5rem', background: 'linear-gradient(135deg, #0f0c29, #302b63)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(124,58,237,0.5)' }}>
                  <Users size={24} color="#c084fc" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '1.4rem', marginBottom: '1rem' }}>Pour les Candidats</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {['Profil compétences détaillé', 'Matching automatique ≥ 30%', 'Soumission de défis facile', 'Suivi de vos évaluations'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(192,132,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ChevronRight size={12} color="#c084fc" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <button style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.25)', color: 'white', borderRadius: '9999px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(10px)', fontSize: '0.875rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    Je suis candidat <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Entreprise card */}
            <div style={{ borderRadius: '20px', padding: '2.5rem', background: 'white', border: '2px solid rgba(76,30,149,0.12)', boxShadow: '0 8px 30px rgba(76,30,149,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1), transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(37,99,235,0.2)' }}>
                  <Award size={24} color="var(--bleu-accent)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--texte-fonce)', fontSize: '1.4rem', marginBottom: '1rem' }}>Pour les Entreprises</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {['Publiez vos challenges techniques', 'Critères d\'éligibilité personnalisés', 'Classement des meilleurs candidats', 'Évaluez et qualifiez directement'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--texte-moyen)', fontSize: '0.9rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(37,99,235,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ChevronRight size={12} color="var(--bleu-accent)" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button className="btn-primary" style={{ borderRadius: '9999px', padding: '0.7rem 1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
                    Je suis une entreprise <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CTA SECTION
         ====================================================== */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #4C1E95 0%, #2563EB 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', marginBottom: '1rem' }}>
            Prêt à relever le défi ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: '480px', margin: '0 auto 2.5rem' }}>
            Rejoignez des milliers de talents et d'entreprises qui font confiance à Talynx.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{ background: 'white', color: 'var(--btn-primaire)', border: 'none', borderRadius: '9999px', padding: '0.875rem 2.25rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 8px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)'; }}
              >
                Créer un compte gratuit <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          FOOTER
         ====================================================== */}
      <footer style={{ background: '#0f0c29', padding: '3rem 1.5rem', color: 'rgba(255,255,255,0.5)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <img src="/images/logo.png" alt="Talynx" style={{ height: '80px', filter: 'brightness(1.1)', marginBottom: '1rem', display: 'block' }} />
            <p style={{ fontSize: '0.875rem', maxWidth: '280px', lineHeight: 1.6 }}>Plateforme de mise en relation talent-entreprise via les challenges techniques.</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem' }}>Plateforme</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[{ to: '/register', label: 'Inscription' }, { to: '/login', label: 'Connexion' }].map(l => (
                  <Link key={l.to} to={l.to} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Talynx. Tous droits réservés.
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Home;
