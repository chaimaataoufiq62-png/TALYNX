import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, ChevronDown, LayoutDashboard, Briefcase, FileText, Settings } from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/notifications/unread-count')
        .then(res => setUnreadCount(res.data?.count || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    padding: '0.75rem 2rem',
    background: scrolled ? 'rgba(255,255,255,0.97)' : '#FFFFFF',
    borderBottom: `1px solid ${scrolled ? 'rgba(76,30,149,0.1)' : '#F3F4F6'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    boxShadow: scrolled ? '0 4px 20px rgba(76,30,149,0.08)' : 'none',
    transition: 'all 0.3s ease',
  };

  const candidateLinks = [
    { to: '/candidate/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/candidate/matches', label: 'Opportunités', icon: <Briefcase size={16} /> },
    { to: '/candidate/submissions', label: 'Candidatures', icon: <FileText size={16} /> },
  ];

  const companyLinks = [
    { to: '/company/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/company/challenges', label: 'Défis', icon: <Briefcase size={16} /> },
    { to: '/company/matching', label: 'Candidats', icon: <User size={16} /> },
    { to: '/company/submissions', label: 'Évaluations', icon: <FileText size={16} /> },
  ];

  const links = user?.type === 'candidat' ? candidateLinks : companyLinks;
  const profilePath = user?.type === 'candidat' ? '/candidate/profile' : '/company/profile';
  const displayName = user ? (user.prenom ? `${user.prenom} ${user.nom}` : user.nomEntreprise) : '';

  return (
    <nav style={navStyle}>
      {/* Left: Logo + Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo.png" alt="Talynx" style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {user && (
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {links.map(link => (
              <NavLink key={link.to} to={link.to} icon={link.icon} label={link.label} />
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <>
            {/* Notification Bell */}
            <button
              style={{
                background: 'none', border: '1.5px solid #E5E7EB',
                borderRadius: 'var(--radius-md)', padding: '0.5rem',
                color: 'var(--texte-moyen)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', position: 'relative',
                transition: 'var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--btn-primaire)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E7EB'}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: 'var(--color-danger)', color: 'white',
                  borderRadius: 'var(--radius-full)', width: '18px', height: '18px',
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'linear-gradient(135deg, rgba(76,30,149,0.08), rgba(37,99,235,0.08))',
                  border: '1.5px solid rgba(76,30,149,0.15)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.45rem 1rem 0.45rem 0.5rem',
                  cursor: 'pointer', color: 'var(--texte-fonce)',
                  fontWeight: 600, fontSize: '0.875rem',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'var(--gradient-btn)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
                <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'white', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid rgba(76,30,149,0.1)',
                    minWidth: '200px', zIndex: 999, overflow: 'hidden',
                    animation: 'fadeIn 0.15s ease'
                  }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #F3F4F6', background: 'linear-gradient(135deg, rgba(76,30,149,0.04), rgba(37,99,235,0.04))' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--texte-fonce)' }}>{displayName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--texte-moyen)', textTransform: 'capitalize' }}>{user.type}</p>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                      <Link to={profilePath} style={{ textDecoration: 'none' }} onClick={() => setDropdownOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--texte-fonce)', cursor: 'pointer', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Settings size={16} color="var(--texte-moyen)" />
                          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Mon Profil</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <LogOut size={16} />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--texte-moyen)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--btn-primaire)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--texte-moyen)'}
            >
              Connexion
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem', borderRadius: 'var(--radius-full)' }}>
                Inscription gratuite
              </button>
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => {
  const [hovered, setHovered] = useState(false);
  const isActive = window.location.pathname === to || window.location.pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.45rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        fontWeight: isActive ? 700 : 500,
        fontSize: '0.875rem',
        color: isActive ? 'var(--btn-primaire)' : (hovered ? 'var(--btn-primaire)' : 'var(--texte-moyen)'),
        background: isActive ? 'rgba(76,30,149,0.08)' : (hovered ? 'rgba(76,30,149,0.05)' : 'transparent'),
        transition: 'all 0.2s ease',
      }}
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
