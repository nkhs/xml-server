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

router.post("/upload/:userName", upload.single("file"), (req, res) => {

    var userName = req.params.userName;
    if (userName.toLowerCase() == "admin") userName = "Admin"
    userName = userName.replace('@', '_');

    const tempPath = req.file.path;
    const fileName = `${tempPath}.jpg`;
    if (!fs.existsSync(`./public/storage/${userName}`))
        fs.mkdirSync(`./public/storage/${userName}`);

    var file = path.basename(fileName)

    targetPath = `./public/storage/${userName}/${file}`
    fs.rename(tempPath, targetPath, err => {
        if (err) {
            console.log(err);
            return handleError(err, res);
        }
        util.responseHandler(res, true, "success", `images/${userName}/${file}`);
    });
});

router.get("/:username/image-list", (req, res) => {
    try {
        var username = req.params.username;
        if (username.toLowerCase() == "admin") username = "Admin"
        username = username.replace('@', '_');

        var files = fs.readdirSync(`${config.STORAGE_PATH}/${username}`);
        var result = [];
        files.forEach(file => {
            result.push(`images/${username}/${file}`);
        })
        util.responseHandler(res, true, 'success', result);
    } catch (e) {
        util.responseHandler(res, false, 'error', e);
    }
});

router.get("/images/:username/:filename", (req, res) => {
    var username = req.params.username;
    if (username.toLowerCase() == "admin") username = "Admin"
    username = username.replace('@', '_');

    var filename = req.params.filename;
    var filePath = `${config.STORAGE_PATH}/${username}/${filename}`;
    
    try {
        var img = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(img, "binary");
    } catch (err) {
        res.sendStatus(404);
    }
});


module.exports = router;