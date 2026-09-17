const express = require("express");
const cors = require("cors");

//importando a rota produtos
const produtoRoutes = require("./routes/produto.routes");
//importando a rota pedidos
const pedidoRoutes = require("./routes/pedido.routes");
//importando a rota itens-pedido
const itemPedidoRoutes = require("./routes/item-pedido.routes");
//importando a rota middleware
const erroMiddleware = require("./middlewares/error.middleware");
const app = express();

app.use(cors());
app.use(express.json());

app.use(produtoRoutes);
app.use(pedidoRoutes);
app.use(itemPedidoRoutes);
app.use(erroMiddleware);
module.exports = app;