/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs'],
            fileName: 'index',
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: 'tsconfig.prod.json',
        }),
    ],
    test: {
        reporters: 'dot',
    },
});
