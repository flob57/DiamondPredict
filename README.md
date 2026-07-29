# DiamondPredict V0.2

Application web progressive de démonstration consacrée aux probabilités MLB.

## Nouveautés
- barre de victoire plus visuelle ;
- notes Diamond sur 10 ;
- comparateur de cotes ;
- meilleure cote mise en évidence ;
- évolution simulée des cotes ;
- détection de value ;
- explication des facteurs du modèle ;
- Pitcher Center avec ERA, WHIP et FIP ;
- onglets Matchs, Cotes, Analyses, Favoris, Historique et Réglages ;
- favoris persistants dans le navigateur ;
- mode compact et thème clair/sombre ;
- installation PWA et fonctionnement hors ligne.

## Déploiement Cloudflare Pages
1. Créer un dépôt GitHub vide.
2. Envoyer tous les fichiers contenus dans ce dossier à la racine du dépôt.
3. Dans Cloudflare Pages, connecter le dépôt.
4. Framework preset : `None`.
5. Build command : laisser vide.
6. Build output directory : `/`.

## Important
Toutes les rencontres, statistiques, cotes et performances sont fictives dans cette version. Elles servent uniquement à valider l’interface. La prochaine étape sera la connexion à des API réelles via un Cloudflare Worker afin de ne jamais exposer les clés API dans le navigateur.
