import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJeuxDonnees } from '@/store/slices/dataSlice';
import { JeuDonneesCard } from '@/components/common/JeuDonneesCard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ExportButton } from '@/components/common/ExportButton';

// Constante pour la taille de page (doit correspondre au PAGE_SIZE du backend)
const PAGE_SIZE = 20;

export const JeuxDonnees = () => {
  const dispatch = useAppDispatch();
  const { jeuxDonnees, loading, error, filters, pagination } = useAppSelector((state) => state.data);

  useEffect(() => {
    dispatch(fetchJeuxDonnees(filters));
  }, [dispatch, filters]);

  // Scroll vers le haut quand les filtres changent et que les données sont chargées
  useEffect(() => {
    if (!loading) {
      // Petit délai pour laisser le temps au DOM de se mettre à jour
      const timer = setTimeout(() => {
        // Scroll vers le début du contenu des résultats
        const element = document.getElementById('jeux-donnees-content');
        if (element) {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - 100; // 100px de marge pour la navbar
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [filters, loading]);

  const handleLoadMore = () => {
    if (pagination.next) {
      const url = new URL(pagination.next);
      const page = url.searchParams.get('page');
      if (page) {
        dispatch(fetchJeuxDonnees({ ...filters, page: parseInt(page) }));
      }
    }
  };

  const handleLoadPrevious = () => {
    if (pagination.previous) {
      const url = new URL(pagination.previous);
      const page = url.searchParams.get('page');
      dispatch(fetchJeuxDonnees({ ...filters, page: page ? parseInt(page) : 1 }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="container-fluid" style={{ marginTop: '2rem', marginBottom: '2rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Header Bootstrap-style */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{ padding: '1.5rem 0' }}>
              <h1 className="display-4" style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                📊 Jeux de données
              </h1>
              <p className="lead" style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '1rem', color: '#6c757d' }}>
                Explorez et découvrez les jeux de données disponibles
              </p>
              <hr className="my-4" style={{ marginTop: '1rem', marginBottom: '1rem', border: 0, borderTop: '1px solid rgba(0,0,0,0.1)' }} />
              {jeuxDonnees.length > 0 && (
                <div className="d-flex justify-content-end mb-3" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <ExportButton
                    elementId="jeux-donnees-content"
                    filename="liste-jeux-donnees"
                    title="Liste des jeux de données - DataQC"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtres horizontaux */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0',
              wordWrap: 'break-word',
              backgroundColor: '#fff',
              backgroundClip: 'border-box',
              border: '1px solid rgba(0,0,0,0.125)',
              borderRadius: '0.25rem'
            }}>
              <div className="card-header" style={{
                padding: '0.75rem 1.25rem',
                marginBottom: '0',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderBottom: '1px solid rgba(0,0,0,0.125)',
                fontWeight: '500'
              }}>
                🔍 Filtres de recherche
              </div>
              <div className="card-body" style={{ padding: '1.25rem' }}>
                <FilterPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des jeux de données */}
        <div id="jeux-donnees-content">
          {error && (
            <Alert variant="destructive" className="mb-4" style={{
              padding: '0.75rem 1.25rem',
              marginBottom: '1rem',
              border: '1px solid #f5c6cb',
              borderRadius: '0.25rem',
              backgroundColor: '#f8d7da',
              color: '#721c24'
            }}>
              <AlertCircle className="h-4 w-4" style={{ marginRight: '0.5rem', display: 'inline-block' }} />
              <AlertDescription style={{ display: 'inline' }}>{error}</AlertDescription>
            </Alert>
          )}

          {loading && jeuxDonnees.length === 0 ? (
            <div className="text-center py-5">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0d6efd', margin: '0 auto' }} />
              <p className="mt-3 text-muted">Chargement des jeux de données...</p>
            </div>
          ) : jeuxDonnees.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <AlertCircle className="h-12 w-12 text-muted mb-3" style={{ margin: '0 auto 1rem', display: 'block', color: '#6c757d' }} />
                <h5 className="card-title">Aucun résultat trouvé</h5>
                <p className="card-text text-muted">
                  Aucun jeu de données ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3" style={{ marginBottom: '1rem' }}>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem', color: '#6c757d' }}>
                  <strong>{pagination.count}</strong> jeu{pagination.count > 1 ? 'x' : ''} de données trouvé{pagination.count > 1 ? 's' : ''}
                </p>
              </div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}
              className="jeux-donnees-grid"
              >
                <style>{`
                  .jeux-donnees-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                  }
                  @media (max-width: 991px) {
                    .jeux-donnees-grid {
                      grid-template-columns: repeat(2, 1fr);
                    }
                  }
                  @media (max-width: 575px) {
                    .jeux-donnees-grid {
                      grid-template-columns: 1fr;
                    }
                  }
                `}</style>
                {jeuxDonnees.map((jeu) => (
                  <div key={jeu.id}>
                    <JeuDonneesCard jeu={jeu} />
                  </div>
                ))}
              </div>

              {/* Pagination Bootstrap-style */}
              {(pagination.next || pagination.previous) && (
                <nav aria-label="Pagination des jeux de données" style={{ marginTop: '2rem' }}>
                  <ul className="pagination justify-content-center" style={{
                    display: 'flex',
                    paddingLeft: '0',
                    listStyle: 'none',
                    justifyContent: 'center',
                    marginTop: '2rem',
                    marginBottom: '0'
                  }}>
                    <li className={`page-item ${!pagination.previous ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={handleLoadPrevious}
                        disabled={!pagination.previous || loading}
                        style={{
                          position: 'relative',
                          display: 'block',
                          padding: '0.375rem 0.75rem',
                          color: '#0d6efd',
                          textDecoration: 'none',
                          backgroundColor: '#fff',
                          border: '1px solid #dee2e6',
                          cursor: !pagination.previous || loading ? 'not-allowed' : 'pointer',
                          opacity: !pagination.previous || loading ? 0.65 : 1
                        }}
                      >
                        Précédent
                      </button>
                    </li>
                    <li className="page-item active">
                      <span className="page-link" style={{
                        position: 'relative',
                        display: 'block',
                        padding: '0.375rem 0.75rem',
                        color: '#fff',
                        textDecoration: 'none',
                        backgroundColor: '#0d6efd',
                        border: '1px solid #0d6efd'
                      }}>
                        Page {filters.page || 1} sur {Math.ceil(pagination.count / PAGE_SIZE)}
                      </span>
                    </li>
                    <li className={`page-item ${!pagination.next ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={handleLoadMore}
                        disabled={!pagination.next || loading}
                        style={{
                          position: 'relative',
                          display: 'block',
                          padding: '0.375rem 0.75rem',
                          color: '#0d6efd',
                          textDecoration: 'none',
                          backgroundColor: '#fff',
                          border: '1px solid #dee2e6',
                          cursor: !pagination.next || loading ? 'not-allowed' : 'pointer',
                          opacity: !pagination.next || loading ? 0.65 : 1
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                            Chargement...
                          </>
                        ) : (
                          'Suivant'
                        )}
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};
