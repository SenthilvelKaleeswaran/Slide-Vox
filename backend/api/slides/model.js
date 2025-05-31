const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  slide : {
    type: String,
  },
  platform: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Slide = mongoose.model('Slide', SlideSchema);

module.exports = Slide;
