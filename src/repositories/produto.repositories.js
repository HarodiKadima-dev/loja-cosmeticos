const { pool } = require("../../database/db");

async function buscarProdutos(){
    try{
        const resultado = await pool.query("SELECT * FROM produtos ORDER BY created_at DESC");
        return resultado.rows;
    }catch(erro){
        console.log("Erro ao buscar produtos:", erro);
        throw erro;
    }
}

async function buscarProdutoPorId(id){
    try{
        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE id = $1",
            [id]
        );
        return resultado.rows[0];
    }catch(erro){
        console.log("Erro ao buscar produto por ID:", erro);
        throw erro;
    }
}

async function buscarProdutoParaTransacao(id, client){
    const resultado = await client.query(`SELECT * FROM produtos WHERE id = $1 FOR UPDATE`, [id]);
    return resultado.rows[0];
}

async function baixarStock(id, quantidade, client) {
    const resultado = await client.query(
        `UPDATE produtos
         SET stock = stock - $1
         WHERE id = $2
           AND stock >= $1
         RETURNING *`,
        [quantidade, id]
    );
    return resultado.rows[0];
}

async function criarProduto(dados){
    try{
        const resultado = await pool.query(
            `INSERT INTO produtos (nome, descricao, preco, stock, imagem, categoria, destaque) 
             VALUES($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [
                dados.nome,
                dados.descricao,
                dados.preco,
                dados.stock,
                dados.imagem,
                dados.categoria || 'Perfumes',
                dados.destaque !== undefined ? dados.destaque : false
            ]
        );
        return resultado.rows[0];
    }catch(erro){
        console.log("Erro ao criar produto:", erro);
        throw erro;
    }
}

async function atualizarProduto(id, dados){
    try{
        const produtoAtual = await buscarProdutoPorId(id);
        
        const resultado = await pool.query(
            `UPDATE produtos SET 
                nome = $1, 
                descricao = $2,
                preco = $3,
                stock = $4, 
                imagem = $5,
                categoria = $6,
                destaque = $7
             WHERE id = $8
             RETURNING *`,
            [
                dados.nome,
                dados.descricao,
                dados.preco,
                dados.stock,
                dados.imagem,
                dados.categoria || produtoAtual.categoria,
                dados.destaque !== undefined ? dados.destaque : produtoAtual.destaque,
                id
            ]
        );
        return resultado.rows[0];
    }catch(erro){
        console.log("Erro ao atualizar produto:", erro);
        throw erro;
    }
}

async function deletarProduto(id){
    try{
        const resultado = await pool.query(
            `DELETE FROM produtos WHERE id = $1 RETURNING *`,
            [id]
        );
        return resultado.rows[0];
    }catch(erro){
        console.log("Erro ao deletar produto:", erro);
        throw erro;
    }
}

async function atualizarStock(id, stock){
    const resultado = await pool.query(
        `UPDATE produtos SET stock = $1 WHERE id = $2 RETURNING *`,
        [stock, id]
    );
    return resultado.rows[0];
}

async function buscarProdutosEmDestaque(){
    try{
        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE destaque = true ORDER BY created_at DESC LIMIT 8"
        );
        return resultado.rows;
    }catch(erro){
        console.log("Erro ao buscar produtos em destaque:", erro);
        throw erro;
    }
}

async function buscarProdutosPorCategoria(categoria){
    try{
        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE categoria = $1 ORDER BY created_at DESC",
            [categoria]
        );
        return resultado.rows;
    }catch(erro){
        console.log("Erro ao buscar produtos por categoria:", erro);
        throw erro;
    }
}

module.exports = {
    buscarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    buscarProdutoParaTransacao,
    baixarStock,
    atualizarStock,
    buscarProdutosEmDestaque,
    buscarProdutosPorCategoria
};
