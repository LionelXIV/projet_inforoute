# Plan de Développement TP2 - Front-End DataQC

## Vue d'ensemble
**Objectif** : Développer une interface client React/TypeScript pour interagir avec les APIs REST et GraphQL du TP1.

**Durée** : 3 jours avec commits GitHub quotidiens

**Technologies** : React, TypeScript, Redux Toolkit, Axios, ShadCN UI, Recharts, jsPDF

---

## 📅 JOUR 1 : Fondations et Authentification

### 🎯 Objectifs du jour
- Mise en place de l'environnement
- Configuration de la structure du projet
- Authentification et gestion du profil utilisateur
- Première connexion avec les APIs

### ✅ Étape 1.1 : Analyse et documentation des APIs (1h)
**Objectif** : Documenter toutes les requêtes nécessaires

**Tâches** :
- [ ] Analyser les endpoints REST du TP1 (via Swagger ou Postman)
- [ ] Analyser les queries GraphQL du TP1 (via GraphiQL)
- [ ] Créer un document `docs/API_REFERENCE.md` avec :
  - Endpoints REST : méthode, URL, paramètres, corps, réponse
  - Queries GraphQL : schéma, variables, réponse
  - Endpoints d'authentification
  - Structure des données (JeuDonnees, Ressource, User, etc.)

**Livrable** : Documentation complète des APIs

---

### ✅ Étape 1.2 : Mise en place de l'environnement (2h)
**Objectif** : Créer le projet React avec TypeScript

**Tâches** :
- [ ] Créer le projet avec `npx nano-react-app dataqc-frontend --template typescript`
- [ ] Installer les dépendances principales :
  ```bash
  npm install react-router-dom
  npm install @reduxjs/toolkit react-redux
  npm install axios
  npm install graphql graphql-request
  ```
- [ ] Installer ShadCN UI :
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Installer les dépendances UI :
  ```bash
  npm install lucide-react
  npm install recharts
  npm install jspdf html2canvas
  ```
- [ ] Créer la structure de dossiers :
  ```
  src/
    ├── components/       # Composants réutilisables
    │   ├── ui/          # Composants ShadCN UI
    │   ├── layout/      # Navbar, Footer, etc.
    │   └── common/      # Composants communs
    ├── pages/           # Pages de l'application
    ├── services/        # Services API (REST & GraphQL)
    ├── store/           # Redux store
    │   ├── slices/      # Redux slices
    │   └── store.ts     # Configuration du store
    ├── types/           # Types TypeScript
    ├── hooks/           # Custom hooks
    ├── utils/           # Fonctions utilitaires
    └── styles/          # Styles globaux
  ```
- [ ] Configurer TypeScript (`tsconfig.json`)
- [ ] Configurer les variables d'environnement (`.env`)
- [ ] Créer le fichier `.gitignore`

**Livrable** : Projet React/TypeScript configuré et structuré

---

### ✅ Étape 1.3 : Configuration Redux Toolkit (1h)
**Objectif** : Mettre en place Redux Toolkit pour la gestion d'état

**Tâches** :
- [ ] Créer `src/store/store.ts` avec configuration de base
- [ ] Créer le slice d'authentification `src/store/slices/authSlice.ts` :
  - État : user, token, isAuthenticated, loading, error
  - Actions : login, logout, updateProfile
  - Thunks : loginUser, fetchUserProfile, updateUserProfile
- [ ] Créer le slice pour les données `src/store/slices/dataSlice.ts` (structure de base)
- [ ] Configurer le Provider Redux dans `src/main.tsx`

**Livrable** : Redux Toolkit configuré avec slices de base

---

### ✅ Étape 1.4 : Services API - Authentification (2h)
**Objectif** : Créer les services pour communiquer avec les APIs

**Tâches** :
- [ ] Créer `src/services/api.ts` :
  - Configuration Axios avec baseURL
  - Intercepteurs pour ajouter le token
  - Gestion des erreurs
- [ ] Créer `src/services/authService.ts` :
  - `login(username, password)` → POST /api/auth/login/
  - `logout()` → Nettoyer le token
  - `getCurrentUser()` → GET /api/auth/user/
  - `updateProfile(data)` → PUT /api/auth/user/
- [ ] Créer `src/services/graphql.ts` :
  - Configuration GraphQL client
  - Queries d'authentification si nécessaire
- [ ] Créer `src/types/auth.types.ts` pour les types TypeScript

**Livrable** : Services API d'authentification fonctionnels

---

### ✅ Étape 1.5 : Pages d'authentification (2h)
**Objectif** : Créer les pages de connexion et d'inscription

**Tâches** :
- [ ] Créer `src/pages/Login.tsx` :
  - Formulaire avec ShadCN UI (Input, Button, Card)
  - Validation des champs
  - Appel au service d'authentification
  - Redirection après connexion
  - Gestion des erreurs
- [ ] Créer `src/pages/Register.tsx` (si nécessaire)
- [ ] Créer `src/components/layout/Navbar.tsx` :
  - Liens de navigation
  - Affichage conditionnel (connecté/non connecté)
  - Bouton de déconnexion
- [ ] Configurer React Router dans `src/App.tsx` :
  - Route `/login`
  - Route `/register` (si nécessaire)
  - Route protégée pour les pages authentifiées

**Livrable** : Pages d'authentification fonctionnelles

---

### ✅ Étape 1.6 : Page de profil utilisateur (2h)
**Objectif** : Créer la page de gestion du profil

**Tâches** :
- [ ] Créer `src/pages/Profile.tsx` :
  - Affichage des informations utilisateur (nom, email, rôle)
  - Formulaire de modification
  - Mise à jour via Redux
  - Gestion des erreurs et messages de succès
- [ ] Créer un composant `src/components/common/ProtectedRoute.tsx` :
  - Vérification de l'authentification
  - Redirection vers /login si non authentifié
- [ ] Ajouter la route `/profile` dans React Router
- [ ] Tester l'authentification complète

**Livrable** : Gestion du profil utilisateur complète

---

### 📦 Commit GitHub - Jour 1
**Message** : `feat: Setup project structure, authentication and user profile`

**Fichiers à commiter** :
- Structure du projet
- Configuration Redux Toolkit
- Services API (auth)
- Pages Login/Register/Profile
- Composants de base (Navbar, ProtectedRoute)
- Types TypeScript de base

---

## 📅 JOUR 2 : Récupération des données et Interface utilisateur

### 🎯 Objectifs du jour
- Récupérer les données depuis les APIs REST et GraphQL
- Développer les pages principales de l'interface
- Mettre en place les filtres dynamiques

### ✅ Étape 2.1 : Services API - Données (2h)
**Objectif** : Créer les services pour récupérer les jeux de données

**Tâches** :
- [ ] Créer `src/services/dataService.ts` :
  - `getAllJeuxDonnees(params?)` → GET /api/jeux-donnees/
  - `getJeuDonneesById(id)` → GET /api/jeux-donnees/:id/
  - `searchJeuxDonnees(query)` → GET /api/jeux-donnees/?search=...
  - `getRessources(jeuDonneesId)` → GET /api/jeux-donnees/:id/ressources/
- [ ] Créer `src/services/graphqlQueries.ts` :
  - Query `GET_ALL_JEUX_DONNEES`
  - Query `GET_JEU_DONNEES_BY_ID`
  - Query `SEARCH_JEUX_DONNEES`
- [ ] Créer `src/types/data.types.ts` :
  - Interface `JeuDonnees`
  - Interface `Ressource`
  - Types pour les réponses API

**Livrable** : Services API complets pour les données

---

### ✅ Étape 2.2 : Redux Slices - Données (2h)
**Objectif** : Créer les slices Redux pour gérer les données

**Tâches** :
- [ ] Compléter `src/store/slices/dataSlice.ts` :
  - État : items, currentItem, loading, error, filters
  - Actions : setFilters, clearFilters, setCurrentItem
  - Thunks :
    - `fetchJeuxDonnees(params)` → REST
    - `fetchJeuxDonneesGraphQL()` → GraphQL
    - `fetchJeuDonneesById(id)` → REST
    - `fetchJeuDonneesByIdGraphQL(id)` → GraphQL
    - `searchJeuxDonnees(query)` → REST
- [ ] Créer `src/store/slices/statsSlice.ts` (pour les statistiques) :
  - État : stats, loading, error
  - Thunk : `fetchStats()`

**Livrable** : Redux slices complets pour les données

---

### ✅ Étape 2.3 : Page d'accueil (1h)
**Objectif** : Créer une page d'accueil attractive

**Tâches** :
- [ ] Créer `src/pages/Home.tsx` :
  - Section hero avec présentation de DataQC
  - Statistiques rapides (nombre de jeux, catalogues, etc.)
  - Liens vers les principales sections
  - Design avec ShadCN UI
- [ ] Ajouter la route `/` dans React Router

**Livrable** : Page d'accueil complète

---

### ✅ Étape 2.4 : Page liste des jeux de données (3h)
**Objectif** : Afficher la liste des jeux de données avec filtres

**Tâches** :
- [ ] Créer `src/pages/JeuxDonnees.tsx` :
  - Affichage de la liste des jeux de données
  - Composant de carte pour chaque jeu (Card de ShadCN UI)
  - Pagination (si nécessaire)
  - Loading states et gestion d'erreurs
- [ ] Créer `src/components/common/JeuDonneesCard.tsx` :
  - Affichage des informations principales
  - Lien vers la page de détails
- [ ] Créer `src/components/filters/FilterPanel.tsx` :
  - Filtre par catalogue (select)
  - Filtre par mots-clés (input)
  - Filtre par date (date picker)
  - Filtre par organisation (select)
  - Bouton "Appliquer les filtres"
  - Bouton "Réinitialiser"
- [ ] Intégrer les filtres dans la page
- [ ] Connecter avec Redux pour récupérer les données
- [ ] Ajouter la route `/jeux-donnees` dans React Router

**Livrable** : Page liste avec filtres fonctionnels

---

### ✅ Étape 2.5 : Page détails d'un jeu de données (2h)
**Objectif** : Afficher les détails complets d'un jeu de données

**Tâches** :
- [ ] Créer `src/pages/JeuDonneesDetail.tsx` :
  - Affichage des informations complètes
  - Liste des ressources associées
  - Tableau avec les ressources (format, taille, date, lien)
  - Bouton de téléchargement pour chaque ressource
- [ ] Créer `src/components/common/RessourceTable.tsx` :
  - Tableau des ressources avec ShadCN UI Table
  - Colonnes : Titre, Format, Taille, Date, Actions
- [ ] Connecter avec Redux pour récupérer les détails
- [ ] Ajouter la route `/jeux-donnees/:id` dans React Router

**Livrable** : Page de détails complète

---

### ✅ Étape 2.6 : Filtres dynamiques avancés (2h)
**Objectif** : Améliorer les filtres et leur réactivité

**Tâches** :
- [ ] Améliorer `FilterPanel.tsx` :
  - Filtres multiples (plusieurs catalogues, plusieurs mots-clés)
  - Filtres par plage de dates
  - Recherche en temps réel (debounce)
  - Sauvegarde des filtres dans l'URL (query params)
- [ ] Créer `src/hooks/useFilters.ts` :
  - Hook personnalisé pour gérer les filtres
  - Synchronisation avec Redux
  - Synchronisation avec l'URL
- [ ] Ajouter un indicateur du nombre de résultats
- [ ] Ajouter un tri (par date, par titre, etc.)

**Livrable** : Filtres dynamiques avancés et réactifs

---

### 📦 Commit GitHub - Jour 2
**Message** : `feat: Data fetching, main pages and dynamic filters`

**Fichiers à commiter** :
- Services API complets (REST & GraphQL)
- Redux slices pour les données
- Pages : Home, JeuxDonnees, JeuDonneesDetail
- Composants : Cards, Tables, FilterPanel
- Hooks personnalisés
- Types TypeScript complets

---

## 📅 JOUR 3 : Graphiques, Export PDF et Déploiement

### 🎯 Objectifs du jour
- Créer les graphiques interactifs avec Recharts
- Implémenter l'export PDF
- Déployer sur Vercel
- Tests finaux et polish

### ✅ Étape 3.1 : Page de statistiques (3h)
**Objectif** : Créer la page avec graphiques interactifs

**Tâches** :
- [ ] Créer `src/pages/Statistics.tsx` :
  - Section d'introduction
  - Zone pour les graphiques
- [ ] Créer `src/components/charts/ChartContainer.tsx` :
  - Wrapper pour les graphiques Recharts
  - Responsive design
- [ ] Créer au minimum 3 graphiques :
  - **Graphique 1** : Répartition par catalogue (Pie Chart ou Bar Chart)
    - `src/components/charts/CatalogueDistributionChart.tsx`
  - **Graphique 2** : Histogramme des dates de publication (Bar Chart)
    - `src/components/charts/DateDistributionChart.tsx`
  - **Graphique 3** : Évolution temporelle (Line Chart)
    - `src/components/charts/TemporalEvolutionChart.tsx`
- [ ] Connecter les graphiques avec Redux
- [ ] Faire réagir les graphiques aux filtres
- [ ] Ajouter des tooltips et légendes
- [ ] Ajouter la route `/statistics` dans React Router

**Livrable** : Page de statistiques avec 3+ graphiques interactifs

---

### ✅ Étape 3.2 : Export PDF (2h)
**Objectif** : Implémenter l'export PDF avec jsPDF et html2canvas

**Tâches** :
- [ ] Créer `src/utils/pdfExporter.ts` :
  - Fonction `exportToPDF(element, filename)`
  - Utilisation de html2canvas pour capturer
  - Utilisation de jsPDF pour générer le PDF
  - Ajout d'un en-tête avec logo/titre
  - Ajout de la date d'exportation
- [ ] Créer `src/components/common/ExportButton.tsx` :
  - Bouton réutilisable pour l'export
  - Icône Lucide React
  - Loading state pendant l'export
- [ ] Intégrer l'export dans :
  - Page de liste des jeux de données
  - Page de détails
  - Page de statistiques (graphiques)
- [ ] Tester l'export avec différents contenus

**Livrable** : Fonctionnalité d'export PDF complète

---

### ✅ Étape 3.3 : Amélioration de l'interface (2h)
**Objectif** : Polir l'interface et améliorer l'UX

**Tâches** :
- [ ] Améliorer le design avec ShadCN UI :
  - Cohérence des couleurs
  - Espacements uniformes
  - Typographie
- [ ] Ajouter des animations et transitions
- [ ] Améliorer les messages d'erreur et de succès :
  - Toast notifications (ShadCN UI toast)
- [ ] Ajouter un footer
- [ ] Améliorer la responsivité mobile
- [ ] Ajouter un loader global
- [ ] Améliorer l'accessibilité (ARIA labels, etc.)

**Livrable** : Interface polie et professionnelle

---

### ✅ Étape 3.4 : Sécurité et optimisations (1h)
**Objectif** : Appliquer les concepts de sécurité du Cours 13

**Tâches** :
- [ ] Valider toutes les entrées utilisateur
- [ ] Sanitizer les données affichées (protection XSS)
- [ ] Sécuriser le stockage du token (localStorage)
- [ ] Implémenter la gestion d'expiration du token
- [ ] Ajouter des vérifications de permissions
- [ ] Optimiser les requêtes API (éviter les appels inutiles)
- [ ] Ajouter du caching si nécessaire

**Livrable** : Application sécurisée et optimisée

---

### ✅ Étape 3.5 : Configuration pour Vercel (1h)
**Objectif** : Préparer le déploiement sur Vercel

**Tâches** :
- [ ] Créer `vercel.json` (si nécessaire)
- [ ] Configurer les variables d'environnement pour la production
- [ ] Vérifier que le build fonctionne : `npm run build`
- [ ] Tester le build localement : `npm run preview`
- [ ] Créer un compte Vercel (si nécessaire)
- [ ] Connecter le repository GitHub à Vercel
- [ ] Configurer les variables d'environnement sur Vercel
- [ ] Déployer l'application
- [ ] Tester l'application déployée
- [ ] Vérifier que les routes fonctionnent
- [ ] Vérifier que les appels API fonctionnent

**Livrable** : Application déployée sur Vercel et fonctionnelle

---

### ✅ Étape 3.6 : Tests finaux et documentation (1h)
**Objectif** : Vérifier que tout fonctionne et documenter

**Tâches** :
- [ ] Tester toutes les fonctionnalités :
  - Authentification (login, logout, profil)
  - Récupération des données (REST et GraphQL)
  - Filtres dynamiques
  - Graphiques interactifs
  - Export PDF
  - Navigation entre les pages
- [ ] Corriger les bugs trouvés
- [ ] Créer un `README.md` complet :
  - Description du projet
  - Instructions d'installation
  - Structure du projet
  - Variables d'environnement
  - Scripts disponibles
  - Lien vers l'application déployée
- [ ] Documenter les composants principaux (commentaires)
- [ ] Vérifier la qualité du code (formatage, linting)

**Livrable** : Application testée et documentée

---

### 📦 Commit GitHub - Jour 3
**Message** : `feat: Charts, PDF export, deployment and final polish`

**Fichiers à commiter** :
- Composants de graphiques (Recharts)
- Utilitaires d'export PDF
- Améliorations UI/UX
- Configuration Vercel
- Documentation (README)
- Corrections de bugs

---

## 📋 Checklist finale avant remise

### Code source
- [ ] Tous les fichiers source dans le repository
- [ ] `.gitignore` correctement configuré
- [ ] `README.md` complet
- [ ] Code commenté et propre
- [ ] Types TypeScript complets
- [ ] Pas de console.log ou code de debug

### Fonctionnalités
- [ ] Authentification fonctionnelle
- [ ] Gestion du profil utilisateur
- [ ] Récupération des données (REST)
- [ ] Récupération des données (GraphQL)
- [ ] Liste des jeux de données
- [ ] Page de détails
- [ ] Filtres dynamiques fonctionnels
- [ ] Minimum 3 graphiques interactifs
- [ ] Export PDF fonctionnel
- [ ] Navigation fluide
- [ ] Responsive design

### Déploiement
- [ ] Application déployée sur Vercel
- [ ] Lien public fonctionnel
- [ ] Variables d'environnement configurées
- [ ] Routes fonctionnelles en production
- [ ] APIs accessibles depuis la production

### Documentation
- [ ] Documentation des APIs (`docs/API_REFERENCE.md`)
- [ ] README.md complet
- [ ] Commentaires dans le code

---

## 📊 Répartition des points (30%)

| Partie | Points | Jour | Statut |
|--------|--------|------|--------|
| Définition des requêtes et analyse des API | 1,0% | Jour 1 | ✅ |
| Mise en place de l'environnement front-end | 1,0% | Jour 1 | ✅ |
| Authentification et gestion du profil utilisateur | 4,0% | Jour 1 | ✅ |
| Récupération et gestion des données | 4,0% | Jour 2 | ✅ |
| Développement de l'interface utilisateur | 4,0% | Jour 2 | ✅ |
| Mise en place des filtres dynamiques | 4,0% | Jour 2 | ✅ |
| Visualisation des données – graphiques | 4,0% | Jour 3 | ✅ |
| Fonctionnalité d'exportation PDF | 2,0% | Jour 3 | ✅ |
| Déploiement de l'application sur Vercel | 2,0% | Jour 3 | ✅ |
| Qualité du code source | 1,0% | Tous | ✅ |
| Rapport rédigé en Français | 2,0% | Après | 📝 |
| Démonstration vidéo de l'application | 1,0% | Après | 🎥 |

---

## 🚀 Commandes utiles

### Installation initiale
```bash
npx nano-react-app dataqc-frontend --template typescript
cd dataqc-frontend
npm install react-router-dom @reduxjs/toolkit react-redux axios graphql graphql-request
npx shadcn-ui@latest init
npm install lucide-react recharts jspdf html2canvas
```

### Développement
```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build pour la production
npm run preview      # Prévisualiser le build
```

### Git
```bash
git init
git add .
git commit -m "feat: [description]"
git remote add origin [url-github]
git push -u origin main
```

---

## 📝 Notes importantes

1. **Respecter l'énoncé** : Tous les éléments demandés doivent être implémentés
2. **TypeScript** : Utiliser TypeScript partout, pas de `any` sauf si nécessaire
3. **ShadCN UI** : Utiliser les composants ShadCN UI pour la cohérence
4. **Redux Toolkit** : Utiliser Redux Toolkit pour toute la gestion d'état
5. **Graphiques** : Minimum 3 graphiques avec Recharts, réactifs aux filtres
6. **Export PDF** : Utiliser jsPDF + html2canvas pour tous les exports
7. **Sécurité** : Appliquer les concepts du Cours 13
8. **Commits** : Faire des commits réguliers et descriptifs
9. **Tests** : Tester chaque fonctionnalité avant de passer à la suivante
10. **Documentation** : Documenter le code et créer un README complet

---

**Bon développement ! 🚀**

