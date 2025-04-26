const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

async function getDataFromDB() {
    const { rows } = await pool.query('SELECT * FROM your_table LIMIT 100');
    return rows;
}

module.exports = { getDataFromDB };
