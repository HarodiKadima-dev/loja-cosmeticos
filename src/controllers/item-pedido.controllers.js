const itemPedidoService = require("../services/item-pedido.services.js");

async function adicionarItemPedido(req,res){
    try{
        const dados = req.body;
        
        const item = await itemPedidoService.adicionarItemPedido(dados);
        
        res.status(201).json(item);
    }catch(erro){
        console.log("Erro ao adicionar item ao pedido", erro);
        
        if(erro.message === "Produto não encontrado"){
            
           return res.status(404).json({
               erro:erro.message
           });
        }
        
        if(
    erro.message === "Quantidade deve ser um número inteiro maior que zero" ||
    erro.message === "Stock insuficiente"
){
    return res.status(400).json({
        erro: erro.message
    });
}
        res.status(500).json({
            erro:"Erro ao adicionar item ao pedido"
        });
    }
}

async function buscarItensPorPedidoId(req,res){
    try{
        const { pedidoId } = req.params;

        const itens = await itemPedidoService.buscarItensPorPedidoId(pedidoId);

        res.json(itens);

    }catch(erro){
        console.log("Erro ao buscar itens do pedido", erro);

        res.status(500).json({
            erro: "Erro ao buscar itens do pedido"
        });
    }
}

module.exports ={
    adicionarItemPedido,
    buscarItensPorPedidoId
}