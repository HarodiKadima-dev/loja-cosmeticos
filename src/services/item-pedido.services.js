const produtoRepository = require("../repositories/produto.repositories.js");
const itemPedidoRepository = require("../repositories/item-pedido.repositories.js");


async function adicionarItemPedido(dados){
    const produto = await produtoRepository.buscarProdutoPorId(dados.produto_id);
    
    if(!produto){
        throw new Error("Produto não encontrado");
    }
    if(!Number.isInteger(dados.quantidade) || dados.quantidade <= 0){
    throw new Error("Quantidade deve ser um número inteiro maior que zero");
}
if(dados.quantidade > produto.stock){
    throw new Error("Stock insuficiente");
}
    const preco = produto.preco;
    
    const item = await itemPedidoRepository.adicionarItemPedido({
    pedido_id: dados.pedido_id,
    produto_id: dados.produto_id,
    quantidade: dados.quantidade,
    preco
});

return item;
}
async function buscarItensPorPedidoId(pedidoId){
    const itens = await itemPedidoRepository.buscarItensPorPedidoId(pedidoId);

    return itens;
}

module.exports={
    adicionarItemPedido,
    buscarItensPorPedidoId
}