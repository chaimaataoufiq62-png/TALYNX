import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: 'candidat',
    nom: '',
    prenom: '',
    nomEntreprise: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      // Registration successful, navigate to login
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Bienvenue chez Talynx" subtitle="Créez votre compte pour commencer." isLogin={false}>
        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fed7d7', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="type" 
                value="candidat" 
                checked={formData.type === 'candidat'} 
                onChange={handleChange} 
              />
              <span className="label" style={{ marginBottom: 0 }}>Je suis un Candidat</span>
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="type" 
                value="entreprise" 
                checked={formData.type === 'entreprise'} 
                onChange={handleChange} 
              />
              <span className="label" style={{ marginBottom: 0 }}>Je suis une Entreprise</span>
            </label>
          </div>

          <div>
            <label className="label">Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
              <input type="email" name="email" className="input-field" placeholder="votre.email@domaine.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          
          <div>
            <label className="label">Mot de Passe <span style={{fontSize: '0.75rem', color: '#999', fontWeight: 'normal'}}>(Min 8 caractères)</span></label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
              <input type="password" name="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength="8" />
              <EyeOff style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666', cursor: 'pointer' }} size={16} />
            </div>
          </div>

          {formData.type === 'candidat' ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="label">Prénom</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
                  <input type="text" name="prenom" className="input-field" placeholder="Jean" value={formData.prenom} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Nom</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
                  <input type="text" name="nom" className="input-field" placeholder="Dupont" value={formData.nom} onChange={handleChange} required />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="label">Nom de l'Entreprise</label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} size={16} />
                <input type="text" name="nomEntreprise" className="input-field" placeholder="TechCorp" value={formData.nomEntreprise} onChange={handleChange} required />
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.85rem', borderRadius: '30px', fontWeight: 700, width: '100%', fontSize: '0.9rem', letterSpacing: '0.05em' }} disabled={loading}>
            {loading ? 'Création en cours...' : 'CRÉER MON COMPTE GRATUIT'}
          </button>
        </form>
    </AuthLayout>
  );
};

export default Register;
