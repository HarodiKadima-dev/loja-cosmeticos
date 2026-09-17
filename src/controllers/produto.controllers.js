const produtoRepository = require("../repositories/produto.repositories.js");
const produtoService = require("../services/produto.services.js");

async function listarProdutos(req, res, next){
    try {
        const produtos = await produtoRepository.buscarProdutos();

        res.json(produtos);

    } catch (erro) {
        next(erro);
    }
}

async function buscarProdutoPorId(req, res, next){
    try {
        const { id } = req.params;

        const produto = await produtoRepository.buscarProdutoPorId(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        res.json(produto);

    } catch (erro) {
        next(erro);
    }
}

async function criarProduto(req, res, next){
    try {
        const dados = req.body;

        const produto = await produtoService.criarProduto(dados);

        res.status(201).json(produto);

    } catch (erro) {
        next(erro);
    }
}

async function atualizarProduto(req, res, next){
    try {
        const { id } = req.params;
        const dados = req.body;

        const produto = await produtoService.atualizarProduto(id, dados);

        res.json(produto);

    } catch (erro) {
        next(erro);
    }
}

async function deletarProduto(req, res, next){
    try {
        const { id } = req.params;

        const produto = await produtoService.deletarProduto(id);

        if (!produto) {
            throw new Error("Produto não encontrado");
        }

        res.json(produto);

    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto
};