const fs = require('fs');

const KEYS = [
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_USE_PROXY',
    'TELEGRAM_PROXY_HOST',
    'TELEGRAM_PROXY_PORT',
    'TELEGRAM_PROXY_LOGIN',
    'TELEGRAM_PROXY_PASSWORD',
    'DATABASE_URL'
];

const content = KEYS
    .reduce((acc, key) => acc.concat(`${key}=${process.env[key]}`), [])
    .join('\n');

fs.writeFileSync('.env', content, {encoding: 'utf-8'});