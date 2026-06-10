const express = require('express');
const router  = express.Router();

// Bekatlar va ularning marshrutlari
const STOP_ROUTES = {
  "chilonzor":          [{ r:'42', name:'42-avtobus' }, { r:'M1', name:'M1-metro' }],
  "yunusobod":          [{ r:'42', name:'42-avtobus' }],
  "mustaqillik":        [{ r:'42', name:'42-avtobus' }, { r:'M1', name:'M1-metro' }],
  "sergeli":            [{ r:'17', name:'17-avtobus' }],
  "markaziy bozor":     [{ r:'17', name:'17-avtobus' }],
  "chorsu":             [{ r:'17', name:'17-avtobus' }],
  "mirobod":            [{ r:'88', name:'88-avtobus' }],
  "olmazor":            [{ r:'88', name:'88-avtobus' }],
  "metro":              [{ r:'M1', name:'M1-metro'  }, { r:'M2', name:'M2-metro' }],
  "oybek":              [{ r:'M1', name:'M1-metro'  }],
  "paxtakor":           [{ r:'M2', name:'M2-metro'  }],
  "dustlik":            [{ r:'M2', name:'M2-metro'  }],
  "yangiyo'l":          [{ r:'55', name:'55-avtobus' }],
  "shahar markazi":     [{ r:'55', name:'55-avtobus' }, { r:'T3', name:'T3-tram' }],
  "amir temur":         [{ r:'42', name:'42-avtobus' }, { r:'M2', name:'M2-metro' }],
};

function findKey(query) {
  const q = query.toLowerCase();
  return Object.keys(STOP_ROUTES).find(k => q.includes(k) || k.includes(q));
}

router.get('/', (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) return res.status(400).json({ success: false, error: 'from va to parametrlari kerak' });

  const fromKey = findKey(from);
  const toKey   = findKey(to);

  if (!fromKey || !toKey) {
    return res.json({
      success: true,
      found: false,
      message: 'Bekat topilmadi. Iltimos, aniqroq yozing.',
      suggestions: Object.keys(STOP_ROUTES),
    });
  }

  const fromRoutes = STOP_ROUTES[fromKey].map(r => r.r);
  const toRoutes   = STOP_ROUTES[toKey].map(r => r.r);
  const direct     = fromRoutes.filter(r => toRoutes.includes(r));

  if (direct.length > 0) {
    const stops   = Math.floor(Math.random() * 8) + 4;
    const minutes = stops * 4 + Math.floor(Math.random() * 5);
    return res.json({
      success: true,
      found: true,
      from: from.trim(),
      to:   to.trim(),
      options: direct.map(r => ({
        route: r,
        type: 'to\'g\'ridan-to\'g\'ri',
        stops,
        duration: minutes + ' daqiqa',
        transfers: 0,
        nextDeparture: getNextDeparture(),
      })),
    });
  }

  // Transfer bilan
  return res.json({
    success: true,
    found: true,
    from: from.trim(),
    to:   to.trim(),
    options: [{
      route: STOP_ROUTES[fromKey][0].name + ' → ' + STOP_ROUTES[toKey][0].name,
      type: 'o\'tish bilan',
      stops: Math.floor(Math.random() * 12) + 8,
      duration: (Math.floor(Math.random() * 20) + 25) + ' daqiqa',
      transfers: 1,
      transferStop: 'Mustaqillik maydoni',
      nextDeparture: getNextDeparture(),
    }],
  });
});

function getNextDeparture() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + Math.floor(Math.random() * 12) + 2);
  return now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
}

module.exports = router;
