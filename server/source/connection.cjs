const { Pool } = require("pg");

const dotenv = require("dotenv");
dotenv.config();
let pool;
if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432,
  });
} else {
  pool = new Pool({
    user: "Khizar",
    host: "localhost",
    database: "VoxaLink",
    password: "123",
    port: 5432,
  });
}

module.exports = pool;
