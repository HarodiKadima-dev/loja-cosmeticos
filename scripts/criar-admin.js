require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("../database/db");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");

async function gerirAdmin() {
    const terminal = readline.createInterface({
        input: stdin,
        output: stdout
    });

    try {
        const email = (
            await terminal.question("Email do administrador: ")
        ).trim().toLowerCase();

        const senha = await terminal.question(
            "Nova palavra-passe: "
        );

        if (!email || !senha) {
            throw new Error("Email e palavra-passe são obrigatórios.");
        }

        if (senha.length < 8) {
            throw new Error(
                "A palavra-passe deve ter pelo menos 8 caracteres."
            );
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const resultado = await pool.query(
            `UPDATE admin
             SET senha_hash = $1
             WHERE LOWER(email) = $2
             RETURNING id, email`,
            [senhaHash, email]
        );

        if (resultado.rows.length === 0) {
            throw new Error(
                "Administrador não encontrado. Nenhuma conta foi criada."
            );
        }

        console.log(
            `Palavra-passe actualizada para: ${resultado.rows[0].email}`
        );

    } catch (erro) {
        console.error("Erro:", erro.message);
        process.exitCode = 1;
    } finally {
        terminal.close();
        await pool.end();
    }
}

gerirAdmin();