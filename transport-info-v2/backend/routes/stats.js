const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  const hour = new Date().getHours();
  const base = [120,90,110,300,820,1240,1580,1820,1640,1390,1150,980,860,750,680,720,890,1100,980,760,540,380,220,140];
  const hourly = base.slice(6, 18);
  res.json({
    success: true,
    data: {
      activeRoutes: 42,
      delays:       7,
      stopped:      2,
      passengers:   12840,
      currentHour:  hour,
      hourly,
    }
  });
});

module.exports = router;
