const produtoRepository = require("../repositories/produto.repositories.js");

async function listarProdutos(req,res){
    try{
    const produtos = await produtoRepository.buscarProdutos();
    
    res.json(produtos);
}catch(erro){
    console.log("Erro ao listar produtos:",erro);
    res.status(500).json({
        erro:"Erro ao buscar produtos"
    });
}

}

module.exports={
    listarProdutos
};