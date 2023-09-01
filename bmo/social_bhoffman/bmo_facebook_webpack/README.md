# navori-boilerplate
Boilerplate for Navori template

### Requirements
 * NodeJs v 14.8.3 or greater

### Instructions
 * run `npm install`
 * run `npm run start` for dev mode
 * run `npm run build` for production. outputs into `dist` directory
 * all source code is required to live in the `src` directory
 * all static assets in the `assets` directory will be copied over to the build
 * all other files are dynamically imported and moved to the build
 * index.html does not need <script> or <link> tags. webpack dynamically adds them in the build
 * to code in plain old javascript, change the webpack.config.js entry point from `index.ts` to `index.js
```
{
  entry: {
    index: {
    import:
      ["./src/js/index.js", "./src/styles/index.css"],
    }
  ,
  }
}
```