const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  contestId: { type: String, required: true },
  platform: { type: String, required: true },
  youtubeLink: { type: String, required: true },
});

module.exports = mongoose.model('Solution', solutionSchema);