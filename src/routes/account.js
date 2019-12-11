var router = require("express").Router();
var mongoose = require("mongoose");
var Account = mongoose.model("Account");
var util = require("../lib/util");
var config = require('../../config');
var md5 = require('md5');

router.get("/", (req, res, next) => {
    Account.find({})
        .then((datasets) => {
            return util.responseHandler(res, true, "Success", datasets);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.post("/login", (req, res) => {
    var email = req.body.email;

    var password = md5(req.body.password);

    if (email == config.ADMIN.auth_email() && password == config.ADMIN.auth_password()) {
        return util.responseHandler(res, true, "Success", {
            _id:config.ADMIN.uid,
            email: email,
            password: password,
            isAdmin: true
        });
    }

    Account.findOne({
        email: email,
        password: password,
    })
        .then((account) => {
            if (account == null) {
                return util.responseHandler(res, false, "Please check your email and password", null);
            } else {
                console.log(account)
                return util.responseHandler(res, true, "Success", account);
            }

        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.post("/update", (req, res) => {
    const userid = req.body._id;
    req.body.password = md5(req.body.password)
    Account.findByIdAndUpdate(userid, req.body)
        .then((accountList) => {
            return util.responseHandler(res, true, "Success", accountList);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.get("/:userid", (req, res) => {
    const userid = req.params.userid;
    Account.find({
        Added_User: userid
    })
        .then((accountList) => {
            return util.responseHandler(res, true, "Success", accountList);
        })
        .catch(err => {
            return util.responseHandler(res, false, "Error", err);
        });
});

router.put("/", (req, res) => {

    req.body.password = md5(req.body.password);

    var newAccount = new Account(req.body);
    newAccount
        .save()
        .then(() => {
            return util.responseHandler(res, true, "Succesfully create new account", null);
        })
        .catch(err => {
            console.log(err)
            return util.responseHandler(res, false, "Error", err);
        });
});

router.post("/", (req, res) => {
    if (!req.body._id) return util.responseHandler(res, false, "Error: require _id", null);
    Account.findByIdAndUpdate(req.body._id, {
        $set: req.body
    }, {
        new: false
    }, function (err, updatedAccount) {
        if (err) return util.responseHandler(res, false, "Error", err);
        return util.responseHandler(res, true, 'successfully updated account', updatedAccount);
    });
});

router.delete("/:id", (req, res) => {
    var accountID = req.params.id;
    Account.deleteOne({
        _id: accountID
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