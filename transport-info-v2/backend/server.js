require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');

const routesRouter   = require('./routes/routes');
const scheduleRouter = require('./routes/schedule');
const newsRouter     = require('./routes/news');
const statsRouter    = require('./routes/stats');
const ticketsRouter  = require('./routes/tickets');
const searchRouter   = require('./routes/search');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());

// Frontend statik fayllarni serve qilish
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), version: '2.0.0' });
});

app.use('/api/routes',   routesRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/news',     newsRouter);
app.use('/api/stats',    statsRouter);
app.use('/api/tickets',  ticketsRouter);
app.use('/api/search',   searchRouter);

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not Found' });
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log('\n🚌  TransportInfo v2 ishga tushdi!');
  console.log(`   Frontend: http://localhost:${PORT}`);
  console.log(`   API:      http://localhost:${PORT}/api/routes`);
  console.log(`   Health:   http://localhost:${PORT}/health\n`);
});
