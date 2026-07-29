# DiamondPredict V3.0

Version gratuite et modulaire avec calendrier MLB, statistiques avancées, cotes The Odds API, favoris et prévisions synchronisés avec Cloudflare D1.

## Nouveautés V3.0

- correction du bug `undefined–undefined` dans l’historique ;
- exclusion stricte des rencontres non terminées ou sans score numérique ;
- historique filtrable par date, équipe et verdict ;
- comparaison entre résultat réel et prévision enregistrée avant match ;
- fiche d’analyse enrichie : forme récente, runs, OPS, moyenne au bâton, ERA et WHIP collectifs ;
- duel détaillé des lanceurs ;
- consensus des bookmakers, meilleures cotes et niveau de value ;
- dix dernières confrontations terminées ;
- IA Coach, Diamond Score, risque et qualité des données ;
- favoris et prévisions synchronisés entre PC et iPhone.

## Installation

Copier tout le contenu du dossier dans le dépôt GitHub. Conserver :

- `functions/api/mlb.js`
- `functions/api/odds.js`
- `functions/api/history.js`
- `functions/api/h2h.js`
- `functions/api/sync.js`

Bindings et secrets Cloudflare nécessaires :

- secret `ODDS_API_KEY` ;
- secret `DIAMOND_SYNC_KEY` ;
- binding D1 nommé `DB` vers la base DiamondPredict.

Exécuter `schema.sql` dans la console D1 si cela n’a pas déjà été fait, puis redéployer.

## Vérifications

- `/api/mlb`
- `/api/odds`
- `/api/history?days=90`

L’API historique ne renvoie désormais que des matchs terminés disposant de deux scores numériques.
