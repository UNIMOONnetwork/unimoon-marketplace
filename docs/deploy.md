# Deploy

## GitHub Pages

Primarily you need to specify your repo in `js/packages/web/package.json` file

Pay attention to these two lines:

```json
"deploy:gh": "yarn export && gh-pages -d ../../build/web --repo https://github.com/UNIMOONnetwork/unimoon-marketplace -t true",
"deploy": "cross-env ASSET_PREFIX=/unimoon/ yarn build && yarn deploy:gh",
```

There are 2 things to change:

- specify your repo URL instead of `https://github.com/UNIMOONnetwork/unimoon-marketplace` (for example, `https://github.com/my-name/my-unimoon`)
- set `ASSET_PREFIX` to repo name (for example, `ASSET_PREFIX=/my-unimoon/`)

After that, the lines will look like this:

```json
"deploy:gh": "yarn export && gh-pages -d ../../build/web --repo https://github.com/my-name/my-unimoon -t true",
"deploy": "cross-env ASSET_PREFIX=/my-unimoon/ yarn build && yarn deploy:gh",
```

And after that, you can publish the Unimoon app to GitHub Pages by the following commands:

```bash
cd js/packages/web
yarn deploy
```

Note that if you have 2fa enabled, you'll need to use a personal access token as your password:

https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token

### GitHub Pages with a custom domain

If you have a custom domain linked to the GitHub Pages in your repo, then the instructions are the same as above, but your need to remove `ASSET_PREFIX` from the deploy script:

```json
"deploy:gh": "yarn export && gh-pages -d ../../build/web --repo https://github.com/my-name/my-unimoon -t true"
"deploy": "yarn build && yarn deploy:gh",
```

The publishing commands are the same:

```bash
cd js/packages/web
yarn deploy
```

## Vercel

To publish the Unimoon app to Vercel, you first need to visit [https://vercel.com/](https://vercel.com/) and create a new project linked to your github repo. Then, create a `pages/` directory under `js`.

After that, configure this project with the following settings:

- Framework: `Next.js`
- Root directory: `js`
- Output directory: `packages/web/.next`

One last thing: specify `REACT_APP_STORE_OWNER_ADDRESS_ADDRESS` in the Environment Variables section
