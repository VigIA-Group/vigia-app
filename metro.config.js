// metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add .mjs to recognized source extensions.
config.resolver.sourceExts = [...config.resolver.sourceExts, "mjs"];

/**
 * Fix ESM/CJS interop issues on web.
 *
 * Metro may process ES-module files and use the "import" condition from
 * package exports. Two packages cause a runtime crash on web:
 *
 * 1. framer-motion (via moti): Moti's ESM build exports from framer-motion,
 *    which picks its ESM build (.mjs). That file imports tslib/modules/index.js
 *    using "import tslib from 'tslib'". If Metro's interop doesn't wrap the
 *    CJS tslib correctly, tslib.default ends up undefined at runtime:
 *    "Cannot destructure property '__extends' of 'tslib.default' as it is undefined."
 *    Fix: redirect framer-motion to its CJS bundle inside moti's node_modules.
 *
 * 2. tslib: Always use the main CJS bundle (tslib.js) regardless of how it is
 *    imported (ESM default, named, or namespace). The CJS bundle exports
 *    __extends, __assign, etc. directly on module.exports, avoiding any
 *    .default interop issue.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "framer-motion") {
    const motiCjs = path.join(
      __dirname,
      "node_modules/moti/node_modules/framer-motion/dist/cjs/index.js"
    );
    return { filePath: motiCjs, type: "sourceFile" };
  }
  if (moduleName === "tslib") {
    return {
      filePath: path.join(__dirname, "node_modules/tslib/tslib.js"),
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
