import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJeuDonneesById } from '@/store/slices/dataSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertCircle, ArrowLeft, ExternalLink, Download, Calendar, Tag, Building2, FileText, Clock, Database, Info } from 'lucide-react';
import { dataService } from '@/services/dataService';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ExportButton } from '@/components/common/ExportButton';

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
        <main className="container" style={{ marginTop: '2rem' }}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !currentJeuDonnees) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ marginTop: '2rem' }}>
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
        </main>
        <Footer />
      </>
    );
  }

  const organisation = typeof currentJeuDonnees.organisation === 'object' 
    ? currentJeuDonnees.organisation 
    : null;

  return (
    <>
      <Navbar />
      <main className="container-fluid" style={{ marginTop: '2rem', marginBottom: '2rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1600px', marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Header avec breadcrumb */}
        <div className="row mb-4">
          <div className="col-12">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Button asChild variant="outline" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  color: '#6c757d',
                  textAlign: 'center',
                  textDecoration: 'none',
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  userSelect: 'none',
                  backgroundColor: 'transparent',
                  border: '1px solid #6c757d',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.875rem',
                  borderRadius: '0.25rem',
                  transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
                }}>
                  <Link to="/jeux-donnees" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} />
                    Retour à la liste
                  </Link>
                </Button>
                <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>/</span>
                <span style={{ color: '#6c757d', fontSize: '0.875rem', fontWeight: '500' }}>Détails du jeu de données</span>
              </div>
              <ExportButton
                elementId="jeu-donnees-detail-content"
                filename={`jeu-donnees-${currentJeuDonnees.id}`}
                title={`${currentJeuDonnees.titre} - DataQC`}
              />
            </div>
          </div>
        </div>

        <div id="jeu-donnees-detail-content">
          {/* En-tête principal avec titre et badges */}
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
                borderRadius: '0.25rem',
                padding: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h1 className="display-5" style={{ fontSize: '2rem', fontWeight: '500', lineHeight: '1.2', marginBottom: '1rem', color: '#212529' }}>
                      {currentJeuDonnees.titre}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                      {currentJeuDonnees.niveau_acces && (
                        <Badge variant={currentJeuDonnees.niveau_acces === 'Ouvert' ? 'default' : 'secondary'} style={{
                          display: 'inline-block',
                          padding: '0.35em 0.65em',
                          fontSize: '0.875em',
                          fontWeight: '700',
                          lineHeight: '1',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'baseline',
                          borderRadius: '0.25rem',
                          ...(currentJeuDonnees.niveau_acces === 'Ouvert' ? {
                            backgroundColor: '#198754',
                            color: '#fff',
                            border: 'none'
                          } : {})
                        }}>
                          {currentJeuDonnees.niveau_acces}
                        </Badge>
                      )}
                      {organisation && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6c757d', fontSize: '0.875rem' }}>
                          <Building2 size={16} />
                          <span style={{ fontWeight: '500' }}>{organisation.nom}</span>
                          {organisation.type_organisation && (
                            <span>• {organisation.type_organisation}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {currentJeuDonnees.url_originale && (
                    <Button asChild variant="outline" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0
                    }}>
                      <a href={currentJeuDonnees.url_originale} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ExternalLink size={16} />
                        Source originale
                      </a>
                    </Button>
                  )}
                </div>

                {/* Métadonnées rapides */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.125)' }}>
                  {currentJeuDonnees.date_creation && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={18} style={{ color: '#0d6efd' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500' }}>Créé le</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#212529' }}>
                          {new Date(currentJeuDonnees.date_creation).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                  {currentJeuDonnees.date_modification && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={18} style={{ color: '#198754' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500' }}>Modifié le</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#212529' }}>
                          {new Date(currentJeuDonnees.date_modification).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  )}
                  {ressources.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} style={{ color: '#0dcaf0' }} />
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500' }}>Ressources</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#212529' }}>
                          {ressources.length} fichier{ressources.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Colonne principale */}
            <div className="col-lg-8 mb-4">
              {/* Description */}
              <div className="card mb-4" style={{
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '500'
                }}>
                  <Info size={18} style={{ color: '#0d6efd' }} />
                  Description
                </div>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                  <p style={{ marginBottom: '0', lineHeight: '1.6', color: '#212529', whiteSpace: 'pre-wrap' }}>
                    {currentJeuDonnees.description || 'Aucune description disponible pour ce jeu de données.'}
                  </p>
                </div>
              </div>

              {/* Catégories et étiquettes */}
              {(getCategories().length > 0 || getEtiquettes().length > 0) && (
                <div className="card mb-4" style={{
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
                    Classification
                  </div>
                  <div className="card-body" style={{ padding: '1.25rem' }}>
                    {getCategories().length > 0 && (
                      <div style={{ marginBottom: getEtiquettes().length > 0 ? '1.5rem' : '0' }}>
                        <h6 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#212529' }}>
                          <Tag size={16} style={{ color: '#0d6efd' }} />
                          Catégories
                        </h6>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {getCategories().map((cat, index) => (
                            <Badge key={index} variant="outline" style={{
                              display: 'inline-block',
                              padding: '0.35em 0.65em',
                              fontSize: '0.875em',
                              fontWeight: '700',
                              lineHeight: '1',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              verticalAlign: 'baseline',
                              borderRadius: '0.25rem',
                              border: '1px solid #dee2e6',
                              color: '#212529',
                              backgroundColor: 'transparent'
                            }}>
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {getEtiquettes().length > 0 && (
                      <div>
                        <h6 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#212529' }}>
                          Étiquettes
                        </h6>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {getEtiquettes().map((etq, index) => (
                            <Badge key={index} variant="secondary" style={{
                              display: 'inline-block',
                              padding: '0.35em 0.65em',
                              fontSize: '0.875em',
                              fontWeight: '700',
                              lineHeight: '1',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              verticalAlign: 'baseline',
                              borderRadius: '0.25rem',
                              backgroundColor: '#6c757d',
                              color: '#fff'
                            }}>
                              {etq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Ressources */}
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: '500'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={18} style={{ color: '#198754' }} />
                    Ressources ({ressources.length})
                  </div>
                </div>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                  {loadingRessources ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                      <Loader2 size={24} className="animate-spin" style={{ color: '#0d6efd' }} />
                    </div>
                  ) : ressources.length === 0 ? (
                    <Alert style={{
                      padding: '0.75rem 1.25rem',
                      marginBottom: '0',
                      border: '1px solid #d1ecf1',
                      borderRadius: '0.25rem',
                      backgroundColor: '#d1ecf1',
                      color: '#0c5460'
                    }}>
                      <AlertCircle size={16} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
                      <AlertDescription style={{ display: 'inline' }}>Aucune ressource disponible pour ce jeu de données.</AlertDescription>
                    </Alert>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <Table style={{ marginBottom: '0' }}>
                        <TableHeader>
                          <TableRow>
                            <TableHead style={{ fontWeight: '600', fontSize: '0.875rem', color: '#212529', borderBottom: '2px solid #dee2e6' }}>Nom du fichier</TableHead>
                            <TableHead style={{ fontWeight: '600', fontSize: '0.875rem', color: '#212529', borderBottom: '2px solid #dee2e6' }}>Format</TableHead>
                            <TableHead style={{ fontWeight: '600', fontSize: '0.875rem', color: '#212529', borderBottom: '2px solid #dee2e6' }}>Type</TableHead>
                            <TableHead style={{ fontWeight: '600', fontSize: '0.875rem', color: '#212529', borderBottom: '2px solid #dee2e6' }}>Taille</TableHead>
                            <TableHead style={{ fontWeight: '600', fontSize: '0.875rem', color: '#212529', borderBottom: '2px solid #dee2e6', textAlign: 'center' }}>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ressources.map((ressource) => (
                            <TableRow key={ressource.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                              <TableCell style={{ fontWeight: '500', fontSize: '0.875rem' }}>{ressource.nom}</TableCell>
                              <TableCell>
                                <Badge variant="outline" style={{
                                  display: 'inline-block',
                                  padding: '0.25em 0.5em',
                                  fontSize: '0.75em',
                                  fontWeight: '700',
                                  lineHeight: '1',
                                  textAlign: 'center',
                                  whiteSpace: 'nowrap',
                                  verticalAlign: 'baseline',
                                  borderRadius: '0.25rem',
                                  border: '1px solid #dee2e6',
                                  color: '#212529',
                                  backgroundColor: 'transparent'
                                }}>
                                  {ressource.format_fichier || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell style={{ fontSize: '0.875rem', color: '#6c757d' }}>{ressource.type_ressource || 'N/A'}</TableCell>
                              <TableCell style={{ fontSize: '0.875rem', color: '#6c757d' }}>{formatFileSize(ressource.taille)}</TableCell>
                              <TableCell style={{ textAlign: 'center' }}>
                                <Button asChild variant="outline" size="sm" style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontSize: '0.875rem',
                                  padding: '0.25rem 0.5rem'
                                }}>
                                  <a href={ressource.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Download size={14} />
                                    Télécharger
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne latérale */}
            <div className="col-lg-4">
              {/* Informations sur l'organisation */}
              {organisation && (
                <div className="card mb-4" style={{
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '500'
                  }}>
                    <Building2 size={18} style={{ color: '#0d6efd' }} />
                    Organisation
                  </div>
                  <div className="card-body" style={{ padding: '1.25rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#212529' }}>
                        {organisation.nom}
                      </h5>
                      {organisation.nom_complet && (
                        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>
                          {organisation.nom_complet}
                        </p>
                      )}
                      {organisation.type_organisation && (
                        <Badge variant="outline" style={{
                          display: 'inline-block',
                          padding: '0.25em 0.5em',
                          fontSize: '0.75em',
                          fontWeight: '700',
                          lineHeight: '1',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'baseline',
                          borderRadius: '0.25rem',
                          border: '1px solid #dee2e6',
                          color: '#212529',
                          backgroundColor: 'transparent',
                          marginBottom: '1rem'
                        }}>
                          {organisation.type_organisation}
                        </Badge>
                      )}
                    </div>
                    {organisation.url && (
                      <Button asChild variant="outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <a href={organisation.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ExternalLink size={16} />
                          Visiter le site web
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Informations complémentaires */}
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
                  Informations
                </div>
                <div className="card-body" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentJeuDonnees.date_creation && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500', marginBottom: '0.25rem' }}>
                          Date de création
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#212529' }}>
                          {formatDate(currentJeuDonnees.date_creation)}
                        </div>
                      </div>
                    )}
                    {currentJeuDonnees.date_modification && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500', marginBottom: '0.25rem' }}>
                          Dernière modification
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#212529' }}>
                          {formatDate(currentJeuDonnees.date_modification)}
                        </div>
                      </div>
                    )}
                    {currentJeuDonnees.date_metadata_creation && (
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', fontWeight: '500', marginBottom: '0.25rem' }}>
                          Métadonnées créées
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#212529' }}>
                          {formatDate(currentJeuDonnees.date_metadata_creation)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

