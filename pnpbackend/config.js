const fs = require('fs');
const ini = require('ini');

const file = fs.readFileSync('./config.ini', 'utf-8');
const settings = ini.parse(file);

module.exports = settings;