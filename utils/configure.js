const exec = require('child_process').exec;
const config = require('../config.json');

exec(
    `firebase functions:config:set virgil.apiprivatekey="${config.APP_KEY}" virgil.appid="${config.APP_ID}" virgil.apikeyid="${config.APP_KEY_ID}"`,
    (err, stdout) => err ? console.error(err) : console.log(stdout)
);