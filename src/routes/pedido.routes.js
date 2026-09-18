const express = require("express");
const router = express.Router();

//conectar o controllers
const pedidoController = require("../controllers/pedido.controllers.js");

//a rota post
router.post("/pedidos",pedidoController.criarPedido);
//a rota get
router.get("/pedidos/:id", pedidoController.buscarPedidoPorId);

router.patch("/pedidos/:id/status", pedidoController.atualizarStatusPedido);

module.exports = router;