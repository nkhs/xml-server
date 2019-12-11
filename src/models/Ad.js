const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var adSchema = new Schema({
  name: String,
  image: String,
  link: String,
  type: String,
  bank: String,
  enable: Boolean,
  scheduleType: String,
  schedule: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
});

mongoose.model("Ad", adSchema);