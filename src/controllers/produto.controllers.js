
const produtoRepository = require("../repositories/produto.repositories.js");
const produtoService = require("../services/produto.services.js");

async function listarProdutos(req, res, next) {
    try {
        const produtos = await produtoRepository.buscarProdutos();
        return res.status(200).json(produtos);
    } catch (erro) {
        next(erro);
    }
}

async function buscarProdutoPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID do produto inválido" });
        }

        const produto = await produtoRepository.buscarProdutoPorId(id);

        if (!produto) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        return res.status(200).json(produto);
    } catch (erro) {
        next(erro);
    }
}

async function criarProduto(req, res, next) {
    try {
        const produto = await produtoService.criarProduto(req.body);
        return res.status(201).json(produto);
    } catch (erro) {
        next(erro);
    }
}

async function atualizarProduto(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID do produto inválido" });
        }

        const produto = await produtoService.atualizarProduto(id, req.body);
        return res.status(200).json(produto);
    } catch (erro) {
        next(erro);
    }
}

async function deletarProduto(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID do produto inválido" });
        }

        const produto = await produtoService.deletarProduto(id);

        if (!produto) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }

        return res.status(200).json({
            mensagem: "Produto eliminado com sucesso",
            produto
        });
    } catch (erro) {
        next(erro);
    }
}

async function atualizarStock(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: "ID do produto inválido" });
        }

        const { stock } = req.body;
        const produto = await produtoService.atualizarStock(id, stock);

        return res.status(200).json(produto);
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    atualizarStock
};
