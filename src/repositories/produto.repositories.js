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

async function buscarProdutoPorId(id){
    try{
        const resultado = await pool.query
        ("SELECT * FROM produtos WHERE id =$1",
        [id]
        );
        return resultado.rows[0];
        
    }catch(erro){
        console.log("Erro ao buscar produto por ID:", erro);
        throw erro;
    }
}

async function criarProduto(dados){
    try{
        const resultado = await pool.query(
            `INSERT INTO produtos (nome, descricao, preco,  stock, imagem) 
            
            VALUES($1,$2, $3, $4, $5)
            
            RETURNING*`,
            [dados.nome,
            dados.descricao,
            dados.preco,
            dados.stock,
            dados.imagem
            ]
            );
           return  resultado.rows[0];
            
    }catch(erro){
        console.log("Erro ao criar produto:",erro);
        throw erro;
    }
}

async function atualizarProduto(id, dados){
    try{
        const resultado = await pool.query(
            `UPDATE produtos SET 
            nome = $1, 
            descricao =$2,
            preco = $3,
            stock = $4, 
            imagem =$5
            WHERE id = $6
            RETURNING *`,
            [
            dados.nome,
            dados.descricao,
            dados.preco,
            dados.stock,
            dados.imagem,
            id
            ]
            );
            return resultado.rows[0];
    }catch(erro){
    console.log("Erro ao buscar produtos:",erro);
    throw erro;
}

}

async function deletarProduto(id){
    try{
        const resultado = await pool.query(`DELETE FROM produtos 
             WHERE id = $1
             RETURNING *`,
             [id]
             )
             
             return resultado.rows[0];
             
    }catch(erro){
    console.log("Erro ao deletar produto:",erro);
    throw erro;
}
    
}
module.exports = {
buscarProdutos,
buscarProdutoPorId,
criarProduto,
atualizarProduto,
deletarProduto
};