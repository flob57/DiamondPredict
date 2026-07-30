# DiamondPredict V3.3

Version gratuite et modulaire avec calendrier MLB, statistiques avancées, cotes The Odds API, favoris et prévisions synchronisés avec Cloudflare D1.

## Nouveautés V3.3

- nouvel onglet **Mes paris** avec match, sélection, bookmaker, cote et mise ;
- calcul automatique du gain potentiel, du bénéfice net, du ROI et du taux de réussite ;
- suivi des statuts en attente, gagné, perdu ou remboursé ;
- règlement automatique lorsque le résultat MLB correspondant est disponible ;
- raccourci **Parier** depuis chaque carte de match et depuis l’analyse ;
- conservation locale des paris dans le navigateur ;
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


## V3.3 — Synchronisation et règlement des paris

- Les paris sont inclus dans la synchronisation Cloudflare D1.
- Les résultats sont détectés automatiquement depuis les matchs MLB terminés (jusqu’à 180 jours).
- Le statut peut être corrigé manuellement : gagné, perdu, remboursé ou en attente.
- Un pari peut être modifié ou supprimé ; la suppression est répliquée sur les autres appareils.
- Aucun nouveau binding n’est nécessaire : la Function crée automatiquement la table `user_bets_state`. Le fichier `schema.sql` peut aussi être exécuté manuellement.


## V3.3 — Laboratoire d’apprentissage

- bilan automatique des prévisions terminées ;
- performances par tranche de probabilité, Diamond Score et Value ;
- détection de la surconfiance du modèle ;
- classement des défaites les plus surprenantes ;
- signaux d’autopsie pour guider les prochains ajustements ;
- enregistrement enrichi des futures prévisions (qualité, marché, facteurs et lanceurs).

Les diagnostics sont statistiques : ils signalent des biais possibles sans prétendre connaître à eux seuls la cause sportive exacte d’une défaite.
