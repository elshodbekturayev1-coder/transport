/**
 * Seed script — MongoDB'ga boshlang'ich ma'lumotlar yuklash
 * Ishlatish: node scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Route    = require('../models/Route');
const News     = require('../models/News');
const { MONGO_URI } = require('../config/db');

const ROUTES = [
  { number: '42', type: 'bus',   name: 'Chilonzor — Yunusobod',       stops: 22, km: 18.4, hours: '05:30–23:00', status: 'active'  },
  { number: '17', type: 'bus',   name: 'Sergeli — Markaziy bozor',    stops: 30, km: 24.1, hours: '05:00–22:30', status: 'delay'   },
  { number: '88', type: 'bus',   name: 'Mirobod — Olmazor',           stops: 26, km: 21.8, hours: '06:00–22:00', status: 'active'  },
  { number: 'M1', type: 'metro', name: 'Chilonzor liniyasi',          stops: 14, km: 11.2, hours: '06:00–00:00', status: 'active'  },
  { number: 'M2', type: 'metro', name: 'O\'zbekiston liniyasi',       stops: 11, km: 9.8,  hours: '06:00–00:00', status: 'active'  },
  { number: 'T3', type: 'tram',  name: 'Shahar markazi tramvayi',     stops: 18, km: 14.6, hours: '06:30–21:00', status: 'stopped' },
  { number: '55', type: 'bus',   name: 'Yangiyo\'l — Shahar markazi', stops: 28, km: 22.0, hours: '06:00–22:00', status: 'active'  },
];

const NEWS_DATA = [
  { cat: 'danger', title: 'T3 tramvay marshrutida ta\'mirlash ishlari', desc: 'Bugundan 15 aprelgacha to\'xtatilgan.',  date: '8 aprel 2026' },
  { cat: 'info',   title: 'Yangi 55-marshrut ishga tushdi',             desc: '10 apreldan boshlanadi.',                date: '5 aprel 2026' },
  { cat: 'warn',   title: '9-may bayram kuni maxsus jadval',            desc: 'Metro va avtobuslar 06:00–01:00.',        date: '3 aprel 2026' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Route.deleteMany({});
    await News.deleteMany({});

    await Route.insertMany(ROUTES);
    await News.insertMany(NEWS_DATA);

    console.log(`✅  Seed complete: ${ROUTES.length} routes, ${NEWS_DATA.length} news items`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
