const produtoRepository = require("../repositories/produto.repositories.js");
const produtoService = require("../services/produto.services.js");
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

async function buscarProdutoPorId(req,res) {
    try{
        const {id} = req.params;
        
        const produto = await produtoRepository.buscarProdutoPorId(id);
        
        if(!produto){
            
            return res.status(404).json({
                erro:"Produto não encontrado"
            });
        }
        
        res.json(produto);
        
    }catch(erro){
        console.log("Erro ao buscar produto por ID:", erro);
        
        res.status(500).json({
            erro:"Erro ao buscar produto"
        });
    }
}
 
async function criarProduto(req,res){
    try{
        const dados = req.body;
        
        const produto = await produtoService.criarProduto(dados);
        
        res.status(201).json(produto);
    }catch(erro){
        console.log("Erro ao criar produto:", erro);
        
        res.status(500).json({
            erro:"Erro ao criar produto"
        });
    }
}


module.exports={
    listarProdutos,
    buscarProdutoPorId,
    criarProduto
};