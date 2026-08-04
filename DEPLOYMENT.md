# Deno Deploy

Ce projet doit etre construit depuis la racine du repository, la ou se trouvent `package.json` et `vite.config.ts`.

Commande de build a configurer dans Deno Deploy:

```sh
cd /tmp/build && npm install && npm run build
```

Alternative plus portable si tu preferes lancer un script du repo:

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
