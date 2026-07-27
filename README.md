# [Resto SaaS — nom à définir]

Menu QR digital et commande à table pour restaurants et cafés en Italie. Voir `CONTEXT.md` à la racine pour la vision produit, le positionnement et la roadmap complète — c'est la mémoire du projet, à lire avant toute contribution.

**Où on en est** : Phase 0, étape 1 — fondations techniques + isolation multi-tenant. Pas encore de fonctionnalités métier (menu, commande, temps réel) : l'objectif de cette étape est un socle où l'isolation entre restaurants est une garantie de base de données, pas une convention de code.

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
npm test               # tests d'isolation multi-tenant (Row-Level Security)
npm run typecheck
npm run build
```

## Isolation multi-tenant

Chaque table métier porte un `organization_id`, et une policy Postgres (`Row-Level Security`) filtre chaque lecture/écriture sur `organization_id = <org de la session>`. Le rôle applicatif (`app_user`) qui exécute les requêtes n'a **aucun moyen de contourner cette policy** : il ne possède pas les tables et n'a pas l'attribut `BYPASSRLS`. Voir `prisma/migrations/*_row_level_security/migration.sql` pour le détail, et `tests/isolation.test.ts` pour la preuve automatisée (deux organisations, lectures et écritures croisées, toutes rejetées).

`docker/init-roles.sql` documente la séparation des rôles PostgreSQL (`app_migrator` vs `app_user`) qui rend ça possible.
