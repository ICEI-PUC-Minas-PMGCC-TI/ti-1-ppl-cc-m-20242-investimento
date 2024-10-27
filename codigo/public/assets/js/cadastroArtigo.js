// Mostra a Imagem a partir do link inserido
document.getElementById('linkImagem').addEventListener('input', function() {
    const imagemPreview = document.getElementById('imagemPreview');
    const url = this.value;

    if (url) {
        imagemPreview.src = url; // Define a imagem da prévia
        imagemPreview.style.display = 'block'; // Mostra a prévia
    } else {
        imagemPreview.style.display = 'none'; // Esconde se não houver URL
    }
});


// Função para salvar dados no localStorage
function salvarDados() {
    const titulo = document.getElementById('titulo').value;
    const subTitulo = document.getElementById('subTitulo').value;
    const contAp = document.getElementById('contAp').value;
    const contIn = document.getElementById('contIn').value;
    const autoria = document.getElementById('autoria').value;
    const data = document.getElementById('data').value;
    const imagem = document.getElementById('linkImagem').value; // Pega a URL da imagem

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!titulo || !subTitulo || !contAp || !contIn || !autoria || !data) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return; // Não permite salvar se os campos obrigatórios não estão preenchidos
    }

    const dados = {
        titulo,
        subTitulo,
        contAp,
        contIn,
        autoria,
        data,
        imagem 
    };

    const db = leDados(); // Lê os dados existentes
    db.artigos.push(dados); // Adiciona o novo artigo
    salvaDados(db); // Salva os dados atualizados

    // Limpa os campos do formulário
    document.getElementById('titulo').value = '';
    document.getElementById('subTitulo').value = '';
    document.getElementById('contAp').value = '';
    document.getElementById('contIn').value = '';
    document.getElementById('autoria').value = '';
    document.getElementById('data').value = '';
    document.getElementById('linkImagem').value = '';
    document.getElementById('imagemPreview').style.display = 'none'; // Esconde a prévia
}



// Função para ler dados do localStorage
function leDados() {
    let strDados = localStorage.getItem('db');
    if (strDados) {
        return JSON.parse(strDados);
    } else {
        return { artigos: [] }; // Retorna um array vazio se não houver dados
    }
}

function salvaDados(dados) {
    localStorage.setItem('db', JSON.stringify(dados));
}

// Função do botão mostrar, quando acionado mostra tudo o que foi inserido
document.getElementById('btnMostrar').addEventListener('click', function() {
    const db = leDados(); // Lê os dados
    let resultado = `<h2>Artigos Inseridos</h2>`;
    
    db.artigos.forEach((artigo, index) => {
        resultado += `
            <div id="mostra">
                <h3>Artigo ${index + 1}</h3>
                <p><strong>Título:</strong> ${artigo.titulo}</p>
                <p><strong>Sub-título:</strong> ${artigo.subTitulo}</p>
                <p><strong>Conteúdo de Apresentação:</strong> ${artigo.contAp}</p>
                <p><strong>Conteúdo Informativo:</strong> ${artigo.contIn}</p>
                <p><strong>Autoria:</strong> ${artigo.autoria}</p>
                <p><strong>Data:</strong> ${artigo.data}</p>
                <img src="${artigo.imagem}" alt="Imagem Inserida" class="img-fluid border border-light" style="max-width: 300px;">
                <hr>
            </div>
        `;
    });

    // Insere os dados no elemento "resultado"
    document.getElementById('resultado').innerHTML = resultado;
});

// Ajusta o tamanho do campo de texto conforme é preenchido
function ajustarAlturaTextarea(textarea) {
    textarea.style.height = 'auto'; // Reseta a altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta para o conteúdo
}

// Associa a função de ajuste de altura a todos os textareas
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', () => ajustarAlturaTextarea(textarea));
});

// Adiciona evento para salvar dados ao clicar em "Salvar"
document.getElementById('btnSalvar').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o envio do formulário
    salvarDados();
    
});
