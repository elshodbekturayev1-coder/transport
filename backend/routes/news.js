const express = require('express');
const router  = express.Router();

let news = [
  { id:1, cat:'danger', title:"T3 tramvay marshrutida ta'mirlash ishlari", date:'8 aprel 2026', desc:"Bugundan 15 aprelgacha to'xtatilgan. Muqobil: 42-marshrut." },
  { id:2, cat:'info',   title:"Yangi 55-marshrut: Yangiyo'l — Shahar markazi", date:'5 aprel 2026', desc:'10 apreldan boshlanadi. Har 18 daqiqada.' },
  { id:3, cat:'warn',   title:'Bayram kunlari (9-may) maxsus jadval', date:'3 aprel 2026', desc:'Metro va avtobuslar 06:00–01:00 ishlaydi.' },
  { id:4, cat:'info',   title:'Metro M3 liniyasining qurilishi boshlandi', date:'1 aprel 2026', desc:'2028-yilda ishga tushiriladi.' },
  { id:5, cat:'ok',     title:"Oylik abonement narxi: 120 000 so'm", date:'1 aprel 2026', desc:'Barcha transport turlari uchun yangi narx.' },
];
let nextId = 6;

router.get('/', (req, res) => {
  res.json({ success: true, count: news.length, data: news });
});

router.post('/', (req, res) => {
  const { cat, title, desc } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'title majburiy' });
  const item = {
    id: nextId++,
    cat:   cat  || 'info',
    title,
    desc:  desc || '',
    date:  new Date().toLocaleDateString('uz-UZ', { day:'numeric', month:'long', year:'numeric' }),
  };
  news.unshift(item);
  res.status(201).json({ success: true, data: item });
});

router.put('/:id', (req, res) => {
  const item = news.find(n => n.id === +req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Topilmadi' });
  const { cat, title, desc } = req.body;
  if (cat)   item.cat   = cat;
  if (title) item.title = title;
  if (desc !== undefined) item.desc = desc;
  res.json({ success: true, data: item });
});

router.delete('/:id', (req, res) => {
  const idx = news.findIndex(n => n.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Topilmadi' });
  news.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
