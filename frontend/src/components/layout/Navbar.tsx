import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Database, LogOut, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
      backgroundColor: '#0d6efd',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <Link to="/" className="navbar-brand" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Database className="inline-block mr-2" style={{ verticalAlign: 'middle', width: '24px', height: '24px' }} />
          DataQC
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.25rem 0.5rem',
            background: 'transparent',
            color: 'white'
          }}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <ul className="navbar-nav" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '0.5rem', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0,
            alignItems: 'center',
            flex: '1'
          }}>
            <li className="nav-item">
              <Link to="/" className="nav-link" style={{ 
                color: 'rgba(255,255,255,0.9)', 
                padding: '0.5rem 0.75rem', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/jeux-donnees" className="nav-link" style={{ 
                color: 'rgba(255,255,255,0.9)', 
                padding: '0.5rem 0.75rem', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Jeux de données
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/statistics" className="nav-link" style={{ 
                color: 'rgba(255,255,255,0.9)', 
                padding: '0.5rem 0.75rem', 
                textDecoration: 'none',
                borderRadius: '0.25rem',
                transition: 'background-color 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Statistiques
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link to="/profile" className="nav-link" style={{ 
                  color: 'rgba(255,255,255,0.9)', 
                  padding: '0.5rem 0.75rem', 
                  textDecoration: 'none',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                  {user?.username || 'Profil'}
                </Link>
              </li>
            )}
          </ul>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginLeft: 'auto'
          }}>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="btn btn-outline-light"
                style={{
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: 'white',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.15s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                }}
              >
                <LogOut size={16} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
                Déconnexion
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-light"
                style={{
                  backgroundColor: 'white',
                  color: '#0d6efd',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: 'all 0.15s ease-in-out',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
