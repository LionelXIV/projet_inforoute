import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJeuDonneesById } from '@/store/slices/dataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, Download, Calendar, Tag, Building2 } from 'lucide-react';
import { dataService } from '@/services/dataService';
import Navbar from '@/components/layout/Navbar';

export const JeuDonneesDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentJeuDonnees, loading, error } = useAppSelector((state) => state.data);
  const [ressources, setRessources] = useState<any[]>([]);
  const [loadingRessources, setLoadingRessources] = useState(false);

  useEffect(() => {
    if (id) {
      const jeuId = parseInt(id);
      dispatch(fetchJeuDonneesById(jeuId));
      
      // Charger les ressources
      setLoadingRessources(true);
      dataService
        .getRessources(jeuId)
        .then((data) => {
          setRessources(data);
          setLoadingRessources(false);
        })
        .catch(() => {
          setLoadingRessources(false);
        });
    }
  }, [id, dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const getCategories = () => {
    if (!currentJeuDonnees?.categories) return [];
    return currentJeuDonnees.categories.split(';').map((cat) => cat.trim()).filter(Boolean);
  };

  const getEtiquettes = () => {
    if (!currentJeuDonnees?.etiquettes) return [];
    return currentJeuDonnees.etiquettes.split(';').map((etq) => etq.trim()).filter(Boolean);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !currentJeuDonnees) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Jeu de données non trouvé'}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/jeux-donnees">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Link>
        </Button>
      </div>
      </>
    );
  }

  const organisation = typeof currentJeuDonnees.organisation === 'object' 
    ? currentJeuDonnees.organisation 
    : null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/jeux-donnees">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{currentJeuDonnees.titre}</CardTitle>
                  {currentJeuDonnees.niveau_acces && (
                    <Badge variant={currentJeuDonnees.niveau_acces === 'Ouvert' ? 'default' : 'secondary'} className="mb-2">
                      {currentJeuDonnees.niveau_acces}
                    </Badge>
                  )}
                </div>
                {currentJeuDonnees.url_originale && (
                  <Button asChild variant="outline" size="icon">
                    <a href={currentJeuDonnees.url_originale} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
              {organisation && (
                <CardDescription className="flex items-center gap-1 mt-2">
                  <Building2 className="h-4 w-4" />
                  <span>{organisation.nom}</span>
                  {organisation.type_organisation && (
                    <span className="text-muted-foreground">• {organisation.type_organisation}</span>
                  )}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {currentJeuDonnees.description || 'Aucune description disponible'}
                  </p>
                </div>

                {getCategories().length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Catégories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getCategories().map((cat, index) => (
                        <Badge key={index} variant="outline">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {getEtiquettes().length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Étiquettes</h3>
                    <div className="flex flex-wrap gap-2">
                      {getEtiquettes().map((etq, index) => (
                        <Badge key={index} variant="secondary">
                          {etq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {currentJeuDonnees.date_creation && (
                    <div>
                      <div className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Date de création
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(currentJeuDonnees.date_creation)}
                      </div>
                    </div>
                  )}
                  {currentJeuDonnees.date_modification && (
                    <div>
                      <div className="text-sm font-medium mb-1">Dernière modification</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(currentJeuDonnees.date_modification)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ressources */}
          <Card>
            <CardHeader>
              <CardTitle>Ressources</CardTitle>
              <CardDescription>
                Fichiers et documents associés à ce jeu de données
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRessources ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : ressources.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Aucune ressource disponible</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ressources.map((ressource) => (
                      <TableRow key={ressource.id}>
                        <TableCell className="font-medium">{ressource.nom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{ressource.format_fichier}</Badge>
                        </TableCell>
                        <TableCell>{ressource.type_ressource}</TableCell>
                        <TableCell>{formatFileSize(ressource.taille)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3 mr-1" />
                                Télécharger
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informations complémentaires */}
        <div className="space-y-6">
          {organisation && (
            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">{organisation.nom}</div>
                    {organisation.nom_complet && (
                      <div className="text-sm text-muted-foreground">{organisation.nom_complet}</div>
                    )}
                  </div>
                  {organisation.type_organisation && (
                    <Badge variant="outline">{organisation.type_organisation}</Badge>
                  )}
                  {organisation.url && (
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={organisation.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visiter le site
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

