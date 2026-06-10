const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  number:  { type: String, required: true, unique: true },
  type:    { type: String, enum: ['bus', 'metro', 'tram'], required: true },
  name:    { type: String, required: true },
  stops:   { type: Number, default: 0 },
  km:      { type: Number, default: 0 },
  hours:   { type: String, default: '06:00–22:00' },
  status:  { type: String, enum: ['active', 'delay', 'stopped'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

RouteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Route', RouteSchema);
