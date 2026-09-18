const produtoRepository = require("../repositories/produto.repositories.js");

async function criarProduto(dados) {
const produto = await produtoRepository.criarProduto(dados);

return produto;
}
async function atualizarProduto(id,dados){
    
    if(dados.stock <0){
        throw new Error("Stock não pode ser negativo");
    }
    const produto = await produtoRepository.atualizarProduto(id,dados);
    return produto;
}
async function deletarProduto(id){
    const produto = await produtoRepository.deletarProduto(id);
    
    return produto;
}
async function atualizarStock(id, stock){

    if(!Number.isInteger(stock) || stock < 0){
        throw new Error("Stock inválido");
    }

    const produto = await produtoRepository.atualizarStock(id, stock);

    if(!produto){
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