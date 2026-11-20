
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const poolConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sia_sekolah',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// SSL untuk TiDB Cloud
if (process.env.DB_SSL === 'true') {
    const caPath = path.join(
        __dirname,
        '..',
        'certs',
        'isrgrootx1.pem'
    );

    poolConfig.ssl = {
        ca: fs.readFileSync(caPath),
        rejectUnauthorized: true
    };
}

const pool = mysql.createPool(poolConfig);

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log('[Database] Berhasil terhubung!');
        console.log(`[Database] Host: ${process.env.DB_HOST}`);
        console.log(`[Database] Database: ${process.env.DB_NAME}`);

        connection.release();
        return true;
    } catch (error) {
        console.error('[Database Error]', error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
