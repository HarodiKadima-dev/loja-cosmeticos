const express = require("express");
const router = express.Router();

//conectar o controllers
const produtoController = require("../controllers/produto.controllers.js");
//a rota de busca de produtos
router.get("/produtos",produtoController.listarProdutos);

module.exports= router;