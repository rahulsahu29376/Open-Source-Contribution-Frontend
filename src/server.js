import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;
const distPath = path.resolve(__dirname, '../dist');

// Serve static files from the Vite build directory
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'frontend' });
});

// Single Page Application (SPA) catch-all: serve index.html for all client routes
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build not found. Please ensure "npm run build" was executed.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend production server running on http://0.0.0.0:${PORT}`);
});
