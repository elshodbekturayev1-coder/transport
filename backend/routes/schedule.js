const express = require('express');
const router  = express.Router();
const store   = require('../data/store');

// Hardcoded detailed schedules for original routes
const schedules = {
  1: { route: "42 — Chilonzor → Yunusobod", timetable: [
    { time:'06:00', stop:"Chilonzor metro",      status:'passed'  },
    { time:'06:18', stop:"Do'stlik ko'chasi",    status:'passed'  },
    { time:'06:35', stop:"Beruniy",              status:'passed'  },
    { time:'06:52', stop:"Buyuk ipak yo'li",     status:'passed'  },
    { time:'07:10', stop:"Mustaqillik maydoni",  status:'coming'  },
    { time:'07:28', stop:"Amir Temur xiyoboni",  status:'pending' },
    { time:'07:45', stop:"Sharq",                status:'pending' },
    { time:'08:02', stop:"Yunusobod 1",          status:'pending' },
    { time:'08:20', stop:"Yunusobod bozori",     status:'pending' },
  ]},
  2: { route: "17 — Sergeli → Markaziy bozor", timetable: [
    { time:'05:30', stop:"Sergeli 1",            status:'passed'  },
    { time:'05:48', stop:"Sergeli 3",            status:'passed'  },
    { time:'06:05', stop:"Qurilish",             status:'passed'  },
    { time:'06:22', stop:"Olmazar",              status:'coming'  },
    { time:'06:40', stop:"Eski shahar",          status:'pending' },
    { time:'06:58', stop:"Chorsu",               status:'pending' },
    { time:'07:15', stop:"Markaziy bozor",       status:'pending' },
  ]},
  3: { route: "88 — Mirobod → Olmazor", timetable: [
    { time:'06:00', stop:"Mirobod",              status:'passed'  },
    { time:'06:15', stop:"Shayxontohur",         status:'passed'  },
    { time:'06:30', stop:"Eski shahar",          status:'coming'  },
    { time:'06:45', stop:"Sobir Rahimov",        status:'pending' },
    { time:'07:00', stop:"Olmazor",              status:'pending' },
  ]},
  4: { route: "M1 — Metro Chilonzor liniyasi", timetable: [
    { time:'06:00', stop:"Buyuk ipak yo'li",     status:'passed'  },
    { time:'06:04', stop:"Chilonzor",            status:'passed'  },
    { time:'06:08', stop:"Mirzo Ulug'bek",       status:'passed'  },
    { time:'06:12', stop:"Hamza",                status:'coming'  },
    { time:'06:16', stop:"Oybek",                status:'pending' },
    { time:'06:20', stop:"Mustaqillik maydoni",  status:'pending' },
    { time:'06:24', stop:"Kosmonavtlar",         status:'pending' },
  ]},
  5: { route: "M2 — Metro O'zbekiston liniyasi", timetable: [
    { time:'06:00', stop:"Dustlik",              status:'passed'  },
    { time:'06:05', stop:"O'zbekiston",          status:'passed'  },
    { time:'06:10', stop:"Paxtakor",             status:'coming'  },
    { time:'06:15', stop:"Amir Temur xiyoboni",  status:'pending' },
    { time:'06:20', stop:"Habib Abdullayev",     status:'pending' },
  ]},
  7: { route: "55 — Yangiyo'l → Shahar markazi", timetable: [
    { time:'06:00', stop:"Yangiyo'l bozori",     status:'passed'  },
    { time:'06:18', stop:"Yangiyo'l markaz",     status:'coming'  },
    { time:'06:36', stop:"Qurilish",             status:'pending' },
    { time:'06:54', stop:"Sergeli",              status:'pending' },
    { time:'07:12', stop:"Shahar markazi",       status:'pending' },
  ]},
};

// Generate a basic timetable for routes that don't have hardcoded schedules
function generateSchedule(route) {
  const hoursStr = route.hours || '06:00–22:00';
  const startMatch = hoursStr.match(/(\d{2}):(\d{2})/);
  let startH = startMatch ? parseInt(startMatch[1]) : 6;
  let startM = startMatch ? parseInt(startMatch[2]) : 0;

  const namedStops = Array.isArray(route.stopNames) && route.stopNames.length > 0
    ? route.stopNames
    : null;
  const stopCount = namedStops ? namedStops.length : Math.min(route.stops || 8, 12);
  const intervalMin = 15;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const timetable = [];
  for (let i = 0; i < stopCount; i++) {
    const totalMin = startH * 60 + startM + i * intervalMin;
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    const timeStr = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    const stopMin = h * 60 + m;

    let status;
    if (stopMin < nowMinutes - 5)       status = 'passed';
    else if (stopMin < nowMinutes + 15) status = 'coming';
    else                                status = 'pending';

    const stopName = namedStops ? namedStops[i] : `${route.name} — bekat ${i + 1}`;
    timetable.push({ time: timeStr, stop: stopName, status });
  }

  return { route: `${route.number} — ${route.name}`, timetable };
}

// GET /api/schedule/:id
router.get('/:id', (req, res) => {
  const id = +req.params.id;

  if (schedules[id]) {
    return res.json({ success: true, data: schedules[id] });
  }

  // Look up the route from shared store and auto-generate schedule
  const route = store.routes.find(r => r.id === id);
  if (!route) return res.status(404).json({ success: false, error: 'Jadval topilmadi' });

  res.json({ success: true, data: generateSchedule(route) });
});

// GET /api/schedule (barcha jadvallar)
router.get('/', (_req, res) => {
  res.json({ success: true, data: schedules });
});

module.exports = router;
