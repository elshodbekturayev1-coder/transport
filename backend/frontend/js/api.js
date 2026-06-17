/**
 * TransportInfo v2 — API Client
 */
const API_BASE = '/api';

const MOCK = {
  routes: [
    { id:1, number:'42', type:'bus',   name:"Chilonzor — Yunusobod",      stops:22, km:18.4, hours:'05:30-23:00', status:'active'  },
    { id:2, number:'17', type:'bus',   name:"Sergeli — Markaziy bozor",   stops:30, km:24.1, hours:'05:00-22:30', status:'delay'   },
    { id:3, number:'88', type:'bus',   name:"Mirobod — Olmazor",          stops:26, km:21.8, hours:'06:00-22:00', status:'active'  },
    { id:4, number:'M1', type:'metro', name:"Chilonzor liniyasi",         stops:14, km:11.2, hours:'06:00-00:00', status:'active'  },
    { id:5, number:'M2', type:'metro', name:"O'zbekiston liniyasi",       stops:11, km:9.8,  hours:'06:00-00:00', status:'active'  },
    { id:6, number:'T3', type:'tram',  name:"Shahar markazi tramvayi",    stops:18, km:14.6, hours:'06:30-21:00', status:'stopped' },
    { id:7, number:'55', type:'bus',   name:"Yangiyo'l — Shahar markazi", stops:28, km:22.0, hours:'06:00-22:00', status:'active'  },
  ],
  schedules: {
    1: { route:"42 — Chilonzor -> Yunusobod", timetable:[
      {time:'06:00',stop:"Chilonzor metro",     status:'passed'},
      {time:'06:18',stop:"Do'stlik",            status:'passed'},
      {time:'06:35',stop:"Beruniy",             status:'passed'},
      {time:'07:10',stop:"Mustaqillik maydoni", status:'coming'},
      {time:'07:28',stop:"Amir Temur xiyoboni", status:'pending'},
      {time:'07:45',stop:"Yunusobod 1",         status:'pending'},
    ]},
  },
  stats: { activeRoutes:42, delays:7, stopped:2, passengers:12840, hourly:[410,620,890,1240,1580,1820,1640,1390,1150,980,860,750,820,1100,980,760,540,380] },
  news: [
    {id:1,cat:'danger',title:"T3 tramvay to'xtatildi",         date:'8 aprel 2026',desc:"15 aprelgacha. Muqobil: 42-marshrut."},
    {id:2,cat:'info',  title:"Yangi 55-marshrut ishga tushdi", date:'5 aprel 2026',desc:'10 apreldan boshlanadi.'},
    {id:3,cat:'warn',  title:'9-may maxsus jadval',            date:'3 aprel 2026',desc:'06:00-01:00.'},
  ],
  tickets: [
    {id:1,name:"Bir martalik",    icon:"🎫",price:1500,   priceStr:"1 500",  unit:"so'm",desc:"Bitta yo'nalish"},
    {id:2,name:"Kunlik",          icon:"📅",price:8000,   priceStr:"8 000",  unit:"so'm",desc:"Cheksiz sayohat"},
    {id:3,name:"Oylik",           icon:"📆",price:120000, priceStr:"120 000",unit:"so'm",desc:"Barcha transport"},
    {id:4,name:"Talaba (30%)",    icon:"🎓",price:84000,  priceStr:"84 000", unit:"so'm",desc:"Talaba guvohnomasi"},
    {id:5,name:"Pensioner (50%)", icon:"👴",price:60000,  priceStr:"60 000", unit:"so'm",desc:"Pensiya guvohnomasi"},
    {id:6,name:"Nogironlar",      icon:"♿",price:0,      priceStr:"Bepul",  unit:"",    desc:"I va II guruh"},
  ],
};

// ── Station arrival data ─────────────────────────────────────────────────────
// Each route: startTime (minutes from midnight), endTime, frequency (min between trips), stops array with [name, minutesFromStart]
const ROUTE_STOPS = [
  { routeId:1, number:'42', type:'bus',  name:'Chilonzor → Yunusobod',    color:'#8b5cf6', start:330, end:1380, freq:15,
    stops:[['Chilonzor metro',0],["Do'stlik",4],['Beruniy',8],['Mirobod',12],['Tinchlik',16],
           ['Mustaqillik maydoni',20],['Amir Temur xiyoboni',24],["Yunusobod 1",28],["Yunusobod 3",32],['Osiyo',36]] },
  { routeId:2, number:'17', type:'bus',  name:'Sergeli → Markaziy bozor', color:'#f59e0b', start:300, end:1350, freq:20,
    stops:[['Sergeli',0],["To'qimachilik",5],["Qo'yliq",10],['Chilonzor metro',14],
           ['Beruniy',18],['Markaziy bozor',24],['Amir Temur xiyoboni',28]] },
  { routeId:3, number:'88', type:'bus',  name:'Mirobod → Olmazor',        color:'#10b981', start:360, end:1320, freq:18,
    stops:[['Mirobod',0],['Tinchlik',5],['Mustaqillik maydoni',9],['Olmazor',15],
           ['Sergeli',20],["Qo'yliq",25]] },
  { routeId:4, number:'M1', type:'metro',name:'Chilonzor liniyasi',        color:'#ef4444', start:360, end:1440, freq:6,
    stops:[['Chilonzor metro',0],['Mirzo Ulugbek',3],['Hamidulla Olimiy',6],['Tinchlik',9],
           ["O'zbekiston",12],['Amir Temur xiyoboni',15],['Yunus Rajabiy',18]] },
  { routeId:5, number:'M2', type:'metro',name:"O'zbekiston liniyasi",      color:'#3b82f6', start:360, end:1440, freq:7,
    stops:[["O'zbekiston",0],['Mustaqillik maydoni',4],['Kosmonavtlar',8],['Ming Orik',12],['Shahar',16]] },
  { routeId:7, number:'55', type:'bus',  name:"Yangiyo'l → Shahar markazi",color:'#06b6d4', start:360, end:1320, freq:25,
    stops:[["Yangiyo'l",0],['Qibray',8],['Sergeli',16],['Chilonzor metro',22],
           ['Mustaqillik maydoni',30],['Markaziy bozor',36],['Shahar markazi',42]] },
];

// Return next N arrival times (as "HH:MM" strings) for a route at a stop
function nextArrivals(route, stopMinutes, count = 3) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const results = [];
  // First trip that reaches this stop
  let trip = route.start + stopMinutes;
  while (trip <= route.end + stopMinutes && results.length < count) {
    if (trip > nowMin) {
      const h = Math.floor(trip / 60) % 24;
      const m = trip % 60;
      const diff = trip - nowMin;
      results.push({
        time: String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'),
        diff,
        label: diff < 1 ? 'Hozir' : diff < 60 ? diff + ' daqiqa' : Math.floor(diff/60) + 'h ' + (diff%60) + 'm',
      });
    }
    trip += route.freq;
  }
  return results;
}

// Get all arrivals at a station name
function getStationArrivals(stationName) {
  const q = stationName.trim().toLowerCase();
  const arrivals = [];
  ROUTE_STOPS.forEach(route => {
    const match = route.stops.find(([name]) => name.toLowerCase().includes(q));
    if (!match) return;
    const [, stopMin] = match;
    const next = nextArrivals(route, stopMin, 3);
    if (next.length) arrivals.push({ route, stopMin, arrivals: next });
  });
  arrivals.sort((a, b) => (a.arrivals[0]?.diff ?? 999) - (b.arrivals[0]?.diff ?? 999));
  return arrivals;
}

// Collect all unique station names
const ALL_STATIONS = [...new Set(ROUTE_STOPS.flatMap(r => r.stops.map(([n]) => n)))].sort();

let backendOnline = false;

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(API_BASE + endpoint, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const json = await res.json();
    backendOnline = true;
    if (!res.ok) throw new Error(json.error || 'Xato');
    return json.data !== undefined ? json : json;
  } catch (e) {
    backendOnline = false;
    return null;
  }
}

function updateBackendStatus() {
  const el = document.getElementById('backend-status');
  if (!el) return;
  el.innerHTML = backendOnline
    ? '<span style="color:var(--green-text)">&#9679; Backend online</span>'
    : '<span style="color:var(--amber-text)">&#9679; Mock rejim</span>';
}

const API = {
  async getStats() {
    const r = await apiFetch('/stats');
    updateBackendStatus();
    return r ? r.data : MOCK.stats;
  },
  async getRoutes(params) {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    const r = await apiFetch('/routes' + q);
    updateBackendStatus();
    return r ? r.data : MOCK.routes;
  },
  async getRoute(id) {
    const r = await apiFetch('/routes/' + id);
    return r ? r.data : MOCK.routes.find(x => x.id === +id);
  },
  async createRoute(data) {
    const r = await apiFetch('/routes', { method:'POST', body: JSON.stringify(data) });
    return r;
  },
  async updateRoute(id, data) {
    const r = await apiFetch('/routes/' + id, { method:'PUT', body: JSON.stringify(data) });
    return r;
  },
  async deleteRoute(id) {
    const r = await apiFetch('/routes/' + id, { method:'DELETE' });
    return r !== null;
  },
  async getSchedule(routeId) {
    const r = await apiFetch('/schedule/' + routeId);
    return r ? r.data : (MOCK.schedules[routeId] || MOCK.schedules[1]);
  },
  async getNews() {
    const r = await apiFetch('/news');
    return r ? r.data : MOCK.news;
  },
  async addNews(data) {
    const r = await apiFetch('/news', { method:'POST', body: JSON.stringify(data) });
    return r ? r.data : null;
  },
  async updateNews(id, data) {
    return await apiFetch('/news/' + id, { method:'PUT', body: JSON.stringify(data) });
  },
  async deleteNews(id) {
    return await apiFetch('/news/' + id, { method:'DELETE' });
  },
  async getTickets() {
    const r = await apiFetch('/tickets');
    return r ? r.data : MOCK.tickets;
  },
  async purchaseTicket(ticketId, qty, category) {
    return await apiFetch('/tickets/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, qty, category }),
    });
  },
  async getPurchases() {
    const r = await apiFetch('/tickets/purchases');
    return r ? r.data : [];
  },
  async search(from, to) {
    const q = new URLSearchParams({ from, to }).toString();
    const r = await apiFetch('/search?' + q);
    return r || { found: false, message: 'Backend offline' };
  },
};
