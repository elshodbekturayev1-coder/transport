const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  cat:   { type: String, enum: ['danger', 'info', 'warn', 'ok'], default: 'info' },
  title: { type: String, required: true },
  desc:  { type: String, default: '' },
  date:  { type: String, default: () => new Date().toLocaleDateString('uz-UZ') },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('News', NewsSchema);
