# 🚌 TransportInfo — Mahalliy Transport Axborot Tizimi

Shahar transport tarmog'ini boshqarish va yo'lovchilarga ma'lumot berish uchun to'liq full-stack veb-ilova.

---

## 📁 Loyiha strukturasi

```
transport-info/
├── frontend/                  # Statik HTML/CSS/JS
│   ├── index.html             # Dashboard (bosh sahifa)
│   ├── css/
│   │   └── style.css          # Barcha sahifalar uchun dizayn
│   ├── js/
│   │   ├── api.js             # Backend bilan aloqa + mock fallback
│   │   ├── app.js             # Umumiy funksiyalar (soat, nav, ...)
│   │   └── dashboard.js       # Dashboard logikasi va grafik
│   └── pages/
│       ├── routes.html        # Marshrutlar ro'yxati
│       ├── schedule.html      # Bekat-vaqt jadvali
│       ├── map.html           # Transport xaritasi
│       ├── tickets.html       # Chipta va tariflar
│       ├── news.html          # Yangiliklar va e'lonlar
│       └── admin.html         # Admin boshqaruv paneli
│
└── backend/                   # Node.js + Express REST API
    ├── server.js              # Asosiy server fayli
    ├── package.json
    ├── .env.example           # Muhit o'zgaruvchilari namunasi
    ├── config/
    │   └── db.js              # MongoDB ulanish konfiguratsiyasi
    ├── models/
    │   ├── Route.js           # Mongoose Schema: Marshrut
    │   └── News.js            # Mongoose Schema: Yangilik
    ├── controllers/
    │   └── routesController.js  # CRUD — MongoDB + mock fallback
    ├── routes/
    │   ├── routes.js          # GET/POST/PUT/DELETE /api/routes
    │   ├── schedule.js        # GET /api/schedule/:id
    │   ├── stats.js           # GET /api/stats
    │   ├── news.js            # GET/POST /api/news
    │   ├── tickets.js         # GET /api/tickets
    │   └── search.js          # GET /api/search?from=&to=
    └── scripts/
        └── seed.js            # MongoDB boshlang'ich ma'lumotlar
```

---

## 🚀 Ishga tushirish

### 1. Frontend (backend siz ham ishlaydi)

```bash
# Shunchaki brauzerda oching:
open frontend/index.html

# Yoki lokal server bilan:
npx serve frontend
# http://localhost:3000 da ochiladi
```

### 2. Backend

```bash
cd backend

# Paketlarni o'rnatish
npm install

# Muhit o'zgaruvchilarini sozlash
cp .env.example .env
# .env faylida MONGO_URI ni to'ldiring (ixtiyoriy)

# Ishga tushirish
npm start          # Production
npm run dev        # Development (nodemon bilan)
```

### 3. MongoDB (ixtiyoriy)

```bash
# MongoDB o'rnatilgan bo'lsa:
mongod --dbpath /data/db

# Boshlang'ich ma'lumotlar yuklash:
cd backend && node scripts/seed.js
```

> **Eslatma:** MongoDB bo'lmasa ham ilova ishlaydi — backend in-memory mock ma'lumotlardan foydalanadi. Frontend esa backend o'chiq bo'lsa ham o'z mock datasidan foydalanadi.

---

## 🔌 API Endpointlar

| Method | Endpoint              | Tavsif                          |
|--------|-----------------------|---------------------------------|
| GET    | `/health`             | Server holati                   |
| GET    | `/api/routes`         | Barcha marshrutlar              |
| GET    | `/api/routes/:id`     | Bitta marshrut                  |
| POST   | `/api/routes`         | Yangi marshrut qo'shish         |
| PUT    | `/api/routes/:id`     | Marshrut yangilash              |
| DELETE | `/api/routes/:id`     | Marshrut o'chirish              |
| GET    | `/api/schedule/:id`   | Marshrut jadvali                |
| GET    | `/api/stats`          | Umumiy statistika               |
| GET    | `/api/news`           | Barcha yangiliklar              |
| POST   | `/api/news`           | Yangilik qo'shish               |
| GET    | `/api/tickets`        | Chipta turlari va narxlar       |
| GET    | `/api/search?from=&to=` | Yo'nalish qidiruv             |

### POST /api/routes — misol so'rov:
```json
{
  "number": "99",
  "type": "bus",
  "name": "Yangi shahar — Markaz",
  "stops": 20,
  "km": 15.5,
  "hours": "06:00–22:00",
  "status": "active"
}
```

---

## 🛠 Texnologiyalar

### Frontend
- Sof HTML5 / CSS3 / JavaScript (framework siz)
- Chart.js — grafiklar uchun
- Google Fonts (Syne + DM Sans)
- Responsive dizayn (mobil qurilmalar uchun)

### Backend
- **Node.js** + **Express.js** — server framework
- **MongoDB** + **Mongoose** — ma'lumotlar bazasi (ixtiyoriy)
- **Helmet** — xavfsizlik
- **CORS** — cross-origin so'rovlar
- **Morgan** — HTTP logging

---

## ✨ Sahifalar

| Sahifa | Fayl | Tavsif |
|--------|------|--------|
| Dashboard | `index.html` | Statistika, jonli holat, grafik, qidiruv |
| Marshrutlar | `pages/routes.html` | Filter, jadval ko'rinishi |
| Jadval | `pages/schedule.html` | Bekat-vaqt, holat |
| Xarita | `pages/map.html` | Transport tarmog'i sxemasi |
| Chipta | `pages/tickets.html` | Narxlar va imtiyozlar |
| Yangiliklar | `pages/news.html` | E'lonlar va ogohlantirishlar |
| Admin | `pages/admin.html` | CRUD — marshrut boshqaruv |

---

## 📝 Kelajakdagi rivojlantirish

- [ ] Haqiqiy GPS integratsiyasi (transport joylashuvi)
- [ ] To'lov tizimi (Payme / Click API)
- [ ] Foydalanuvchi autentifikatsiyasi (JWT)
- [ ] Push-xabarnomalar (kechikishlar haqida)
- [ ] Mobil ilova (React Native)
- [ ] Google Maps / Yandex Maps integratsiyasi
- [ ] Ko'p tillilik (O'zbek / Rus / Ingliz)

---

## 👤 Muallif

TransportInfo loyihasi — mahalliy jamoat transporti uchun ochiq manba axborot tizimi.
