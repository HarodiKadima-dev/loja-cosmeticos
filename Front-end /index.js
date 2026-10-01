const API_URL = "http://127.0.0.1:3000";
let produtos = [];

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

linksHeader.forEach(link => {
    link.addEventListener("click", () => {

        linksHeader.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

const linksBottomNav = document.querySelectorAll(
    ".bottom-nav-item:not(.cart-nav-button)"
);

linksBottomNav.forEach(link => {
    link.addEventListener("click", () => {

        linksBottomNav.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

botoesCategorias.forEach(botao => {
    botao.addEventListener("click", () => {

        botoesCategorias.forEach(item => {
            item.classList.remove("categoria-active");
        });

        botao.classList.add("categoria-active");

        const categoria = botao.textContent
            .trim()
            .toLowerCase();

        const secao = document.querySelector(
            `.produto-secao[data-categoria="${categoria}"]`
        );

        if (!secao) {
            return;
        }

        secao.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

const carItems = document.querySelector(".cart-items");

const carrinhoPainel = document.querySelector("#carrinho");

const cartButton = document.querySelector(".cart-button");

const cartNavButton = document.querySelector(
    ".cart-nav-button"
);

const cartBadge = document.querySelector(
    ".cart-badge"
);

const cartBadgeMobile = document.querySelector(
    ".cart-badge-mobile"
);

const cartFechar = carrinhoPainel.querySelector(
    ".cart-header button"
);

const continuarComprando = document.querySelector(
    ".continuar-comprando"
);

function abrirCarrinho() {
    carrinhoPainel.classList.add("ativo");
}

function fecharCarrinho() {
    carrinhoPainel.classList.remove("ativo");
}

continuarComprando.addEventListener(
    "click",
    fecharCarrinho
);

cartButton.addEventListener(
    "click",
    abrirCarrinho
);

cartNavButton.addEventListener(
    "click",
    abrirCarrinho
);

cartFechar.addEventListener(
    "click",
    fecharCarrinho
);

function renderCarrinho() {

    carItems.innerHTML = "";

    if (carrinho.length === 0) {

        carItems.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fa-solid fa-bag-shopping"></i>

                <h3>O seu carrinho está vazio</h3>

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

        const verProdutos = carItems.querySelector(
            ".ver-produtos-btn"
        );

        verProdutos.addEventListener(
            "click",
            () => {
                fecharCarrinho();
            }
        );

        return;
    }

    const quantidadeTotal = carrinho.reduce(
        (soma, item) => {
            return soma + item.qtd;
        },
        0
    );

    cartBadge.textContent = quantidadeTotal;

    cartBadgeMobile.textContent = quantidadeTotal;

    if (quantidadeTotal === 0) {

        cartBadge.style.display = "none";

        cartBadgeMobile.style.display = "none";

    } else {

        cartBadge.style.display = "flex";

        cartBadgeMobile.style.display = "flex";
    }

    const total = carrinho.reduce(
        (soma, item) => {
            return soma + (item.preco * item.qtd);
        },
        0
    );

    carrinho.forEach(item => {

        const div = document.createElement("div");

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

                <span>
                    ${item.qtd}
                </span>

                <button
                    type="button"
                    class="cart-mais">
                    +
                </button>

            </div>

            <strong class="cart-item-subtotal">

                ${(item.preco * item.qtd)
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

        const mais = div.querySelector(
            ".cart-mais"
        );

        mais.addEventListener(
            "click",
            () => {

                if (item.qtd >= item.stock) {
                    return;
                }

                item.qtd++;

                renderCarrinho();
            }
        );

        const menos = div.querySelector(
            ".cart-menos"
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

        const remover = div.querySelector(
            ".cart-remover"
        );

        remover.addEventListener(
            "click",
            () => {

                carrinho = carrinho.filter(
                    produto =>
                        produto.id !== item.id
                );

                renderCarrinho();
            }
        );
    });

    const totalElemento = document.querySelector(
        ".cart-total-valor"
    );

    totalElemento.textContent =
        `${total.toLocaleString("pt-AO")} Kz`;
}

async function buscarProdutos() {

    try {

        const resposta = await fetch(
            `${API_URL}/produtos`
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar produtos"
            );
        }

        produtos = await resposta.json();

        console.log(
            "Produtos recebidos:",
            produtos
        );

        renderProdutos();

    } catch (erro) {

        console.error(
            "Erro ao buscar produtos:",
            erro
        );
    }
}

function criarCard(produto) {

    const div = document.createElement("div");

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

    const menos = div.querySelector(
        ".menos"
    );

    const mais = div.querySelector(
        ".mais"
    );

    const valor = div.querySelector(
        ".contador-valor"
    );

    const comprar = div.querySelector(
        ".adicionar-btn"
    );

    menos.addEventListener(
        "click",
        () => {
            alterarQuantidade(
                produto.id,
                -1,
                valor
            );
        }
    );

    mais.addEventListener(
        "click",
        () => {
            alterarQuantidade(
                produto.id,
                1,
                valor
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
    delta,
    elemento
) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) {
        return;
    }

    const atual = quantidades[id] ?? 1;

    const novaQuantidade =
        atual + delta;

    if (novaQuantidade < 1) {
        return;
    }

    if (novaQuantidade > produto.stock) {
        return;
    }

    quantidades[id] = novaQuantidade;

    const contadores =
        document.querySelectorAll(
            `.contador-valor[data-produto-id="${id}"]`
        );

    contadores.forEach(
        contador => {
            contador.textContent =
                novaQuantidade;
        }
    );
}

function renderProdutos() {

    secoesProdutos.forEach(
        secao => {

            const grid =
                secao.querySelector(
                    ".produtos-grid"
                );

            if (grid) {
                grid.innerHTML = "";
            }
        }
    );

    produtos.forEach(
        produto => {

            if (produto.destaque) {

                gridDestaque.appendChild(
                    criarCard(produto)
                );
            }

            todosProdutos.appendChild(
                criarCard(produto)
            );

            const categoria =
                produto.categoria?.toLowerCase();

            const secaoCategoria =
                document.querySelector(
                    `.produto-secao[data-categoria="${categoria}"]`
                );

            if (secaoCategoria) {

                const grid =
                    secaoCategoria.querySelector(
                        ".produtos-grid"
                    );

                grid.appendChild(
                    criarCard(produto)
                );
            }
        }
    );
}

let carrinho = [];

// ADICIONAR AO CARRINHO
function adicionarAoCarrinho(
    id,
    quantidade
) {

    const produto = produtos.find(
        produto => produto.id === id
    );

    if (!produto) {

        console.error(
            "Produto não encontrado:",
            id
        );

        return;
    }

    const itemExistente =
        carrinho.find(
            item => item.id === id
        );

    if (itemExistente) {

        itemExistente.qtd += quantidade;

    } else {

        carrinho.push({
            ...produto,
            qtd: quantidade
        });
    }

    console.log(
        "Carrinho:",
        carrinho
    );

    renderCarrinho();
}

buscarProdutos();