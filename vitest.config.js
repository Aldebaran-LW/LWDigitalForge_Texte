import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.js',
        exclude: [
            'node_modules/',
            'dist/',
            '.next/',
            'ponto_diario_temp/**',
            '**/*.spec.js',
            '**/useSubscription.test.jsx',
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'src/test/',
                'ponto_diario_temp/**',
                '**/*.spec.js',
                '**/*.test.js',
                '**/index.js',
            ],
        },
    },
});
