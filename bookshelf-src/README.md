# Bookshelf build tooling

The app itself lives in `static/bookshelf/` and is plain HTML, CSS and
JavaScript modules: edit those files directly, there is no build step for them.

This folder only rebuilds the third-party code the page loads from
`static/bookshelf/vendor/`:

- `anthropic.js` – the Anthropic SDK and Zod, bundled for the browser
- `interestfor.min.js` – polyfill for hover tooltips in Firefox and Safari

Run it after upgrading a dependency:

```bash
npm install
npm run build
```
