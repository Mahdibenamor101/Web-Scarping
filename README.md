# mbQr

Menu QR digital et commande à table pour restaurants et cafés en Italie. Voir `CONTEXT.md` à la racine pour la vision produit, le positionnement et la roadmap complète — c'est la mémoire du projet, à lire avant toute contribution.

**Où on en est** : Phase 0 complète (étapes 1 à 5 : fondations + isolation multi-tenant, gestion du menu, QR + commande client, dashboard commandes temps réel, Stripe), plus limitation de débit et un premier passage nom + identité visuelle. Stripe est codé mais jamais exercé contre un vrai compte — voir la section Stripe ci-dessous et `CONTEXT.md` §12.7 avant tout pilote payant. Le nom "mbQr" n'a pas non plus été vérifié juridiquement (marque, domaine) — voir `CONTEXT.md` §2.

## Stack

- Next.js 14 (App Router) + TypeScript
- PostgreSQL avec Row-Level Security (isolation multi-tenant appliquée par la base, pas par l'application)
- Prisma (schéma + migrations)
- Tailwind CSS
- Auth maison (JWT en cookie httpOnly, bcrypt) — voir "Pourquoi pas Supabase Auth/Clerk pour l'instant" dans `CONTEXT.md`

## Démarrage local

Prérequis : Docker (Postgres tourne en conteneur), Node.js 20+.

```bash
npm run setup
```

Cette commande unique : démarre Postgres, applique les migrations (schéma + policies RLS), génère le client Prisma, seed un restaurant de démo, puis lance le serveur de dev sur http://localhost:3000.

Le script (`scripts/dev-setup.mjs`) est en Node.js pur, pas en bash — il tourne tel quel sous Windows (cmd ou PowerShell, sans WSL), macOS et Linux. Seul Docker Desktop doit être installé et lancé au préalable. Si vous voyez une erreur liée à WSL (`execvpe(/bin/bash) failed`), c'est que vous êtes sur une version d'avant ce changement — faites `git pull` sur cette branche et réessayez.

Comptes de démo créés par le seed (mot de passe `password123`) :

| Email | Rôle |
|---|---|
| owner@demo.local | OWNER |
| manager@demo.local | MANAGER |
| server@demo.local | SERVER |
| kitchen@demo.local | KITCHEN |

### Commandes utiles

```bash
npm run dev            # serveur de dev (Postgres doit déjà tourner)
npm run db:up          # démarre juste Postgres
npm run db:down        # arrête Postgres
npm run db:migrate:dev # nouvelle migration en dev
npm run db:seed        # rejoue le seed (no-op si déjà présent)
npm test               # tests d'isolation multi-tenant (Row-Level Security) + limitation de débit
npm run typecheck
npm run build
```

## Isolation multi-tenant

Chaque table métier porte un `organization_id`, et une policy Postgres (`Row-Level Security`) filtre chaque lecture/écriture sur `organization_id = <org de la session>`. Le rôle applicatif (`app_user`) qui exécute les requêtes n'a **aucun moyen de contourner cette policy** : il ne possède pas les tables et n'a pas l'attribut `BYPASSRLS`. Voir `prisma/migrations/*_row_level_security/migration.sql` pour le détail, et `tests/isolation.test.ts` pour la preuve automatisée (deux organisations, lectures et écritures croisées, toutes rejetées).

`docker/init-roles.sql` documente la séparation des rôles PostgreSQL (`app_migrator` vs `app_user`) qui rend ça possible.

## Menu

`/dashboard/menu` (owner/manager) : catégories, plats, prix, disponibilité, étiquetage des 14 allergènes UE (Règlement (UE) n°1169/2011), noms/descriptions IT/EN. Lecture seule pour server/kitchen. Pas encore d'upload de photo — le champ attend une URL déjà hébergée ailleurs.

## QR + commande client

`/dashboard/tables` (owner/manager) : ajouter une table génère un QR code pointant vers `/menu/[qrToken]` — page publique, sans compte, mobile-first, bascule IT/EN, panier, envoi de commande. Le client n'a jamais de session ; la résolution QR → organisation passe par une fonction Postgres dédiée (`resolve_table_by_qr_token`, voir `prisma/migrations/*_public_ordering`), et tout le reste (lecture du menu, création de la commande) passe par les mêmes policies RLS que le reste de l'app. Le prix facturé est toujours recalculé côté serveur.

## Dashboard commandes temps réel

`/dashboard/orders` (les quatre rôles) : colonnes à faire / en cours / prêt, mise à jour en direct sans recharger la page. Le mécanisme est Postgres `LISTEN`/`NOTIFY` (un trigger sur `orders`, voir `prisma/migrations/*_order_realtime_notify`) relayé aux navigateurs via Server-Sent Events (`GET /api/orders/stream`) — pas de Socket.io ni de service tiers, voir `CONTEXT.md` §12.6 pour le détail et la limite connue en hébergement serverless. Le statut de la table (`free`/`occupied`) suit automatiquement ses commandes actives.

## Stripe

`/dashboard/billing` (owner uniquement) : statut d'abonnement/essai, bouton d'abonnement (Stripe Checkout, un seul plan ~400 €/an), bouton de gestion (Stripe Billing Portal). `POST /api/billing/webhook` synchronise le statut à chaque événement Stripe.

**Sans configuration Stripe (`STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET` absentes de `.env`), tout le reste de l'app fonctionne normalement** — les routes de facturation renvoient un 501 propre, la page billing affiche un avertissement. `npm run setup` ne nécessite donc pas de compte Stripe.

**Non vérifié : un vrai paiement de bout en bout.** Le webhook a été testé avec des événements Stripe signés localement (voir `CONTEXT.md` §12.7), mais aucun appel n'a été fait contre un vrai compte Stripe. Avant le premier pilote payant : créer un compte Stripe (mode test), renseigner les trois variables d'environnement, et dérouler le parcours Checkout une fois pour de vrai.

## Limitation de débit

Compteur en mémoire par clé (`src/lib/rate-limit.ts`), même limite de conception que le temps réel (un seul processus Node — voir `CONTEXT.md` §12.8 pour le détail et ce qu'il faudrait pour un déploiement multi-instances). Appliqué à la connexion (par IP et par email), l'inscription, la commande client (par table et par IP), l'acceptation/lecture d'invitation, l'envoi d'invitations (par organisation) et les actions de facturation. Les lectures authentifiées du dashboard ne sont volontairement pas limitées.

## Identité visuelle

Accent `sky-500` (Tailwind, `#0ea5e9`), fond navy foncé pour les sections héro/sidebar, boutons en pilule, cartes très arrondies — palette et conventions de forme extraites du CSS réellement livré par un concurrent (QonnectQR) à la demande du fondateur, appliquées à un contenu et une structure originaux. Système de composants partagé dans `src/app/globals.css` (`@layer components` : `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge`) plutôt que des utilitaires Tailwind répétés à chaque page. Voir `CONTEXT.md` §12.9.

**Logo** (`src/components/logo.tsx`) : mark géométrique en SVG (motifs "finder pattern" de QR code sur trois coins d'un badge dégradé, un point sur le quatrième), produit directement en code plutôt que dans Figma — **aucun connecteur Figma n'est disponible dans cet environnement**. `src/app/icon.svg` réutilise le même dessin comme favicon. Absent volontairement de `/menu/[qrToken]` : cette page montre le nom du restaurant, pas celui de mbQr.

**Landing page** : section "aperçu du produit" avec de vraies captures d'écran de l'app (`public/screenshots/`, à régénérer après tout changement visuel notable du dashboard ou du menu public — voir `CONTEXT.md` §13), section tarifs, animations légères au scroll (`src/components/reveal.tsx`, IntersectionObserver, sans librairie externe). Volontairement sans témoignages clients : aucun pilote réel n'a encore eu lieu, voir `CONTEXT.md` §12.10.
