/**
 * Vite Configuration
 * 
 * Build tool configuration for the Heva frontend application.
 * Optimizes the development experience and production builds.
 * 
 * Features:
 * - React plugin integration for JSX/TSX support
 * - Lucide React optimization exclusion to prevent build issues
 * - Fast HMR (Hot Module Replacement) for development
 * - Optimized bundling for production
 * 
 * @see https://vitejs.dev/config/
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude to prevent icon loading issues
  },
});
