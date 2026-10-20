const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controllers");
const verificarAdmin = require("../middlewares/verificarAdmin");

// Autenticação
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/logout", adminController.logoutAdmin);

// Verificar sessão do administrador
router.get("/admin/me", verificarAdmin, adminController.obterAdminAtual);

module.exports = router;