var router = require("express").Router();
var mongoose = require("mongoose");

// var Account = mongoose.model("Account");
var Ad = mongoose.model("Ad");

var util = require("../lib/util");
var config = require('../../config');
var xml = require('../lib/xml');
var fs = require('fs');
var path = require('path');
router.get("/:userId", (req, res, next) => {

    Ad.find({ owner: req.params.userId })
        .then((adList) => {
            return util.responseHandler(res, true, "Success", adList);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.get("/xml/:username/cads.xml", (req, res, next) => {
    var appDir = path.dirname(require.main.filename);
    var username = req.params.username + "";
    username = username.replace(/\@/g, '_');
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

router.post("/update", (req, res) => {
    const adId = req.body._id;
    Ad.findByIdAndUpdate(adId, req.body)
        .then((adList) => {
            xml();
            return util.responseHandler(res, true, "Success", adList);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });


});

router.put("/", (req, res) => {

    var newAd = new Ad(req.body);
    newAd
        .save()
        .then(() => {
            xml();
            return util.responseHandler(res, true, "Succesfully create new AD", null);
        })
        .catch(err => {
            console.log(err)
            if (((err + '').includes('duplicate key error collection'))) {
                return util.responseHandler(res, false, "The Ad Name is already exist.", err);
            } else {
                return util.responseHandler(res, false, "Error", err);
            }
        });
});

router.post("/ad-namecheck", (req, res) => {
    Ad
        .findOne({ name: req.body.name })
        .then((ad) => {
            if (ad == null) {
                return util.responseHandler(res, true, "Available Ad Name", null);
            } else {
                if (ad._id == req.body.id) {
                    return util.responseHandler(res, true, "Available Ad Name", null);
                } else {
                    return util.responseHandler(res, false, "The Ad Name is already exist.", null);
                }
            }

        })
        .catch(err => {
            console.log(err)
            return util.responseHandler(res, false, "Error Occur", err);
        });
});

router.post("/", (req, res) => {
    if (!req.body._id) return util.responseHandler(res, false, "Error: require _id", null);
    Ad.findByIdAndUpdate(req.body._id, {
        $set: req.body
    }, {
        new: false
    }, function (err, updatedAd) {
        if (err) return util.responseHandler(res, false, "Error", err);
        xml();
        return util.responseHandler(res, true, 'successfully updated Ad', updatedAd);
    });
});

router.delete("/:id", (req, res) => {
    var adId = req.params.id;
    Ad.deleteOne({
        _id: adId
    })
        .exec()
        .then(result => {
            xml();
            return util.responseHandler(res, true, "Success", result);
        })
        .catch(error => {
            return util.responseHandler(res, false, "Fail", error);
        });
});

module.exports = router;