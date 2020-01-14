const express = require("express");
const http = require("http");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const config = require('./config');
var util = require('./src/lib/util');
var Logger = util.Logger;

app.use(express.static(path.join(__dirname, "public/dist")));

app.use(bodyParser.urlencoded({
  limit: '5mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '5mb'
}));

app.use(cors());
app.use(function (err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(err);
  }
});


const server = http.createServer(app);

require("./src/models");

app.use('/api', require("./src/routes"));

// app.use(function (req, res /*, next*/) {
//   console.log('*')
//   res.redirect("/");
// });

util.checkClientIp(function () { });

var _port = require('./config').port;
var port = normalizePort(process.env.PORT || `${_port}`);
server.listen(port, function listening() {
  console.log(`Listening on http://localhost:${port}`);
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}


mongoose.connect(config.DB.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongodb connected ...");
    var xml = require('./src/lib/xml');
    xml();
    setInterval(xml, 1000 * 3600);

  })
  .catch(err => {
    console.log("err", err);
    Logger.LOGE(`Cannot connect to ${config.DB.URI}`);
    process.exit();
  });