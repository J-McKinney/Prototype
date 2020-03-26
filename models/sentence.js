const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sentenceSchema = new Schema({
  sentence: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Sentence = mongoose.model("Sentence", sentenceSchema);

module.exports = Sentence;
