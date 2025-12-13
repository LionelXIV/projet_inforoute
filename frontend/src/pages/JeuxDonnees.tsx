import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJeuxDonnees } from '@/store/slices/dataSlice';
import { JeuDonneesCard } from '@/components/common/JeuDonneesCard';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';

export const JeuxDonnees = () => {
  const dispatch = useAppDispatch();
  const { jeuxDonnees, loading, error, filters, pagination } = useAppSelector((state) => state.data);

  useEffect(() => {
    // Charger les jeux de données avec les filtres actuels
    dispatch(fetchJeuxDonnees(filters));
  }, [dispatch, filters]);

  const handleLoadMore = () => {
    if (pagination.next) {
      // Extraire le numéro de page de l'URL next
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
      if (page) {
        dispatch(fetchJeuxDonnees({ ...filters, page: parseInt(page) }));
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Jeux de données</h1>
        <p className="text-muted-foreground">
          Explorez et découvrez les jeux de données disponibles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de filtres */}
        <div className="lg:col-span-1">
          <FilterPanel />
        </div>

        {/* Liste des jeux de données */}
        <div className="lg:col-span-3">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && jeuxDonnees.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : jeuxDonnees.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucun jeu de données trouvé. Essayez de modifier vos filtres.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {pagination.count} jeu{pagination.count > 1 ? 'x' : ''} de données trouvé
                {pagination.count > 1 ? 's' : ''}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {jeuxDonnees.map((jeu) => (
                  <JeuDonneesCard key={jeu.id} jeu={jeu} />
                ))}
              </div>

              {/* Pagination */}
              {(pagination.next || pagination.previous) && (
                <div className="flex items-center justify-between gap-4">
                  <Button
                    onClick={handleLoadPrevious}
                    disabled={!pagination.previous || loading}
                    variant="outline"
                  >
                    Précédent
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {filters.page || 1} sur {Math.ceil(pagination.count / 20)}
                  </div>
                  <Button
                    onClick={handleLoadMore}
                    disabled={!pagination.next || loading}
                    variant="outline"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      'Suivant'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

