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

const config = defineConfig({
  base: "./",
  build: {
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'sundry',
      formats: ["es", "cjs"],
      fileName: (format) => fileName[format],
    },
    rollupOptions: {
      external: ['react', '@emotion', '@emotion/css', '@emotion/styled', '@emotion/react'],
      plugins: [excludeDependenciesFromBundle()],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lodash-es': 'lodashEs',
          '@emotion/css': 'EmotionCSS',
          '@emotion/styled': 'EmotionStyled',
          '@emotion/react': 'EmotionReact',
        },
      }
    }
  },
});

export default config
