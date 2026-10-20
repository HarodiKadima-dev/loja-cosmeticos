
const express = require("express");
const router = express.Router();

// Controller
const pedidoController = require("../controllers/pedido.controllers.js");

// Middleware de autenticação
const verificarAdmin = require("../middlewares/verificarAdmin");

// Todas estas operações são exclusivas do administrador

router.get(
    "/pedidos",
    verificarAdmin,
    pedidoController.buscarTodosPedidos
);

router.get(
    "/pedidos/:id",
    verificarAdmin,
    pedidoController.buscarPedidoPorId
);

router.post(
    "/pedidos",
    verificarAdmin,
    pedidoController.criarPedido
);

router.patch(
    "/pedidos/:id/status",
    verificarAdmin,
    pedidoController.atualizarStatusPedido
);

module.exports = router;
