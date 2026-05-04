# TunisiaRent 🏠🇹🇳
**Plateforme de location en Tunisie** pour la **courte durée**, la **longue durée** et les **étudiants**, dans **toutes les villes/gouvernorats**.

TunisiaRent est une marketplace moderne qui permet de **rechercher** des logements par région/catégorie/type et de **publier** des annonces de location. Le projet a été réalisé comme **projet portfolio** avec une interface soignée, authentification et sécurité (Supabase + RLS).

---

## ✨ Fonctionnalités

### 🔎 Recherche & navigation
- Parcourir les annonces dans **tous les gouvernorats** de Tunisie
- Filtres par **type de location** :
  - **Long terme** (mois/années)
  - **Court terme** (vacances, séjours courts)
  - **Étudiants** (logements proches des universités)
- Filtres par **catégorie** : Appartement, Maison, Villa, Chambre, Studio
- Page détail d’annonce avec galerie + caractéristiques

### 📝 Publication d’annonces
- Utilisateurs connectés :
  - Création d’annonces (titre, description, prix, adresse…)
  - Sélection de la catégorie et de la région
  - Nombre de chambres / salles de bain, superficie, meublé
  - Ajout de photos (URLs stockées dans `images[]`)

### 👤 Espace utilisateur (Dashboard)
- Gestion des annonces personnelles
- Statistiques rapides (total, actives, long terme, court terme)

### 🔐 Authentification & confidentialité
- Inscription / connexion (Supabase Auth)
- Routes protégées (ex: `/dashboard`, `/ajouter`)
- **Téléphone & email masqués par défaut**
  - **Connexion requise** pour afficher les informations de contact

---

## 🧰 Stack technique
- **Next.js** (App Router)
- **Tailwind CSS**
- **Supabase** (Auth, Postgres, Storage)
- **lucide-react** (icônes)

---

## 📌 Routes principales
- `/` — Accueil (hero + recherche + catégories + régions)
- `/annonces` — Liste / recherche d’annonces
- `/annonces/[id]` — Détail d’une annonce
- `/ajouter` — Publier une annonce *(protégé)*
- `/dashboard` — Espace utilisateur *(protégé)*
- `/connexion` — Connexion
- `/inscription` — Inscription

---

## 🚀 Installation & démarrage (local)

### 1) Installer les dépendances
```bash
npm install