# Smart Juris ⚖️

[🇬🇧 English Version](#-english-version) | [🇫🇷 Version Française](#-version-française)

---

<a name="-english-version"></a>
## 🇬🇧 English Version

**Smart Juris** is a next-generation intelligent legal assistance platform designed for lawyers, legal experts, and legal professionals. It harnesses the power of artificial intelligence (Google Gemini) to automate legal research, document drafting, and case management.

### 🚀 Key Features

The application covers the entire range of needs for a modern law firm:

1.  **Authentication & Roles**: Secure access management (Administrator, Lawyer, Assistant, Student).
2.  **Semantic Legal Search (AI)**: Natural language search engine to find relevant laws, articles, and jurisprudence.
3.  **Virtual Assistant Chat**: Interactive discussion with a specialized AI for case analysis and strategic advice.
4.  **Client Case Management**: Complete tracking of cases (status, dates, notes) with automatic integration of AI responses.
5.  **Legal Library**: Centralized document database (Codes, Laws, Jurisprudence).
6.  **Document Generator**: Automatic creation of custom contracts and letters via AI.
7.  **Dashboard**: Overview of activity with statistics and charts.
8.  **Subscription Management**: Interface presenting plans (Free, Premium, Enterprise).
9.  **Internal Messaging**: Collaborative communication tool for the firm.
10. **Activity Log**: Complete traceability of actions for the administrator.
11. **OHADA Coverage**: Specific support for law in the OHADA space (17 African countries).

### 🛠 Technologies Used

This project is a Single Page Application (SPA) built with modern technologies:

*   **Frontend**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom "Light Purple" Theme)
*   **Artificial Intelligence**: [Google Gemini API](https://ai.google.dev/) (via `@google/genai`)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)

### 📂 Project Structure

```text
/
├── components/
│   ├── Auth.tsx           # Login/Signup screens
│   ├── Landing.tsx        # Showcase Landing Page
│   ├── Layout.tsx         # Sidebar, Header and global structure
│   ├── Management.tsx     # Dashboard, Case Mgmt, Library, Logs
│   └── SmartFeatures.tsx  # AI Features (Search, Chat, Generator)
├── services/
│   └── geminiService.ts   # Google Gemini API Integration
├── store/
│   └── mockData.ts        # Demo data
├── types.ts               # Global TypeScript definitions
├── App.tsx                # Root component and logic routing
├── index.tsx              # React Entry Point
├── index.html             # Tailwind config and imports
└── metadata.json          # Application metadata
```

### ⚙️ Configuration & Installation

#### Prerequisites

*   A valid Google Gemini API Key.

#### Launch

The project is designed to run without a complex build step in an environment supporting ES modules via CDN (like StackBlitz or AI Studio).

1.  **API Key**: The application expects the `API_KEY` environment variable to be defined for Gemini calls.
2.  **Dependencies**: All dependencies (React, Tailwind, GenAI SDK) are loaded dynamically via `importmap` in `index.html`.

### 🎨 Design System

The interface uses a custom color palette defined in `index.html`:
*   **Primary**: Shades of Purple (`purple-50` to `purple-950`) for a modern and premium look.
*   **Typography**: System sans-serif font optimized for readability.
*   **Components**: Light "Glassmorphism" design, soft shadows, and rounded corners (`rounded-xl`).

### 🛡 Security & Data

*   Default displayed data comes from `store/mockData.ts` for demonstration.
*   Authentication is simulated (any email works).
*   In production, this frontend must be connected to a secure backend.

---

<a name="-version-française"></a>
## 🇫🇷 Version Française

**Smart Juris** est une plateforme d'assistance juridique intelligente de nouvelle génération, conçue pour les avocats, juristes et professionnels du droit. Elle exploite la puissance de l'intelligence artificielle (Google Gemini) pour automatiser la recherche juridique, la rédaction d'actes et la gestion de dossiers.

### 🚀 Fonctionnalités Clés

L'application couvre l'ensemble des besoins d'un cabinet juridique moderne :

1.  **Authentification & Rôles** : Gestion sécurisée des accès (Administrateur, Avocat, Assistant, Étudiant).
2.  **Recherche Juridique Sémantique (IA)** : Moteur de recherche comprenant le langage naturel pour trouver lois, articles et jurisprudences pertinents.
3.  **Chat Assistant Virtuel** : Discussion interactive avec une IA spécialisée pour l'analyse de cas et le conseil stratégique.
4.  **Gestion de Dossiers Clients** : Suivi complet des affaires (statut, dates, notes) avec intégration automatique des réponses de l'IA.
5.  **Bibliothèque Juridique** : Base documentaire centralisée (Codes, Lois, Jurisprudence).
6.  **Générateur de Documents** : Création automatique de contrats et courriers sur mesure via l'IA.
7.  **Tableau de Bord** : Vue d'ensemble de l'activité avec statistiques et graphiques.
8.  **Gestion des Abonnements** : Interface de présentation des plans (Gratuit, Premium, Entreprise).
9.  **Messagerie Interne** : Outil de communication collaboratif pour le cabinet.
10. **Journal d'Activité** : Traçabilité complète des actions pour l'administrateur.
11. **Couverture OHADA** : Prise en charge spécifique du droit dans l'espace OHADA (17 pays africains).

### 🛠 Technologies Utilisées

Ce projet est une Single Page Application (SPA) construite avec des technologies modernes :

*   **Frontend** : [React 19](https://react.dev/)
*   **Langage** : [TypeScript](https://www.typescriptlang.org/)
*   **Styling** : [Tailwind CSS](https://tailwindcss.com/) (Thème personnalisé "Light Purple")
*   **Intelligence Artificielle** : [Google Gemini API](https://ai.google.dev/) (via `@google/genai`)
*   **Icônes** : [Lucide React](https://lucide.dev/)
*   **Graphiques** : [Recharts](https://recharts.org/)

### 📂 Structure du Projet

```text
/
├── components/
│   ├── Auth.tsx           # Écrans de connexion/inscription
│   ├── Landing.tsx        # Page d'accueil vitrine (Landing Page)
│   ├── Layout.tsx         # Sidebar, Header et structure globale
│   ├── Management.tsx     # Dashboard, Gestion Dossiers, Biblio, Logs
│   └── SmartFeatures.tsx  # Fonctionnalités IA (Recherche, Chat, Générateur)
├── services/
│   └── geminiService.ts   # Intégration API Google Gemini
├── store/
│   └── mockData.ts        # Données de démonstration
├── types.ts               # Définitions TypeScript globales
├── App.tsx                # Composant racine et routage logique
├── index.tsx              # Point d'entrée React
├── index.html             # Configuration Tailwind et imports
└── metadata.json          # Métadonnées de l'application
```

### ⚙️ Configuration & Installation

#### Pré-requis

*   Une clé API Google Gemini valide.

#### Lancement

Le projet est conçu pour fonctionner sans étape de build complexe dans un environnement supportant les modules ES via CDN (comme StackBlitz ou AI Studio).

1.  **Clé API** : L'application attend que la variable d'environnement `API_KEY` soit définie pour les appels à Gemini.
2.  **Dépendances** : Toutes les dépendances (React, Tailwind, SDK GenAI) sont chargées dynamiquement via `importmap` dans `index.html`.

### 🎨 Design System

L'interface utilise une palette de couleurs personnalisée définie dans `index.html` :
*   **Primaire** : Nuances de Violet (`purple-50` à `purple-950`) pour un aspect moderne et premium.
*   **Typographie** : Police système sans-serif optimisée pour la lisibilité.
*   **Composants** : Design "Glassmorphism" léger, ombres douces et coins arrondis (`rounded-xl`).

### 🛡 Sécurité & Données

*   Les données affichées par défaut proviennent de `store/mockData.ts` pour la démonstration.
*   L'authentification est simulée (tout email fonctionne).
*   En production, ce frontend doit être connecté à un backend sécurisé.

---
© 2024 Smart Juris LegalTech
