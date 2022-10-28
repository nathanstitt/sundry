import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";

const packageName = packageJson.name.replace(RegExp('.*/'), '')


const fileName = {
  es: `${packageName}.mjs`,
  cjs: `${packageName}.cjs`,
  iife: `${packageName}.iife.js`,
};

module.exports = defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'sundry',
      formats: ["es", "cjs", "iife"],
      fileName: (format) => fileName[format],
    },
    rollupOptions: {
      external: ['react', 'lodash-es', '@emotion/css', '@emotion/styled', '@emotion/react'],
      plugins: [excludeDependenciesFromBundle()],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'lodash-es': 'lodashEs',
          '@emotion/css': 'EmotionCSS',
          '@emotion/styled': 'EmotionStyled',
          '@emotion/react': 'EmotionReact',
        },
      }
    }
  },
});


// const getPackageName = () => {
//   return packageJson.name;
// };

// const getPackageNameCamelCase = () => {
//   try {
//     return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
//   } catch (err) {
//     throw new Error("Name property in package.json is missing.");
//   }
// };

// const fileName = {
//   es: `${getPackageName()}.mjs`,
//   cjs: `${getPackageName()}.cjs`,
//   iife: `${getPackageName()}.iife.js`,
// };

// module.exports = defineConfig({
//   base: "./",
//   build: {
//     lib: {
//       entry: path.resolve(__dirname, "src/index.ts"),
//       name: getPackageNameCamelCase(),
//       formats: ["es", "cjs", "iife"],
//       fileName: (format) => fileName[format],
//     },
//   },
// });
