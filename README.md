# Paradis Services

Plateforme sénégalaise de **location de chambres** (courte ou longue durée) et
de **prestations de services** (ménage, blanchisserie, sécurité, accueil &
conciergerie). Frontend React connecté au backend multi-tenant **ABMCY
Core** — même architecture que le projet frère `HANNIFA` (site de HANI'S),
adaptée pour un usage hôtellerie/coliving plutôt que mode.

## Stack technique

- **React 18** + **Vite 6** + **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme` tokens, pas de config JS séparée)
- **React Router v6** (`HashRouter` — pas besoin de règles de réécriture
  côté serveur sur un hébergement statique type Vercel/Netlify)
- Aucun state manager externe : un contexte React (`StoreContext`) gère le
  panier/sélection en `localStorage`.
- Aucune dépendance backend embarquée : tout passe par `src/services/abmcy.ts`,
  qui appelle l'API ABMCY Core (Go, multi-tenant, RLS Postgres) — voir le
  projet backend `abmcycors` (non modifié ici).

## Configuration

1. Copier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```
2. Renseigner les variables :
   - `VITE_ABMCY_API_URL` — URL de l'API ABMCY (par défaut `https://api.abmcy.com`)
   - `VITE_ABMCY_API_KEY` — clé API du tenant "Paradis Services"
     (`pk_live_...`), fournie depuis le dashboard admin ABMCY à la création
     du tenant. **Vide par défaut** — tant qu'aucun tenant réel n'a été créé
     côté backend, les appels API échoueront proprement (écrans "chargement
     impossible" plutôt qu'un crash).
   - `VITE_ABMCY_TENANT_SLUG` — `paradis-services` par défaut.
3. Ne jamais committer `.env` (déjà exclu par `.gitignore`).

## Démarrage

```bash
npm install
npm run dev        # serveur de dev sur http://localhost:3000
npm run build       # build de production dans dist/
npm run typecheck   # vérification TypeScript sans émission
npm run preview     # sert le build de production localement
```

## Modèle de données côté backend

Le backend ABMCY Core est un **modulith générique** : `products.category`
vaut `"chambre"` ou `"prestation"`, et tout le reste (ville, type précis,
équipements, capacité, unité de prix nuit/mois/prestation...) vit librement
dans `products.attributes` (JSONB, aucune colonne dédiée). Voir
`src/lib/mapProduct.ts` pour la convention exacte utilisée par ce frontend
(`city`, `type`, `amenities[]`, `capacity`, `price_unit`, `image_url`).

Aucune modification du backend Go n'a été nécessaire pour ce nouveau tenant —
c'est tout l'intérêt du modèle catalogue générique.

## Pages

| Route | Rôle |
|---|---|
| `/` | Accueil : présentation du concept, mises en avant, témoignages |
| `/chambres` | Liste des chambres disponibles, filtrable par ville, triable par prix/nouveauté |
| `/chambres/:id` | Détail d'une chambre — photos, équipements, prix/nuit, bouton réserver, partage social |
| `/prestations` | Liste des prestations de service |
| `/prestations/:id` | Détail d'une prestation |
| `/publier` | Formulaire de publication d'une nouvelle annonce (photo avec filigrane automatique) |
| `/reserver` | Finalisation de la réservation/demande (panier -> `POST /orders`) |
| `/galerie` | Galerie des chambres publiées et réalisations, avec partage social |
| `/espace-client` | Connexion client (téléphone + mot de passe) et suivi des réservations |

## Fonctionnalité clé : filigrane automatique sur les photos

Quand un propriétaire publie une photo de chambre (page `/publier`), la photo
reçoit **automatiquement** un filigrane semi-transparent « Paradis Services »
avant d'être envoyée au backend :

1. La photo choisie est chargée dans un `<canvas>` HTML5 (`src/lib/watermark.ts`, `applyWatermark()`).
2. Un bandeau semi-transparent + le texte « Paradis Services » sont dessinés
   dans le coin choisi (bas-droite par défaut).
3. Le canvas est reconverti en `File` (JPEG/PNG selon le fichier d'origine).
4. Ce fichier filigrané est celui envoyé à `uploadImage()` (`POST
   /uploads/image`, 25 Mo max) — **jamais le fichier original**.

Composant réutilisable : `src/components/PhotoUploadWithWatermark.tsx`
(gère la sélection, l'aperçu, le filigrane, l'upload et les erreurs).

## Fonctionnalité clé : partage réseaux sociaux

Sur le détail d'une annonce et dans la galerie, un menu de partage
(`src/components/ShareMenu.tsx`) propose :

- **WhatsApp** (`https://wa.me/?text=...`)
- **Facebook** (`https://www.facebook.com/sharer/sharer.php?u=...`)
- **X / Twitter** (`https://twitter.com/intent/tweet?text=...&url=...`)
- **Copier le lien** (`navigator.clipboard`)

Aucun SDK tiers — uniquement des URL d'intent standard.

## Choix de design

- **Palette** : ton chaud et neutre pensé pour l'hébergement et la
  confiance — `linen` (sable/lin clair, fond), `pine` (vert ardoise
  profond, sérénité/sérieux — header, footer, textes forts) et `clay`
  (terracotta chaud, accent — CTA, prix, badges). Volontairement différent
  du duo beige/cognac "haute couture" du site frère HANI'S : ici on vise un
  ressenti "hôtellerie/coliving" plutôt que "mode".
- **Typographie** : `Fraunces` (serif à forte présence, pour les titres) +
  `Inter` (sans-serif très lisible, pour le corps de texte) — un pairing
  courant en produit "hospitality" moderne, distinct du Cormorant/Jost du
  site frère.
- **Logo** : placeholder purement SVG/CSS (cercle + icône de toit inline),
  **aucun fichier image** — à remplacer par un vrai logo graphique quand la
  marque en aura un (voir `src/components/Header.tsx`, composant `Logo`).
- Les numéros de téléphone, emails de contact et liens réseaux sociaux sont
  des **placeholders explicitement marqués `// TODO`** dans le code
  (`src/data/catalog.ts`, `src/components/Footer.tsx`, `src/App.tsx`) — à
  remplacer par les vraies coordonnées avant mise en production.

## Ce qui n'a pas été repris de HANNIFA

Le sur-mesure (mesures corporelles, choix de tissu) est spécifique à une
maison de couture et n'a pas de sens pour une plateforme de location — les
routes backend correspondantes (`/custom-orders`, `/measurements`,
`/fabrics*`) existent toujours côté ABMCY Core (backend générique
multi-tenant) mais ne sont **volontairement pas exposées** par ce frontend.

## Déploiement

Projet 100% statique après `npm run build` (`dist/`) — déployable sur
Vercel, Netlify, ou tout hébergeur de fichiers statiques. Le `HashRouter`
évite d'avoir à configurer une règle de réécriture SPA côté serveur.

## Statut

- `npm install`, `npm run typecheck` et `npm run build` passent sans erreur.
- Aucun tenant réel n'a été créé côté backend — `.env` reste vide par défaut
  (voir `.env.example`), le frontend est prêt mais pas encore branché à un
  vrai compte ABMCY.
