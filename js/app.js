document.addEventListener('DOMContentLoaded', () => {
    carregarServicos();
    carregarDepoimentos();
    configurarFormularioOrcamento();
    configurarFormularioDepoimento();
  });
  
  function criarElementoTexto(tag, texto, className = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = texto;
    return el;
  }
  
  function formatarPreco(valor) {
    const num = Number(valor);
    if (Number.isNaN(num) || num <= 0) return '';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  function formatarData(dataStr) {
    if (!dataStr) return '';
    const data = new Date(String(dataStr).replace(' ', 'T'));
    if (Number.isNaN(data.getTime())) return String(dataStr);
    return data.toLocaleDateString('pt-BR');
  }
  
  async function carregarServicos() {
    const container = document.getElementById('lista-servicos');
    if (!container) return;
  
    try {
      const resp = await fetch('api/listar_servicos.php');
      const resultado = await resp.json();
      if (!resultado.sucesso) throw new Error(resultado.mensagem || 'Erro ao carregar serviços');
  
      container.replaceChildren();
  
      resultado.dados.forEach((servico, index) => {
        const numeroStr = String(index + 1).padStart(2, '0');
        const isReverso = index % 2 === 1;
        const isUltimo = index === resultado.dados.length - 1;
  
        const linha = document.createElement('div');
        linha.className = `linha-servico row align-items-center g-4${isUltimo ? '' : ' mb-5'}${isReverso ? ' flex-lg-row-reverse' : ''}`;
  
        const colNum = document.createElement('div');
        colNum.className = 'col-lg-2 d-none d-lg-block text-center';
        colNum.appendChild(criarElementoTexto('span', numeroStr, 'numero-servico'));
  
        const colImg = document.createElement('div');
        colImg.className = 'col-lg-5';
        if (servico.imagem) {
          const img = document.createElement('img');
          img.src = servico.imagem;
          img.alt = servico.titulo || 'Serviço da Oficina do Jardim';
          img.className = 'img-fluid shadow-sm';
          colImg.appendChild(img);
        }
  
        const colTexto = document.createElement('div');
        colTexto.className = 'col-lg-5';
        colTexto.appendChild(criarElementoTexto('h4', servico.titulo || '', 'text-verde-escuro'));
        colTexto.appendChild(criarElementoTexto('p', servico.descricao || '', 'text-muted'));
  
        const precoFormatado = formatarPreco(servico.preco);
        if (precoFormatado) {
          colTexto.appendChild(criarElementoTexto('p', precoFormatado, 'fs-4 fw-bold text-verde-escuro'));
        }
  
        const link = document.createElement('a');
        link.href = servico.pagina_url || `servico${index + 1}.html`;
        link.className = 'btn btn-primary';
        link.textContent = 'Solicitar Orçamento';
        colTexto.appendChild(link);
  
        linha.appendChild(colNum);
        linha.appendChild(colImg);
        linha.appendChild(colTexto);
        container.appendChild(linha);
      });
    } catch (err) {
      container.replaceChildren(
        criarElementoTexto('p', 'Não foi possível carregar os serviços.', 'text-center text-muted')
      );
    }
  }
  
  async function carregarDepoimentos() {
    const container = document.getElementById('lista-depoimentos');
    if (!container) return;
  
    try {
      const resp = await fetch('api/depoimentos.php');
      const resultado = await resp.json();
      if (!resultado.sucesso) throw new Error(resultado.mensagem || 'Erro ao carregar depoimentos');
  
      container.replaceChildren();
  
      if (!Array.isArray(resultado.dados) || resultado.dados.length === 0) {
        const item = document.createElement('div');
        item.className = 'carousel-item active';
        item.appendChild(criarElementoTexto('p', 'Ainda não há depoimentos cadastrados.', 'fs-5 fst-italic'));
        container.appendChild(item);
        return;
      }
  
      resultado.dados.forEach((dep, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item${index === 0 ? ' active' : ''}`;
  
        const nomeAutor = dep.autor || 'Cliente';
        const avatar = document.createElement('img');
        avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeAutor)}&background=1B5E20&color=fff&size=128`;
        avatar.alt = nomeAutor;
        avatar.className = 'rounded-circle avatar-depoimento-grande mb-3';
        item.appendChild(avatar);
  
        item.appendChild(criarElementoTexto('p', `"${dep.comentario || ''}"`, 'fs-5 fst-italic'));
  
        const qtdEstrelas = Math.min(5, Math.max(1, Number(dep.avaliacao) || 5));
        const estrelas = '★'.repeat(qtdEstrelas);
        item.appendChild(criarElementoTexto('h6', `${nomeAutor} (${estrelas})`, 'text-verde-escuro mb-0'));
  
        const dataFormatada = formatarData(dep.criado_em);
        if (dataFormatada) {
          item.appendChild(criarElementoTexto('small', dataFormatada, 'text-muted'));
        }
  
        container.appendChild(item);
      });
    } catch (err) {
      container.replaceChildren(
        criarElementoTexto('p', 'Não foi possível carregar os depoimentos.', 'text-center text-muted')
      );
    }
  }
  
  function configurarFormularioOrcamento() {
    const form = document.getElementById('form-orcamento');
    const feedback = document.getElementById('feedback-orcamento');
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dados = Object.fromEntries(new FormData(form).entries());
  
      if (form.dataset.servicoId) {
        dados.servico_id = Number(form.dataset.servicoId);
      }
  
      const extras = [];
      if (dados.endereco) extras.push(`Endereço: ${dados.endereco}`);
      if (dados.cidade || dados.uf) {
        extras.push(`Local: ${[dados.cidade, dados.uf].filter(Boolean).join('/')}`);
      }
      if (dados.data_desejada) extras.push(`Data desejada: ${dados.data_desejada}`);
      if (extras.length > 0) {
        dados.mensagem = `${dados.mensagem || ''}\n[${extras.join(' | ')}]`.trim();
      }
  
      try {
        const resp = await fetch('api/salvar_orcamento.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        const resultado = await resp.json();
  
        if (feedback) feedback.textContent = resultado.mensagem || '';
        if (resultado.sucesso) form.reset();
      } catch (err) {
        if (feedback) feedback.textContent = 'Erro de comunicação ao enviar orçamento.';
      }
    });
  }
  
  function configurarFormularioDepoimento() {
    const form = document.getElementById('form-depoimento');
    const feedback = document.getElementById('feedback-depoimento');
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dados = Object.fromEntries(new FormData(form).entries());
  
      try {
        const resp = await fetch('api/depoimentos.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        const resultado = await resp.json();
  
        if (feedback) feedback.textContent = resultado.mensagem || '';
        if (resultado.sucesso) {
          form.reset();
          carregarDepoimentos();
        }
      } catch (err) {
        if (feedback) feedback.textContent = 'Erro de comunicação ao enviar depoimento.';
      }
    });
  }