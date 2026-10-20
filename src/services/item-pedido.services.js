
const produtoRepository = require("../repositories/produto.repositories.js");
const pedidoRepository = require("../repositories/pedido.repositories.js");
const itemPedidoRepository = require("../repositories/item-pedido.repositories.js");

async function adicionarItemPedido(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new Error("Dados do item inválidos");
    }

    if (!Number.isInteger(dados.pedido_id) || dados.pedido_id <= 0) {
        throw new Error("Pedido inválido");
    }

    if (!Number.isInteger(dados.produto_id) || dados.produto_id <= 0) {
        throw new Error("Produto inválido");
    }

    if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
        throw new Error("Quantidade deve ser um número inteiro maior que zero");
    }

    const pedido = await pedidoRepository.buscarPedidoPorId(dados.pedido_id);

    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    if (pedido.status !== "Pendente") {
        throw new Error("Só é possível adicionar itens a pedidos pendentes");
    }

    const produto = await produtoRepository.buscarProdutoPorId(dados.produto_id);

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    if (dados.quantidade > produto.stock) {
        throw new Error("Stock insuficiente");
    }

    // O preço vem da base de dados, nunca do pedido enviado pelo cliente.
    const preco = produto.preco;

    const item = await itemPedidoRepository.adicionarItemPedido({
        pedido_id: dados.pedido_id,
        produto_id: dados.produto_id,
        quantidade: dados.quantidade,
        preco
    });

    return item;
}

async function buscarItensPorPedidoId(pedidoId) {
    const id = Number(pedidoId);

    if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Pedido inválido");
    }

    const pedido = await pedidoRepository.buscarPedidoPorId(id);

    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    return await itemPedidoRepository.buscarItensPorPedidoId(id);
}

module.exports = {
    adicionarItemPedido,
    buscarItensPorPedidoId
};
