const itemPedidoService = require("../services/item-pedido.services.js");

async function adicionarItemPedido(req, res, next){
    try {
        const dados = req.body;

        const item = await itemPedidoService.adicionarItemPedido(dados);

        res.status(201).json(item);

    } catch (erro) {
        next(erro);
    }
}

async function buscarItensPorPedidoId(req, res, next){
    try {
        const { pedidoId } = req.params;

        const itens = await itemPedidoService.buscarItensPorPedidoId(pedidoId);

        res.json(itens);

    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    adicionarItemPedido,
    buscarItensPorPedidoId
};