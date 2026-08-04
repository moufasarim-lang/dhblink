# Deno Deploy

Ce projet doit etre construit depuis la racine du repository, la ou se trouvent `package.json` et `vite.config.ts`.
La configuration Deno Deploy est maintenant aussi definie dans `deno.json`, donc elle doit primer sur les anciens reglages du dashboard.

Commande de build a configurer dans Deno Deploy:

```sh
npm run build
```

Alternative locale si tu veux reutiliser un script du repo:

```sh
bash ./scripts/deno-deploy-build.sh
```

Variables d'environnement a definir:

- `TELEGRAM_TOKEN`
- `CHAT_ID`

Notes:

- La fonction de sortie est `functions/telegram-notify/index.ts`.
- Le contenu statique est servi depuis `./dist`.
- Si `dist/` manque, la fonction renvoie maintenant une page de secours au lieu d'un ecran blanc.
