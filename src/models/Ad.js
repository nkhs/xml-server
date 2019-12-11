const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var adSchema = new Schema({
  name: String,
  image: String,
  description: String,
  type: String,
  bank: String,
  enable: Boolean,
  schedule: Array,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
});

mongoose.model("Ad", adSchema);