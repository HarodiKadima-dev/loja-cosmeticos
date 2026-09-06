const express = require("express");
const router = express.Router();

//conectar o controllers
const produtoController = require("../controllers/produto.controllers.js");
//a rota de busca de produtos (get)
router.get("/produtos",produtoController.listarProdutos);

router.get("/produtos/:id", produtoController.buscarProdutoPorId);
//a rota post
router.post("/produtos",produtoController.criarProduto);

module.exports= router;