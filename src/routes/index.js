var express = require('express');
var router = express.Router();

router.use('/account', require('./account'));
router.use('/ad', require('./ad'));
router.use('/storage', require('./storage'));

var fs = require('fs');
var path = require('path');
var util = require('../lib/util');
router.get("/:username/cads.xml", (req, res, next) => {
    var appDir = path.dirname(require.main.filename);
    var username = req.params.username;
    console.log(username)
    var xmlPath = appDir + `/public/xml/${username}/cads.xml`;
    if (process.platform === "win32") {
    }
    else {
        xmlPath = `/var/www/html/${username}/cads.xml`;
    }

    if (fs.existsSync(xmlPath))
        res.sendFile(xmlPath);
    else util.responseHandler(res, false, 'Cannot find xml file');
});

module.exports = router;