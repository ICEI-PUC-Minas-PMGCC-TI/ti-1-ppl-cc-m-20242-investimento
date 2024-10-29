//Função para salvar dados
function salvarDados() {
    const titulo = document.getElementById('titulo').value;
    const subTitulo = document.getElementById('subTitulo').value;
    const contAp = document.getElementById('contAp').value;
    const contIn = document.getElementById('contIn').value;
    const autoria = document.getElementById('autoria').value;
    const data = document.getElementById('data').value;
    const imagem = document.getElementById('linkImagem').value;

    //Condicional para preencher todos os campos
    if (!titulo || !subTitulo || !contAp || !contIn || !autoria || !data) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    // Faz os ids serem sequenciais
    fetch('http://localhost:3000/artigos')
        .then(response => response.json())
        .then(artigos => {
            // Calcula o próximo ID
            const nextId = artigos.length > 0 ? (Math.max(...artigos.map(a => parseInt(a.id))) + 1).toString() : '1';

            const dados = {
                id: nextId,  // Define o novo ID como string
                titulo,
                subTitulo,
                contAp,
                contIn,
                autoria,
                data,
                imagem 
            };
            //Manda os dados para o json
            return fetch('http://localhost:3000/artigos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log('Artigo salvo:', data);
            document.getElementById('formArtigo').reset();
            document.getElementById('imagemPreview').style.display = 'none';
            mostrarArtigos(); // Atualiza a lista de artigos após salvar
        })
        .catch(error => console.error('Erro ao salvar o artigo:', error));
}


//Mostra os artigos quando o botão(mostrar artigos) é clicado
function mostrarArtigos() {
    fetch('http://localhost:3000/artigos')
        .then(response => response.json())
        .then(data => {
            let resultado = `<h2>Artigos Inseridos</h2>`;
            data.forEach((artigo) => {
                resultado += `
                    <div id="mostra">
                        <h3>Artigo ${artigo.id}</h3>
                        <p><strong>Título:</strong> ${artigo.titulo}</p>
                        <p><strong>Sub-título:</strong> ${artigo.subTitulo}</p>
                        <p><strong>Conteúdo de Apresentação:</strong> ${artigo.contAp}</p>
                        <p><strong>Conteúdo Informativo:</strong> ${artigo.contIn}</p>
                        <p><strong>Autoria:</strong> ${artigo.autoria}</p>
                        <p><strong>Data:</strong> ${artigo.data}</p>
                        <img src="${artigo.imagem}" alt="Imagem Inserida" class="img-fluid border border-light" style="max-width: 300px;">
                        <button class="btn btn-danger" onclick="excluirArtigo(${artigo.id})">Excluir</button>
                        <hr>
                    </div>
                `;
            });
            document.getElementById('resultado').innerHTML = resultado;
        })
        .catch(error => console.error('Erro ao mostrar artigos:', error));
}
//Função para excluir os artigos, o botão de exclusão fica disponivel quando tem artigo criado e quando vc mostra os artigos
function excluirArtigo(id) {
    fetch(`http://localhost:3000/artigos/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Artigo excluído com sucesso!');
            mostrarArtigos(); // Atualiza a lista de artigos
        } else {
            alert('Erro ao excluir artigo!');
        }
    })
    .catch(error => console.error('Erro ao excluir artigo:', error));
}

//Configuração dos botões Mostrar e Salvar 
document.getElementById('btnMostrar').addEventListener('click', mostrarArtigos);
document.getElementById('btnSalvar').addEventListener('click', function(event) {
    event.preventDefault();
    salvarDados();
});

//Esta parte aqui ajusta a visualização da imagem
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
