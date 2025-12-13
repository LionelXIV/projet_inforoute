# DataQC Front-End

Interface client React/TypeScript pour la plateforme DataQC de visualisation des données ouvertes du Québec.

## Technologies

- **React 19** avec **TypeScript**
- **Vite** - Build tool et dev server
- **Redux Toolkit** - Gestion d'état
- **React Router** - Navigation
- **Axios** - Requêtes HTTP (REST API)
- **GraphQL Request** - Requêtes GraphQL
- **Tailwind CSS** - Styling
- **ShadCN UI** - Composants UI
- **Lucide React** - Icônes
- **Recharts** - Graphiques
- **jsPDF + html2canvas** - Export PDF

## Installation

```bash
npm install
```

## Configuration

Copiez `.env.example` vers `.env` et configurez les URLs de l'API :

```bash
cp .env.example .env
```

## Développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000` (ou le port configuré par Vite).

## Build

```bash
npm run build
```

## Structure du projet

```
src/
├── components/       # Composants réutilisables
│   └── layout/       # Composants de mise en page (Navbar, etc.)
├── pages/            # Pages de l'application
├── services/         # Services API (REST et GraphQL)
├── store/            # Redux store et slices
│   └── slices/       # Redux slices
├── types/            # Types TypeScript
├── utils/            # Utilitaires
└── hooks/            # Custom hooks React
```

## Fonctionnalités implémentées (Jour 1)

- ✅ Configuration de l'environnement React + TypeScript
- ✅ Configuration Redux Toolkit
- ✅ Services API (authentification)
- ✅ Page de connexion
- ✅ Page de profil utilisateur
- ✅ Navigation et routes protégées
- ✅ Documentation des APIs

## Prochaines étapes (Jour 2)

- Récupération des données (REST et GraphQL)
- Liste des jeux de données
- Page de détails
- Filtres dynamiques
