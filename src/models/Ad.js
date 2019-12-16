const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var adSchema = new Schema({
  name: { type: String, index: true, unique: true },
  image: String,
  link: String,
  type: String,
  bank: String,
  enable: Boolean,
  scheduleType: String,
  schedule: String,
  owner: String,
});

mongoose.model("Ad", adSchema);