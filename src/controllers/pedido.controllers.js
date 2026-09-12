const pedidoService = require("../services/pedido.services.js");

async function criarPedido(req,res){
    try{
     const dados = req.body;
     
     const pedido = await pedidoService.criarPedido(dados);
     
     res.status(201).json(pedido);

}catch(erro){
    console.log("Erro ao criar pedido", erro);

    if(
        erro.message === "O nome deve ter pelo menos 3 caracteres" ||
        erro.message === "Número de telefone inválido"
    ){
        return res.status(400).json({
            erro: erro.message
        });
    }

    res.status(500).json({
        erro:"Erro ao criar pedido"
    });
}
}
async function buscarPedidoPorId(req,res){
    try{
        const { id } = req.params;

        const pedido = await pedidoService.buscarPedidoPorId(id);

        res.json(pedido);

    }catch(erro){
        console.log("Erro ao buscar pedido por ID", erro);

        if(erro.message === "Pedido não encontrado"){
            return res.status(404).json({
                erro: erro.message
            });
        }

        res.status(500).json({
            erro: "Erro ao buscar pedido"
        });
    }
}
module.exports ={
    criarPedido,
    buscarPedidoPorId
};