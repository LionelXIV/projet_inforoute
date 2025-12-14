import { useState, useEffect } from 'react';
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
    organisation: filters.organisation?.toString() || 'all',
    categories: filters.categories || 'all',
    ordering: filters.ordering || 'default',
  });

  useEffect(() => {
    if (organisations.length === 0 && !loadingOrganisations) {
      dispatch(fetchOrganisations());
    }
    if (categories.length === 0 && !loadingCategories) {
      dispatch(fetchCategories());
    }
  }, [dispatch, organisations.length, categories.length, loadingOrganisations, loadingCategories]);

  useEffect(() => {
    setLocalFilters({
      search: filters.search || '',
      organisation: filters.organisation?.toString() || 'all',
      categories: filters.categories || 'all',
      ordering: filters.ordering || 'default',
    });
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const appliedFilters: any = {};
    if (localFilters.search.trim()) appliedFilters.search = localFilters.search.trim();
    if (localFilters.organisation && localFilters.organisation !== 'all') {
      appliedFilters.organisation = parseInt(localFilters.organisation);
    }
    if (localFilters.categories && localFilters.categories !== 'all') {
      appliedFilters.categories = localFilters.categories;
    }
    if (localFilters.ordering && localFilters.ordering !== 'default') {
      appliedFilters.ordering = localFilters.ordering;
    }

    // Réinitialiser la page à 1 lors de l'application des filtres
    appliedFilters.page = 1;

    dispatch(setFilters(appliedFilters));
    
    // Scroll vers le haut de la page pour voir les résultats
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      organisation: 'all',
      categories: 'all',
      ordering: 'default',
    });
    dispatch(clearFilters());
    
    // Scroll vers le haut de la page pour voir les résultats
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const hasActiveFilters = 
    localFilters.search !== '' ||
    localFilters.organisation !== 'all' ||
    localFilters.categories !== 'all' ||
    localFilters.ordering !== 'default';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'row', 
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'flex-end'
    }}>
      {/* Recherche textuelle */}
      <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
        <label htmlFor="search" style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#212529'
        }}>
          Recherche
        </label>
        <input
          id="search"
          type="text"
          placeholder="Rechercher par titre, description..."
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#212529',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#86b7fe';
            e.target.style.outline = '0';
            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Filtre par organisation */}
      <div style={{ flex: '1 1 180px', minWidth: '180px' }}>
        <label htmlFor="organisation" style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#212529'
        }}>
          Organisation
        </label>
        <select
          id="organisation"
          value={localFilters.organisation}
          onChange={(e) => handleFilterChange('organisation', e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.375rem 2rem 0.375rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#212529',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            boxSizing: 'border-box',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px 12px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#86b7fe';
            e.target.style.outline = '0';
            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="all">Toutes les organisations</option>
          {organisations.map((org) => (
            <option key={org.id} value={org.id.toString()}>
              {org.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Filtre par catégorie */}
      <div style={{ flex: '1 1 180px', minWidth: '180px' }}>
        <label htmlFor="categories" style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#212529'
        }}>
          Catégorie
        </label>
        <select
          id="categories"
          value={localFilters.categories}
          onChange={(e) => handleFilterChange('categories', e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.375rem 2rem 0.375rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#212529',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            boxSizing: 'border-box',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px 12px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#86b7fe';
            e.target.style.outline = '0';
            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.nom}>
              {cat.nom} ({cat.nombre_jeux_donnees})
            </option>
          ))}
        </select>
      </div>

      {/* Tri */}
      <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
        <label htmlFor="ordering" style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#212529'
        }}>
          Trier par
        </label>
        <select
          id="ordering"
          value={localFilters.ordering}
          onChange={(e) => handleFilterChange('ordering', e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '0.375rem 2rem 0.375rem 0.75rem',
            fontSize: '0.875rem',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#212529',
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            boxSizing: 'border-box',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px 12px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#86b7fe';
            e.target.style.outline = '0';
            e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#ced4da';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="default">Ordre par défaut</option>
          <option value="titre">Titre (A-Z)</option>
          <option value="-titre">Titre (Z-A)</option>
          <option value="date_creation">Date de création (plus ancien)</option>
          <option value="-date_creation">Date de création (plus récent)</option>
          <option value="date_metadata_creation">Date métadonnées (plus ancien)</option>
          <option value="-date_metadata_creation">Date métadonnées (plus récent)</option>
        </select>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
        <button
          onClick={handleApplyFilters}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '400',
            lineHeight: '1.5',
            color: '#fff',
            textAlign: 'center',
            textDecoration: 'none',
            verticalAlign: 'middle',
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: '#0d6efd',
            border: '1px solid #0d6efd',
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem',
            borderRadius: '0.25rem',
            transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
            whiteSpace: 'nowrap',
            height: '38px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0b5ed7';
            e.currentTarget.style.borderColor = '#0a58ca';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0d6efd';
            e.currentTarget.style.borderColor = '#0d6efd';
          }}
        >
          <Search size={16} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Appliquer
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            style={{
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
              transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
              minWidth: '42px',
              height: '38px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = '#6c757d';
              e.currentTarget.style.borderColor = '#6c757d';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6c757d';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#6c757d';
            }}
            title="Réinitialiser les filtres"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
