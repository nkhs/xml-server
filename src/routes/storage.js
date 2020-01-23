var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express()
var config = require('../../config')
var upload = multer({ dest: `${config.STORAGE_PATH}/` })
var util = require("../lib/util");
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

router.post("/upload/:userId", upload.single("file"), (req, res) => {
    // console.log(req.body)
    var userId = req.params.userId;
    // var deviceId = req.body.deviceId.toLowerCase();
    const tempPath = req.file.path;
    const fileName = `${tempPath}.jpg`;


    var folder = path.dirname(fileName)
    var file = path.basename(fileName)
    console.log('fileName', fileName, folder, file)

    var targetFile = `${userId}_${file}`;
    targetPath = `${folder}/${targetFile}`
    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.log(err);
            return handleError(err, res);
        }
        util.responseHandler(res, true, "success", `${userId}/images/${targetFile}`);
    });
});

router.get("/:userId/image-list", (req, res) => {
    try {
        var userId = req.params.userId;
        var files = fs.readdirSync(`${config.STORAGE_PATH}`);
        var result = [];
        files.forEach(file => {
            if (file.includes(userId))
                result.push(`${userId}/images/${file}`);
        })
        // console.log(result);
        util.responseHandler(res, true, 'success', result);
    } catch (e) {
        util.responseHandler(res, false, 'error', e);
    }
});

router.get("/:userId/images/:filename", (req, res) => {
    var filename = req.params.filename;
    var filePath = `${config.STORAGE_PATH}/${filename}`;
    // console.log(filePath)
    try {
        var img = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(img, "binary");
    } catch (err) {
        // console.log(err)
        res.sendStatus(404);
    }
});


module.exports = router;