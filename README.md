# DiamondPredict 0.5 — calendrier MLB réel

Cette version connecte l'application au flux MLB pour afficher :

- le véritable calendrier MLB sur 7 jours ;
- les horaires convertis en heure française ;
- les stades ;
- les bilans des équipes ;
- les lanceurs probables annoncés ;
- le statut des rencontres ;
- les scores en direct et les résultats finaux.

## Déploiement Cloudflare Pages

1. Remplace les anciens fichiers de ton dépôt GitHub par tout le contenu de ce dossier.
2. Vérifie que le dossier `functions/api/mlb.js` est bien présent dans GitHub.
3. Redéploie le projet Cloudflare Pages.
4. Aucune clé API n'est nécessaire pour cette étape.

La fonction Cloudflare `/api/mlb` sert de relais entre l'interface et le flux MLB. Elle met les réponses en cache pendant 60 secondes.

## Important

Les probabilités de la V0.5 sont encore **préliminaires**. Elles utilisent uniquement le bilan réel des équipes et un léger avantage domicile. Les cotes bookmakers, la forme récente, les statistiques complètes des lanceurs et le véritable moteur prédictif seront connectés ensuite.

## Test

Après le déploiement, ouvre :

`https://TON-SITE.pages.dev/api/mlb`

Tu dois obtenir du JSON contenant `source`, `dates` et `totalGames`.
