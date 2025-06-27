document.addEventListener('DOMContentLoaded', () => {
  const abas = document.querySelectorAll('.aba');
  const conteudos = document.querySelectorAll('.conteudo-aba');
  const form = document.getElementById('formCliente');
  const tabela = document.getElementById('tabelaClientes');

  // Função para trocar abas
  abas.forEach(aba => {
    aba.addEventListener('click', () => {
      abas.forEach(a => a.classList.remove('ativa'));
      aba.classList.add('ativa');

      const alvo = aba.getAttribute('data-alvo');
      conteudos.forEach(c => {
        if (c.id === alvo) {
          c.classList.add('ativo');
        } else {
          c.classList.remove('ativo');
        }
      });
    });
  });

  // Funções para gerenciar clientes no localStorage
  function getClientes() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
  }

  function salvarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }

  function renderClientes() {
    tabela.innerHTML = '';
    getClientes().forEach((cliente, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.cpf}</td>
        <td>
          <button onclick="editarCliente(${index})">Editar</button>
          <button onclick="excluirCliente(${index})">Excluir</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cpf = document.getElementById('cpf').value.trim();

    if (!nome || !email || !cpf) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const clientes = getClientes();
    clientes.push({ nome, email, cpf });
    salvarClientes(clientes);
    renderClientes();
    form.reset();
  });

  window.excluirCliente = function(index) {
    const clientes = getClientes();
    clientes.splice(index, 1);
    salvarClientes(clientes);
    renderClientes();
  };

  window.editarCliente = function(index) {
    const clientes = getClientes();
    const cliente = clientes[index];

    document.getElementById('nome').value = cliente.nome;
    document.getElementById('email').value = cliente.email;
    document.getElementById('cpf').value = cliente.cpf;

    clientes.splice(index, 1);
    salvarClientes(clientes);
    renderClientes();

    // Forçar aba HOME para edição
    abas.forEach(a => a.classList.remove('ativa'));
    document.querySelector('.aba[data-alvo="home"]').classList.add('ativa');
    conteudos.forEach(c => {
      if (c.id === 'home') c.classList.add('ativo');
      else c.classList.remove('ativo');
    });
  };

  // Renderizar clientes ao carregar a página
  renderClientes();
});