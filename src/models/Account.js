const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var accountSchema = new Schema({
  name: String,
  email: String,
  password: String
});

mongoose.model("Account", accountSchema);