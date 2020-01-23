var mongoose = require("mongoose");
var Account = mongoose.model("Account");
var Ad = mongoose.model("Ad");
var fs = require('fs');
var config = require('../../config');
var weekNameToNumber = (str) => {
    return 'sun|mon|tue|wed|thu|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday'.split('|').indexOf(str.toLowerCase()) % 7;
}

var checkSchedule = (ad) => {

    var isValid = false;
    if (ad.scheduleType == 'Weekly') {
        var nowDay = new Date().getDay();
        var schedule = ad.schedule.replace(/\s/g, '');
        var items = schedule.split(',');

        items.forEach(item => {
            if (item.includes('-')) {

                var from = weekNameToNumber(item.split('-')[0]);
                var to = weekNameToNumber(item.split('-')[1]);
                if (from <= nowDay && nowDay <= to) {
                    isValid = true;
                }
            } else {
                if (weekNameToNumber(item) == nowDay) isValid = true;
            }
        });
    }

    if (ad.scheduleType == 'Monthly') {
        var nowDate = new Date().getDate();
        var schedule = ad.schedule.replace(/\s/g, '');
        var items = schedule.split(',');
        items.forEach(item => {
            if (item.includes('-')) {
                var from = parseInt(item.split('-')[0]);
                var to = parseInt(item.split('-')[1]);
                if (from <= nowDate && nowDate <= to) {
                    isValid = true;
                }
            } else {
                if (parseInt(item) == nowDate) isValid = true;
            }
        });

    }
    return isValid;
}
var _xml = (uid, userName) => {
    Ad.find({ owner: uid })
        .then((adList) => {

            var Rolling = '';
            var TopBank = '';
            var AppLink = '';
            var Banner = '';
            var AppOpenAd = '';
            for (var i = 0; i < adList.length; i++) {
                if (!adList[i].enable) continue;
                if (!checkSchedule(adList[i])) continue;

                if (adList[i].type == 'Rolling') {
                    Rolling +=
                        `<rollingAd>\n` +
                        `    <name>${adList[i].image}</name>\n` +
                        `    <link>${adList[i].link}</link>\n` +
                        `    <position>${adList[i].position}</position>\n` +
                        `    <height>${adList[i].height}</height>\n` +
                        `</rollingAd>\n`
                }

                if (adList[i].type == 'Top Bank') {
                    TopBank +=
                        `<bank>\n` +
                        `    <name>${adList[i].bank}</name>\n` +
                        `    <tagString>${adList[i].tagLine}</tagString>\n` +
                        `    <link>${adList[i].link}</link>\n` +
                        `</bank>\n`

                }

                if (adList[i].type == 'App Link') {
                    AppLink +=
                        `<AppLinkBank>\n` +
                        `    <name>${adList[i].bank}</name>\n` +
                        `    <displayOrder>${adList[i].order}</displayOrder>\n` +
                        `    <link>${adList[i].link}</link>\n` +
                        `</AppLinkBank>\n`

                }

                if (adList[i].type == 'Banner') {
                    Banner +=
                        `    <tabView>\n` +
                        `        <tabId>${adList[i].tabId}</tabId>\n` +
                        `        <fullWidth>${adList[i].fullwidth ? 1 : 0}</fullWidth>\n` +
                        `        <name>${adList[i].image}</name>\n` +
                        `        <link>${adList[i].link}</link>\n` +
                        `    </tabView>\n`

                }

                if (adList[i].type == 'App Open Ad') {
                    AppOpenAd +=
                        `<appOpenAd>\n` +
                        `    <frequency>${adList[i].frequency}</frequency>\n` +
                        `    <duration>${adList[i].duration}</duration>\n` +
                        `    <name>${adList[i].image}</name>\n` +
                        `    <link>${adList[i].link}</link>\n` +
                        `</appOpenAd>\n`

                }
            }
            var host_url = config.host_url;
            if (config.port == 80) host_url = host_url.replace(':80', '');
            var str = `<cAds>\n` +
                `    <resources>\n` +
                `        <path>${host_url}/api/</path>\n` +
                `    </resources>\n` +
                Rolling +
                `<ListView>\n` +
                TopBank +
                AppLink +
                `</ListView>\n` +
                AppOpenAd +
                `<bannerAds>\n` +
                Banner +
                `</bannerAds>\n` +
                `</cAds>`
            if (process.platform === "win32") {
                if (!fs.existsSync(`./public/xml/${userName}`))
                    fs.mkdirSync(`./public/xml/${userName}`);
                fs.writeFileSync(`./public/xml/${userName}/cads.xml`, str, 'utf8');
            }
            else {
                if (!fs.existsSync(`/var/www`))
                    fs.mkdirSync(`/var/www`);
                if (!fs.existsSync(`/var/www/html`))
                    fs.mkdirSync(`/var/www/html`);
                if (!fs.existsSync(`/var/www/html/${userName}`))
                    fs.mkdirSync(`/var/www/html/${userName}`);
                fs.writeFileSync(`/var/www/html/${userName}/cads.xml`, str, 'utf8');
            }
            console.log('createed xml', userName, uid)
        })
        .catch(err => {
            console.log(err);
        });
}
var createXML = () => {
    var userID = require('../../config').ADMIN.uid;
    _xml(userID, 'Admin');

    Account.find({})
        .then((accountList) => {
            accountList.forEach(account => {
                _xml(account._id, account.email.replace('@', '_'));
            })
        })
}

module.exports = createXML;