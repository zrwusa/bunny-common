export default [
  {
    entryPoints: {
      "bunny-common": "src/index.ts"
    },
    target: 'es6',
    format: ["iife"],
    clean: true,
    sourcemap: true,
    minify: true,
    outDir: "dist/umd",
    globalName: "bunnyCommon",
    platform: "browser",
    bundle: true,
    outExtension() {
      return {
        js: `.min.js`,
      }
    },
  },
  {
    entryPoints: {
      "bunny-common": "src/index.ts"
    },
    target: 'es6',
    format: ["iife"],
    clean: true,
    sourcemap: false,
    minify: false,
    outDir: "dist/umd",
    globalName: "bunnyCommon",
    platform: "browser",
    bundle: true,
    outExtension() {
      return {
        js: `.js`,
      }
    },
  }
];
