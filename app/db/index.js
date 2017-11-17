const mysql = require('mysql2/promise');
const poolConfig = require('../config');

if (!poolConfig) {
  console.error('No config provided');
  process.exit(0);
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
