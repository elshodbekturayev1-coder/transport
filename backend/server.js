require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routesRouter = require('./routes/routes');
const scheduleRouter = require('./routes/schedule');
const newsRouter = require('./routes/news');
const statsRouter = require('./routes/stats');
const ticketsRouter = require('./routes/tickets');
const searchRouter = require('./routes/search');

const app = express();

// 🔥 PORT (8080 ishlatmoqchi bo‘lsang shuni qoldir)
const PORT = process.env.PORT || 8080;

/**
 * MIDDLEWARE
 */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/**
 * FRONTEND PATH (ENG MUHIM FIX)
 * server.js joylashgan papkaga qarab sozlanadi
 */
const frontendPath = path.join(__dirname, 'frontend');

/**
 * STATIC FRONTEND
 */
app.use(express.static(frontendPath));

/**
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    port: PORT,
    frontendPath
  });
});

/**
 * API TEST
 */
app.get('/api/test', (req, res) => {
  res.json({ ok: true, message: 'API ishlayapti' });
});

/**
 * API ROUTES
 */
app.use('/api/routes', routesRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/news', newsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/search', searchRouter);

/**
 * API 404 (faqat /api uchun)
 */
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API Not Found' });
});

/**
 * FRONTEND ROUTE (SPA FIX)
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/**
 * ERROR HANDLER
 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log('🚀 Server running');
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`👉 API: http://localhost:${PORT}/api/routes`);
});
