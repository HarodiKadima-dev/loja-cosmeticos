const pool = require("../../database/db");

async function adicionarItemPedido(dados){
    const resultado = await pool.query(
        `INSERT INTO itens_pedidos (pedido_id, produto_id, quantidade, preco) VALUES($1,$2,$3,$4) RETURNING*`,
        [
            dados.pedido_id,
            dados.produto_id,
            dados.quantidade,
            dados.preco
            ]
        );
        
        return resultado.rows[0];
}

async function buscarItensPorPedidoId(pedidoId){
    const resultado = await pool.query(
        `SELECT  itens_pedidos.id,
        itens_pedidos.pedido_id,
        
        itens_pedidos.produto_id,
        produtos.nome,
        produtos.descricao,
        produtos.imagem,
        
        itens_pedidos.quantidade,
        itens_pedidos.preco FROM itens_pedidos INNER JOIN produtos ON itens_pedidos.produto_id = produtos.id WHERE itens_pedidos.pedido_id = $1`,
        [pedidoId]
        
         
    );

    return resultado.rows;
}

module.exports={
    adicionarItemPedido,
    buscarItensPorPedidoId
}