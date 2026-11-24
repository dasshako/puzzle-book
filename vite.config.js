import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite only appends __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS to an existing
// allowedHosts array. The preview passes that variable; without it the default
// Vite behaviour is untouched.
const previewHosts = (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS || '')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    ...(process.env.BASE44_PREVIEW_MODE === '1' && previewHosts.length > 0
      ? { allowedHosts: previewHosts }
      : {}),
  },
  plugins: [react()],
});
