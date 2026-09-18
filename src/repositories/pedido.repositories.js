const { pool } = require("../../database/db");

async function criarPedido(dados,client){
    const resultado = await client.query(
        `INSERT INTO pedidos
        (nome_cliente, telefone)
        VALUES ($1, $2)
        RETURNING *`,
        [
            dados.nome_cliente,
          dados.telefone
        ]
        );
        
        return resultado.rows[0];
        
}
async function buscarPedidoPorId(id){
    const resultado = await pool.query(
        `SELECT * FROM pedidos
         WHERE id = $1`,
        [id]
    );

    return resultado.rows[0];
}
async function atualizarStatusPedido(id, status){
    const resultado = await pool.query(
        `UPDATE pedidos
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    return resultado.rows[0];
}
module.exports ={
    criarPedido,
    buscarPedidoPorId,
    atualizarStatusPedido
}