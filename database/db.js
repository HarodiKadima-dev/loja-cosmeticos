const {Pool} = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString:
    process.env.DATABASE_URL
    
});

async function obterClient(){
   return await pool.connect(); 
}

module.exports = {
    pool,
    obterClient
}