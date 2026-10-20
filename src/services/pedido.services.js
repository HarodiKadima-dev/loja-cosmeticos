
const pedidoRepository = require("../repositories/pedido.repositories.js");
const produtoRepository = require("../repositories/produto.repositories.js");
const itemPedidoRepository = require("../repositories/item-pedido.repositories.js");
const { obterClient } = require("../../database/db");

async function criarPedido(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new Error("Dados do pedido inválidos");
    }

    if (
        typeof dados.nome_cliente !== "string" ||
        dados.nome_cliente.trim().length < 3
    ) {
        throw new Error("O nome deve ter pelo menos 3 caracteres");
    }

    if (
        typeof dados.telefone !== "string" ||
        !/^\+244\d{9}$/.test(dados.telefone)
    ) {
        throw new Error("Número de telefone inválido");
    }

    if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
        throw new Error("O pedido deve ter pelo menos um item");
    }

    const client = await obterClient();
    let transacaoIniciada = false;

    try {
        await client.query("BEGIN");
        transacaoIniciada = true;

        const pedido = await pedidoRepository.criarPedido(dados, client);

        for (const item of dados.itens) {
            if (
                !item ||
                !Number.isInteger(item.produto_id) ||
                item.produto_id <= 0
            ) {
                throw new Error("Produto inválido");
            }

            if (
                !Number.isInteger(item.quantidade) ||
                item.quantidade <= 0
            ) {
                throw new Error(
                    "Quantidade deve ser um número inteiro maior que zero"
                );
            }

            const produto =
                await produtoRepository.buscarProdutoParaTransacao(
                    item.produto_id,
                    client
                );

            if (!produto) {
                throw new Error("Produto não encontrado");
            }

            if (item.quantidade > produto.stock) {
                throw new Error("Stock insuficiente");
            }

            const stockAtualizado = await produtoRepository.baixarStock(
                item.produto_id,
                item.quantidade,
                client
            );

            if (!stockAtualizado) {
                throw new Error("Stock insuficiente ou produto inexistente");
            }

            await itemPedidoRepository.adicionarItemPedido(
                {
                    pedido_id: pedido.id,
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    preco: produto.preco
                },
                client
            );
        }

        await client.query("COMMIT");
        transacaoIniciada = false;

        const itens = await itemPedidoRepository.buscarItensPorPedidoId(
            pedido.id
        );

        const total = itens.reduce(
            (soma, item) =>
                soma + Number(item.preco) * Number(item.quantidade),
            0
        );

        return { pedido, itens, total };
    } catch (erro) {
        if (transacaoIniciada) {
            try {
                await client.query("ROLLBACK");
            } catch (erroRollback) {
                console.error("Erro ao reverter transação:", erroRollback);
            }
        }

        throw erro;
    } finally {
        client.release();
    }
}

async function buscarPedidoPorId(id) {
    const pedido = await pedidoRepository.buscarPedidoPorId(id);

    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    const itens = await itemPedidoRepository.buscarItensPorPedidoId(id);

    const total = itens.reduce(
        (soma, item) =>
            soma + Number(item.preco) * Number(item.quantidade),
        0
    );

    return { pedido, itens, total };
}

async function atualizarStatusPedido(id, status) {
    const estadosPermitidos = [
        "Pendente",
        "Confirmado",
        "Concluído",
        "Cancelado"
    ];

    if (!estadosPermitidos.includes(status)) {
        throw new Error("Estado do pedido inválido");
    }

    const pedido = await pedidoRepository.atualizarStatusPedido(id, status);

    if (!pedido) {
        throw new Error("Pedido não encontrado");
    }

    return pedido;
}

async function buscarTodosPedidos() {
  const pedidos = await pedidoRepository.listarTodosPedidos();
  return pedidos;
}

module.exports = {
    criarPedido,
    buscarPedidoPorId,
    atualizarStatusPedido,
    buscarTodosPedidos
};
