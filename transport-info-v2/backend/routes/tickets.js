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

router.get('/', (req, res) => {
  res.json({ success: true, data: tickets });
});

module.exports = router;
