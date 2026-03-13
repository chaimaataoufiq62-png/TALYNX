import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, isLogin = true }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* ===================== LEFT PANEL ===================== */}
      <div style={{
        flex: '0 0 45%',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #1a0a40 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        {/* Top left logo */}
        <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 2 }}>
          <Link to="/">
            <img src="/images/logo.png" alt="Talynx" style={{ height: '120px', width: 'auto', filter: 'brightness(1.1)' }} />
          </Link>
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '420px' }}>
          {/* Big icon */}
          <div style={{
            width: '90px', height: '90px', borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(37,99,235,0.5))',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
            backdropFilter: 'blur(10px)'
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M10 22C10 15.373 15.373 10 22 10C28.627 10 34 15.373 34 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M22 34C18 34 15 31 15 27C15 23 18 20 22 20C26 20 29 23 29 27C29 31 26 34 22 34Z" fill="white" fillOpacity="0.8"/>
              <circle cx="22" cy="16" r="3" fill="white"/>
            </svg>
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'white', fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Bienvenue sur<br />
            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Talynx
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
            La plateforme qui connecte les meilleurs talents aux entreprises innovantes à travers des challenges techniques.
          </p>

          {/* Features pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2.5rem', alignItems: 'flex-start' }}>
            {[
              { icon: '⚡', text: 'Matching intelligent par algorithme' },
              { icon: '🏆', text: 'Challenges techniques certifiés' },
              { icon: '🔗', text: 'Connexion directe entreprises-talents' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '0.65rem 1rem',
                backdropFilter: 'blur(5px)',
                width: '100%'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== RIGHT PANEL ===================== */}
      <div style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Back to home link */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '2rem' }}>
          <Link to="/" style={{ color: 'var(--texte-moyen)', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--btn-primaire)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--texte-moyen)'}
          >
            ← Retour à l'accueil
          </Link>
        </div>

        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          {/* Logo + Title */}
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--texte-fonce)', marginBottom: '0.4rem', fontWeight: 700 }}>
              {title}
            </h2>
            <p style={{ color: 'var(--texte-moyen)', fontSize: '0.925rem' }}>{subtitle}</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #F3F4F6', marginBottom: '2rem' }}>
            <Link to="/login" style={{
              flex: 1, textAlign: 'center', padding: '0.85rem', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em',
              color: isLogin ? 'var(--btn-primaire)' : 'var(--texte-moyen)',
              borderBottom: isLogin ? '2px solid var(--btn-primaire)' : '2px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}>
              SE CONNECTER
            </Link>
            <Link to="/register" style={{
              flex: 1, textAlign: 'center', padding: '0.85rem', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em',
              color: !isLogin ? 'var(--btn-primaire)' : 'var(--texte-moyen)',
              borderBottom: !isLogin ? '2px solid var(--btn-primaire)' : '2px solid transparent',
              marginBottom: '-2px', transition: 'all 0.2s'
            }}>
              S'INSCRIRE
            </Link>
          </div>

          {/* Form children */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
