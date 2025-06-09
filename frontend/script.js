const loginForm = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');
const loginContainer = document.getElementById('login-container');
const homeContainer = document.getElementById('home-container');
const welcome = document.getElementById('welcome');
const adminControls = document.getElementById('admin-controls');
const empresaSelect = document.getElementById('empresa-select');
const dataSelect = document.getElementById('data-select');
const resultado = document.getElementById('resultados');

let userRole = '';

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Usuário e senha são obrigatórios');
    return;
  }

  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem('token', data.token);
    userRole = data.role;

    loginContainer.style.display = 'none';
    homeContainer.style.display = 'block';
    welcome.textContent = `Bem-vindo, ${data.username}`;

    if (userRole === 'admin') {
      adminControls.style.display = 'block';
      preencherFiltros();
    }
  } else {
    mensagem.textContent = data.message || 'Erro ao logar.';
  }
});

async function preencherFiltros() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3000/api/contracts', {
    headers: { Authorization: `Bearer ${token}` }
  });

  const json = await res.json();

  const empresas = [...new Set(json.data.map(c => c.empresa))];
  const datas = [...new Set(json.data.map(c => c.data_inicio))];

  empresaSelect.innerHTML = '<option value="">Todas</option>';
  dataSelect.innerHTML = '<option value="">Todas</option>';

  empresas.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e;
    opt.textContent = e;
    empresaSelect.appendChild(opt);
  });

  datas.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    dataSelect.appendChild(opt);
  });
}

document.getElementById('buscar-contratos').addEventListener('click', async () => {
  const empresa = empresaSelect.value;
  const data = dataSelect.value;
  const token = localStorage.getItem('token');

  const url = new URL(`http://localhost:3000/api/contracts`, window.location.origin);
  if (empresa) url.searchParams.append('empresa', empresa);
  if (data) url.searchParams.append('inicio', data);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` }
  });

  const json = await res.json();

  if (!res.ok) {
    resultado.innerHTML = `<p>${json.message || 'Erro ao buscar contratos.'}</p>`;
    return;
  }

  const contratos = json.data;

  if (!contratos.length) {
    resultado.innerHTML = `<p>Nenhum contrato encontrado.</p>`;
    return;
  }

  let table = `
    <table border="1" style="width: 50%; border-collapse: collapse; color: #fff;">
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Início</th>
          <th>Fim</th>
        </tr>
      </thead>
      <tbody>
        ${contratos.map(c => `
          <tr>
            <td>${c.empresa}</td>
            <td>${c.data_inicio}</td>
            <td>${c.data_fim || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  resultado.innerHTML = table;
});
