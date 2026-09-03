const express = require("express");
const cors = require("cors");
//importando a rota
const produtoRoutes = require("./routes/produto.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(produtoRoutes);
module.exports = app;