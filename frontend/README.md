# Lafaaz Frontend - React + Vite + Tailwind

Application React moderne pour la plateforme Lafaaz Fondation.

## Stack technique

- **React 18** : UI framework
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Styling utility-first
- **React Router** : Routing
- **React Query** : Data fetching & cache
- **Zustand** : State management
- **Axios** : HTTP client

## Installation

```bash
npm install
```

## Développement

Démarrer le serveur de développement (port 3000) :

```bash
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── components/       # Composants réutilisables
│   ├── layout/      # Header, Footer
│   └── ui/          # Button, Input, etc.
├── pages/           # Pages de l'application
├── routes/          # Configuration des routes
├── services/        # API client (axios)
├── store/           # State management (zustand)
├── hooks/           # Custom hooks
└── styles/          # CSS global (Tailwind)
```

## API Backend

L'API Laravel est accessible sur `http://127.0.0.1:8000/api`

Endpoints disponibles :
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /user` - Profil utilisateur (protégé)
- `POST /logout` - Déconnexion (protégé)
- `PUT /user/profile` - Mise à jour profil (protégé)
- `PUT /user/password` - Changement mot de passe (protégé)

## Authentification

L'authentification utilise Laravel Sanctum avec tokens Bearer stockés dans localStorage.

## Variables d'environnement

Copier `.env.example` vers `.env` et ajuster :

```env
VITE_API_URL=http://127.0.0.1:8000/api
```
# lafaaz
