const express = require("express");
const cors = require("cors");
const path = require("path");

const sessionMiddleware = require("./config/session");

const adminRoutes = require("./routes/admin.routes");
const produtoRoutes = require("./routes/produto.routes");
const pedidoRoutes = require("./routes/pedido.routes");
const itemPedidoRoutes = require("./routes/item-pedido.routes");
const erroMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middlewares gerais
app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Painel administrativo
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// Rotas da API
app.use(produtoRoutes);
app.use(pedidoRoutes);
app.use(itemPedidoRoutes);
app.use(adminRoutes);

// Tratamento de erros
app.use(erroMiddleware);

module.exports = app;