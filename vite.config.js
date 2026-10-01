import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

function imageProxyPlugin() {
  return {
    name: 'image-proxy',
    configureServer(server) {
      server.middlewares.use('/api/proxy-image', async (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:5173');
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.end('Missing url parameter');
            return;
          }
          const response = await fetch(targetUrl);
          if (!response.ok) {
            res.statusCode = response.status;
            res.end(`Failed to fetch upstream: ${response.statusText}`);
            return;
          }
          const contentType = response.headers.get('content-type') || 'application/octet-stream';
          res.setHeader('Content-Type', contentType);
          res.setHeader('Access-Control-Allow-Origin', '*');
          const arrayBuffer = await response.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (err) {
          res.statusCode = 500;
          res.end(err.message);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageProxyPlugin()],
  optimizeDeps: {
    include: [
      'sanity',
      'sanity/structure',
      'styled-components',
      '@sanity/client',
      '@sanity/image-url',
      'lucide-react',
      'react-router-dom',
    ],
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});

