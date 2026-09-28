import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const prodSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com https://*.google.com https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com; frame-src 'self' https://www.google.com https://maps.google.com; form-action 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self';",
};

const devSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://maps.googleapis.com https://maps.gstatic.com https://*.google.com https://images.unsplash.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://maps.googleapis.com ws://localhost:* http://localhost:*; frame-src 'self' https://www.google.com https://maps.google.com; form-action 'self'; frame-ancestors 'self'; object-src 'none'; base-uri 'self';",
};

// Security middleware to prevent SPA Fallback False Positives on sensitive paths
function securityHeadersPlugin() {
  const isBlockedPath = (url: string): boolean => {
    const cleanUrl = url.split('?')[0].toLowerCase();
    // Block dotfiles (.env, .git, .DS_Store, etc.)
    if (/^\/\..+/.test(cleanUrl)) return true;
    // Block sensitive backup/config/archive extensions
    if (/\.(bak|php|sql|conf|config|ini|log|sh|zip|tar|gz|tgz|rar|7z)$/.test(cleanUrl)) return true;
    // Block probe endpoints that don't exist in our frontend app
    if (
      cleanUrl.startsWith('/api/') ||
      cleanUrl === '/api' ||
      cleanUrl.startsWith('/rest/') ||
      cleanUrl === '/rest' ||
      cleanUrl.startsWith('/ftp') ||
      cleanUrl === '/crossdomain.xml' ||
      cleanUrl.startsWith('/actuator') ||
      cleanUrl.startsWith('/upload') ||
      cleanUrl.startsWith('/filemanager') ||
      cleanUrl.startsWith('/cron') ||
      cleanUrl.startsWith('/scheduler') ||
      cleanUrl.startsWith('/wp-admin') ||
      cleanUrl.startsWith('/administrator') ||
      cleanUrl.startsWith('/phpmyadmin') ||
      cleanUrl.startsWith('/pma') ||
      cleanUrl.startsWith('/cpanel') ||
      cleanUrl.startsWith('/webmail') ||
      cleanUrl.startsWith('/adminer') ||
      cleanUrl.startsWith('/dbadmin') ||
      cleanUrl.startsWith('/jenkins') ||
      cleanUrl.startsWith('/gitlab') ||
      cleanUrl.startsWith('/grafana') ||
      cleanUrl.startsWith('/kibana') ||
      cleanUrl.startsWith('/portainer') ||
      cleanUrl.startsWith('/traefik') ||
      cleanUrl.startsWith('/server-status') ||
      cleanUrl.startsWith('/server-info') ||
      cleanUrl.startsWith('/elmah') ||
      cleanUrl.startsWith('/_debug')
    ) {
      return true;
    }
    return false;
  };

  const handleMiddleware = (req: any, res: any, next: () => void) => {
    if (req.url && isBlockedPath(req.url)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('404 Not Found');
      return;
    }
    next();
  };

  return {
    name: 'security-probe-blocker',
    configureServer(server: any) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server: any) {
      server.middlewares.use(handleMiddleware);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), securityHeadersPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    headers: devSecurityHeaders,
  },
  preview: {
    port: 4173,
    headers: prodSecurityHeaders,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
  // @ts-expect-error vitest config
  test: {
    globals: true,
    environment: 'jsdom',
    passWithNoTests: true,
  },
});

