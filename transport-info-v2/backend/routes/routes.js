const express = require('express');
const router  = express.Router();

// In-memory store (MongoDB o'rniga)
let routes = [
  { id: 1, number: '42', type: 'bus',   name: "Chilonzor — Yunusobod",      stops: 22, km: 18.4, hours: '05:30–23:00', status: 'active'  },
  { id: 2, number: '17', type: 'bus',   name: "Sergeli — Markaziy bozor",   stops: 30, km: 24.1, hours: '05:00–22:30', status: 'delay'   },
  { id: 3, number: '88', type: 'bus',   name: "Mirobod — Olmazor",          stops: 26, km: 21.8, hours: '06:00–22:00', status: 'active'  },
  { id: 4, number: 'M1', type: 'metro', name: "Chilonzor liniyasi",         stops: 14, km: 11.2, hours: '06:00–00:00', status: 'active'  },
  { id: 5, number: 'M2', type: 'metro', name: "O'zbekiston liniyasi",       stops: 11, km: 9.8,  hours: '06:00–00:00', status: 'active'  },
  { id: 6, number: 'T3', type: 'tram',  name: "Shahar markazi tramvayi",    stops: 18, km: 14.6, hours: '06:30–21:00', status: 'stopped' },
  { id: 7, number: '55', type: 'bus',   name: "Yangiyo'l — Shahar markazi", stops: 28, km: 22.0, hours: '06:00–22:00', status: 'active'  },
];
let nextId = 8;

// GET /api/routes?type=bus&status=active
router.get('/', (req, res) => {
  let result = [...routes];
  if (req.query.type)   result = result.filter(r => r.type   === req.query.type);
  if (req.query.status) result = result.filter(r => r.status === req.query.status);
  res.json({ success: true, count: result.length, data: result });
});

// GET /api/routes/:id
router.get('/:id', (req, res) => {
  const route = routes.find(r => r.id === +req.params.id);
  if (!route) return res.status(404).json({ success: false, error: 'Marshrut topilmadi' });
  res.json({ success: true, data: route });
});

// POST /api/routes
router.post('/', (req, res) => {
  const { number, type, name, stops, km, hours, status } = req.body;
  if (!number || !name) return res.status(400).json({ success: false, error: 'number va name majburiy' });
  if (routes.find(r => r.number === number)) {
    return res.status(400).json({ success: false, error: `${number} raqamli marshrut allaqachon mavjud` });
  }
  const newRoute = {
    id: nextId++,
    number,
    type:   type   || 'bus',
    name,
    stops:  stops  || 0,
    km:     km     || 0,
    hours:  hours  || '06:00–22:00',
    status: status || 'active',
  };
  routes.push(newRoute);
  res.status(201).json({ success: true, data: newRoute });
});

// PUT /api/routes/:id
router.put('/:id', (req, res) => {
  const idx = routes.findIndex(r => r.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Marshrut topilmadi' });
  routes[idx] = { ...routes[idx], ...req.body, id: routes[idx].id };
  res.json({ success: true, data: routes[idx] });
});

// DELETE /api/routes/:id
router.delete('/:id', (req, res) => {
  const idx = routes.findIndex(r => r.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Marshrut topilmadi' });
  const deleted = routes.splice(idx, 1)[0];
  res.json({ success: true, data: deleted });
});

module.exports = router;
