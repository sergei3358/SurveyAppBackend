const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined, // process.env.DB_PORT'un değeri numara türünde olmalıdır, ancak TypeScript bunu otomatik olarak anlayamadığından, parseInt gibi bir dönüştürme işlemi yaparak bu değeri belirli bir sayı türüne dönüştürdük
    ssl: {
        rejectUnauthorized: false,
        timeout: 10000,
        cert: fs.readFileSync("./ssl/server-ca.pem"),
       
    },
    connectionTimeoutMillis: 100000
});

module.exports = pool;