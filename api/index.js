import express from 'express';
import { registerRoutes } from '../server/routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register your routes
await registerRoutes(app);

// Serve static files from dist/public
app.use(express.static('dist/public'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/dist/public/index.html');
});

export default app;
