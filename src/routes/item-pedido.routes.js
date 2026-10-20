
const express = require("express");
const router = express.Router();

const itemPedidoController = require("../controllers/item-pedido.controllers.js");
const verificarAdmin = require("../middlewares/verificarAdmin");

router.post(
    "/itens-pedidos",
    verificarAdmin,
    itemPedidoController.adicionarItemPedido
);

router.get(
    "/pedidos/:pedidoId/itens",
    verificarAdmin,
    itemPedidoController.buscarItensPorPedidoId
);

module.exports = router;
