const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '../../.env');
const isExists = fs.existsSync(envPath);
if (!isExists) throw new Error('.env not found');
const config = require('dotenv').parse(fs.readFileSync(envPath));

exec(
    `firebase functions:config:set virgil.app_key="${config.APP_KEY}" virgil.app_id="${config.APP_ID}" virgil.app_key_id="${config.APP_KEY_ID}"`,
    (err, stdout) => err ? console.error(err) : console.log(stdout)
);