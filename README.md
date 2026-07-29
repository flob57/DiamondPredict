# DiamondPredict V1.0 — Laboratoire

Application personnelle d'analyse MLB pour Cloudflare Pages.

## Données réellement connectées
- calendrier MLB sur 7 jours ;
- horaires en heure française ;
- équipes et bilans ;
- stades ;
- lanceurs probables annoncés ;
- statuts, scores en direct et résultats.

## Nouveautés V1.0
- Score Diamond sur 100 ;
- indice de risque ;
- simulation pédagogique de 10 000 matchs ;
- IA Coach explicative ;
- momentum estimé ;
- Value Index ;
- évolution du pronostic ;
- historique local des prévisions ;
- mode Laboratoire avec pondérations et influence des variables.

## Important
Les éléments avancés (Score Diamond, risque, momentum, Value Index et simulation) restent des **estimations** tant que les cotes, statistiques détaillées des lanceurs, bullpen, blessures, météo et Statcast ne sont pas connectés. L'interface distingue volontairement les données réelles des données estimées.

## Déploiement
1. Décompresser l'archive.
2. Remplacer le contenu du dépôt GitHub par le contenu du dossier `diamondpredict-v1.0`.
3. Conserver le dossier `functions/api/mlb.js`.
4. Redéployer Cloudflare Pages.
5. Vérifier `https://ton-site.pages.dev/api/mlb`.

Aucune clé API n'est nécessaire pour le calendrier MLB actuel.
