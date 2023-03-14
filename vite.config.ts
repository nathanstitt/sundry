import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";
import typescript from '@rollup/plugin-typescript'

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
        minify: false,
        lib: {
            entry: {
                'index': './src/index.ts',
                'base': './src/base.ts',
                'ui': './src/ui.ts',
                'form': './src/form.tsx',
                'modal': './src/modal.tsx',
                'menu': './src/menu.tsx',
            },
        },
        rollupOptions: {
            external: ['react', '@emotion', '@emotion/css', '@emotion/styled', '@emotion/react'],
            plugins: [excludeDependenciesFromBundle(), typescript()],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'lodash-es': 'lodashEs',
                    '@restart/ui': '@restart/ui',
                    '@emotion/css': 'EmotionCSS',
                    '@emotion/styled': 'EmotionStyled',
                    '@emotion/react': 'EmotionReact',
                },
            }
        }
    },
    test: {
        environment: 'jsdom',
    },
});

export default config
