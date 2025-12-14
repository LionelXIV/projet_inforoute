import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/slices/statsSlice';
import { fetchJeuxDonnees } from '@/store/slices/dataSlice';
import { FormatDistributionChart } from '@/components/charts/FormatDistributionChart';
import { TypeDistributionChart } from '@/components/charts/TypeDistributionChart';
import { TemporalEvolutionChart } from '@/components/charts/TemporalEvolutionChart';
import { OrganisationDistributionChart } from '@/components/charts/OrganisationDistributionChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Database, FileText, Calendar, Building2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ExportButton } from '@/components/common/ExportButton';

export const Statistics = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.stats);
  
  // Charger les statistiques depuis l'API backend (contient toutes les données calculées)
  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  // Charger les jeux de données comme fallback pour les graphiques (si les données backend ne sont pas disponibles)
  // Les graphiques utilisent maintenant en priorité les données calculées côté backend (evolution_temporelle, distribution_organisations)
  useEffect(() => {
    dispatch(fetchJeuxDonnees({ page_size: 1000 }));
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Organisations',
      value: stats?.statsOrganisations || stats?.stats_organisations || '0',
      icon: Building2,
      description: 'Nombre total d\'organisations',
      color: 'primary',
      bgColor: '#0d6efd',
    },
    {
      title: 'Jeux de données',
      value: stats?.statsJeuxDonnees || stats?.stats_jeux_donnees || '0',
      icon: Database,
      description: 'Nombre total de jeux de données',
      color: 'success',
      bgColor: '#198754',
    },
    {
      title: 'Ressources',
      value: stats?.statsRessources || stats?.stats_ressources || stats?.total_ressources || '0',
      icon: FileText,
      description: 'Nombre total de ressources',
      color: 'info',
      bgColor: '#0dcaf0',
    },
    {
      title: 'Taille totale',
      value: stats?.taille_totale
        ? `${(stats.taille_totale / 1024 / 1024 / 1024).toFixed(2)} GB`
        : 'N/A',
      icon: Calendar,
      description: 'Taille totale des ressources',
      color: 'primary',
      bgColor: '#0d6efd',
    },
  ];

  return (
    <>
      <Navbar />
      <main className="container" style={{ marginTop: '2rem' }}>
        {/* Header Bootstrap-style */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{ padding: '1.5rem 0' }}>
              <h1 className="display-4" style={{ fontSize: '2.5rem', fontWeight: '300', lineHeight: '1.2', marginBottom: '0.5rem' }}>
                📈 Statistiques
              </h1>
              <p className="lead" style={{ fontSize: '1.25rem', fontWeight: '300', marginBottom: '1rem', color: '#6c757d' }}>
                Visualisez les données et tendances de la plateforme DataQC
              </p>
              <hr className="my-4" style={{ marginTop: '1rem', marginBottom: '1rem', border: 0, borderTop: '1px solid rgba(0,0,0,0.1)' }} />
              <div className="d-flex justify-content-end mb-3" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <ExportButton elementId="statistics-content" filename="statistiques-dataqc" title="Statistiques DataQC" />
              </div>
            </div>
          </div>
        </div>

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

        {loading && !stats ? (
          <div className="text-center py-5">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0d6efd', margin: '0 auto' }} />
            <p className="mt-3 text-muted">Chargement des statistiques...</p>
          </div>
        ) : (
          <div id="statistics-content">
            {/* Cartes de statistiques Bootstrap-style */}
            <div className="row mb-5">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="col-md-3 mb-4">
                    <div className="card text-center" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '0',
                      wordWrap: 'break-word',
                      backgroundColor: '#fff',
                      backgroundClip: 'border-box',
                      border: '1px solid rgba(0,0,0,0.125)',
                      borderRadius: '0.25rem',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div className="card-body" style={{ flex: '1 1 auto', padding: '1.5rem' }}>
                        <div className="mb-3" style={{ marginBottom: '1rem' }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            backgroundColor: `${stat.bgColor}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                          }}>
                            <Icon size={30} style={{ color: stat.bgColor }} />
                          </div>
                        </div>
                        <h5 className="card-title" style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '500' }}>
                          {stat.title}
                        </h5>
                        <h2 style={{ 
                          color: stat.bgColor, 
                          fontSize: '2rem', 
                          fontWeight: '500', 
                          marginBottom: '0.5rem' 
                        }}>
                          {stat.value}
                        </h2>
                        <p className="card-text" style={{ marginBottom: '0', color: '#6c757d', fontSize: '0.875rem' }}>
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Graphiques */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-4">
                <FormatDistributionChart />
              </div>
              <div className="col-lg-6 mb-4">
                <TypeDistributionChart />
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 mb-4">
                <TemporalEvolutionChart />
              </div>
              <div className="col-lg-6 mb-4">
                <OrganisationDistributionChart />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
