
const bcrypt = require("bcryptjs");
const { pool } = require("../../database/db");

async function loginAdmin(req, res, next) {
    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({
                mensagem: "Dados de login inválidos"
            });
        }

        const { email, senha } = req.body;

        if (
            typeof email !== "string" ||
            typeof senha !== "string" ||
            !email.trim() ||
            !senha
        ) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios"
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const resultado = await pool.query(
            `SELECT id, email, senha_hash
             FROM admin
             WHERE LOWER(email) = $1`,
            [emailNormalizado]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensagem: "Credenciais inválidas."
            });
        }

        const admin = resultado.rows[0];

        const senhaValida = await bcrypt.compare(
            senha,
            admin.senha_hash
        );

        if (!senhaValida) {
            return res.status(401).json({
                mensagem: "Credenciais inválidas."
            });
        }

        // Evita reutilizar o identificador de sessão anterior ao autenticar.
        req.session.regenerate((erro) => {
            if (erro) {
                return next(erro);
            }

            req.session.adminId = admin.id;

            req.session.save((erroSave) => {
                if (erroSave) {
                    return next(erroSave);
                }

                return res.status(200).json({
                    mensagem: "Login realizado com sucesso.",
                    admin: {
                        id: admin.id,
                        email: admin.email
                    }
                });
            });
        });
    } catch (erro) {
        next(erro);
    }
}

function logoutAdmin(req, res, next) {
    if (!req.session) {
        return res.status(200).json({
            mensagem: "Sessão terminada com sucesso."
        });
    }

    req.session.destroy((erro) => {
        if (erro) {
            return next(erro);
        }

        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            mensagem: "Sessão terminada com sucesso."
        });
    });
}

async function obterAdminAtual(req, res, next) {
    try {
        const resultado = await pool.query(
            `SELECT id, email
             FROM admin
             WHERE id = $1`,
            [req.session.adminId]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensagem: "Administrador não encontrado."
            });
        }

        return res.status(200).json({
            admin: resultado.rows[0]
        });
    } catch (erro) {
        next(erro);
    }
}

module.exports = {
    loginAdmin,
    logoutAdmin,
    obterAdminAtual
};
