const pedidoRepository = require("../repositories/pedido.repositories.js");
const produtoRepository = require("../repositories/produto.repositories.js");
const itemPedidoRepository = require("../repositories/item-pedido.repositories.js");
const { obterClient } = require("../../database/db");

async function criarPedido(dados) {
    const client = await obterClient();
    try{
        //inicia a transação
    await client.query("BEGIN");
    
    if(!dados.nome_cliente || dados.nome_cliente.trim().length < 3){
        throw new Error("O nome deve ter pelo menos 3 caracteres");
    }
    const telefoneValido = /^\+244\d{9}$/;

if (!telefoneValido.test(dados.telefone)) {
    throw new Error("Número de telefone inválido");
}
//Verificar os itens do pedido
if(!Array.isArray(dados.itens) || dados.itens.length === 0){
    throw new Error("O pedido deve ter pelo menos um item");
}
const pedido = await pedidoRepository.criarPedido(dados, client);
//Processar itens
for(const item of dados.itens){
    const produto = await produtoRepository.buscarProdutoParaTransacao(item.produto_id, client);
    if(!produto){
        throw new Error("Produto não encontrado");
    }

//Quantidade do item
if(!Number.isInteger(item.quantidade) || item.quantidade <=0){
    throw new Error("Quantidade deve ser um número inteiro maior que zero");
}

if(item.quantidade > produto.stock){
    throw new Error("Stock insuficiente");
}

        await produtoRepository.baixarStock(
    item.produto_id,
    item.quantidade,
    client
);
        await itemPedidoRepository.adicionarItemPedido({
            pedido_id:pedido.id,
            produto_id:item.produto_id,
            quantidade:item.quantidade,
            preco:produto.preco
        }, client);
}
    
//confirma e guarda as alterações da transação
await client.query("COMMIT");
    return pedido;

}catch(erro){
    //desfaz as alterações da transação em caso de erro
   await client.query("ROLLBACK");
    throw erro;
}finally{
    //liberta a conexão
    client.release();
}
}
async function buscarPedidoPorId(id){
    const pedido = await pedidoRepository.buscarPedidoPorId(id);

    if(!pedido){
        throw new Error("Pedido não encontrado");
    }
    return pedido;
}
  
module.exports = {
    criarPedido,
    buscarPedidoPorId
};