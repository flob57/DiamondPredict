# DiamondPredict V1.1 — Données avancées gratuites

Cette version conserve le calendrier, les scores et les résultats MLB réels, puis ajoute des statistiques avancées sans clé API et sans abonnement payant.

## Sources utilisées

- MLB Stats API : calendrier, équipes, résultats, lanceurs probables et statistiques de saison.
- Historique récent MLB : forme sur 5 et 10 matchs, différentiel de points, performances domicile/extérieur sur les 35 derniers jours.

Aucune API payante n'est requise. Aucune clé secrète n'est nécessaire.

## Nouveautés

- ERA, WHIP, victoires/défaites, K/9 et BB/9 des lanceurs annoncés ;
- forme réelle sur 5 et 10 matchs ;
- différentiel de points récent ;
- OPS offensif de saison lorsqu'il est fourni par la MLB ;
- ERA collective de l'équipe lorsqu'elle est fournie ;
- prise en compte du repos ;
- nouveau modèle pondéré uniquement avec des statistiques gratuites ;
- indicateur de qualité des données pour chaque match ;
- mode dégradé automatique lorsqu'une statistique MLB est indisponible.

## Installation

1. Supprimer les anciens fichiers du dépôt GitHub.
2. Copier tout le contenu du dossier `diamondpredict-v1.1` à la racine du dépôt.
3. Conserver impérativement :

```text
functions/
└── api/
    └── mlb.js
```

4. Attendre le redéploiement Cloudflare Pages.
5. Tester :

```text
https://votre-site.pages.dev/api/mlb
```

La réponse doit contenir une section `advanced` avec `recent`, `teamStats`, `pitchers` et `warnings`.

## Important

Les probabilités restent des estimations statistiques et ne garantissent aucun résultat. Les cotes des bookmakers ne sont pas intégrées dans cette version afin de conserver une solution gratuite et stable.
