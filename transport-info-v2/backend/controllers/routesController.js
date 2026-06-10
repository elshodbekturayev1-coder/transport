/**
 * Routes Controller
 * Tries MongoDB first, falls back to in-memory mock
 */
const Route = require('../models/Route');

// In-memory store (used when MongoDB is unavailable)
let mockRoutes = [
  { id: 1, number: '42', type: 'bus',   name: 'Chilonzor — Yunusobod',     stops: 22, km: 18.4, hours: '05:30–23:00', status: 'active'  },
  { id: 2, number: '17', type: 'bus',   name: 'Sergeli — Markaziy bozor',  stops: 30, km: 24.1, hours: '05:00–22:30', status: 'delay'   },
  { id: 3, number: '88', type: 'bus',   name: 'Mirobod — Olmazor',         stops: 26, km: 21.8, hours: '06:00–22:00', status: 'active'  },
  { id: 4, number: 'M1', type: 'metro', name: 'Chilonzor liniyasi',        stops: 14, km: 11.2, hours: '06:00–00:00', status: 'active'  },
  { id: 5, number: 'M2', type: 'metro', name: 'O\'zbekiston liniyasi',     stops: 11, km: 9.8,  hours: '06:00–00:00', status: 'active'  },
  { id: 6, number: 'T3', type: 'tram',  name: 'Shahar markazi tramvayi',   stops: 18, km: 14.6, hours: '06:30–21:00', status: 'stopped' },
  { id: 7, number: '55', type: 'bus',   name: 'Yangiyo\'l — Shahar markazi', stops: 28, km: 22.0, hours: '06:00–22:00', status: 'active' },
];
let nextId = 8;

function isDbConnected() {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
}

exports.getAll = async (req, res) => {
  try {
    if (isDbConnected()) {
      const routes = await Route.find().sort({ number: 1 });
      return res.json(routes);
    }
    let result = [...mockRoutes];
    if (req.query.type)   result = result.filter(r => r.type === req.query.type);
    if (req.query.status) result = result.filter(r => r.status === req.query.status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    if (isDbConnected()) {
      const route = await Route.findById(req.params.id);
      if (!route) return res.status(404).json({ error: 'Not found' });
      return res.json(route);
    }
    const route = mockRoutes.find(r => r.id === +req.params.id);
    if (!route) return res.status(404).json({ error: 'Not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { number, type, name, stops, km, hours, status } = req.body;
    if (!number || !name) return res.status(400).json({ error: 'number and name are required' });
    if (isDbConnected()) {
      const route = new Route({ number, type, name, stops, km, hours, status });
      await route.save();
      return res.status(201).json(route);
    }
    const newRoute = { id: nextId++, number, type: type||'bus', name, stops: stops||0, km: km||0, hours: hours||'06:00–22:00', status: status||'active' };
    mockRoutes.push(newRoute);
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (isDbConnected()) {
      const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!route) return res.status(404).json({ error: 'Not found' });
      return res.json(route);
    }
    const idx = mockRoutes.findIndex(r => r.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    mockRoutes[idx] = { ...mockRoutes[idx], ...req.body };
    res.json(mockRoutes[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (isDbConnected()) {
      await Route.findByIdAndDelete(req.params.id);
      return res.json({ deleted: true });
    }
    const idx = mockRoutes.findIndex(r => r.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    mockRoutes.splice(idx, 1);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
