//conectar ao banco de dados
const pool = require("../../database/db");

async function buscarProdutos(){
    try{
   const resultado = await pool.query("SELECT * FROM produtos");
   
   return resultado.rows;
   
}catch(erro){
    console.log("Erro ao buscar produtos:",erro);
    throw erro;
}

}
module.exports = {
buscarProdutos
};