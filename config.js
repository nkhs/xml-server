var port = 80;

var host_url = `192.168.1.122`;
var client_url = `http://${host_url}/#`;
var mongodb_url = `mongodb://localhost:27017/xml-db`;
// var mongodb_url = `mongodb://192.168.1.105:27017/xml-db`;

var default_auth_email = "admin"
var default_auth_password = "123456"

module.exports = {
  DB: { URI: mongodb_url },
  port: port,
  host_url: `http://${host_url}:${port}`,
  ip_url: host_url,
  client_url: client_url,
  STORAGE_PATH: './public/storage',
  WEB_SOURCE: './public/dist',
  email: {
    auth_email: function () {
      try { return require('./gmail.js').email; } catch (error) { }
      return default_auth_email;
    },
    auth_password: function () {
      try { return require('./gmail.js').password; } catch (error) { }
      return default_auth_password;
    }
  }
};