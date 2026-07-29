# DiamondPredict V2.0

Version entièrement modulaire et gratuite.

## Déploiement Cloudflare Pages

Copier **tout le contenu** de ce dossier à la racine du dépôt GitHub. L’arborescence doit rester exactement ainsi :

```
index.html
assets/
  css/app.css
  js/app.js
  js/api.js
  js/model.js
  js/ui.js
  js/utils.js
  js/config.js
functions/
  api/mlb.js
```

Après déploiement, vérifier d’abord :

`https://votre-site.pages.dev/api/mlb`

Puis ouvrir la page principale. Aucun abonnement ni clé API n’est nécessaire.

## Architecture

- `api.js` : appels réseau
- `model.js` : calcul des probabilités
- `ui.js` : composants HTML
- `app.js` : navigation et orchestration
- `functions/api/mlb.js` : passerelle Cloudflare vers les données MLB
