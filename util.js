const https = require("https");
const { TG_TOKEN } = require("./config");
const qs = require("querystring");

/**
 * 
 * @param {String} message 
 */
const log = (message) => {
    const d = new Date().toLocaleDateString("id-ID", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).replace(".", ":");

    const data = `[${d}]: ${message}`;
    console.log(data);
    return data;
}

/**
 * 
 * @param {String} endpoint 
 * @param {?Any} parameters 
 */
function sendTG(endpoint, parameters = false) {
    let data = "";
    
    if (parameters) parameters = qs.stringify(parameters);

    const req = https.request({
        host: "api.telegram.org",
        port: 443,
        method: "GET",
        path: `/bot${TG_TOKEN}/${endpoint}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(parameters)
        }
    }, (res) => {
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
            data += chunk;
        });
    });
    req.write(parameters ? parameters : qs.stringify({}));
    req.end();

    return data;
}

module.exports = { log, sendTG };