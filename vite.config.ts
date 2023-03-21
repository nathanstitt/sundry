import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";
import excludeDependenciesFromBundle from "rollup-plugin-exclude-dependencies-from-bundle";
import typescript from '@rollup/plugin-typescript'


const config = defineConfig({
    base: "./",
    debug: true,
    build: {
        emptyOutDir: true,
        minify: false,
        lib: {
            entry: {
                'all': './src/all.ts',
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
