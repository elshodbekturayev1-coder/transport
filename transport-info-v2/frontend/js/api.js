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
  stats: { activeRoutes:42, delays:7, stopped:2, passengers:12840, hourly:[410,620,890,1240,1580,1820,1640,1390,1150,980,860,750] },
  news: [
    {id:1,cat:'danger',title:"T3 tramvay to'xtatildi",         date:'8 aprel 2026',desc:"15 aprelgacha. Muqobil: 42-marshrut."},
    {id:2,cat:'info',  title:"Yangi 55-marshrut ishga tushdi", date:'5 aprel 2026',desc:'10 apreldan boshlanadi.'},
    {id:3,cat:'warn',  title:'9-may maxsus jadval',            date:'3 aprel 2026',desc:'06:00-01:00.'},
  ],
  tickets: [
    {id:1,name:"Bir martalik", icon:"🎫",priceStr:"1 500",  unit:"so'm",desc:"Bitta yo'nalish"},
    {id:2,name:"Kunlik",       icon:"📅",priceStr:"8 000",  unit:"so'm",desc:"Cheksiz sayohat"},
    {id:3,name:"Oylik",        icon:"📆",priceStr:"120 000",unit:"so'm",desc:"Barcha transport"},
    {id:4,name:"Talaba (30%)", icon:"🎓",priceStr:"84 000", unit:"so'm",desc:"Talaba guvohnomasi"},
    {id:5,name:"Pensioner",    icon:"👴",priceStr:"60 000", unit:"so'm",desc:"Pensiya guvohnomasi"},
    {id:6,name:"Nogironlar",   icon:"♿",priceStr:"Bepul",  unit:"",    desc:"I va II guruh"},
  ],
};

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
  async deleteNews(id) {
    return await apiFetch('/news/' + id, { method:'DELETE' });
  },
  async getTickets() {
    const r = await apiFetch('/tickets');
    return r ? r.data : MOCK.tickets;
  },
  async search(from, to) {
    const q = new URLSearchParams({ from, to }).toString();
    const r = await apiFetch('/search?' + q);
    return r || { found: false, message: 'Backend offline' };
  },
};
