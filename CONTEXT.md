# CONTEXT.md — mbQr

> Fichier de mémoire du projet. À coller en début de chaque session de travail (chat ou Claude Code) et à tenir à jour après chaque décision importante.
> Dernière mise à jour : 27 juillet 2026 — Phase 0 complète : étapes 1 à 5 (fondations + multi-tenant, menu, QR + commande client, dashboard temps réel, Stripe) implémentées, plus un durcissement limitation de débit (§12.8) et nom + identité visuelle + logo (§2, §12.9). Décisions d'architecture consignées en §12. Réserves à ne pas perdre de vue : Stripe non vérifié contre un vrai compte (§12.7), nom non vérifié juridiquement (§2, §13), logo produit en code plutôt qu'en Figma faute de connecteur disponible (§12.9, §13).

## 1. Vision

Un SaaS de menu QR digital et de commande à table pour les restaurants et cafés en Italie. Un client scanne le QR de sa table, consulte le menu depuis son téléphone (rien à installer) et commande — la commande arrive instantanément en cuisine et sur le dashboard du restaurant.

**Positionnement — TRANCHÉ : l'angle est la distribution, pas la fonctionnalité.**

Le produit reste une réplique fonctionnelle du cœur de marché (menu + commande + temps réel + staff + analytics). Ce qui différencie n'est pas ce que fait le logiciel, mais comment il arrive chez le client : acquisition payante alimentée par une preuve sociale réelle, construite avec un réseau de restaurateurs sur place.

**Atouts du fondateur :** présence en Italie + réseau de contacts dans la restauration. Ce sont ces deux éléments qui rendent le plan viable — pas une supériorité produit.

**Décision d'acquisition : publicité payante** (et non vente en direct par le réseau). Le réseau ne sert pas de canal de vente mais de **source de preuve sociale** : il produit les témoignages, vidéos et chiffres qui rendent les publicités rentables. Sans cette preuve, les créas d'un SaaS inconnu convertissent très mal.

### ⚠️ Paysage concurrentiel réel (révisé — bien plus dense qu'estimé initialement)

Au moins **dix acteurs identifiés** sur le menu QR en Italie, dont plusieurs gratuits ou freemium :

| Concurrent | Positionnement |
|---|---|
| Comanda Facile / Comanda Assistant | gestion complète salle/cuisine + menu QR, bien installés |
| MenüQR | menu + upsell piloté par IA, analytics |
| Qromo | gestionnaire complet, remplace les palmaires par smartphone |
| atavola.menu (@tavola) | menu QR, multilingue, allergènes + filtres — le plus proche du MVP prévu |
| e-menu.it | menu digital, allergènes, tarif bas |
| SmartTouch Menu | commande table/plage/hôtel + paiement in-app |
| Etable | menu digital + découverte de locaux |
| MenuPrime | menu digital, 1er mois gratuit |
| leggimenu.it | **gratuit** en version de base, extensions payantes |
| JMENU | activation gratuite, sans abonnement |

**Implication stratégique (non résolue) :** la stratégie initiale — lancer sans différenciation à 40€/mois — a été décidée en pensant le marché peu peuplé. Elle ne tient pas face à dix concurrents dont certains gratuits. Sans angle, il n'y a pas de raison pour un restaurateur de choisir ce produit, donc pas de première traction, donc pas de données pour différencier plus tard. **L'angle doit être défini AVANT le build, pas après.**

**Le pricing à 40€/mois est également à revalider** dans ce contexte : le positionnement se justifie seulement si l'angle le justifie.

## 2. Nom

**Statut : "mbQr" retenu comme nom de travail (27 juillet 2026), les vérifications obligatoires ci-dessous restent à faire.** Choisi directement par le fondateur pendant le build (Phase 0), sans repasser par le processus décrit plus bas (générer 20 candidats → vérifier les domaines en masse). Ce n'est pas un problème en soi — §9 dit explicitement que le nom n'est pas bloquant pour le build — mais ça veut dire que les leçons de méthode ci-dessous n'ont pas été appliquées à "mbQr" spécifiquement, et qu'aucune des quatre vérifications obligatoires n'a été faite. **À faire avant la Phase B**, pas avant.

Sept candidats antérieurs testés, tous éliminés ou affaiblis :

| Candidat | Verdict |
|---|---|
| QRisto | ❌ qristo.app = "QRisto Menu", produit identique |
| Ordimo | ❌ app estonienne de commande QR à table, même flux |
| MenuVivo | ❌ menuvivo.com pris (app repas IA) |
| Menoo | ❌ pris 6× (.ro, .us, .io, .me, usemenoo.com, apps) |
| Tavolà | ❌ atavola.menu = concurrent direct |
| Servito | ⚠️ libre, mais mot ultra-courant du secteur → invisible en recherche |
| Sedimo | ⚠️ libre, mais évoque "sedimento" en italien |

**Leçons de méthode :**
- Les noms descriptifs composés (QR/ordre + suffixe italien) sont tous pris — c'est la formule que tout le monde applique. Les acteurs installés ont des noms **inventés** : QonnectQR, Qromo, Mobee, Etable.
- Éviter les mots italiens courants du secteur (*portata*, *servito*, *comanda*) : noyés dans les tournures idiomatiques, inutilisables en SEO.
- **Bon ordre** : définir l'angle → générer 20 candidats → vérifier les domaines en masse chez un registrar (5 min) → n'approfondir que les survivants. Chercher un nom avant de connaître l'angle fait tourner en rond.

**Vérification obligatoire avant engagement** (non faite, hors de portée de la recherche web) :
1. TMview (EUIPO) — marques UE, classes 9 et 42 pour du SaaS
2. UIBM — marques italiennes nationales
3. Disponibilité domaine .it / .com
4. App Store + Google Play

Un nom peut être déposé sans aucune présence web visible.

## 3. Personas

| Persona | Besoin principal | Point de friction actuel |
|---|---|---|
| Gérant / propriétaire | Réduire les erreurs de commande, voir le CA en direct | Gère tout sur papier, aucune visibilité temps réel |
| Serveur / staff cuisine | Recevoir les commandes sans ambiguïté, gérer les statuts | Commandes criées à voix haute, erreurs de transcription |
| Client final (souvent touriste) | Commander vite, comprendre le menu dans sa langue | Menu papier en italien uniquement, doit héler un serveur |

## 4. Fonctionnalités (MVP)

Réplique du cœur de marché, avec deux éléments non négociables en Italie (pas des "bonus", des prérequis légaux/commerciaux) :

| Fonctionnalité | Note |
|---|---|
| QR par table, menu digital | |
| Commande client sans compte | |
| Dashboard commandes temps réel | statuts à faire / en cours / prêt |
| Gestion du menu (catégories, plats, photos, rupture de stock) | |
| **Menu multilingue (IT + EN minimum)** | attendu par le marché vu le poids du tourisme, pas un luxe |
| **Étiquetage des 14 allergènes UE** | obligation légale — Règlement UE n°1169/2011, pas optionnel |
| Comptes staff + rôles | |
| Appeler le serveur depuis le menu | |
| Abonnement + essai gratuit, paiement Stripe | |
| Analytics de base (CA, plats vedettes, heures de pointe) | |
| Personnalisation de marque (logo, couleurs) | |

## 5. Modèle de données (premier jet)

```
organizations (le "tenant" = un restaurant)
  id, name, slug, address, city, phone, logo_url,
  theme_color, default_language (it),
  subscription_plan, subscription_status, trial_ends_at

users (staff)
  id, organization_id → organizations, name, email,
  password_hash, role (owner/manager/server/kitchen),
  last_active_at

tables (tables physiques du restaurant)
  id, organization_id → organizations, label,
  qr_token (unique), status (free/occupied)

menu_categories
  id, organization_id → organizations, name_it, name_en, sort_order

menu_items
  id, category_id → menu_categories, organization_id → organizations,
  name_it, name_en, description_it, description_en,
  price, photo_url, is_available, sort_order,
  allergens (array — 14 allergènes UE, ex: gluten, lactose, fruits à coque...)

orders
  id, organization_id → organizations, table_id → tables,
  status (pending/in_progress/ready/served/cancelled),
  total_amount, created_at, updated_at

order_items
  id, order_id → orders, menu_item_id → menu_items,
  quantity, unit_price, notes

staff_calls (bouton "appeler le serveur")
  id, table_id → tables, status (pending/acknowledged), created_at

subscriptions
  id, organization_id → organizations, plan, status,
  payment_provider (stripe), external_subscription_id,
  current_period_end
```

Tout est scopé par `organization_id` — c'est la clé de l'isolation multi-tenant.

> **Implémenté en Phase 0 / étape 1 avec deux écarts par rapport à ce premier jet — voir §12.2** : `order_items` et `staff_calls` portent aussi un `organization_id` direct (pas seulement via leur FK parent), et une table `invitations` (absente d'ici) a été ajoutée pour le flux d'invitation du staff.

## 6. Stack technique

- **Frontend** (menu public + dashboard) : Next.js + Tailwind, mobile-first pour le menu public
- **Temps réel** : Socket.io ou Supabase Realtime pour le flux commande → cuisine
- **Backend** : Node/TS (API routes Next.js ou NestJS séparé)
- **Base de données** : PostgreSQL (Supabase ou Neon pour démarrer vite)
- **Auth staff** : Supabase Auth / Clerk — les clients qui commandent n'ont pas de compte
- **Stockage photos** : S3-compatible (Supabase Storage / Cloudflare R2)
- **Paiement/abonnement** : Stripe (pleinement supporté en Italie, contrairement à la Tunisie — pas de contournement nécessaire)
- **Notifications** : Web Push (statut commande, appel serveur)
- **Hébergement** : Vercel (front + edge) + Postgres managé, idéalement région UE (Frankfurt/Paris) pour la latence et la conformité RGPD

> **Précisions apportées en Phase 0 / étape 1 — voir §12.1** : API routes Next.js retenues (pas de NestJS séparé) ; auth staff maison (JWT + bcrypt) en attendant de rebrancher Supabase Auth/Clerk ; PostgreSQL avec Row-Level Security comme mécanisme d'isolation multi-tenant, quel que soit l'hébergeur choisi ensuite (Neon/Supabase, tous deux compatibles RLS).

## 7. Contraintes non-fonctionnelles

- **Latence** : la commande doit apparaître côté cuisine en moins de 2-3 secondes après validation client
- **Isolation multi-tenant** : aucune fuite de données entre restaurants
- **RGPD** : régime UE complet (plus strict que le cadre tunisien envisagé initialement) — base légale claire pour chaque donnée collectée, droit à l'effacement, hébergement UE recommandé
- **Allergènes** : conformité Règlement UE n°1169/2011 (14 allergènes à signaler clairement)
- **Multilingue dès le MVP** : italien + anglais au minimum
- **Résilience réseau** : le wifi resto n'est pas toujours fiable — comportement dégradé propre plutôt qu'un plantage silencieux

## 8. Pricing

**Modèle retenu : annuel prépayé, ~400 €/an.**

Raison : avec une acquisition payante, le coût d'acquisition client (CAC) est estimé entre 80 et 300 €. Un abonnement mensuel à 40 € oblige à financer 2 à 6 mois de trésorerie avant de rembourser l'acquisition de chaque client. L'annuel prépayé rembourse le CAC immédiatement.

**Arithmétique à valider par le test** (ordres de grandeur B2B, pas des prévisions) :

| Variable | Estimation |
|---|---|
| Durée de vie moyenne client | 10-15 mois (les petits restos churnent beaucoup) |
| Valeur client (LTV) brute | 400-600 € |
| Coût par lead (Meta, B2B resto Italie) | 5-30 € |
| Taux lead → client payant | 5-15 % |
| **CAC estimé** | **80-300 €** |
| Retour sur investissement | 4-8 mois en mensuel / immédiat en annuel |

Marge d'erreur faible : ces chiffres doivent être remplacés par les chiffres réels du test média (Phase C) avant tout engagement budgétaire sérieux.

Essai gratuit à définir.

## 9. Roadmap

⚠️ **Correction de séquençage** : une version antérieure plaçait les pilotes en phase 1. Impossible — on ne peut pas installer chez des restaurateurs un produit qui n'existe pas. **Le build vient en premier.**

### Phase 0 — Build du MVP ← ON EST ICI
QR + menu multilingue + allergènes + commande + dashboard temps réel + staff + Stripe.
Le nom n'est pas bloquant : coder avec un placeholder, trancher le nom en parallèle (il devient nécessaire en Phase B).

**Étape 1 — fondations + multi-tenant : FAITE.** Voir §12 pour le détail des décisions et §13 pour ce qui reste fragile.

**Étape 2 — gestion du menu : FAITE.** CRUD catégories/plats (owner/manager), 14 allergènes UE, multilingue IT/EN, disponibilité, dans `/dashboard/menu`. Lecture seule pour les autres rôles (server/kitchen en ont besoin au quotidien). Pas encore de upload de photo (URL collée à la main — voir §13), pas de drag-and-drop pour le tri.

**Étape 3 — QR + commande client : FAITE.** Gestion des tables (`/dashboard/tables`, owner/manager) avec QR code généré par table. Page publique `/menu/[qrToken]` (sans compte, mobile-first, IT/EN) : parcours du menu, panier, envoi de commande. Le prix facturé est toujours recalculé côté serveur à partir du menu au moment de la commande, jamais accepté depuis le client. Voir §12.5 pour le mécanisme de résolution QR → organisation et le durcissement du schéma qui l'a accompagné (clés étrangères composites).

**Étape 4 — dashboard commandes temps réel : FAITE.** `/dashboard/orders` (les quatre rôles), vue par colonnes à faire / en cours / prêt, mise à jour en direct sans rafraîchir la page. Le statut de la table (`free`/`occupied`) suit maintenant automatiquement ses commandes actives. Voir §12.6 pour le choix de mécanisme (Postgres `LISTEN`/`NOTIFY` + Server-Sent Events, pas Socket.io) et sa limite connue en production serverless.

**Étape 5 — Stripe : FAITE, avec une réserve importante.** `/dashboard/billing` (owner uniquement) : statut d'abonnement, essai gratuit, bouton d'abonnement (Stripe Checkout) et bouton de gestion (Stripe Billing Portal). Webhook `POST /api/billing/webhook` qui synchronise le statut à chaque événement Stripe. **Codé et vérifiable hors-ligne (voir §12.7), mais jamais exercé contre un vrai compte Stripe** — Claude Code n'a pas d'accès à des identifiants Stripe. Avant le premier pilote payant : créer un compte Stripe (mode test d'abord), configurer `STRIPE_SECRET_KEY` / `STRIPE_PRICE_ID` / `STRIPE_WEBHOOK_SECRET`, et dérouler le parcours de paiement une fois pour de vrai en mode test.

**Phase 0 terminée en ce sens** : les cinq étapes prévues sont codées. Ce qui reste avant un pilote réel n'est plus architectural — c'est de la vérification avec de vrais identifiants (Stripe), du contenu (mentions légales, CGV — §10), et les points listés en §13.

**Durcissement post-Phase 0 — limitation de débit : FAITE.** Signup, connexion (par IP et par email), acceptation d'invitation, commande client (par table et par IP), invitations envoyées (par organisation), et les actions de facturation sont maintenant limitées en fréquence — c'était le point le plus concret listé en §13 après l'étape 5. Voir §12.8 pour le mécanisme et sa même limite de processus unique que le temps réel (§12.6).

**Correction portabilité — `npm run setup` sous Windows sans WSL : FAIT (27 juillet 2026).** Un fondateur testant en vrai sur Windows a fait échouer `npm run setup` : le script `scripts/dev-setup.sh` dépendait de `bash`, et sur sa machine `bash` résolvait vers un relai WSL cassé (`execvpe(/bin/bash) failed`). C'est un vrai trou dans la promesse "démarre en local avec une commande" (§7), jamais testé contre du Windows sans WSL fonctionnel avant ce retour utilisateur. Remplacé par `scripts/dev-setup.mjs`, Node.js pur (aucune dépendance à bash/WSL/Git Bash) — `child_process.execSync` choisit automatiquement le bon shell (`cmd.exe` sous Windows, `/bin/sh` ailleurs). Même logique, même comportement, `npm run setup` inchangé du point de vue de l'utilisateur. Seul prérequis restant : Docker Desktop installé et lancé.

**Nom + premier passage design : FAIT (27 juillet 2026).** Nom de travail "mbQr" retenu (voir §2, vérifications obligatoires encore à faire). Identité visuelle Tailwind appliquée à tout l'app — accent sky-500, boutons pilule, cartes `rounded-2xl`, sidebar/hero en navy foncé — voir §12.9 pour le détail et la source de la référence visuelle. §4 prévoyait la "personnalisation de marque" comme fonctionnalité MVP (logo/couleurs *par restaurant*) ; ce qui a été fait ici est différent et plus en amont : l'identité visuelle *du produit lui-même*, pas encore la personnalisation par tenant — cette dernière reste à faire.

**Landing page enrichie + animations : FAIT (27 juillet 2026).** Section "aperçu du produit" avec de vraies captures d'écran de l'app (pas des photos stock ni des maquettes inventées), section tarifs, bandeau de confiance, icônes, animations au scroll et micro-interactions sur le tableau de commandes et le panier public. Voir §12.10 pour le détail, y compris la décision de ne pas afficher de faux témoignages clients.

### Phase A — Pilotes (3-4 semaines)
5-8 restos du réseau, **gratuits 3 mois**. Ce n'est pas de la générosité : c'est l'achat d'actifs publicitaires. À exiger explicitement dès le départ :
- vidéos du produit en service réel (scan client → commande en cuisine)
- 2-3 témoignages nommés, avec nom et logo du resto
- chiffres concrets : temps de service, commandes/soir, erreurs évitées
- **autorisation écrite** d'utiliser nom, logo et images en publicité

### Phase B — Actifs, avant la première dépense pub
- Landing page en italien : promesse claire, prix visible, et **QR de démo scannable directement depuis la page** (essayer en 5 secondes bat n'importe quel argumentaire)
- 3-5 créas vidéo tirées des pilotes, format vertical
- Le nom + domaine doivent être tranchés ici

### Phase C — Test média (budget 500-1000 € sur 3-4 semaines)
**Commencer par Google Search, pas Meta.** Capter une demande existante ("menu digitale ristorante", "qr code menu ristorante") coûte bien moins cher que la créer. Volume plus faible, conversion nettement meilleure. Meta ensuite pour le volume : ciblage géographique régional, propriétaires d'entreprises / HoReCa, puis audiences similaires sur les premiers clients payants.

Objectif de ce budget : **acheter une réponse à "combien me coûte un client"** — pas acquérir des clients.

Métriques : coût par lead qualifié, taux essai → payant, délai de rentabilisation. Pas les clics, pas les impressions.

**Seuil d'abandon à fixer AVANT de dépenser**, ex. : si après 1000 € le CAC dépasse 300 €, on revoit l'offre — pas le ciblage.

### Phase D — Scale ou pivot selon les chiffres réels du test

## 10. Questions ouvertes

**Résolues :**
- ~~Angle~~ → distribution / acquisition payante adossée à la preuve sociale du réseau
- ~~Pricing~~ → annuel prépayé ~400 €/an
- ~~Séquençage~~ → build d'abord, pilotes ensuite

**Ouvertes, non bloquantes pour le build :**
- **Le nom** — nécessaire en Phase B, pas en Phase 0. Voir §2 pour la méthode
- Durée de l'essai gratuit
- Région d'hébergement précise (UE) pour la conformité RGPD — voir §12.4, non tranchée mais cadrée
- Structure juridique et fiscale côté vendeur (TVA, facturation) — à voir avec un commercialista avant d'encaisser le premier euro
- Mentions légales, CGV, politique de confidentialité RGPD — avant le premier paiement

## 11. Outillage de développement

- **Claude Code** (pas l'interface chat) : lit et écrit directement dans le repo, CONTEXT.md vit dans le projet au lieu d'être recollé à chaque session
- **Modèle par défaut : Claude Opus 5** — recommandé par la doc officielle pour le codage agentique complexe ; 1M de contexte (CONTEXT.md + une bonne partie du codebase tiennent dedans), 128k de sortie
- **Paramètre `effort`** : déjà sur `high` par défaut sur Opus 5 ; passer à `xhigh` pour l'architecture et le flux temps réel
- **Sonnet 5** pour le travail de routine (CRUD, formulaires, CSS) — bascule via `/model` en cours de session
- Prérequis : Opus 5 exige Claude Code v2.1.219+ (`claude update`)

**Note :** le choix du modèle est un levier plus faible qu'il n'y paraît. Ce qui sépare un SaaS professionnel d'un prototype, c'est la gestion des cas limites, les tests, la propreté du multi-tenant et la discipline du CONTEXT.md — pas quelques points de benchmark.

## 12. Phase 0 / étape 1 — décisions d'architecture (fondations + multi-tenant)

Implémenté : projet Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL, isolation multi-tenant par Row-Level Security, signup restaurateur, invitation de staff par rôle, dashboard minimal par rôle, démarrage local en une commande (`npm run setup`).

### 12.1 Précisions sur la stack (§6) — pas de contradiction, des choix concrets faits

- **API routes Next.js, pas NestJS.** §6 laissait le choix ouvert. Un backend séparé n'apporte rien tant qu'il n'y a qu'une seule application cliente (le dashboard) — c'est de la complexité à justifier plus tard si un vrai besoin de découplage apparaît (ex. un service worker séparé pour le temps réel à fort volume).
- **Auth maison (JWT en cookie httpOnly + bcrypt), pas Supabase Auth/Clerk pour l'instant.** Le mécanisme de vérité — l'isolation — devait être prouvé au niveau de la base de données indépendamment de qui authentifie l'utilisateur. Écrire l'auth soi-même a permis de contrôler exactement ce qui se passe entre "l'utilisateur est authentifié" et "la policy RLS s'applique" (voir 12.3). Rebrancher Supabase Auth ou Clerk plus tard reste possible : il suffirait de leur faire émettre le même type de session (userId + organizationId + role) et de garder la même couche RLS — c'est le point d'intégration, pas un mur.
- **PostgreSQL avec Row-Level Security, indépendant de l'hébergeur.** Neon et Supabase supportent tous les deux RLS nativement ; ce choix ne ferme aucune porte sur l'hébergement UE (§12.4).

### 12.2 Écarts par rapport au premier jet du schéma (§5)

1. **`organization_id` dénormalisé sur `order_items` et `staff_calls`.** Le jet initial ne les scope qu'indirectement (via `order_id` / `table_id`). Une policy RLS a besoin d'une colonne sur la ligne elle-même pour filtrer efficacement — passer par une sous-requête vers la table parente à chaque lecture aurait fonctionné mais coûté cher en performance sur les tables les plus chaudes (commandes). Dénormaliser le `organization_id` est une pratique reconnue en multi-tenant Postgres avec RLS.
2. **Table `invitations` ajoutée**, absente du jet initial. Nécessaire pour que "inviter du staff" soit un vrai flux (lien à durée de vie limitée, rôle proposé, statut accepté/en attente) plutôt qu'un compte pré-créé avec un mot de passe à deviner.
3. **`users.email` est unique globalement**, pas seulement par organisation. Un membre du staff se connecte sans indiquer d'abord son restaurant — l'email doit donc être non ambigu à l'échelle du système. Limite connue : une même personne ne peut pas avoir un compte dans deux restaurants différents avec le même email (voir §13).

Le reste du schéma §5 (`tables`, `menu_categories`, `menu_items`, `orders`, `subscriptions`) est en place dans Prisma et protégé par RLS, mais sans logique métier ni UI — c'est le socle pour les prochaines étapes de la Phase 0, pas une fonctionnalité livrée.

### 12.3 L'isolation multi-tenant est une garantie Postgres, pas une convention de code

C'était la contrainte explicite de cette étape. Mécanisme :

- Le rôle applicatif (`app_user`, celui que Next.js utilise pour se connecter) ne possède aucune table et n'a pas l'attribut `BYPASSRLS`. Un rôle séparé (`app_migrator`) possède le schéma et exécute les migrations — voir `docker/init-roles.sql`.
- Chaque table scopée par organisation a une policy `USING / WITH CHECK (organization_id = current_setting('app.current_org_id'))`. Sans ce réglage de session, la policy s'évalue à `NULL` (donc "aucune ligne") — la position par défaut est "ne rien voir", pas "tout voir".
- Toute requête applicative passe par `withTenant(organizationId, ...)` (`src/lib/db.ts`), qui ouvre une transaction et fixe cette variable de session avant d'exécuter quoi que ce soit.
- Trois flux sont légitimement antérieurs à tout contexte de tenant (inscription, connexion, acceptation d'invitation) et ne peuvent pas passer par une transaction scopée — chacun a sa propre fonction Postgres `SECURITY DEFINER`, étroite et à usage unique, plutôt qu'un contournement large de RLS pour tout le rôle applicatif.
- **Preuve automatisée** : `tests/isolation.test.ts` crée deux organisations et vérifie, au niveau de la base (pas via l'API), que ni une lecture ni une écriture ne peuvent franchir la frontière — y compris dans le cas d'un bug applicatif simulé (une requête qui "oublie" de filtrer par organisation).

### 12.4 Hébergement UE (RGPD)

Non tranché à ce stade (cohérent avec §10, question ouverte non bloquante), mais cadré : le choix se fera entre Neon et Supabase, tous deux avec des régions Francfort, et tous deux compatibles avec le modèle RLS mis en place ici — donc pas de retour en arrière architectural à prévoir quel que soit le choix final.

### 12.5 QR + commande client (étape 3) — le même schéma de contournement étroit, étendu au client final

Le client qui scanne un QR n'a ni compte ni session : c'est la même catégorie de problème que l'inscription/connexion/invitation (§12.3), avec la même solution. Une seule fonction `SECURITY DEFINER` de plus, `resolve_table_by_qr_token`, qui transforme le `qr_token` d'une table en `organization_id`. **Une fois cet identifiant connu, tout le reste — lire le menu, insérer la commande — passe par le `withTenant()` RLS-scopé normal, exactement comme une écriture faite par le staff.** Il n'y a pas de fonction `SECURITY DEFINER` pour créer une commande : la garantie `WITH CHECK` de RLS suffit, une fois qu'on est dans le bon tenant.

**Prix jamais fait confiance au client** : le prix facturé est relu depuis `menu_items` au moment de la commande, dans la même transaction qui crée la commande — un client qui manipule la requête HTTP pour envoyer un prix différent n'a aucun effet, le schéma de validation n'accepte même pas de champ prix côté commande.

**Durcissement supplémentaire découvert pendant cette étape** : RLS garantit qu'une organisation ne peut pas *lire* les tables d'une autre, mais ne garantit pas, à elle seule, qu'une ligne `orders` ne puisse pas *pointer* vers une table d'une autre organisation (une commande avec `organization_id` correct mais `table_id` d'un autre tenant serait acceptée par la policy RLS, qui ne vérifie que la colonne `organization_id`). Corrigé par des **clés étrangères composites** : `orders.table_id` référence désormais `tables(id, organization_id)` et non plus `tables(id)` seul (même traitement pour `menu_items.category_id`, `order_items.order_id`, `order_items.menu_item_id`, `staff_calls.table_id`). La base rejette maintenant nativement toute ligne où les deux tenants ne correspondent pas — plus une propriété qu'on espère du code applicatif, une contrainte que Postgres impose à l'écriture. Voir `prisma/migrations/*_composite_tenant_foreign_keys`.

### 12.6 Temps réel (étape 4) — Postgres `LISTEN`/`NOTIFY` + Server-Sent Events, pas Socket.io

§6 envisageait Socket.io ou Supabase Realtime. Ni l'un ni l'autre n'a été retenu pour cette étape :

- **Socket.io** suppose un serveur Node avec connexions WebSocket persistantes — cohérent avec `next start` en un seul processus, mais ajoute une dépendance et un protocole de plus alors que le besoin réel ("le staff voit une commande apparaître sans recharger la page") ne demande pas de canal bidirectionnel.
- **Supabase Realtime** suppose d'être hébergé chez Supabase, ce qui n'est pas encore tranché (§12.4 — Neon est toujours une option).

**Choix retenu** : un trigger Postgres (`prisma/migrations/*_order_realtime_notify`) appelle `pg_notify('order_events', ...)` à chaque création ou changement de statut d'une commande. Le serveur Next.js maintient une seule connexion Postgres dédiée en écoute (`LISTEN`, `src/lib/realtime.ts`) pendant toute sa durée de vie, et relaie chaque notification aux navigateurs connectés via **Server-Sent Events** (`GET /api/orders/stream`, une réponse HTTP en flux continu, pas de librairie externe). Le navigateur reçoit l'événement puis rappelle `GET /api/orders` — pas de fusion d'état incrémentale côté client, juste "quelque chose a changé, relis tout", volontairement simple pour cette étape.

C'est cohérent avec le reste de l'architecture : la base est déjà la source de vérité pour l'isolation (RLS) ; ici elle devient aussi la source de vérité pour "quoi notifier" — pas un bus de messages séparé à garder synchronisé avec elle.

**Limite connue, documentée plutôt que cachée** : ce mécanisme suppose un processus Node long-vivant (vrai pour `next dev` / `next start`, et pour tout hébergeur type Railway/Fly/VM classique). Une fonction serverless (Vercel Functions dans sa forme par défaut) ne maintient pas de connexion `LISTEN` persistante entre les invocations — il faudrait soit un petit service Node dédié à cette seule connexion, soit un service temps réel géré (Supabase Realtime, Pusher). Pas un problème pour valider le produit en pilote ; à trancher en même temps que l'hébergement définitif (§12.4).

### 12.7 Stripe (étape 5) — codé, vérifié hors-ligne, jamais exercé en vrai

**Ce qui a pu être vérifié sans compte Stripe réel :**
- Le webhook (`POST /api/billing/webhook`) a été testé avec un événement `customer.subscription.updated` signé localement (la vérification de signature Stripe est un simple HMAC, elle ne nécessite aucun appel réseau) : signature valide → statut d'organisation et ligne `subscriptions` correctement mis à jour ; signature invalide ou absente → rejeté (400) ; événement sans le `organizationId` de confiance en métadonnée → accepté (200) mais ignoré, plutôt que deviné.
- La création de session Checkout (`POST /api/billing/checkout`) a été appelée avec une fausse clé — elle atteint bien l'API Stripe réelle et se fait rejeter proprement (401 de Stripe, propagé en erreur applicative), ce qui confirme que le code est correct jusqu'à la frontière de l'appel réseau, sans prouver qu'un vrai paiement aboutit.
- Restriction owner-only (ni manager, ni autre rôle) vérifiée sur les trois routes de facturation et sur `/dashboard/billing`.
- Sans aucune clé Stripe configurée, tout le reste de l'app continue de fonctionner normalement (`npm run setup` ne dépend pas d'un compte Stripe) — `/dashboard/billing` affiche un avertissement clair, les routes renvoient un 501 propre plutôt qu'un plantage.

**Ce qui n'a pas pu être vérifié** (pas d'identifiants Stripe disponibles dans cet environnement) : un vrai parcours de paiement de bout en bout — carte de test, redirection Checkout réelle, retour sur `success_url`, webhook réellement envoyé par Stripe plutôt que simulé. **À faire avant le premier restaurateur pilote payant**, avec un compte Stripe en mode test.

**Design** : un seul plan (~400 €/an, §8), pas de sélecteur de tarif. `organization_id` transite dans les métadonnées de la session Checkout et de l'abonnement Stripe créés par cette app elle-même ; le webhook, une fois la signature Stripe vérifiée, peut donc faire confiance à cette métadonnée et écrire via `withTenant()` normal — **aucune sixième fonction `SECURITY DEFINER` n'a été nécessaire**, contrairement à l'intuition initiale (le webhook n'a de session ni de compte, comme signup/login/QR, mais contrairement à eux il n'a pas besoin de *résoudre* un tenant depuis une donnée non fiable : il le relit depuis une donnée que l'app a écrite elle-même et que Stripe se contente de renvoyer). Bonne confirmation que le modèle en §12.3 tient sans multiplier les contournements.

### 12.8 Limitation de débit (durcissement post-Phase 0)

**Mécanisme** : compteur en mémoire, fenêtre fixe, par clé (`src/lib/rate-limit.ts`). Même limite de conception que le temps réel (§12.6) : un seul processus Node, pas de magasin partagé — un déploiement multi-instances appliquerait la limite séparément sur chaque instance, ce qui la multiplie de fait par le nombre d'instances plutôt que de la faire respecter globalement. À remplacer par un magasin partagé (Redis) si l'hébergement final est multi-instances ; à trancher avec le reste de l'hébergement (§12.4), pas avant.

**Où c'est appliqué, et pourquoi ces clés précises :**
- **Connexion** : par IP (10/15 min) *et* par email (5/15 min) — une seule source qui teste beaucoup de comptes est bloquée par la première, beaucoup de sources qui testent un seul compte sont bloquées par la seconde. Vérifié en conditions réelles au-delà de 5 tentatives sur un même email.
- **Inscription** : par IP (5/heure) — contre la création automatisée d'organisations bidon. Vérifié : la 6ᵉ tentative en une heure depuis la même IP est rejetée avec un `Retry-After` correct (~3600s).
- **Commande client** (`/menu/[qrToken]`) : par table (20/5 min) *et* par IP (30/heure) — la table protège contre un script qui spamme une seule table, l'IP contre un script qui teste plusieurs tables. Vérifié : exactement 20 commandes passent sur une même table, la 21ᵉ est rejetée.
- **Acceptation et lecture d'invitation** : par IP, limites larges (20–30/heure) — les jetons (32 octets aléatoires) rendent le brute-force impraticable de toute façon ; c'est une assurance bon marché contre le sondage automatisé, pas la vraie défense.
- **Invitation de staff** : par organisation (20/heure), pas par personne qui invite — ce qui est borné, c'est "combien de liens d'invitation ce restaurant peut générer par heure", pas l'activité d'un individu.
- **Facturation** (Checkout, Portail) : par organisation, limites larges — même logique que les invitations, protection de dernier recours plutôt que contrainte pensée pour l'usage normal.

**Ce qui n'est délibérément pas limité** : les lectures authentifiées du tableau de bord (`/api/orders`, `/api/menu/*`, `/api/staff`) — un membre du staff qui recharge sa page ne doit jamais se heurter à une limite pensée pour du trafic public non authentifié.

### 12.9 Nom + identité visuelle

**Nom** : "mbQr", choisi directement par le fondateur (voir §2 pour ce qui reste à vérifier avant que ce nom soit définitif).

**Design** : demande explicite d'un rendu "comme QonnectQR" (un concurrent listé en §1). Plutôt que deviner un style à partir du nom, le CSS réellement livré par qonnectqr.com a été récupéré et inspecté (feuilles de style `_next/static/css/*.css`, via le proxy sortant de l'environnement) pour en extraire la vraie palette : accent bleu ciel `#0ea5e9` (le `sky-500` de Tailwind, exactement), fond navy foncé `#0d1b3e` pour les sections héro/sombres, boutons en pilule (`border-radius:9999px`), cartes très arrondies (`1.5rem`), ombres teintées de la couleur d'accent plutôt que grises neutres. Aucun asset (logo, texte, image) du concurrent n'a été copié — seule la palette et les conventions de forme ont servi de référence, appliquées à un contenu et une structure originaux.

Implémenté comme un petit système de composants Tailwind (`src/app/globals.css`, classes `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge` sous `@layer components`) plutôt que des chaînes Tailwind répétées à chaque page — cohérence garantie par construction plutôt que par discipline de copier-coller. Appliqué à l'ensemble du parcours : landing, authentification, les cinq pages du dashboard (sidebar navy), et le menu public/panier mobile.

**Ce que ça ne couvre pas** : la personnalisation de marque *par restaurant* (logo, couleurs personnalisées — §4, colonnes `logo_url`/`theme_color` déjà présentes sur `organizations` depuis l'étape 1 mais sans UI pour les éditer). Ce qui a été fait ici est l'identité visuelle du produit mbQr lui-même, pas encore un mécanisme pour qu'un restaurant y superpose la sienne.

**Logo** : demande explicite d'un logo et de passer par Figma. **Figma n'est pas connecté à cet environnement** (recherche de connecteur infructueuse, opt-in requis côté compte) — le logo a donc été produit directement en SVG dans le code plutôt que dans un outil de design externe. Le résultat visuel est le même ; ce qui change, c'est qu'il n'existe pas de fichier `.fig` éditable à côté — si un vrai fichier Figma (pour itérer visuellement, faire éditer par quelqu'un d'autre, exporter des variantes) est nécessaire, il faudra soit connecter Figma à ce compte, soit reconstruire le mark dans Figma à partir du SVG (`src/components/logo.tsx`).

Le mark : trois motifs "finder pattern" de QR code (les carrés imbriqués qui permettent à un scanner de s'orienter) sur trois coins d'un badge dégradé sky-400→sky-600, un simple point sur le quatrième coin — asymétrie volontaire pour que ça se lise comme une marque, pas comme un vrai QR code scannable. Deux exports : `<Logo />` (mark + nom, utilisé partout où l'app se présente : nav landing, sidebar dashboard, en-tête auth) et `<LogoMark />` (icône seule). `src/app/icon.svg` réutilise le même dessin comme favicon (convention Next.js : un fichier `icon.svg` dans `app/` est automatiquement servi comme favicon, pas de câblage supplémentaire nécessaire).

Volontairement absent du menu public (`/menu/[qrToken]`) : cette page affiche le nom du *restaurant*, pas celui de mbQr — le client scanne pour voir le menu de "Trattoria da Mario", pas pour découvrir le SaaS qui le sert.

### 12.10 Enrichissement de la landing page + animations (27 juillet 2026)

Demande du fondateur en montrant des captures de qonnectqr.com : ajouter un aperçu produit, des "photos", des animations, et enrichir toutes les pages.

**"Des photos" — décision** : aucune bibliothèque d'images ni outil de génération d'image n'est disponible dans cet environnement, et utiliser de vraies photos de plats sans les avoir soi-même aurait signifié soit des stocks photos génériques (mentent sur ce que le produit montre vraiment), soit une fabrication. Choix retenu : de **vraies captures d'écran de l'application elle-même**, prises avec Playwright après avoir seedé un jeu de données de démo réaliste (catégories, plats, tables, commandes à différents statuts) via les vraies routes API. La section "Aperçu du produit" de la landing (`src/components/product-preview.tsx`) affiche ces captures dans un mockup téléphone (menu client + panier) et deux mockups navigateur (tableau de commandes en direct, tables + QR), avec un sélecteur d'onglet. Les fichiers vivent dans `public/screenshots/` et disent explicitement "Ce sont de vraies captures de l'application — pas des maquettes" — un choix plus honnête qu'un mockup graphique inventé, et qui a l'avantage de rester vrai à mesure que le produit évolue (il suffira de reprendre les captures).

**Témoignages clients — délibérément absents.** qonnectqr.com affiche des avis nommés ("Karim Ben Salah, Restaurant Le Palmier, Tunis"...). Le premier pilote n'a pas encore eu lieu (Phase A, §9) : il n'existe aucun restaurateur réel à citer. Inventer des noms et des citations attribuées à des personnes qui n'existent pas aurait été un faux témoignage présenté comme authentique — refusé, pas seulement pour cette landing mais comme principe. Cette section reviendra une fois les pilotes de Phase A auront produit de vrais retours (voir §10/roadmap Phase A : témoignages nommés déjà listés comme un livrable attendu des pilotes).

**Reste de l'enrichissement** : section tarifs (un seul plan, ~400 €/an — reprend les chiffres de §8, essai 14 jours sans carte confirmé exact en relisant `TRIAL_DAYS` dans `src/app/api/auth/signup/route.ts`), bandeau de confiance sous le hero, icônes SVG pour les 4 cartes fonctionnalités, CTA de clôture avant le footer. Animations : `src/components/reveal.tsx` (IntersectionObserver, fondu + translation à l'entrée dans le viewport, sans librairie externe), keyframes `float`/`bump-in` dans `tailwind.config.ts`, appliquées aussi au tableau de commandes (nouvelle commande qui apparaît), au panier public (retour visuel à chaque ajout), et aux listes du dashboard (menu, tables, staff, facturation).

Vérifié par capture d'écran de chaque page modifiée (pas seulement `tsc`/`eslint`/`next build`) — voir méthode identique aux passes de design précédentes (§12.9).

Élévation visuelle de la landing en même temps : dégradé/lueur radiale en fond du héro, texture de grille légère (CSS pur, aucune image), séparateur en vague entre le héro sombre et le contenu clair, léger effet de survol (translation + ombre) sur les cartes — même esprit "SaaS moderne" que la palette de référence, sans copier sa mise en page.

## 13. Ce qui reste fragile ou à surveiller (issu de la revue des étapes 1 à 5, du durcissement post-Phase 0, et du passage nom + design)

- **Pas d'envoi d'email réel.** L'invitation de staff génère un lien qu'il faut transmettre à la main (affiché dans le dashboard, loggé côté serveur). Premier vrai manque à combler dès que des restaurateurs pilotes utilisent le produit.
- **Email globalement unique pour les comptes staff** (voir §12.2.3) : une personne travaillant dans deux restaurants ne peut pas avoir le même email des deux côtés. Non bloquant pour le MVP, mais à concevoir explicitement si le besoin apparaît (compte multi-organisation) plutôt que de le découvrir en production.
- **`DIRECT_DATABASE_URL` (rôle `app_migrator`) ne doit jamais être utilisé par le code applicatif.** Prisma Client ne s'en sert qu'au moment des migrations, jamais à l'exécution — mais c'est une convention à faire respecter en revue de code, pas quelque chose que la base empêche mécaniquement si quelqu'un l'utilisait par erreur dans une future route API.
- **Les cinq fonctions `SECURITY DEFINER`** (`create_organization_and_owner`, `auth_lookup_user`, `accept_invitation`, `invitation_lookup_by_token`, `resolve_table_by_qr_token`) sont la seule surface qui contourne RLS — toujours cinq après l'étape Stripe, voir §12.7. Elles sont volontairement étroites, mais toute nouvelle fonction de ce type doit être traitée avec la même rigueur : elle est par construction en dehors de la garantie décrite en §12.3.
- **Pas de vérification d'email.** N'importe quelle adresse peut créer un compte sans jamais prouver qu'elle existe. La limitation de débit (voir §12.8) réduit l'abus automatisé mais ne remplace pas une vérification d'identité — à traiter avant le premier pilote réel si le spam de comptes devient un problème concret, pas avant.
- **Le magasin de limitation de débit est en mémoire, un seul processus** (§12.8) — comme le temps réel (§12.6), à revoir ensemble si l'hébergement final est multi-instances.
- **Pas d'upload de photo pour les plats.** Le champ `photoUrl` attend une URL déjà hébergée ailleurs — pas de stockage S3-compatible branché (Supabase Storage / R2, prévu §6). À faire avant que des restaurateurs pilotes alimentent vraiment leur menu.
- **Le temps réel suppose un processus Node long-vivant** (voir §12.6) — pas compatible tel quel avec un hébergement serverless par défaut (Vercel Functions). À trancher avec le choix d'hébergement définitif (§12.4), pas avant.
- **N'importe quel membre du staff peut faire passer n'importe quelle commande à n'importe quel statut**, y compris l'annuler. Volontaire pour cette étape (server et kitchen doivent pouvoir agir vite, sans se heurter à une permission trop fine) mais pas de piste d'audit : impossible de savoir qui a annulé quoi. À revoir si des restaurateurs pilotes signalent un problème réel de coordination interne — pas avant.
- **RGPD** : le schéma des `organizations`/`users` est prêt à recevoir une base légale de traitement documentée et un droit à l'effacement, mais ni l'un ni l'autre n'est implémenté (pas de mentions légales, pas d'endpoint de suppression de compte) — attendu pour avant le premier paiement (§10). Le client final qui commande via QR est, lui aussi, une personne dont on traite des données (commande horodatée, éventuellement des notes en texte libre) sans base légale documentée ni mention affichée sur la page publique.
- **Stripe n'a jamais tourné contre un vrai compte** (voir §12.7) — le code est en place et vérifié dans la mesure du possible sans identifiants, mais un vrai parcours de paiement (mode test) reste à dérouler une fois avant tout pilote payant.
- **Pas d'application du statut d'abonnement.** Un essai expiré ou un abonnement `past_due`/`canceled` ne bloque rien aujourd'hui — l'organisation garde un accès complet à toutes les fonctionnalités quel que soit `subscription_status`. Choix délibéré pour cette étape (verrouiller l'accès sur une intégration Stripe non testée en conditions réelles aurait été prématuré et risqué de bloquer un pilote par erreur) mais à trancher explicitement avant la Phase C (test média) : qu'est-ce qui se passe vraiment quand l'essai se termine ?
- **"mbQr" n'a subi aucune des quatre vérifications que §2 lui-même liste comme obligatoires** (TMview, UIBM, domaine, stores). Utilisable comme nom de travail pendant le reste du build ; à vérifier avant la Phase B, pas avant — mais ne pas oublier que ça n'a pas été fait, précisément parce que rien dans le produit ne le rappellera tout seul.
- **Les captures d'écran de la landing (`public/screenshots/`, §12.10) se périment.** Ce sont de vraies captures de l'app à un instant donné (menu de démo, tableau de commandes) — un futur changement visuel du dashboard ou du menu public les rendra visuellement en décalage avec le vrai produit. Pas d'automatisation qui les régénère : à refaire manuellement (`Playwright` + jeu de données de démo, voir §12.10) après tout changement notable de ces pages, et certainement avant la Phase A.
- **Pas de témoignages clients sur la landing, volontairement** (§12.10) — à ajouter une fois de vrais retours de pilotes existent (Phase A), jamais avec des noms inventés.
- **Pas de fichier Figma.** Le logo (§12.9) existe en SVG dans le code, pas dans un outil de design — Figma n'est pas connecté à cet environnement. Si quelqu'un d'autre doit itérer visuellement dessus (variantes, retouche par un designer), il faudra soit connecter Figma, soit reconstruire le mark depuis `src/components/logo.tsx`.
