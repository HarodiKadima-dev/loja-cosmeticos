
const express = require("express");
const router = express.Router();

// Controllers
const produtoController = require("../controllers/produto.controllers.js");

// Middleware de autenticação
const verificarAdmin = require("../middlewares/verificarAdmin");

// Consultas públicas
router.get("/produtos", produtoController.listarProdutos);
router.get("/produtos/:id", produtoController.buscarProdutoPorId);

// Operações exclusivas do administrador
router.post("/produtos", verificarAdmin, produtoController.criarProduto);

router.put("/produtos/:id", verificarAdmin, produtoController.atualizarProduto);

router.delete("/produtos/:id", verificarAdmin, produtoController.deletarProduto);

router.patch(
    "/produtos/:id/stock",
    verificarAdmin,
    produtoController.atualizarStock
);

module.exports = router;
