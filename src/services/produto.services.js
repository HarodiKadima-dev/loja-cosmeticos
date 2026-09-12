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
module.exports = {
    criarProduto,
    atualizarProduto,
    deletarProduto
};