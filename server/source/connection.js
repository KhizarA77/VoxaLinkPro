const {Pool} = require('pg');

const pool = new Pool({
    user: 'Khizar',
    host: 'localhost',
    database: 'VoxaLink',
    password: '123',
    port: 5432,
  });

module.exports=pool;