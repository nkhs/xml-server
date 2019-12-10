var express = require('express');
var router = express.Router();

router.use('/account', require('./account'));
router.use('/ad', require('./ad'));
router.use('/storage', require('./storage'));

module.exports = router;