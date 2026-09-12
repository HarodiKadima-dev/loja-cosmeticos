const express = require("express");
const router = express.Router();
const itemPedidoController = require("../controllers/item-pedido.controllers.js");

router.post("/itens-pedidos",
itemPedidoController.adicionarItemPedido);

router.get(
    "/pedidos/:pedidoId/itens",
    itemPedidoController.buscarItensPorPedidoId
);

module.exports = router;