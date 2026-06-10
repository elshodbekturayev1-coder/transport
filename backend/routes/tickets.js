const express = require('express');
const router  = express.Router();

const tickets = [
  { id:1, name:"Bir martalik",    icon:"🎫", price:1500,   priceStr:"1 500",   unit:"so'm", desc:"Bitta yo'nalish" },
  { id:2, name:"Kunlik",          icon:"📅", price:8000,   priceStr:"8 000",   unit:"so'm", desc:"Cheksiz sayohat" },
  { id:3, name:"Oylik",           icon:"📆", price:120000, priceStr:"120 000", unit:"so'm", desc:"Barcha transport" },
  { id:4, name:"Talaba (30%)",    icon:"🎓", price:84000,  priceStr:"84 000",  unit:"so'm", desc:"Talaba guvohnomasi" },
  { id:5, name:"Pensioner (50%)", icon:"👴", price:60000,  priceStr:"60 000",  unit:"so'm", desc:"Pensiya guvohnomasi" },
  { id:6, name:"Nogironlar",      icon:"♿", price:0,      priceStr:"Bepul",   unit:"",     desc:"I va II guruh" },
];

const purchases = [];
let purchaseSeq = 1000;

router.get('/', (_req, res) => {
  res.json({ success: true, data: tickets });
});

router.post('/purchase', (req, res) => {
  const { ticketId, qty, category } = req.body;
  const ticket = tickets.find(t => t.id === Number(ticketId));
  if (!ticket) return res.status(400).json({ success: false, error: 'Chipta topilmadi' });

  const quantity = Math.max(1, Math.min(10, Number(qty) || 1));
  const total    = ticket.price * quantity;
  const code     = 'TI-' + (++purchaseSeq);
  const now      = new Date();
  const dateStr  = now.toLocaleDateString('uz-UZ') + ' ' + now.toLocaleTimeString('uz-UZ', { hour:'2-digit', minute:'2-digit' });

  const purchase = { id: purchaseSeq, code, ticketId: ticket.id, ticketName: ticket.name,
    ticketIcon: ticket.icon, qty: quantity, total, category: category || 'Oddiy', date: dateStr };
  purchases.unshift(purchase);
  if (purchases.length > 50) purchases.pop();

  res.json({ success: true, data: purchase });
});

router.get('/purchases', (_req, res) => {
  res.json({ success: true, data: purchases });
});

module.exports = router;
