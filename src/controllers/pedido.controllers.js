const pedidoService = require("../services/pedido.services.js");

async function criarPedido(req, res, next){
    try {
        const dados = req.body;

        const pedido = await pedidoService.criarPedido(dados);

        res.status(201).json(pedido);

    } catch (erro) {
        next(erro);
    }
}

async function buscarPedidoPorId(req, res, next){
    try {
        const { id } = req.params;

        const pedido = await pedidoService.buscarPedidoPorId(id);

        res.json(pedido);

    } catch (erro) {
        next(erro);
    }
}
async function atualizarStatusPedido(req, res, next){
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pedido = await pedidoService.atualizarStatusPedido(id, status);

        res.json(pedido);
    } catch (erro) {
        next(erro);
    }
}
module.exports = {
    criarPedido,
    buscarPedidoPorId,
    atualizarStatusPedido
};