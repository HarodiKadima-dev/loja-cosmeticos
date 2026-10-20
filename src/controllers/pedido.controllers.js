const pedidoService = require("../services/pedido.services.js");

async function buscarTodosPedidos(req, res, next){
  try {
    const pedidos = await pedidoService.buscarTodosPedidos();
    res.json(pedidos);
  } catch (erro) {
    next(erro);
  }
}

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
    buscarTodosPedidos,
    criarPedido,
    buscarPedidoPorId,
    atualizarStatusPedido
};