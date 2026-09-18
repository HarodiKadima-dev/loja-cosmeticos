function errorMiddleware(erro, req, res, next){
    console.log("Erro:", erro);

    if(erro.message === "O nome deve ter pelo menos 3 caracteres" ||
   erro.message === "Número de telefone inválido" ||
   erro.message === "O pedido deve ter pelo menos um item" ||
   erro.message === "Quantidade deve ser um número inteiro maior que zero" ||
   erro.message === "Stock insuficiente" ||
   erro.message === "Estado do pedido inválido" || erro.message === "Stock inválido"){
    
    return res.status(400).json({
        erro: erro.message
    });
}

    if(erro.message === "Produto não encontrado" || erro.message === "Pedido não encontrado"){
        return res.status(404).json({
            erro: erro.message
        });
    }

    res.status(500).json({
        erro: "Erro interno do servidor"
    });
}

module.exports = errorMiddleware;