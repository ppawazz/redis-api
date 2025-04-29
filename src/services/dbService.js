const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

async function getDataFromDB() {
  const { rows } = await pool.query('SELECT * FROM produk LIMIT 1000');
  return rows;
}

async function setupDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS produk (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        harga NUMERIC(12, 2) NOT NULL,
        stok INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const { rows } = await pool.query(`SELECT COUNT(*) FROM produk`);
    if (parseInt(rows[0].count) === 0) {
      const insertPromises = [];
      for (let i = 1; i <= 1000; i++) {
        insertPromises.push(
          pool.query(
            'INSERT INTO produk (nama, deskripsi, harga, stok) VALUES ($1, $2, $3, $4)',
            [`Produk ${i}`, `Deskripsi produk ${i}`, (1000 + i), 50 + i]
          )
        );
      }
      await Promise.all(insertPromises);
      console.log('✅ Tabel produk berhasil dibuat dan diisi 100 data.');
    } else {
      console.log('ℹ️ Data produk sudah ada, tidak perlu diisi ulang.');
    }
  } catch (err) {
    console.error('❌ Gagal setup database:', err);
  }
}

module.exports = { getDataFromDB, setupDatabase };
