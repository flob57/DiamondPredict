# DiamondPredict V0.4

Application web personnelle de démonstration consacrée à l’analyse de matchs MLB.

## Nouveautés

- Tableau de bord complet
- Match vedette
- Top 5 Value
- Alertes de mouvements de cotes et changements de lanceurs
- Calendrier sur plusieurs jours
- Comparateur de bookmakers
- Analyse détaillée avec contexte, forme, bullpen et confrontations
- Pitcher Center enrichi
- Synthèse automatique du pronostic
- Historique, calibration et ROI simulé
- Favoris persistants
- Mode clair, sombre et compact
- Installation comme PWA
- Logos distants avec repli automatique vers des fichiers locaux

## Déploiement GitHub + Cloudflare Pages

1. Crée un nouveau dépôt GitHub.
2. Décompresse l’archive.
3. Envoie tous les fichiers à la racine du dépôt.
4. Dans Cloudflare Pages, connecte le dépôt.
5. Framework preset : `None`.
6. Build command : laisser vide.
7. Build output directory : `/`.

## Logos des équipes

Par défaut, l’application tente de charger des logos distants. Tu peux désactiver cette option dans **Réglages** et ajouter tes propres fichiers PNG dans :

`assets/logos/`

Les noms attendus sont les codes MLB en minuscules :

- `nyy.png`
- `bos.png`
- `lad.png`
- `sd.png`
- `hou.png`
- `tex.png`
- `phi.png`
- `mia.png`
- `atl.png`
- `chc.png`
- `tor.png`
- `sea.png`
- `tb.png`
- `mil.png`
- `nym.png`

L’application affiche automatiquement un badge texte si un logo manque.

## Important

Toutes les données, cotes, prévisions, alertes, performances et synthèses de cette version sont fictives. Cette version sert à valider l’interface avant la connexion à des API réelles.
