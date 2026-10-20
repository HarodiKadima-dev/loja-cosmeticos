const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const loginMessage = document.getElementById('login-message');
const appMessage = document.getElementById('app-message');
const logoutButton = document.getElementById('logout-button');
const productsList = document.getElementById("products-list");

const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.getElementById('page-title');
const pages = document.querySelectorAll('.page');

menuToggle.addEventListener('click', () => {
  const menuAberto = sidebar.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', menuAberto);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const paginaSelecionada = link.dataset.page;

    pages.forEach(page => {
      page.classList.add('hidden');
    });

    const paginaAtiva = document.getElementById(`page-${paginaSelecionada}`);
    if (!paginaAtiva) return;

    paginaAtiva.classList.remove('hidden');

    navLinks.forEach(navLink => {
      navLink.classList.remove('active');
    });
    link.classList.add('active');

    pageTitle.textContent = link.querySelector('span').textContent;
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');

    if (paginaSelecionada === "produtos") {
      carregarProdutos();
    }
    if (paginaSelecionada === "encomendas") {
      carregarEncomendas();
    }
    if (paginaSelecionada === 'dashboard') {
      carregarDashboard();
    }
    if (paginaSelecionada === "stock") {
      carregarStock();
    }
  });
});

async function fazerPedido(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...opcoes.headers
    }
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.mensagem || dados.erro || "Ocorreu um erro");
  }
  return dados;
}

loginForm.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  loginMessage.textContent = "";

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

  try {
    const resultado = await fazerPedido("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, senha })
    });

    mostrarDashboard();
    loginForm.reset();
    appMessage.textContent = resultado.mensagem;

  } catch (erro) {
    loginMessage.textContent = erro.message;
  }
});

function mostrarDashboard() {
  loginSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  carregarDashboard();
}

async function verificarSessao() {
  try {
    const resultado = await fazerPedido("/admin/me");
    mostrarDashboard();
    appMessage.textContent = `Bem-vindo, ${resultado.admin.email}`;
  } catch (erro) {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
}
verificarSessao();

logoutButton.addEventListener('click', async () => {
  try {
    const resultado = await fazerPedido("/admin/logout", { method: "POST" });
    dashboardSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    loginForm.reset();
    loginMessage.textContent = "";
    appMessage.textContent = "";
    sidebar.classList.remove('open');
  } catch (erro) {
    appMessage.textContent = erro.message;
  }
});

async function carregarProdutos() {
  try {
    const produtos = await fazerPedido("/produtos");

    if (produtos.length > 0) {
      productsList.innerHTML = produtos.map(produto => `
        <tr>
          <td>
            <strong>${produto.nome}</strong>
            <small class="muted">${produto.descricao?.substring(0, 40)}...</small>
            <span class="produto-categoria">${produto.categoria || 'Perfumes'}</span>
            ${produto.destaque ? '<span class="destaque-tag">Em Destaque</span>' : ''}
          </td>
          <td>${Number(produto.preco).toFixed(2)} Kz</td>
          <td>${produto.stock}</td>
          <td>
            <button onclick="editarProduto(${produto.id})">Editar</button>
            <button onclick="apagarProduto(${produto.id})">Apagar</button>
          </td>
        </tr>
      `).join("");
    } else {
      productsList.innerHTML = `
        <tr>
          <td colspan="4" class="empty-state">
            Nenhum produto ainda disponivel. Clica em "Novo Produto" para começar!
          </td>
        </tr>
      `;
    }
  } catch (erro) {
    productsList.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          Erro ao carregar Produtos: ${erro.message}
        </td>
      </tr>
    `;
  }
}

async function editarProduto(id) {
  try {
    const produto = await fazerPedido(`/produtos/${id}`);

    document.getElementById('produto-id').value = produto.id;
    document.getElementById('produto-nome').value = produto.nome;
    document.getElementById('produto-descricao').value = produto.descricao || '';
    document.getElementById('produto-preco').value = produto.preco;
    document.getElementById('produto-stock').value = produto.stock;
    document.getElementById('produto-imagem').value = produto.imagem || '';

    const campoCategoria = document.getElementById('produto-categoria');
    const campoDestaque = document.getElementById('produto-destaque');

    if (campoCategoria) campoCategoria.value = produto.categoria || 'Perfumes';
    if (campoDestaque) campoDestaque.checked = produto.destaque || false;

    document.getElementById('produto-form-title').textContent = 'Editar produto';
    document.getElementById('produto-form-container').classList.remove('hidden');

  } catch (erro) {
    appMessage.textContent = erro.message;
  }
}
window.editarProduto = editarProduto;

async function apagarProduto(id) {
  const confirmar = confirm("Tens a certeza de que pretendes eliminar este produto?");
  if (!confirmar) return;

  try {
    const resultado = await fazerPedido(`/produtos/${id}`, { method: "DELETE" });
    appMessage.textContent = resultado.mensagem || "Produto eliminado com sucesso!";
    await carregarProdutos();
  } catch (erro) {
    appMessage.textContent = erro.message;
  }
}
window.apagarProduto = apagarProduto;

document.getElementById('novo-produto-button').addEventListener('click', () => {
  const produtoFormContainer = document.getElementById('produto-form-container');
  if (!produtoFormContainer) return;
  produtoFormContainer.classList.remove('hidden');
  document.getElementById('produto-form').reset();
  document.getElementById('produto-id').value = "";
  document.getElementById('produto-form-title').textContent = 'Novo Produto';
});

document.getElementById('cancelar-produto').addEventListener('click', () => {
  const produtoFormContainer = document.getElementById('produto-form-container');
  if (!produtoFormContainer) return;
  produtoFormContainer.classList.add('hidden');
});

document.getElementById('produto-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const id = document.getElementById('produto-id').value;
  const nome = document.getElementById('produto-nome').value.trim();
  const descricao = document.getElementById('produto-descricao').value.trim();
  const preco = parseFloat(document.getElementById('produto-preco').value);
  const stock = parseInt(document.getElementById('produto-stock').value);
  const imagem = document.getElementById('produto-imagem').value.trim();

  const categoriaEl = document.getElementById('produto-categoria');
  const destaqueEl = document.getElementById('produto-destaque');

  const categoria = categoriaEl ? categoriaEl.value : 'Perfumes';
  const destaque = destaqueEl ? destaqueEl.checked : false;

  try {
    let resultado;
    const dados = { nome, descricao, preco, stock, imagem, categoria, destaque };

    if (id) {
      resultado = await fazerPedido(`/produtos/${id}`, {
        method: "PUT",
        body: JSON.stringify(dados)
      });
      appMessage.textContent = 'Produto atualizado com sucesso!';
    } else {
      resultado = await fazerPedido("/produtos", {
        method: "POST",
        body: JSON.stringify(dados)
      });
      appMessage.textContent = 'Produto criado com sucesso!';
    }

    document.getElementById('produto-form-container').classList.add('hidden');
    carregarProdutos();

  } catch (erro) {
    appMessage.textContent = erro.message;
  }
});

async function carregarEncomendas() {
  try {
    const pedidos = await fazerPedido("/pedidos");

    if (pedidos.length > 0) {
      document.getElementById('orders-list').innerHTML = pedidos.map(pedido => `
        <tr>
          <td><strong>#${pedido.id}</strong></td>
          <td>${pedido.nome_cliente || pedido.nome || "Cliente"}</td>
          <td>${pedido.telefone_cliente || pedido.telefone || "-"}</td>
          <td>
            <span class="status-badge status-${pedido.status || pedido.estado}">
              ${traduzirEstado(pedido.status || pedido.estado)}
            </span>
          </td>
          <td>
            <button onclick="mudarEstadoEncomenda(${pedido.id})" class="small-button">
              Alterar Estado
            </button>
          </td>
        </tr>
      `).join("");
    } else {
      document.getElementById('orders-list').innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            Ainda não há encomendas registadas.
          </td>
        </tr>
      `;
    }
  } catch (erro) {
    document.getElementById("orders-list").innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          Erro ao carregar Encomendas: ${erro.message}
        </td>
      </tr>
    `;
  }
}

function traduzirEstado(estado) {
  const mapa = {
    "pendente": "Pendente",
    "confirmado": "Confirmado",
    "concluído": "Concluído",
    "concluido": "Concluído",
    "cancelado": "Cancelado"
  };
  return mapa[estado?.toLowerCase()] || estado || "Desconhecido";
}

async function mudarEstadoEncomenda(id) {
  try {
    const novoEstado = prompt(
      "Escolhe o novo estado:\n-Pendente\n-Confirmado\n-Concluído\n-Cancelado",
      "Pendente"
    );
    if (!novoEstado) return;

    const resultado = await fazerPedido(`/pedidos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: novoEstado })
    });

    appMessage.textContent = resultado.mensagem || "Estado atualizado com sucesso!";
    await carregarEncomendas();
  } catch (erro) {
    appMessage.textContent = erro.message;
  }
}
window.mudarEstadoEncomenda = mudarEstadoEncomenda;

async function carregarDashboard() {
  try {
    const [produtos, pedidos] = await Promise.all([
      fazerPedido("/produtos"),
      fazerPedido("/pedidos")
    ]);

    const totalProdutos = produtos.length;
    const stockBaixo = produtos.filter(p => p.stock !== null && p.stock <= 3).length;

    const encomendasPendentes = pedidos.filter(p => {
      const estado = (p.status || p.estado || '').toLowerCase();
      return estado === "pendente" || estado === "confirmado";
    }).length;

    const totalVendas = pedidos.filter(p => {
      const estado = (p.status || p.estado || '').toLowerCase();
      return estado === "concluído" || estado === "concluido";
    }).reduce((soma, pedido) => soma + Number(pedido.total || 0), 0);

    document.getElementById("total-produtos").textContent = totalProdutos;
    document.getElementById("stock-baixo").textContent = stockBaixo;
    document.getElementById("encomendas-pendentes").textContent = encomendasPendentes;
    document.getElementById("vendas-total").textContent = `${totalVendas.toFixed(2)} Kz`;

    mostrarEncomendasRecentes(pedidos.slice(0, 5));
  } catch (erro) {
    console.log("Erro ao carregar dashboard:", erro.message);
  }
}

function mostrarEncomendasRecentes(pedidos) {
  const container = document.getElementById("recent-orders");
  if (pedidos.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          Ainda não há encomendas registadas.
        </td>
      </tr>
    `;
    return;
  }
  container.innerHTML = pedidos.map(pedido => {
    const estado = pedido.status || pedido.estado || "Desconhecido";
    return `
      <tr>
        <td><strong>#${pedido.id}</strong></td>
        <td>${pedido.nome_cliente || pedido.nome || "Cliente"}</td>
        <td><span class="status-badge">${estado}</span></td>
        <td>${pedido.created_at ? new Date(pedido.created_at).toLocaleDateString('pt-AO') : '-'}</td>
      </tr>
    `;
  }).join('');
}

async function carregarStock() {
  try {
    const produtos = await fazerPedido("/produtos");
    const stockList = document.getElementById("stock-list");
    if (!stockList) return;

    if (produtos.length > 0) {
      const produtosOrdenados = [...produtos].sort((a, b) =>
        Number(a.stock) - Number(b.stock)
      );

      stockList.innerHTML = produtosOrdenados.map(produto => {
        let classeStock = "stock-alto";
        if (produto.stock <= 3) classeStock = "stock-baixo";
        else if (produto.stock <= 10) classeStock = "stock-medio";

        return `
          <tr class="${classeStock}">
            <td>
              <strong>${produto.nome}</strong>
              <small class="muted">${produto.descricao?.substring(0, 35)}...</small>
            </td>
            <td>
              <strong>${produto.stock}</strong> unidades
            </td>
            <td>
              ${produto.stock === 0
                ? '<span class="aviso-stock">Sem stock</span>'
                : produto.stock <= 3
                  ? '<span class="aviso-stock">Repor já!</span>'
                  : 'Disponível'}
            </td>
          </tr>
        `;
      }).join("");

    } else {
      stockList.innerHTML = `
        <tr>
          <td colspan="3" class="empty-state">
            Ainda não há produtos registados.
          </td>
        </tr>
      `;
    }

  } catch (erro) {
    const stockList = document.getElementById("stock-list");
    if (stockList) {
      stockList.innerHTML = `
        <tr>
          <td colspan="3" class="empty-state">
            Erro ao carregar Stock: ${erro.message}
          </td>
        </tr>
      `;
    }
  }
}
