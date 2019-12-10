const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var adSchema = new Schema({
  name: String,
  image: String,
  description: String,
  enable: Boolean,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
});

mongoose.model("Ad", adSchema);