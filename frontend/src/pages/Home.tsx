import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="container" style={{ marginTop: '2rem' }}>
        <div className="row">
          <div className="col-12">
            <div style={{ padding: '1.5rem' }}>
              <h1 className="display-4" style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                Bienvenue sur DataQC
              </h1>
              <p className="lead" style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '1rem' }}>
                Plateforme de visualisation et d'exploration des données ouvertes du Québec
              </p>
              <hr className="my-4" style={{ marginTop: '1rem', marginBottom: '1rem', border: 0, borderTop: '1px solid rgba(0,0,0,0.1)' }} />
              <p>Cette plateforme permet d'explorer et de visualiser les données ouvertes du Québec via une interface moderne et intuitive.</p>
            </div>
          </div>
        </div>

        <div className="row" style={{ 
          marginTop: '3rem', 
          marginLeft: '-15px', 
          marginRight: '-15px',
          display: 'flex',
          flexWrap: 'nowrap'
        }}>
          <div className="col-md-4" style={{ 
            paddingLeft: '15px', 
            paddingRight: '15px', 
            marginBottom: '1.5rem',
            display: 'flex',
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%'
          }}>
            <div className="card text-center" style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0',
              wordWrap: 'break-word',
              backgroundColor: '#fff',
              backgroundClip: 'border-box',
              border: '1px solid rgba(0,0,0,0.125)',
              borderRadius: '0.25rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
            }}
            >
              <div className="card-body" style={{ flex: '1 1 auto', padding: '1.5rem' }}>
                <h5 className="card-title" style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '500' }}>
                  📊 Jeux de données
                </h5>
                <h2 className="text-primary" style={{ color: '#0d6efd', fontSize: '2rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Explorez
                </h2>
                <p className="card-text" style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  Explorez et recherchez parmi des centaines de jeux de données ouverts
                </p>
                <Link
                  to="/jeux-donnees"
                  className="btn btn-outline-primary"
                  style={{
                    display: 'inline-block',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#0d6efd',
                    textAlign: 'center',
                    textDecoration: 'none',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none',
                    border: '1px solid #0d6efd',
                    padding: '0.375rem 0.75rem',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.backgroundColor = '#0d6efd';
                    e.currentTarget.style.borderColor = '#0d6efd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0d6efd';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#0d6efd';
                  }}
                >
                  Explorer
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4" style={{ 
            paddingLeft: '15px', 
            paddingRight: '15px', 
            marginBottom: '1.5rem',
            display: 'flex',
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%'
          }}>
            <div className="card text-center" style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0',
              wordWrap: 'break-word',
              backgroundColor: '#fff',
              backgroundClip: 'border-box',
              border: '1px solid rgba(0,0,0,0.125)',
              borderRadius: '0.25rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
            }}
            >
              <div className="card-body" style={{ flex: '1 1 auto', padding: '1.5rem' }}>
                <h5 className="card-title" style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '500' }}>
                  📈 Statistiques
                </h5>
                <h2 className="text-success" style={{ color: '#198754', fontSize: '2rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Visualisez
                </h2>
                <p className="card-text" style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  Visualisez les données avec des graphiques interactifs et des analyses
                </p>
                <Link
                  to="/statistics"
                  className="btn btn-outline-success"
                  style={{
                    display: 'inline-block',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#198754',
                    textAlign: 'center',
                    textDecoration: 'none',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none',
                    border: '1px solid #198754',
                    padding: '0.375rem 0.75rem',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.backgroundColor = '#198754';
                    e.currentTarget.style.borderColor = '#198754';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#198754';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#198754';
                  }}
                >
                  Voir les stats
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4" style={{ 
            paddingLeft: '15px', 
            paddingRight: '15px', 
            marginBottom: '1.5rem',
            display: 'flex',
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%'
          }}>
            <div className="card text-center" style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0',
              wordWrap: 'break-word',
              backgroundColor: '#fff',
              backgroundClip: 'border-box',
              border: '1px solid rgba(0,0,0,0.125)',
              borderRadius: '0.25rem',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              height: '100%',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
            }}
            >
              <div className="card-body" style={{ flex: '1 1 auto', padding: '1.5rem' }}>
                <h5 className="card-title" style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '500' }}>
                  🔍 Recherche avancée
                </h5>
                <h2 className="text-info" style={{ color: '#0dcaf0', fontSize: '2rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Filtrez
                </h2>
                <p className="card-text" style={{ marginBottom: '1rem', color: '#6c757d' }}>
                  Utilisez des filtres dynamiques pour trouver exactement ce que vous cherchez
                </p>
                <Link
                  to="/jeux-donnees"
                  className="btn btn-outline-info"
                  style={{
                    display: 'inline-block',
                    fontWeight: '400',
                    lineHeight: '1.5',
                    color: '#0dcaf0',
                    textAlign: 'center',
                    textDecoration: 'none',
                    verticalAlign: 'middle',
                    cursor: 'pointer',
                    userSelect: 'none',
                    border: '1px solid #0dcaf0',
                    padding: '0.375rem 0.75rem',
                    fontSize: '1rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.backgroundColor = '#0dcaf0';
                    e.currentTarget.style.borderColor = '#0dcaf0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0dcaf0';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#0dcaf0';
                  }}
                >
                  Rechercher
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
