const os = require('os');

module.exports.check = function (req, res) {
    let uptime = `${Math.floor(process.uptime())}s`;
    let loadavg = os.loadavg()[2];
    let time = new Date().toTimeString();
    res.json({
        uptime,
        loadavg,
        time,
    });
};

module.exports.loopBack = function (req, res) {
    let ip = req.ip;
    let ua = req.header('User-Agent');
    res.json({
        ip,
        ua
    });
};