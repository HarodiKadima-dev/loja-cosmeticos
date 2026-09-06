const produtoRepository = require("../repositories/produto.repositories.js");

async function criarProduto(dados) {
const produto = await produtoRepository.criarProduto(dados);

return produto;
}

module.exports = {
    criarProduto
};