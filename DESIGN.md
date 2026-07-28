# DESIGN.md — Direction visuelle

> Référencé depuis CONTEXT.md. À lire avant toute écriture de UI.
> Références visuelles : `/design/refs/*.jpg` — charge-les avant de coder.

## Principe directeur

Le produit vend **une commande qui arrive en cuisine en 2 secondes**. Toute la page d'accueil doit faire *ressentir* cette immédiateté, pas la décrire. Le mouvement sert cette idée ou n'existe pas.

## Tokens de couleur

```css
--ink:      #0E1418;  /* sections sombres, texte principal */
--paper:    #F6F7F5;  /* fond clair (neutre froid, jamais crème) */
--surface:  #FFFFFF;  /* cartes flottantes */
--brand:    #1E6F52;  /* basilic — accent de marque, CTA */
--signal:   #E8873A;  /* ambre — statut "à faire", urgence */
--progress: #4A7FB5;  /* ardoise — statut "en cours" */
--muted:    #6B7580;  /* texte secondaire, labels */
```

**Codage sémantique strict** — la couleur porte de l'information, jamais de la décoration :
- ambre = à faire · ardoise = en cours · basilic = prêt/live
- Un point qui pulse = flux temps réel actif. Nulle part ailleurs.

## Typographie

| Rôle | Police | Usage |
|---|---|---|
| Display | Bricolage Grotesque | titres de section uniquement, poids 600-700, tracking serré |
| Corps / UI | Inter | tout le reste, 400-500 |
| Données | Inter avec `font-variant-numeric: tabular-nums` | chiffres, prix, KPI — l'alignement des colonnes est non négociable |

Échelle : 14 / 16 / 20 / 28 / 40 / 56. Pas de valeurs intermédiaires improvisées.

## Vocabulaire de layout

Les patterns à reproduire (conventions SaaS génériques, pas une identité empruntée) :

1. **Mockups comme visuel héros** — cadre iPhone pour le mobile, chrome de navigateur (pastilles rouge/jaune/vert + barre d'URL) pour le dashboard.
2. **Cartes flottantes en profondeur** — 2 à 3 cartes qui débordent du mockup à des z-index différents, ombres douces et larges. Chacune montre **une vraie donnée produit** : une notification de nouvelle commande, un aperçu de sticker QR, un CA du jour avec mini-graphe.
3. **Alternance clair / sombre** entre sections. Le dashboard se montre toujours sur fond sombre.
4. **Rayons généreux** : 16px cartes, 24px conteneurs, 999px pills.
5. **Texture de fond** : grille de points très discrète (opacité ≤ 4%) sur les sections claires uniquement.
6. **Lignes de commande** : bordure gauche colorée 3px + pill de statut à droite.

```
┌─────────────────────────────────────┐
│  [logo]                      [menu] │
│                                     │
│         ┌──────────────┐            │
│    ┌────┤              ├────┐       │  ← cartes flottantes
│    │ QR │   mockup     │ CA │       │     décalées en z
│    └────┤   device     ├────┘       │
│         │              │            │
│         └──────────────┘            │
│              DÉFILER ⌄              │
└─────────────────────────────────────┘
```

## Élément signature

**La carte de commande vivante.** Dans le héros, une commande réelle glisse dans la pile toutes les ~6 secondes : elle entre en ambre ("à faire"), le compteur de temps démarre, puis elle bascule en basilic ("prête") et sort. En boucle, silencieuse.

C'est le seul endroit où l'on dépense de l'audace. Tout le reste autour reste calme.

## Mouvement

**Librairie** : Framer Motion (`whileInView` pour les révélations au scroll).

| Effet | Spécification |
|---|---|
| Révélation au scroll | `opacity 0→1`, `translateY 16px→0`, 500ms, `ease-out`, déclenchée à 15% de visibilité, **une seule fois** (`viewport={{ once: true }}`) |
| Décalage en cascade | 60ms entre éléments frères, maximum 4 éléments |
| Cartes flottantes | dérive verticale ±6px, 8s, `ease-in-out`, en boucle |
| Point "en direct" | pulse d'opacité 2s |
| Compteurs KPI | comptage animé sur 800ms à la première apparition |
| Hover cartes | `translateY -2px` + ombre renforcée, 200ms |

**Règles non négociables :**
- `prefers-reduced-motion: reduce` → toutes les animations désactivées, contenu immédiatement visible. Ce n'est pas optionnel.
- Aucun parallaxe, aucune rotation, aucun effet d'apparition lettre par lettre.
- Rien ne bouge en boucle sauf la carte signature, les cartes flottantes et le point live.
- Si un élément anime sans raison narrative, le supprimer. Le sur-animé est le tell principal d'une page générée.

## Plancher de qualité

- Responsive jusqu'à 360px de large
- Focus clavier visible partout
- Le menu public (`/m/[slug]?t=N`) charge en moins de 2s sur 3G — pas d'animation lourde sur ce chemin, la faim ne scrolle pas
- Contraste AA minimum sur tout texte

## Copie

Voix : verbes simples, phrases courtes, en italien. On décrit ce que fait le produit, on ne le vend pas. Les boutons disent ce qui va se passer ("Voir la démo", jamais "Envoyer"). Un libellé garde le même mot dans tout le flux.

---

## ⚠️ Ce qu'on ne reprend pas des références

Les captures dans `/design/refs/` servent de vocabulaire de **structure et de mouvement**, qui relève des conventions SaaS courantes. Ne pas reprendre : le logo, la palette bleue, les textes, le nom. La palette ci-dessus est délibérément différente.
