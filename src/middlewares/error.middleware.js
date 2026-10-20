

function errorMiddleware(erro, req, res, next) {
    console.error("Erro:", erro);

    const errosValidacao = [
        "Dados do pedido inválidos",
        "O nome deve ter pelo menos 3 caracteres",
        "Número de telefone inválido",
        "O pedido deve ter pelo menos um item",
        "Produto inválido",
        "Quantidade deve ser um número inteiro maior que zero",
        "Stock insuficiente",
        "Stock insuficiente ou produto inexistente",
        "Estado do pedido inválido",
        "Stock inválido",
        "Dados do produto inválidos",
        "O nome deve ter pelo menos 2 caracteres",
        "A descrição é obrigatória",
        "Preço inválido",
        "Imagem inválida",
        "ID do produto inválido",
        "Stock não pode ser negativo",
        "Pedido inválido",
        "Só é possível adicionar itens a pedidos pendentes"
    ];

    if (errosValidacao.includes(erro.message)) {
        return res.status(400).json({
            erro: erro.message
        });
    }

    if (
        erro.message === "Produto não encontrado" ||
        erro.message === "Pedido não encontrado"
    ) {
        return res.status(404).json({
            erro: erro.message
        });
    }

    return res.status(500).json({
        erro: "Erro interno do servidor"
    });
}

module.exports = errorMiddleware;
