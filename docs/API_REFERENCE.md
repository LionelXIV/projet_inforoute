# Documentation des APIs - DataQC

## Vue d'ensemble
Ce document référence toutes les APIs REST et GraphQL disponibles dans le back-end Django du TP1.

**Base URL REST** : `http://localhost:8000/api/`  
**Base URL GraphQL** : `http://localhost:8000/graphql/`  
**Swagger UI** : `http://localhost:8000/swagger/`  
**ReDoc** : `http://localhost:8000/redoc/`

**Pagination** : Toutes les listes sont paginées avec 20 éléments par page (configurable via `?page_size=...`)

---

## 🔐 Authentification

L'API utilise `IsAuthenticatedOrReadOnly` :
- **GET** : Accessible sans authentification (lecture seule)
- **POST/PUT/DELETE** : Nécessitent une authentification

**Note** : Pour le TP2, vous devrez implémenter l'authentification par token si nécessaire. Actuellement, l'API accepte les requêtes GET sans authentification.

---

## 📊 API REST

### Organisations

#### GET /api/organisations/
**Description** : Récupérer la liste des organisations

**Paramètres de requête** :
- `search` : Recherche dans `nom`, `nom_complet`, `description`
- `ordering` : Tri (`nom`, `date_creation`, `nombre_jeux_donnees`)
- `page` : Numéro de page
- `page_size` : Taille de la page

**Réponse (200)** :
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/organisations/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "Ville de Québec",
      "nom_complet": "Ville de Québec",
      "type_organisation": "Ville",
      "description": "Description...",
      "url": "https://www.ville.quebec.qc.ca",
      "nombre_jeux_donnees": 25,
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

#### GET /api/organisations/:id/
**Description** : Récupérer les détails d'une organisation (avec jeux de données inclus)

**Réponse (200)** :
```json
{
  "id": 1,
  "nom": "Ville de Québec",
  "nom_complet": "Ville de Québec",
  "type_organisation": "Ville",
  "description": "Description...",
  "url": "https://www.ville.quebec.qc.ca",
  "nombre_jeux_donnees": 25,
  "jeux_donnees": [
    {
      "id": 1,
      "titre": "Données ouvertes",
      "description": "...",
      "organisation": 1,
      "organisation_nom": "Ville de Québec",
      "organisation_type": "Ville",
      "categories": "Transport; Tourisme",
      "etiquettes": "HackQC20",
      "niveau_acces": "Ouvert",
      "url_originale": "https://...",
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z",
      "date_metadata_creation": "2024-01-01T00:00:00Z",
      "date_metadata_modification": "2024-01-15T00:00:00Z"
    }
  ],
  "date_creation": "2024-01-01T00:00:00Z",
  "date_modification": "2024-01-15T00:00:00Z"
}
```

---

#### GET /api/organisations/:id/jeux_donnees/
**Description** : Récupérer les jeux de données d'une organisation

**Réponse (200)** :
```json
[
  {
    "id": 1,
    "titre": "Données ouvertes",
    "description": "...",
    "organisation": 1,
    "organisation_nom": "Ville de Québec",
    "organisation_type": "Ville",
    "categories": "Transport; Tourisme",
    "etiquettes": "HackQC20",
    "niveau_acces": "Ouvert",
    "url_originale": "https://...",
    "date_creation": "2024-01-01T00:00:00Z",
    "date_modification": "2024-01-15T00:00:00Z",
    "date_metadata_creation": "2024-01-01T00:00:00Z",
    "date_metadata_modification": "2024-01-15T00:00:00Z"
  }
]
```

---

### Catégories

#### GET /api/categories/
**Description** : Récupérer la liste des catégories

**Paramètres de requête** :
- `search` : Recherche dans `nom`, `description`
- `ordering` : Tri (`nom`, `nombre_jeux_donnees`)
- `page` : Numéro de page
- `page_size` : Taille de la page

**Réponse (200)** :
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "Transport",
      "description": "Données liées au transport",
      "nombre_jeux_donnees": 15
    }
  ]
}
```

---

### Jeux de Données

#### GET /api/jeux-donnees/
**Description** : Récupérer la liste des jeux de données

**Paramètres de requête** :
- `search` : Recherche dans `titre`, `description`, `categories`, `etiquettes`
- `ordering` : Tri (`titre`, `date_creation`, `date_metadata_creation`)
- `page` : Numéro de page
- `page_size` : Taille de la page

**Réponse (200)** :
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/jeux-donnees/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "titre": "Données ouvertes",
      "description": "Description du jeu de données",
      "organisation": 1,
      "organisation_nom": "Ville de Québec",
      "organisation_type": "Ville",
      "categories": "Transport; Tourisme",
      "etiquettes": "HackQC20; Aménagement",
      "niveau_acces": "Ouvert",
      "url_originale": "https://...",
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z",
      "date_metadata_creation": "2024-01-01T00:00:00Z",
      "date_metadata_modification": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

#### GET /api/jeux-donnees/:id/
**Description** : Récupérer les détails d'un jeu de données (avec ressources incluses)

**Réponse (200)** :
```json
{
  "id": 1,
  "titre": "Données ouvertes",
  "description": "Description complète",
  "organisation": {
    "id": 1,
    "nom": "Ville de Québec",
    "nom_complet": "Ville de Québec",
    "type_organisation": "Ville",
    "description": "...",
    "url": "https://...",
    "nombre_jeux_donnees": 25,
    "date_creation": "2024-01-01T00:00:00Z",
    "date_modification": "2024-01-15T00:00:00Z"
  },
  "categories": "Transport; Tourisme",
  "etiquettes": "HackQC20; Aménagement",
  "niveau_acces": "Ouvert",
  "url_originale": "https://...",
  "ressources": [
    {
      "id": 1,
      "nom": "donnees.csv",
      "jeu_donnees": 1,
      "jeu_donnees_titre": "Données ouvertes",
      "jeu_donnees_organisation": "Ville de Québec",
      "format_fichier": "CSV",
      "type_ressource": "Données",
      "url": "https://...",
      "taille": 1024000,
      "description": "Fichier CSV contenant...",
      "methode_collecte": "...",
      "contexte_collecte": "...",
      "attributs": "objectid (integer) : type (char)",
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z"
    }
  ],
  "date_creation": "2024-01-01T00:00:00Z",
  "date_modification": "2024-01-15T00:00:00Z",
  "date_metadata_creation": "2024-01-01T00:00:00Z",
  "date_metadata_modification": "2024-01-15T00:00:00Z"
}
```

---

#### GET /api/jeux-donnees/:id/ressources/
**Description** : Récupérer les ressources d'un jeu de données

**Réponse (200)** :
```json
[
  {
    "id": 1,
    "nom": "donnees.csv",
    "jeu_donnees": 1,
    "jeu_donnees_titre": "Données ouvertes",
    "jeu_donnees_organisation": "Ville de Québec",
    "format_fichier": "CSV",
    "type_ressource": "Données",
    "url": "https://...",
    "taille": 1024000,
    "description": "Fichier CSV contenant...",
    "methode_collecte": "...",
    "contexte_collecte": "...",
    "attributs": "objectid (integer) : type (char)",
    "date_creation": "2024-01-01T00:00:00Z",
    "date_modification": "2024-01-15T00:00:00Z"
  }
]
```

---

### Ressources

#### GET /api/ressources/
**Description** : Récupérer la liste des ressources

**Paramètres de requête** :
- `search` : Recherche dans `nom`, `description`
- `ordering` : Tri (`nom`, `date_creation`, `taille`)
- `page` : Numéro de page
- `page_size` : Taille de la page

**Réponse (200)** :
```json
{
  "count": 500,
  "next": "http://localhost:8000/api/ressources/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nom": "donnees.csv",
      "jeu_donnees": 1,
      "jeu_donnees_titre": "Données ouvertes",
      "jeu_donnees_organisation": "Ville de Québec",
      "format_fichier": "CSV",
      "type_ressource": "Données",
      "url": "https://...",
      "taille": 1024000,
      "description": "Fichier CSV contenant...",
      "methode_collecte": "...",
      "contexte_collecte": "...",
      "attributs": "objectid (integer) : type (char)",
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z"
    }
  ]
}
```

---

#### GET /api/ressources/par_format/
**Description** : Récupérer les ressources groupées par format

**Réponse (200)** :
```json
{
  "CSV": [
    {
      "id": 1,
      "nom": "donnees.csv",
      "jeu_donnees": 1,
      "jeu_donnees_titre": "Données ouvertes",
      "jeu_donnees_organisation": "Ville de Québec",
      "format_fichier": "CSV",
      "type_ressource": "Données",
      "url": "https://...",
      "taille": 1024000,
      "description": "...",
      "date_creation": "2024-01-01T00:00:00Z",
      "date_modification": "2024-01-15T00:00:00Z"
    }
  ],
  "GeoJSON": [
    {
      "id": 2,
      "nom": "carte.geojson",
      "format_fichier": "GeoJSON",
      ...
    }
  ]
}
```

---

#### GET /api/ressources/statistiques/
**Description** : Récupérer les statistiques des ressources

**Réponse (200)** :
```json
{
  "total_ressources": 500,
  "formats": {
    "CSV": 200,
    "GeoJSON": 150,
    "SHP": 100,
    "JSON": 50
  },
  "types": {
    "Données": 400,
    "Documentation": 80,
    "Carte interactive": 20
  },
  "taille_totale": 1073741824
}
```

---

## 🔍 GraphQL

### Endpoint
`POST http://localhost:8000/graphql/`

**Interface GraphiQL** : `http://localhost:8000/graphql/` (interface interactive)

**Headers** :
```
Content-Type: application/json
```

---

### Queries

#### allOrganisations
**Description** : Récupérer toutes les organisations

**Requête** :
```graphql
query {
  allOrganisations {
    id
    nom
    nomComplet
    typeOrganisation
    description
    url
    nombreJeuxDonnees
    dateCreation
    dateModification
  }
}
```

---

#### organisation
**Description** : Récupérer une organisation par ID

**Requête** :
```graphql
query {
  organisation(id: 1) {
    id
    nom
    nomComplet
    typeOrganisation
    description
    url
    nombreJeuxDonnees
    dateCreation
    dateModification
  }
}
```

---

#### allCategories
**Description** : Récupérer toutes les catégories

**Requête** :
```graphql
query {
  allCategories {
    id
    nom
    description
    nombreJeuxDonnees
  }
}
```

---

#### allJeuxDonnees
**Description** : Récupérer tous les jeux de données

**Requête** :
```graphql
query {
  allJeuxDonnees {
    id
    titre
    description
    organisation {
      id
      nom
      typeOrganisation
    }
    categories
    etiquettes
    niveauAcces
    urlOriginale
    dateCreation
    dateModification
    dateMetadataCreation
    dateMetadataModification
  }
}
```

---

#### jeuDonnees
**Description** : Récupérer un jeu de données par ID

**Requête** :
```graphql
query {
  jeuDonnees(id: 1) {
    id
    titre
    description
    organisation {
      id
      nom
      typeOrganisation
    }
    categories
    etiquettes
    niveauAcces
    urlOriginale
    dateCreation
    dateModification
    dateMetadataCreation
    dateMetadataModification
  }
}
```

---

#### allRessources
**Description** : Récupérer toutes les ressources

**Requête** :
```graphql
query {
  allRessources {
    id
    nom
    jeuDonnees {
      id
      titre
      organisation {
        nom
      }
    }
    formatFichier
    typeRessource
    url
    taille
    description
    dateCreation
    dateModification
  }
}
```

---

#### ressource
**Description** : Récupérer une ressource par ID

**Requête** :
```graphql
query {
  ressource(id: 1) {
    id
    nom
    jeuDonnees {
      id
      titre
      organisation {
        nom
      }
    }
    formatFichier
    typeRessource
    url
    taille
    description
    dateCreation
    dateModification
  }
}
```

---

#### Statistiques
**Description** : Récupérer les statistiques

**Requête** :
```graphql
query {
  statsOrganisations
  statsJeuxDonnees
  statsRessources
}
```

**Réponse** :
```json
{
  "data": {
    "statsOrganisations": 10,
    "statsJeuxDonnees": 100,
    "statsRessources": 500
  }
}
```

---

### Mutations

#### createOrganisation
**Description** : Créer une nouvelle organisation

**Requête** :
```graphql
mutation {
  createOrganisation(
    nom: "Nouvelle Organisation"
    typeOrganisation: "Ville"
    description: "Description"
    url: "https://example.com"
  ) {
    organisation {
      id
      nom
      typeOrganisation
    }
    success
    message
  }
}
```

---

#### updateOrganisation
**Description** : Modifier une organisation

**Requête** :
```graphql
mutation {
  updateOrganisation(
    id: 1
    nom: "Nom modifié"
    description: "Nouvelle description"
  ) {
    organisation {
      id
      nom
      description
    }
    success
    message
  }
}
```

---

#### deleteOrganisation
**Description** : Supprimer une organisation

**Requête** :
```graphql
mutation {
  deleteOrganisation(id: 1) {
    success
    message
  }
}
```

---

## 📝 Types de Données TypeScript

### Organisation
```typescript
interface Organisation {
  id: number;
  nom: string;
  nom_complet?: string;
  type_organisation: string;  // "Ville", "Ministère", "Agence"
  description?: string;
  url?: string;
  nombre_jeux_donnees: number;
  date_creation: string;  // ISO date
  date_modification: string;  // ISO date
}
```

### Categorie
```typescript
interface Categorie {
  id: number;
  nom: string;
  description?: string;
  nombre_jeux_donnees: number;
}
```

### JeuDonnees
```typescript
interface JeuDonnees {
  id: number;
  titre: string;
  description: string;
  organisation: number | Organisation;  // ID ou objet complet
  organisation_nom?: string;  // Dans la liste
  organisation_type?: string;  // Dans la liste
  categories: string;  // "Transport; Tourisme" (séparées par ;)
  etiquettes?: string;  // "HackQC20; Aménagement" (séparées par ;)
  niveau_acces: string;  // "Ouvert", "Privé"
  url_originale?: string;
  ressources?: Ressource[];  // Dans la vue détaillée
  date_creation: string;  // ISO date
  date_modification: string;  // ISO date
  date_metadata_creation?: string;  // ISO date
  date_metadata_modification?: string;  // ISO date
}
```

### Ressource
```typescript
interface Ressource {
  id: number;
  nom: string;
  jeu_donnees: number | JeuDonnees;  // ID ou objet complet
  jeu_donnees_titre?: string;  // Dans la liste
  jeu_donnees_organisation?: string;  // Dans la liste
  format_fichier: string;  // "CSV", "GeoJSON", "SHP", "JSON", etc.
  type_ressource: string;  // "Données", "Documentation", "Carte interactive"
  url: string;
  taille?: number;  // en bytes
  description?: string;
  methode_collecte?: string;
  contexte_collecte?: string;
  attributs?: string;  // "objectid (integer) : type (char)"
  date_creation: string;  // ISO date
  date_modification: string;  // ISO date
}
```

### PaginatedResponse
```typescript
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

---

## 🔍 Filtres et Recherche

### Recherche (paramètre `search`)
- **Organisations** : Recherche dans `nom`, `nom_complet`, `description`
- **Catégories** : Recherche dans `nom`, `description`
- **Jeux de données** : Recherche dans `titre`, `description`, `categories`, `etiquettes`
- **Ressources** : Recherche dans `nom`, `description`

### Tri (paramètre `ordering`)
- Utilisez `?ordering=nom` pour trier par nom
- Utilisez `?ordering=-date_creation` pour trier par date décroissante
- Champs disponibles selon l'endpoint (voir documentation ci-dessus)

---

## ⚠️ Gestion des Erreurs

### Format d'erreur standard (REST)
```json
{
  "detail": "Message d'erreur"
}
```

### Format d'erreur GraphQL
```json
{
  "errors": [
    {
      "message": "Message d'erreur",
      "locations": [{"line": 2, "column": 3}],
      "path": ["jeuDonnees"]
    }
  ],
  "data": null
}
```

### Codes HTTP
- `200` : Succès
- `201` : Créé
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Non trouvé
- `500` : Erreur serveur

---

## 📌 Notes importantes

1. **CORS** : Le back-end doit être configuré pour accepter les requêtes depuis `http://localhost:3000` (front-end React)
2. **Pagination** : Toutes les listes utilisent la pagination Django REST Framework (20 éléments par page)
3. **Dates** : Format ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
4. **GraphQL** : Utiliser GraphiQL pour tester les queries : `http://localhost:8000/graphql/`
5. **Swagger** : Documentation interactive disponible : `http://localhost:8000/swagger/`
6. **Catégories et Étiquettes** : Stockées comme chaînes séparées par `;` (ex: "Transport; Tourisme")
7. **Authentification** : Actuellement, les requêtes GET sont publiques. Pour POST/PUT/DELETE, une authentification sera nécessaire.

---

**Dernière mise à jour** : Basé sur le code du dépôt GitHub (https://github.com/LionelXIV/projet_inforoute)



