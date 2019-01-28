const fs = require('fs');
const dotenv = require('dotenv').parse(fs.readFileSync('./.env'));

Object.assign(process.env, dotenv);
console.log(`[env] applied ${Object.keys(dotenv).length} var(s) from .env`);

require = require('esm')(module);

require('./main');
