import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.type === 'candidat') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bienvenue chez Talynx" subtitle="Identifiez-vous pour continuer sur Talynx." isLogin={true}>
        
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fed7d7', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="label">Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
              <input 
                type="email" 
                className="input-field" 
                placeholder="votre.email@domaine.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeOff style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666', cursor: 'pointer' }} size={16} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#1A1A1A', marginTop: '0.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#1E12A3' }} />
              Se souvenir de moi
            </label>
            <Link to="#" style={{ color: '#1E12A3', textDecoration: 'none', fontWeight: 500 }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.8rem', padding: '0.85rem', borderRadius: '30px', fontWeight: 700, width: '100%', fontSize: '0.9rem', letterSpacing: '0.05em' }} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'SE CONNECTER'}
          </button>
        </form>
    </AuthLayout>
  );
};

export default Login;
