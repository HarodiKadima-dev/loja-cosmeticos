const pedidoRepository = require("../repositories/pedido.repositories.js");

async function criarPedido(dados) {
    
    if(!dados.nome_cliente || dados.nome_cliente.trim().length < 3){
        throw new Error("O nome deve ter pelo menos três  caracteres");
    }
    const telefoneValido = /^\+244\d{9}$/;

if (!telefoneValido.test(dados.telefone)) {
    throw new Error("Número de telefone inválido");
}
    const pedido = await pedidoRepository.criarPedido(dados);

    return pedido;
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