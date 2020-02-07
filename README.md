[![CircleCI](https://circleci.com/gh/ProtonMail/proton-calendar.svg?style=svg)](https://circleci.com/gh/ProtonMail/proton-calendar)

# Proton Calendar

Proton Calendar built with React.



>**⚠ If you use Windows plz follow this document before anything else [how to prepare Windows](https://github.com/ProtonMail/proton-shared/wiki/setup-windows)**



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

### Deploy to prod

`$ npm run deploy:prod` 

> Build from master post git clone into /tmp. `--no-remote` build from local.


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

## :rocket: Create a new version (before deploy)

This command will:

- Manage dependencies (detect and update the lock)
- Take care of active npm links
- run npm version

```sh
$ npx proton-version <patch|minor|major>
```
> Default is patch

If you want to force the update of all dependencies add the flag `--all`;

By default it provides a prompt and ask you what you want to update etc.

> If you have an active `npm link` it will remove it from your node_modules.