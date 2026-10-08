const API_URL = "http://127.0.0.1:3000";

let produtos = [];
let carrinho = [];

const quantidades = {};

const gridDestaque = document.querySelector(
    ".destaque .produtos-grid"
);

const todosProdutos = document.querySelector(
    ".todos-produtos .produtos-grid"
);

const secoesProdutos = document.querySelectorAll(
    ".produto-secao"
);

const botoesCategorias = document.querySelectorAll(
    ".categorias button"
);

const linksHeader = document.querySelectorAll(
    ".desktop-nav a"
);

const linksBottomNav = document.querySelectorAll(
    ".bottom-nav-item:not(.cart-nav-button):not(.mais-nav-button)"
);

// MENU MAIS

const maisButton = document.querySelector(
    ".mais-nav-button"
);

const maisMenu = document.querySelector(
    ".mais-menu"
);

function fecharMaisMenu() {
    if (!maisMenu) return;

    maisMenu.classList.remove("ativo");

    if (maisButton) {
        maisButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
}

function alternarMaisMenu() {
    if (!maisMenu) return;

    const aberto =
        maisMenu.classList.contains("ativo");

    if (aberto) {
        fecharMaisMenu();
    } else {
        maisMenu.classList.add("ativo");

        if (maisButton) {
            maisButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }
}

if (maisButton) {
    maisButton.addEventListener(
        "click",
        alternarMaisMenu
    );
}

if (maisMenu) {
    const linksMais =
        maisMenu.querySelectorAll("a");

    linksMais.forEach(link => {
        link.addEventListener(
            "click",
            fecharMaisMenu
        );
    });
}

// NAVEGAÇÃO

function atualizarNavegacaoAtiva() {
    const catalogo =
        document.querySelector(".catalogo");

    const footer =
        document.querySelector("footer");

    const posicao =
        window.scrollY + 180;

    let secaoAtual = "inicio";

    if (
        catalogo &&
        posicao >= catalogo.offsetTop
    ) {
        secaoAtual = "produtos";
    }

    if (
        footer &&
        posicao >= footer.offsetTop
    ) {
        secaoAtual = "contacto";
    }

    linksHeader.forEach(link => {
        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (
            href === `#${secaoAtual}` ||
            href === `index.html#${secaoAtual}`
        ) {
            link.classList.add("active");
        }
    });

    linksBottomNav.forEach(link => {
        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (
            href === `#${secaoAtual}` ||
            href === `index.html#${secaoAtual}`
        ) {
            link.classList.add("active");
        }
    });
}

window.addEventListener(
    "scroll",
    atualizarNavegacaoAtiva
);

atualizarNavegacaoAtiva();

// CATEGORIAS

botoesCategorias.forEach(botao => {
    botao.addEventListener(
        "click",
        () => {
            botoesCategorias.forEach(item => {
                item.classList.remove(
                    "categoria-active"
                );
            });

            botao.classList.add(
                "categoria-active"
            );

            const categoria =
                botao.textContent
                    .trim()
                    .toLowerCase();

            const secao =
                document.querySelector(
                    `.produto-secao[data-categoria="${categoria}"]`
                );

            if (!secao) return;

            secao.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
});

// PESQUISA

const searchForm =
    document.querySelector(".search-form");

const searchInput =
    document.querySelector(
        ".search-form input"
    );

if (searchForm && searchInput) {
    searchForm.addEventListener(
        "submit",
        evento => {
            evento.preventDefault();

            const termo =
                searchInput.value
                    .trim()
                    .toLowerCase();

            if (!termo) {
                renderProdutos();
                return;
            }

            const resultados =
                produtos.filter(produto => {
                    const nome =
                        String(
                            produto.nome || ""
                        ).toLowerCase();

                    const descricao =
                        String(
                            produto.descricao || ""
                        ).toLowerCase();

                    const categoria =
                        String(
                            produto.categoria || ""
                        ).toLowerCase();

                    return (
                        nome.includes(termo) ||
                        descricao.includes(termo) ||
                        categoria.includes(termo)
                    );
                });

            renderResultadosPesquisa(
                resultados
            );
        }
    );
}

// CARRINHO

const carItems =
    document.querySelector(".cart-items");

const carrinhoPainel =
    document.querySelector("#carrinho");

const cartButton =
    document.querySelector(".cart-button");

const cartNavButton =
    document.querySelector(".cart-nav-button");

const cartBadge =
    document.querySelector(".cart-badge");

const cartBadgeMobile =
    document.querySelector(
        ".cart-badge-mobile"
    );

const cartFechar =
    carrinhoPainel?.querySelector(
        ".cart-header button"
    );

const continuarComprando =
    document.querySelector(
        ".continuar-comprando"
    );

// CHECKOUT

const checkoutPanel =
    document.querySelector("#checkout");

const checkoutButton =
    document.querySelector(".checkout-button");

const checkoutFechar =
    document.querySelector(".checkout-fechar");

const checkoutVoltar =
    document.querySelector(".checkout-voltar");

const checkoutItens =
    document.querySelector(".checkout-itens");

const checkoutTotal =
    document.querySelector(".checkout-total-valor");

const checkoutConfirmar =
    document.querySelector(".checkout-confirmar");

function abrirCarrinho() {
    if (!carrinhoPainel) return;

    fecharMaisMenu();

    carrinhoPainel.classList.add("ativo");
}

function fecharCarrinho() {
    if (!carrinhoPainel) return;

    carrinhoPainel.classList.remove(
        "ativo"
    );
}

function abrirCheckout() {
    if (!checkoutPanel) return;

    if (carrinho.length === 0) return;

    fecharCarrinho();
    fecharMaisMenu();

    checkoutPanel.classList.add("ativo");

    renderCheckout();
}

function fecharCheckout() {
    if (!checkoutPanel) return;

    checkoutPanel.classList.remove(
        "ativo"
    );
}

if (cartButton) {
    cartButton.addEventListener(
        "click",
        abrirCarrinho
    );
}

if (cartNavButton) {
    cartNavButton.addEventListener(
        "click",
        abrirCarrinho
    );
}

if (cartFechar) {
    cartFechar.addEventListener(
        "click",
        fecharCarrinho
    );
}

if (continuarComprando) {
    continuarComprando.addEventListener(
        "click",
        fecharCarrinho
    );
}

if (checkoutButton) {
    checkoutButton.addEventListener(
        "click",
        abrirCheckout
    );
}

if (checkoutFechar) {
    checkoutFechar.addEventListener(
        "click",
        fecharCheckout
    );
}

if (checkoutVoltar) {
    checkoutVoltar.addEventListener(
        "click",
        () => {
            fecharCheckout();
            abrirCarrinho();
        }
    );
}

if (checkoutConfirmar) {
    checkoutConfirmar.addEventListener(
        "click",
        confirmarPedido
    );
}

async function confirmarPedido() {
    const nomeInput =
        document.querySelector("#cliente-nome");

    const telefoneInput =
        document.querySelector("#cliente-telefone");

    const nome =
        nomeInput.value.trim();

    const telefone =
        telefoneInput.value
            .replace(/\s/g, "")
            .trim();

    if (nome.length < 3) {
        alert("Digite o seu nome completo.");
        nomeInput.focus();
        return;
    }

    const telefoneValido =
    /^9\d{8}$/;

if (!telefoneValido.test(telefone)) {
    alert(
        "Digite um número de telefone válido.\nExemplo: 923456789"
    );

    telefoneInput.focus();
    return;
}

const telefoneFormatado =
    `+244${telefone}`;

    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio.");
        return;
    }

const mensagem = `
Olá, Kadima Beauty! 🌸

Gostaria de fazer o seguinte pedido:

👤 Nome: ${nome}
📱 Telefone: ${telefone}

🛍️ PEDIDO

${carrinho.map((item, index) => {
    const subtotal =
        Number(item.preco) * Number(item.qtd);

    return `${index + 1}. ${item.nome}
   Quantidade: ${item.qtd}
   Preço: ${Number(item.preco).toLocaleString("pt-AO")} Kz
   Subtotal: ${subtotal.toLocaleString("pt-AO")} Kz`;
}).join("\n\n")}

💰 TOTAL: ${carrinho.reduce(
    (total, item) =>
        total + Number(item.preco) * Number(item.qtd),
    0
).toLocaleString("pt-AO")} Kz

Obrigado! 🌸
`;
    
    const numeroWhatsApp = "244951090896";

const mensagemWhatsApp =
    encodeURIComponent(mensagem);

const urlWhatsApp =
    `https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}`;

window.open(
    urlWhatsApp,
    "_blank"
);
    try {
        checkoutConfirmar.disabled = true;
        checkoutConfirmar.textContent =
            "A processar...";

        const resposta =
            await fetch(
                `${API_URL}/pedidos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(
                        dadosPedido
                    )
                }
            );

        const dados =
            await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.message ||
                dados.error ||
                "Não foi possível criar o pedido."
            );
        }

        console.log(
            "Pedido criado:",
            dados
        );

        alert(
            `Pedido realizado com sucesso!\n\nPedido nº ${dados.pedido.id}`
        );

        carrinho = [];

        renderCarrinho();

        fecharCheckout();

    } catch (erro) {
        console.error(
            "Erro ao confirmar pedido:",
            erro
        );

        alert(
            erro.message ||
            "Ocorreu um erro ao realizar o pedido."
        );

    } finally {
        checkoutConfirmar.disabled = false;

        checkoutConfirmar.innerHTML = `
            Confirmar pedido
            <i class="fa-solid fa-arrow-right"></i>
        `;
    }
}

function atualizarBadges() {
    const quantidadeTotal =
        carrinho.reduce(
            (total, item) =>
                total + Number(item.qtd),
            0
        );

    if (cartBadge) {
        cartBadge.textContent =
            quantidadeTotal;

        cartBadge.style.display =
            quantidadeTotal > 0
                ? "flex"
                : "none";
    }

    if (cartBadgeMobile) {
        cartBadgeMobile.textContent =
            quantidadeTotal;

        cartBadgeMobile.style.display =
            quantidadeTotal > 0
                ? "flex"
                : "none";
    }
}

function renderCarrinho() {
    if (!carItems) return;

    carItems.innerHTML = "";

    atualizarBadges();

    if (carrinho.length === 0) {
        carItems.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fa-solid fa-bag-shopping"></i>

                <h3>
                    O seu carrinho está vazio
                </h3>

                <p>
                    Explore os nossos produtos
                    e encontre algo especial para si.
                </p>

                <a
                    href="#produtos"
                    class="ver-produtos-btn">
                    Ver produtos
                </a>
            </div>
        `;

        const verProdutos =
            carItems.querySelector(
                ".ver-produtos-btn"
            );

        if (verProdutos) {
            verProdutos.addEventListener(
                "click",
                fecharCarrinho
            );
        }

        atualizarTotalCarrinho();

        return;
    }

    carrinho.forEach(item => {
        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <img
                src="./${item.imagem}"
                alt="${item.nome}"
            >

            <div class="cart-item-info">
                <h3>${item.nome}</h3>

                <p>
                    ${item.descricao || ""}
                </p>

                <strong>
                    ${Number(item.preco)
                        .toLocaleString("pt-AO")} Kz
                </strong>
            </div>

            <div class="cart-item-quantidade">
                <button
                    type="button"
                    class="cart-menos">
                    −
                </button>

                <span>${item.qtd}</span>

                <button
                    type="button"
                    class="cart-mais">
                    +
                </button>
            </div>

            <strong class="cart-item-subtotal">
                ${(Number(item.preco) * item.qtd)
                    .toLocaleString("pt-AO")} Kz
            </strong>

            <button
                type="button"
                class="cart-remover"
                aria-label="Remover produto">

                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        carItems.appendChild(div);

        const mais =
            div.querySelector(".cart-mais");

        const menos =
            div.querySelector(".cart-menos");

        const remover =
            div.querySelector(".cart-remover");

        mais.addEventListener(
            "click",
            () => {
                const stock =
                    Number(item.stock);

                if (item.qtd >= stock) {
                    return;
                }

                item.qtd++;

                renderCarrinho();
            }
        );

        menos.addEventListener(
            "click",
            () => {
                if (item.qtd <= 1) {
                    return;
                }

                item.qtd--;

                renderCarrinho();
            }
        );

        remover.addEventListener(
            "click",
            () => {
                carrinho =
                    carrinho.filter(
                        produto =>
                            produto.id !== item.id
                    );

                renderCarrinho();
            }
        );
    });

    atualizarTotalCarrinho();
}

function atualizarTotalCarrinho() {
    const totalElemento =
        document.querySelector(
            ".cart-total-valor"
        );

    if (!totalElemento) return;

    const total =
        carrinho.reduce(
            (soma, item) => {
                return soma +
                    Number(item.preco) *
                    Number(item.qtd);
            },
            0
        );

    totalElemento.textContent =
        `${total.toLocaleString("pt-AO")} Kz`;
}

function renderCheckout() {
    if (!checkoutItens || !checkoutTotal) {
        return;
    }

    checkoutItens.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {
        const subtotal =
            Number(item.preco) *
            Number(item.qtd);

        total += subtotal;

        const div =
            document.createElement("div");

        div.className = "checkout-item";

        div.innerHTML = `
            <div>
                <strong>${item.nome}</strong>

                <span>
                    ${item.qtd} ×
                    ${Number(item.preco)
                        .toLocaleString("pt-AO")} Kz
                </span>
            </div>

            <strong>
                ${subtotal.toLocaleString("pt-AO")} Kz
            </strong>
        `;

        checkoutItens.appendChild(div);
    });

    checkoutTotal.textContent =
        `${total.toLocaleString("pt-AO")} Kz`;
}

// PRODUTOS

async function buscarProdutos() {
    try {
        const resposta =
            await fetch(
                `${API_URL}/produtos`
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar produtos"
            );
        }

        produtos =
            await resposta.json();

        renderProdutos();
        renderCarrinho();

        console.log(
            "Produtos recebidos:",
            produtos
        );

    } catch (erro) {
        console.error(
            "Erro ao buscar produtos:",
            erro
        );
    }
}

function criarCard(produto) {
    const div =
        document.createElement("div");

    div.className = "produto-card";

    if (!quantidades[produto.id]) {
        quantidades[produto.id] = 1;
    }

    div.innerHTML = `
        <img
            class="produto-imagem"
            src="./${produto.imagem}"
            alt="${produto.nome}"
        >

        <h3 class="produto-nome">
            ${produto.nome}
        </h3>

        <p class="produto-preco">
            ${Number(produto.preco)
                .toLocaleString("pt-AO")} Kz
        </p>

        <p class="produto-descricao">
            ${produto.descricao || ""}
        </p>

        <div class="contador">
            <button
                class="contador-btn menos"
                type="button"
                aria-label="Diminuir quantidade">
                −
            </button>

            <span
                class="contador-valor"
                data-produto-id="${produto.id}">
                ${quantidades[produto.id]}
            </span>

            <button
                class="contador-btn mais"
                type="button"
                aria-label="Aumentar quantidade">
                +
            </button>
        </div>

        <button
            class="adicionar-btn"
            type="button">
            Comprar
        </button>
    `;

    const menos =
        div.querySelector(".menos");

    const mais =
        div.querySelector(".mais");

    const comprar =
        div.querySelector(".adicionar-btn");

    menos.addEventListener(
        "click",
        () => {
            alterarQuantidade(
                produto.id,
                -1
            );
        }
    );

    mais.addEventListener(
        "click",
        () => {
            alterarQuantidade(
                produto.id,
                1
            );
        }
    );

    comprar.addEventListener(
        "click",
        () => {
            adicionarAoCarrinho(
                produto.id,
                quantidades[produto.id]
            );

            abrirCarrinho();
        }
    );

    return div;
}

function alterarQuantidade(
    id,
    delta
) {
    const produto =
        produtos.find(
            item => item.id === id
        );

    if (!produto) return;

    const atual =
        quantidades[id] ?? 1;

    const novaQuantidade =
        atual + delta;

    if (novaQuantidade < 1) {
        return;
    }

    if (
        novaQuantidade >
        Number(produto.stock)
    ) {
        return;
    }

    quantidades[id] =
        novaQuantidade;

    const contadores =
        document.querySelectorAll(
            `.contador-valor[data-produto-id="${id}"]`
        );

    contadores.forEach(contador => {
        contador.textContent =
            novaQuantidade;
    });
}

function limparProdutos() {
    secoesProdutos.forEach(secao => {
        const grid =
            secao.querySelector(
                ".produtos-grid"
            );

        if (grid) {
            grid.innerHTML = "";
        }
    });
}

function renderProdutos() {
    limparProdutos();

    produtos.forEach(produto => {
        if (
            produto.destaque &&
            gridDestaque
        ) {
            gridDestaque.appendChild(
                criarCard(produto)
            );
        }

        if (todosProdutos) {
            todosProdutos.appendChild(
                criarCard(produto)
            );
        }

        const categoria =
            String(
                produto.categoria || ""
            ).toLowerCase();

        const secaoCategoria =
            document.querySelector(
                `.produto-secao[data-categoria="${categoria}"]`
            );

        if (secaoCategoria) {
            const grid =
                secaoCategoria.querySelector(
                    ".produtos-grid"
                );

            if (grid) {
                grid.appendChild(
                    criarCard(produto)
                );
            }
        }
    });
}

function renderResultadosPesquisa(
    resultados
) {
    limparProdutos();

    if (!todosProdutos) return;

    if (resultados.length === 0) {
        todosProdutos.innerHTML = `
            <div class="pesquisa-vazia">
                <i class="fa-solid fa-magnifying-glass"></i>

                <h3>
                    Nenhum produto encontrado
                </h3>

                <p>
                    Não encontramos produtos
                    para a sua pesquisa.
                </p>
            </div>
        `;

        todosProdutos.parentElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    resultados.forEach(produto => {
        todosProdutos.appendChild(
            criarCard(produto)
        );
    });

    todosProdutos.parentElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// CARRINHO

function adicionarAoCarrinho(
    id,
    quantidade
) {
    const produto =
        produtos.find(
            item => item.id === id
        );

    if (!produto) {
        console.error(
            "Produto não encontrado:",
            id
        );

        return;
    }

    const quantidadeAdicionar =
        Number(quantidade);

    if (
        quantidadeAdicionar < 1 ||
        Number(produto.stock) < 1
    ) {
        return;
    }

    const itemExistente =
        carrinho.find(
            item => item.id === id
        );

    if (itemExistente) {
        itemExistente.qtd =
            Math.min(
                itemExistente.qtd +
                quantidadeAdicionar,
                Number(itemExistente.stock)
            );
    } else {
        carrinho.push({
            ...produto,
            qtd: Math.min(
                quantidadeAdicionar,
                Number(produto.stock)
            )
        });
    }

    renderCarrinho();
}

buscarProdutos();