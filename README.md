# DiamondPredict V2.1

Version gratuite avec calendrier MLB, statistiques avancées, cotes The Odds API, favoris, confrontations directes et historique des prévisions.

## Installation

Copiez tout le contenu de ce dossier à la racine du dépôt GitHub. Les dossiers `assets/` et `functions/` doivent rester à la racine.

## Secret Cloudflare obligatoire pour les cotes

Dans **Cloudflare > Workers & Pages > DiamondPredict > Settings > Variables and Secrets**, ajoutez un secret chiffré :

- Nom : `ODDS_API_KEY`
- Valeur : votre clé The Odds API

Ajoutez-le dans **Production** et, si vous testez des URL de prévisualisation, également dans **Preview**. Redéployez après l'ajout.

## Tests

- `/api/mlb` : calendrier et statistiques MLB
- `/api/odds` : cotes et quota restant
- `/api/history?days=30` : résultats terminés
- `/api/h2h?away=143&home=146` : confrontations entre deux équipes

## Fonctionnement

- Les cotes utilisent le marché `h2h` et la région `eu`.
- La réponse des cotes est mise en cache environ 15 minutes afin d'économiser les crédits.
- Les favoris et prévisions sont enregistrés dans le navigateur (`localStorage`). Ils ne sont donc pas encore synchronisés entre PC et iPhone.
- L'historique compare uniquement les résultats aux prévisions qui ont été enregistrées avant le match sur cet appareil.
