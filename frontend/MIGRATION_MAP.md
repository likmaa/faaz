# 📊 Cartographie complète de l'ancien projet Lafaaz

## 🗂️ Structure des pages (Blade → React)

### **Pages publiques (Fondation)**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/` | `fondation/welcome.blade.php` | `Home.jsx` | Page d'accueil (hero, causes, projets) | ✅ Créé |
| `/projets` | `fondation/projet.blade.php` | `Projects.jsx` | Liste des projets avec pagination | ✅ Créé |
| `/details/{id}` | `fondation/details.blade.php` | `ProjectDetail.jsx` | Détail d'un projet | ⏳ À créer |
| `/apropos` | `fondation/apropos.blade.php` | `About.jsx` | À propos de la fondation | ⏳ À créer |
| `/realisation` | `fondation/realisation.blade.php` | `Achievements.jsx` | Réalisations accomplies | ⏳ À créer |

### **Pages actualités**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/actualite` | `actualite/actu.blade.php` | `News.jsx` | Liste des actualités | ✅ Créé |
| `/detail-de-l'actualite/{id}` | `actualite/dactu.blade.php` | `NewsDetail.jsx` | Détail actualité avec prev/next | ⏳ À créer |
| `/actualite/2023` | `actualite/2023.blade.php` | `NewsArchive.jsx` | Archives 2023 | ⏳ À créer |

### **Pages recrutement**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/offres-d'emplois` | `fondation/emplois.blade.php` | `JobOffers.jsx` | Offres d'emploi | ⏳ À créer |
| `/detail-de-l'offre-d'emploi/{id}` | `fondation/demplois.blade.php` | `JobDetail.jsx` | Détail offre emploi | ⏳ À créer |
| `/benevolats` | `fondation/benevolat.blade.php` | `VolunteerOffers.jsx` | Offres bénévolat | ⏳ À créer |
| `/detail-sur-le-benevolat/{id}` | `fondation/dbenevolat.blade.php` | `VolunteerDetail.jsx` | Détail bénévolat | ⏳ À créer |
| `/offres-de-stages` | `fondation/stage.blade.php` | `InternshipOffers.jsx` | Offres de stage | ⏳ À créer |
| `/detail-sur-l'offre-de-stage/{id}` | `fondation/dstage.blade.php` | `InternshipDetail.jsx` | Détail stage | ⏳ À créer |
| `/nous-rejoindre` | `fondation/travail-avec-nous.blade.php` | `JoinUs.jsx` | Page "Travailler avec nous" | ⏳ À créer |

### **Pages dons**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/don/pour-projet` | `don/pr-projet.blade.php` | `DonateProject.jsx` | Don pour un projet spécifique | ⏳ À créer |
| `/don/soutient` | `don/soutient.blade.php` | `Donate.jsx` | Don de soutien général | ✅ Créé (WIP) |

### **Pages programmes**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/programme/assistance-troisieme-age` | `programme/assistance-troisieme-age.blade.php` | `ProgramSeniors.jsx` | Programme 3e âge | ⏳ À créer |
| `/programme/assistance-aux-orphelins` | `programme/assistant-aux-orphelins.blade.php` | `ProgramOrphans.jsx` | Programme orphelins | ⏳ À créer |
| `/programme/coaching-couple` | `programme/coaching-couple.blade.php` | `ProgramCouples.jsx` | Coaching couple | ⏳ À créer |
| `/programme/education-jeunesse` | `programme/education-jeunesse.blade.php` | `ProgramYouth.jsx` | Éducation jeunesse | ⏳ À créer |

### **Pages membres**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/membre/partenaire` | `membre/partenaire.blade.php` | `Partners.jsx` | Liste des partenaires | ⏳ À créer |
| `/membre/adhesion` | `membre/rejoindre.blade.php` | `Membership.jsx` | Formulaire d'adhésion | ⏳ À créer |

### **Page FAQ**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/Faq` | `faq.blade.php` | `FAQ.jsx` | Questions fréquentes | ⏳ À créer |

### **Authentification**

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/login` | `auth/login.blade.php` | `Login.jsx` | Connexion | ✅ Créé |
| `/register` | `auth/register.blade.php` | `Register.jsx` | Inscription | ✅ Créé |

### **Dashboard (Zone connectée)**

#### Dashboard commun (tous rôles)

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/tableau-de-bord` | `dashboard/commun/home.blade.php` | `Dashboard/Home.jsx` | Tableau de bord principal | ⏳ À créer |
| `/profil` | `dashboard/commun/profil.blade.php` | `Dashboard/Profile.jsx` | Profil utilisateur | ⏳ À créer |
| `/majprofil/{maj}` | `dashboard/commun/majprofil.blade.php` | `Dashboard/EditProfile.jsx` | Modifier profil | ⏳ À créer |
| `/parametre-du-compte` | `dashboard/commun/settings.blade.php` | `Dashboard/Settings.jsx` | Paramètres compte | ⏳ À créer |

#### Dashboard ADMIN

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/gestion-des-projets-de-dons` | `dashboard/admin/projets.blade.php` | `Dashboard/Admin/Projects.jsx` | Gestion projets | ⏳ À créer |
| `/gestion-des-actualites` | `dashboard/admin/actu.blade.php` | `Dashboard/Admin/News.jsx` | Gestion actualités | ⏳ À créer |
| `/gestion-des-recrutements` | - | `Dashboard/Admin/Recruitment.jsx` | Gestion recrutement | ⏳ À créer |
| `/gestion-des-adhesion-a-la-fondation` | - | `Dashboard/Admin/Memberships.jsx` | Gestion adhésions | ⏳ À créer |
| `/gestion-des-contributeurs` | - | `Dashboard/Admin/Contributors.jsx` | Gestion contributeurs | ⏳ À créer |
| `/presentation-de-la-fondation` | - | `Dashboard/Admin/Presentation.jsx` | Gestion présentation | ⏳ À créer |

#### Dashboard CONTRIBUTEUR

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/tableau-de-bord/articles` | - | `Dashboard/Contributor/Articles.jsx` | Mes articles | ⏳ À créer |
| `/tableau-de-bord/gestion-des-offres` | - | `Dashboard/Contributor/Offers.jsx` | Gestion offres | ⏳ À créer |

#### Dashboard USER

| Route | Vue Blade | Page React | Description | Statut |
|-------|-----------|------------|-------------|--------|
| `/mes-demandes` | - | `Dashboard/User/Requests.jsx` | Mes demandes | ⏳ À créer |
| `/gestion-de-mes-documents/{id}` | - | `Dashboard/User/Documents.jsx` | Mes documents | ⏳ À créer |

---

## 🎨 Composants UI identifiés

### Layouts
- ✅ `Header.jsx` - Navigation principale
- ✅ `Footer.jsx` - Pied de page
- ⏳ `DashboardLayout.jsx` - Layout pour tableau de bord
- ⏳ `Sidebar.jsx` - Menu latéral dashboard

### Composants réutilisables
- ✅ `Button.jsx` - Boutons
- ⏳ `Card.jsx` - Cartes de contenu
- ⏳ `ProjectCard.jsx` - Carte projet
- ⏳ `NewsCard.jsx` - Carte actualité
- ⏳ `JobCard.jsx` - Carte offre d'emploi
- ⏳ `Carousel.jsx` - Carrousel d'images
- ⏳ `Modal.jsx` - Modales
- ⏳ `Breadcrumb.jsx` - Fil d'ariane
- ⏳ `Pagination.jsx` - Pagination
- ⏳ `Tabs.jsx` - Onglets
- ⏳ `Form/Input.jsx` - Champs de formulaire
- ⏳ `Form/Select.jsx` - Sélection
- ⏳ `Form/Textarea.jsx` - Zone de texte
- ⏳ `Loading.jsx` - Indicateurs de chargement

### Sections spécifiques
- ⏳ `Hero.jsx` - Section hero (accueil)
- ⏳ `CausesSection.jsx` - Section "Nos causes"
- ⏳ `StatsSection.jsx` - Statistiques (projets, dons, etc.)
- ⏳ `TestimonialsSection.jsx` - Témoignages
- ⏳ `PartnersSection.jsx` - Partenaires
- ⏳ `CTASection.jsx` - Call-to-action

---

## 🔗 Routes API à créer (Backend)

### Projets
- `GET /api/projets` - Liste projets
- `GET /api/projets/{id}` - Détail projet
- `POST /api/projets` - Créer projet (admin)
- `PUT /api/projets/{id}` - Modifier projet (admin)
- `DELETE /api/projets/{id}` - Supprimer projet (admin)

### Actualités
- `GET /api/actualites` - Liste actualités
- `GET /api/actualites/{id}` - Détail actualité
- `POST /api/actualites` - Créer actualité (admin/contributeur)
- `PUT /api/actualites/{id}` - Modifier actualité
- `DELETE /api/actualites/{id}` - Supprimer actualité

### Réalisations
- `GET /api/realisations` - Liste réalisations
- `GET /api/realisations/{id}` - Détail réalisation
- `POST /api/realisations` - Créer réalisation (admin)

### Recrutement
- `GET /api/recrutements` - Liste offres
- `GET /api/recrutements/{id}` - Détail offre
- `POST /api/recrutements` - Créer offre (admin)
- `POST /api/recrutements/{id}/apply` - Postuler

### Dons
- `POST /api/dons/projet` - Don pour projet
- `POST /api/dons/soutien` - Don général
- `GET /api/dons` - Liste dons (admin)

### FAQ
- `GET /api/faqs` - Liste FAQ

### Bénévoles
- `GET /api/benevoles` - Liste bénévoles

### Témoignages
- `GET /api/temoignages` - Liste témoignages (Gtdona)

### Dashboard
- `GET /api/dashboard/stats` - Statistiques
- `GET /api/dashboard/demandes` - Mes demandes (user)
- `GET /api/dashboard/documents` - Mes documents (user)

---

## 📦 Modèles de données

| Modèle Laravel | Table DB | Usage | Endpoints API |
|----------------|----------|-------|---------------|
| `Gprojet` | `gprojets` | Projets de dons | `/api/projets` |
| `Gactualite` | `gactualites` | Actualités | `/api/actualites` |
| `Grealisation` | `grealisations` | Réalisations | `/api/realisations` |
| `Grecrutement` | `grecrutements` | Offres (emploi/stage/bénévolat) | `/api/recrutements` |
| `Gdonprojet` | `gdonprojets` | Dons liés à un projet | `/api/dons/projet` |
| `Gdonsout` | `gdonsouts` | Dons de soutien | `/api/dons/soutien` |
| `Gtdona` | `gtdonas` | Témoignages de donateurs | `/api/temoignages` |
| `Gfaq` | `gfaqs` | Questions fréquentes | `/api/faqs` |
| `Gbenevole` | `gbenevoles` | Bénévoles affichés | `/api/benevoles` |
| `Grejoindre` | `grejoindres` | Demandes d'adhésion | `/api/adhesions` |
| `Gfile` | `gfiles` | Fichiers utilisateur | `/api/fichiers` |

---

## 🎯 Plan d'action React

### Phase 1 : Pages publiques essentielles (Priorité haute)
1. ✅ Home.jsx - Enrichir avec sections manquantes
2. ⏳ ProjectDetail.jsx
3. ⏳ About.jsx
4. ⏳ Achievements.jsx
5. ⏳ NewsDetail.jsx
6. ⏳ FAQ.jsx

### Phase 2 : Recrutement
7. ⏳ JobOffers.jsx + JobDetail.jsx
8. ⏳ VolunteerOffers.jsx + VolunteerDetail.jsx
9. ⏳ InternshipOffers.jsx + InternshipDetail.jsx
10. ⏳ JoinUs.jsx

### Phase 3 : Dons & Programmes
11. ⏳ DonateProject.jsx (avec Kkiapay)
12. ⏳ Programmes (4 pages)
13. ⏳ Partners.jsx
14. ⏳ Membership.jsx

### Phase 4 : Dashboard
15. ⏳ Dashboard layout + routing
16. ⏳ Pages communes (profil, settings)
17. ⏳ Pages admin
18. ⏳ Pages contributeur
19. ⏳ Pages user

### Phase 5 : Composants UI
20. ⏳ Tous les composants listés ci-dessus

---

## 🚧 Prochaines actions immédiates

1. **Enrichir Home.jsx** avec sections hero, causes, stats
2. **Créer composants UI de base** (Card, Carousel, etc.)
3. **Implémenter pages détails** (ProjectDetail, NewsDetail)
4. **Commencer l'API REST** côté Laravel pour alimenter le frontend

---

**Total pages à créer : ~45 pages**  
**Total composants UI : ~25 composants**  
**Progression actuelle : 7/45 pages (15%)**
