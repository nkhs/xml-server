const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var accountSchema = new Schema({
  email: String,
  password: String
});

mongoose.model("Account", accountSchema);