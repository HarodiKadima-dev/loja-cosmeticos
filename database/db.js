const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("error", (erro) => {
    console.error(
        "Erro numa ligação inactiva do PostgreSQL:",
        erro.code || erro.message
    );
});

async function obterClient() {
    return await pool.connect();
}

module.exports = {
    pool,
    obterClient
};