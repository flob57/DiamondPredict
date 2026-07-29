# DiamondPredict V2.1 Sync

Cette édition conserve toutes les fonctions de la V2.1 et synchronise gratuitement les favoris et les prévisions entre PC et iPhone grâce à Cloudflare D1. Le stockage local reste actif comme solution de secours.

## 1. Copier les fichiers

Copiez tout le contenu de ce dossier à la racine du dépôt GitHub. Les dossiers `assets/` et `functions/` doivent rester à la racine.

## 2. Conserver le secret des cotes

Dans Cloudflare Pages, gardez le secret :

- `ODDS_API_KEY` = votre clé The Odds API

## 3. Créer la base D1 gratuite

Dans Cloudflare : **Storage & Databases > D1 SQL Database > Create database**. Nommez-la par exemple `diamondpredict-db`.

Ouvrez ensuite la console SQL de cette base et exécutez le contenu du fichier `schema.sql`.

## 4. Relier D1 au projet Pages

Dans **Workers & Pages > DiamondPredict > Settings > Bindings**, ajoutez un binding D1 :

- Variable name : `DB`
- D1 database : `diamondpredict-db`

Ajoutez-le à Production et à Preview si vous utilisez les URL de prévisualisation.

## 5. Ajouter la clé personnelle de synchronisation

Dans **Variables and Secrets**, créez un secret :

- Nom : `DIAMOND_SYNC_KEY`
- Valeur : une phrase secrète personnelle de votre choix

Exemple de format : `Diamond-Florian-2026-une-suite-personnelle` (ne reprenez pas cet exemple mot pour mot). Utilisez la même valeur dans Production et Preview si nécessaire. Ne mettez jamais cette valeur dans GitHub.

Redéployez le projet après avoir ajouté le binding et le secret.

## 6. Connecter les appareils

Dans DiamondPredict, ouvrez **Favoris > Synchronisation personnelle**. Saisissez exactement la valeur de `DIAMOND_SYNC_KEY`, puis cliquez sur **Connecter et synchroniser**. Répétez sur le PC et l’iPhone.

Au premier raccordement, les favoris des deux appareils sont fusionnés. Pour les prévisions portant sur le même match, la plus récente est conservée.

## Tests

- `/api/mlb` : données MLB
- `/api/odds` : cotes
- `/api/sync` sans en-tête : doit répondre 401, ce qui est normal

## Sécurité et fonctionnement

- L’accès à `/api/sync` exige le secret `DIAMOND_SYNC_KEY`.
- La clé saisie dans l’application reste dans le stockage local de l’appareil et voyage uniquement en HTTPS.
- Les favoris et prévisions restent aussi dans `localStorage`, donc l’application continue de fonctionner si D1 est temporairement indisponible.
- Cette solution est dimensionnée pour un usage personnel et reste largement dans les quotas gratuits de Cloudflare D1.
