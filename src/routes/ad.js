var router = require("express").Router();
var mongoose = require("mongoose");

// var Account = mongoose.model("Account");
var Ad = mongoose.model("Ad");

var util = require("../lib/util");
var config = require('../../config');

router.get("/:userId", (req, res, next) => {
    
    Ad.find({ owner: req.params.userId })
        .then((adList) => {
            return util.responseHandler(res, true, "Success", adList);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.post("/update", (req, res) => {
    const adId = req.body._id;
    Ad.findByIdAndUpdate(adId, req.body)
        .then((adList) => {
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
            return util.responseHandler(res, true, "Succesfully create new AD", null);
        })
        .catch(err => {
            console.log(err)
            return util.responseHandler(res, false, "Error", err);
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
            return util.responseHandler(res, true, "Success", result);
        })
        .catch(error => {
            return util.responseHandler(res, false, "Fail", error);
        });
});

module.exports = router;