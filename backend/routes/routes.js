const express = require('express');
const router  = express.Router();
const store   = require('../data/store');

const routes  = store.routes;

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
  const { number, type, name, stops, km, hours, status, stopNames } = req.body;
  if (!number || !name) return res.status(400).json({ success: false, error: 'number va name majburiy' });
  if (routes.find(r => r.number === number)) {
    return res.status(400).json({ success: false, error: `${number} raqamli marshrut allaqachon mavjud` });
  }
  const parsedStopNames = Array.isArray(stopNames) ? stopNames.filter(Boolean) : [];
  const newRoute = {
    id:        store.getNextId(),
    number,
    type:      type   || 'bus',
    name,
    stops:     parsedStopNames.length || stops  || 0,
    km:        km     || 0,
    hours:     hours  || '06:00–22:00',
    status:    status || 'active',
    stopNames: parsedStopNames,
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
