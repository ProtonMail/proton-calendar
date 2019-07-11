# Proton Calendar

Proton Calendar built with React.

## Basic installation

To set up the project, follow the steps below:

1. Create a file `appConfig.json` at the root of your project. To set up the dev env config for this app, add the clientiD `<clientID>` inside appConfig.json (cf. [How to dev](https://github.com/ProtonMail/proton-pack#dev-env))

```json
{
    "appConfig": {
        "clientId": "WebSettings"
    }
}
```

2. `npm install`

3. `npm start`

>:warning: Do not commit appConfig.json . Notice it's already inside .gitignore

## How to deploy

- `$ npm run deploy -- --branch=<deploy-X> --api=<target>`
_Deploy the app as /calendar_

- `$ npm run deploy:standalone -- --branch=<deploy-X> --api=<target>`
_Deploy the app as deploy + /login_

Based on [proton-bundler](https://github.com/ProtonMail/proton-bundler)

## I18N

### Upgrade translations [App  to crowdin]

You can sync them via `$ npm run i18n:upgrade`, it will:
- Extract translations
- Push them to crowndin
- Create a commit with them on the repo

### Sync translations inside the app [Crowdin to our App]

To get latest translations available on crowdin, you can run `$ npm run i18n:getlatest`.
It will:
- Get list of translations available (default same as proton-i18n crowdin --list --type --limit=95)
- Upgrade our translations with ones from crowdin
- Store a cache of translations available in the app
- Export translations as JSON
- Commit everything

> :warning: If you want to get only a **custom** list of translations, configure it inside `po/i18n.txt` and run `$ npm run i18n:getlatest -- --custom`
