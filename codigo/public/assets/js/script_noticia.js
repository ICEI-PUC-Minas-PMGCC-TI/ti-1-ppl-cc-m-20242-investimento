// URL do JSON Server
const jsonUrl = 'http://localhost:3000/noticias';

// Mostra a Imagem a partir do link inserido
document.getElementById('linkImagem').addEventListener('input', function () {
    const imagemPreview = document.getElementById('imagemPreview');
    const url = this.value;

    if (url) {
        imagemPreview.src = url; // Define a imagem da prévia
        imagemPreview.style.display = 'block'; // Mostra a prévia
    } else {
        imagemPreview.style.display = 'none'; // Esconde se não houver URL
    }
});

// Função para salvar dados no JSON Server
async function salvarDados() {
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

    try {
        const response = await fetch(jsonUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert('Notícia salva com sucesso no servidor!');
            document.getElementById('formAnoticia').reset(); // Limpa os campos do formulário
            document.getElementById('imagemPreview').style.display = 'none'; // Esconde a prévia
        } else {
            throw new Error('Erro ao salvar no servidor.');
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar a notícia. Verifique a conexão com o servidor.');
    }
}

// Função para buscar e exibir notícias do JSON Server
async function mostrarNoticias() {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error('Erro ao carregar as notícias.');

        const noticias = await response.json();
        let resultado = `<h2>Notícias Inseridas</h2>`;

        noticias.forEach((noticia, index) => {
            resultado += `
                <div id="mostra">
                    <h3>Notícia ${index + 1}</h3>
                    <p><strong>Título:</strong> ${noticia.titulo}</p>
                    <p><strong>Sub-título:</strong> ${noticia.subTitulo}</p>
                    <p><strong>Conteúdo de Apresentação:</strong> ${noticia.contAp}</p>
                    <p><strong>Conteúdo Informativo:</strong> ${noticia.contIn}</p>
                    <p><strong>Autoria:</strong> ${noticia.autoria}</p>
                    <p><strong>Data:</strong> ${noticia.data}</p>
                    <img src="${noticia.imagem}" alt="Imagem Inserida" class="img-fluid border border-light" style="max-width: 300px;">
                    <hr>
                </div>
            `;
        });

        // Insere os dados no elemento "resultado"
        document.getElementById('resultado').innerHTML = resultado;
    } catch (error) {
        console.error('Erro ao carregar as notícias:', error);
        document.getElementById('resultado').innerHTML = '<p>Erro ao carregar notícias. Verifique a conexão com o servidor.</p>';
    }
}

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

// Eventos para salvar e exibir notícias
document.getElementById('btnSalvar').addEventListener('click', function (event) {
    event.preventDefault(); // Evita o envio do formulário
    salvarDados();
});

document.getElementById('btnMostrar').addEventListener('click', function () {
    mostrarNoticias();
});
