const express = require('express');
const router  = express.Router();
const store   = require('../data/store');

// Realistic hourly passenger base pattern (index 0 = 00:00)
const BASE_HOURLY = [
  80, 60, 40, 30, 50, 180,
  620, 1100, 1640, 1820, 1580, 1390,
  1150, 980, 860, 750, 820, 1100,
  980, 760, 540, 380, 220, 140,
];

router.get('/', (_req, res) => {
  const routes      = store.routes;
  const activeCount = routes.filter(r => r.status === 'active').length;
  const delayCount  = routes.filter(r => r.status === 'delay').length;
  const stoppedCount= routes.filter(r => r.status === 'stopped').length;

  const hour  = new Date().getHours();
  const scale = Math.max(routes.length / 7, 1); // scale passengers by route count

  // Chart shows hours 6–23 (18 bars)
  const hourly = BASE_HOURLY.slice(6, 24).map((v, i) => {
    const h = 6 + i;
    if (h > hour) return 0;
    // Jitter only the current hour so historical bars stay stable
    const jitter = h === hour ? 1 + (Math.random() * 0.06 - 0.03) : 1;
    return Math.round(v * scale * jitter);
  });

  const passengers = BASE_HOURLY.slice(0, hour + 1)
    .reduce((sum, v) => sum + Math.round(v * scale), 0);

  res.json({
    success: true,
    data: { activeRoutes: activeCount, delays: delayCount, stopped: stoppedCount, passengers, currentHour: hour, hourly },
  });
});

module.exports = router;
