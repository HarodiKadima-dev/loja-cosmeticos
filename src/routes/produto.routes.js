const express = require("express");
const router = express.Router();

//conectar o controllers
const produtoController = require("../controllers/produto.controllers.js");
//a rota de busca de produtos (get)
router.get("/produtos",produtoController.listarProdutos);

router.get("/produtos/:id", produtoController.buscarProdutoPorId);
//a rota post
router.post("/produtos",produtoController.criarProduto);

// a rota put 
router.put("/produtos/:id", produtoController.atualizarProduto);
//a rota delete
router.delete("/produtos/:id", produtoController.deletarProduto);
//rota patch
router.patch(
    "/produtos/:id/stock",
    produtoController.atualizarStock
);
module.exports= router;