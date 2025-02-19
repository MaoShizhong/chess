import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: './dist/index.js',
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
});
