const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'IMC',
    password: 'wcc@2023',
    port: 5432,
})

pool.connect()
    .then(() => console.log('Server is now Online'))
    .catch(() => console.error('Server Failed to Connect to database'));

module.exports = pool;