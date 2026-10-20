
const produtoRepository = require("../repositories/produto.repositories.js");

function validarDadosProduto(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new Error("Dados do produto inválidos");
    }

    if (
        typeof dados.nome !== "string" ||
        dados.nome.trim().length < 2
    ) {
        throw new Error("O nome deve ter pelo menos 2 caracteres");
    }

    if (
        typeof dados.descricao !== "string" ||
        dados.descricao.trim().length === 0
    ) {
        throw new Error("A descrição é obrigatória");
    }

    if (
        dados.preco === undefined ||
        dados.preco === null ||
        dados.preco === "" ||
        !Number.isFinite(Number(dados.preco)) ||
        Number(dados.preco) <= 0
    ) {
        throw new Error("Preço inválido");
    }

    if (
        dados.stock === undefined ||
        !Number.isInteger(dados.stock) ||
        dados.stock < 0
    ) {
        throw new Error("Stock inválido");
    }

    if (
        dados.imagem !== undefined &&
        dados.imagem !== null &&
        typeof dados.imagem !== "string"
    ) {
        throw new Error("Imagem inválida");
    }
}

async function criarProduto(dados) {
    validarDadosProduto(dados);

    const dadosValidados = {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    preco: Number(dados.preco),
    stock: dados.stock,
    imagem: dados.imagem || null,
    categoria: dados.categoria,
    destaque: dados.destaque
};

    return await produtoRepository.criarProduto(dadosValidados);
}

async function atualizarProduto(id, dados) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("ID do produto inválido");
    }

    validarDadosProduto(dados);

    const dadosValidados = {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    preco: Number(dados.preco),
    stock: dados.stock,
    imagem: dados.imagem || null,
    categoria: dados.categoria,
    destaque: dados.destaque
};
    
    const produto = await produtoRepository.atualizarProduto(
        Number(id),
        dadosValidados
    );

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    return produto;
}

async function deletarProduto(id) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("ID do produto inválido");
    }

    return await produtoRepository.deletarProduto(Number(id));
}

async function atualizarStock(id, stock) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("ID do produto inválido");
    }

    if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("Stock inválido");
    }

    const produto = await produtoRepository.atualizarStock(
        Number(id),
        stock
    );

    if (!produto) {
        throw new Error("Produto não encontrado");
    }

    return produto;
}

module.exports = {
    criarProduto,
    atualizarProduto,
    deletarProduto,
    atualizarStock
};
