const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  contestId: { type: String, required: true },
  platform: { type: String, required: true },
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);