const pool = require("./src/database/db");

async function testarBanco() {
    try {
        const resultado = await pool.query("SELECT NOW()");
        console.log("PostgreSQL conectado:", resultado.rows[0]);
    } catch (erro) {
        console.error("Erro ao conectar:", erro.message);
    } finally {
        await pool.end();
    }
}

testarBanco();