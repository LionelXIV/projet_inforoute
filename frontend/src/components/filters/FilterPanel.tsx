import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters, fetchOrganisations, fetchCategories } from '@/store/slices/dataSlice';
import { Search, X } from 'lucide-react';

export const FilterPanel = () => {
  const dispatch = useAppDispatch();
  const { filters, organisations, categories, loadingOrganisations, loadingCategories } = useAppSelector(
    (state) => state.data
  );

  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    organisation: filters.organisation?.toString() || '',
    categories: filters.categories || '',
    ordering: filters.ordering || '',
  });

  useEffect(() => {
    // Charger les organisations et catégories au montage
    if (organisations.length === 0 && !loadingOrganisations) {
      dispatch(fetchOrganisations());
    }
    if (categories.length === 0 && !loadingCategories) {
      dispatch(fetchCategories());
    }
  }, [dispatch, organisations.length, categories.length, loadingOrganisations, loadingCategories]);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.search) appliedFilters.search = localFilters.search;
    if (localFilters.organisation) appliedFilters.organisation = parseInt(localFilters.organisation);
    if (localFilters.categories) appliedFilters.categories = localFilters.categories;
    if (localFilters.ordering) appliedFilters.ordering = localFilters.ordering;

    dispatch(setFilters(appliedFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      organisation: '',
      categories: '',
      ordering: '',
    });
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.values(localFilters).some((value) => value !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtres
        </CardTitle>
        <CardDescription>Filtrez les jeux de données selon vos critères</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche textuelle */}
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher par titre, description, catégories..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filtre par organisation */}
        <div className="space-y-2">
          <Label htmlFor="organisation">Organisation</Label>
          <Select
            value={localFilters.organisation}
            onValueChange={(value) => handleFilterChange('organisation', value)}
          >
            <SelectTrigger id="organisation">
              <SelectValue placeholder="Toutes les organisations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les organisations</SelectItem>
              {organisations.map((org) => (
                <SelectItem key={org.id} value={org.id.toString()}>
                  {org.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre par catégorie */}
        <div className="space-y-2">
          <Label htmlFor="categories">Catégorie</Label>
          <Select
            value={localFilters.categories}
            onValueChange={(value) => handleFilterChange('categories', value)}
          >
            <SelectTrigger id="categories">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.nom}>
                  {cat.nom} ({cat.nombre_jeux_donnees})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tri */}
        <div className="space-y-2">
          <Label htmlFor="ordering">Trier par</Label>
          <Select
            value={localFilters.ordering}
            onValueChange={(value) => handleFilterChange('ordering', value)}
          >
            <SelectTrigger id="ordering">
              <SelectValue placeholder="Ordre par défaut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Ordre par défaut</SelectItem>
              <SelectItem value="titre">Titre (A-Z)</SelectItem>
              <SelectItem value="-titre">Titre (Z-A)</SelectItem>
              <SelectItem value="date_creation">Date de création (plus ancien)</SelectItem>
              <SelectItem value="-date_creation">Date de création (plus récent)</SelectItem>
              <SelectItem value="date_metadata_creation">Date métadonnées (plus ancien)</SelectItem>
              <SelectItem value="-date_metadata_creation">Date métadonnées (plus récent)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2 pt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Appliquer les filtres
          </Button>
          {hasActiveFilters && (
            <Button onClick={handleClearFilters} variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

