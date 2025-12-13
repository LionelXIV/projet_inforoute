import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { JeuDonnees } from '@/types/data.types';

interface JeuDonneesCardProps {
  jeu: JeuDonnees;
}

export const JeuDonneesCard = ({ jeu }: JeuDonneesCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategories = () => {
    if (!jeu.categories) return [];
    return jeu.categories.split(';').map((cat) => cat.trim()).filter(Boolean);
  };

  const getEtiquettes = () => {
    if (!jeu.etiquettes) return [];
    return jeu.etiquettes.split(';').map((etq) => etq.trim()).filter(Boolean);
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{jeu.titre}</CardTitle>
          {jeu.niveau_acces && (
            <Badge variant={jeu.niveau_acces === 'Ouvert' ? 'default' : 'secondary'}>
              {jeu.niveau_acces}
            </Badge>
          )}
        </div>
        {jeu.organisation_nom && (
          <CardDescription className="flex items-center gap-1 mt-1">
            <span>{jeu.organisation_nom}</span>
            {jeu.organisation_type && (
              <span className="text-muted-foreground">• {jeu.organisation_type}</span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {truncateDescription(jeu.description || 'Aucune description disponible')}
        </p>

        {getCategories().length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Catégories</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {getCategories().slice(0, 3).map((cat, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {getCategories().length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{getCategories().length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {getEtiquettes().length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {getEtiquettes().slice(0, 2).map((etq, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {etq}
                </Badge>
              ))}
              {getEtiquettes().length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{getEtiquettes().length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
          {jeu.date_creation && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Créé le {formatDate(jeu.date_creation)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link to={`/jeux-donnees/${jeu.id}`}>Voir les détails</Link>
        </Button>
        {jeu.url_originale && (
          <Button asChild variant="outline" size="icon">
            <a href={jeu.url_originale} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

