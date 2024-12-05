const apiUrl = "http://localhost:3000";
        
        // Função para carregar os gastos do servidor
        async function carregarGastos() {
            let user_id = JSON.parse(sessionStorage.getItem('usuarioCorrente')).id
            const response = await fetch(`/entrada?tipo=gasto&usuario_id=${user_id}`);
            const gastos = await response.json();
            const gastosBody = document.getElementById("gastos-body");
            let totalGastos = 0;
        
            gastosBody.innerHTML = "";
            gastos.forEach(gasto => {
                totalGastos += gasto.valor;
                const row = `<tr><td>${gasto.nome}</td><td>R$${gasto.valor.toFixed(2)}</td></tr>`;
                gastosBody.innerHTML += row;
            });
        
            document.getElementById("total-gastos").innerText = `TOTAL: R$${totalGastos.toFixed(2)}`;
        }
        
        // Função para carregar a renda passiva do servidor
        async function carregarRenda() {
            let user_id = JSON.parse(sessionStorage.getItem('usuarioCorrente')).id
            const response = await fetch(`/entrada?tipo=investimento&usuario_id=${user_id}`);
            const rendas = await response.json();
            const rendaBody = document.getElementById("renda-body");
            let totalRenda = 0;
        
            rendaBody.innerHTML = "";
            rendas.forEach(renda => {
                totalRenda += renda.valor_renda;
                const row = `<tr><td>${renda.nome}</td><td>R$${renda.valor.toFixed(2)}</td><td>R$${renda.valor_renda.toFixed(2)}</td></tr>`;
                rendaBody.innerHTML += row;
            });
        
            document.getElementById("total-renda").innerText = `TOTAL: R$${totalRenda.toFixed(2)}`;
        }
        
        // Função para carregar as notícias do servidor
        async function carregarNoticias() {
            const response = await fetch(`/noticias`);
            const noticias = await response.json();
            const noticiasContainer = document.getElementById("noticias-container");
        
            noticiasContainer.innerHTML = "";
            noticias.forEach(noticia => {
                const noticiaElement = `
                    <div class="noticia">
                        <div class="image-frame">
                            <img src="${noticia.imagem}" alt="${noticia.titulo}">
                        </div>
                        <a href="${noticia.link}">
                            <h3>${noticia.titulo}</h3>
                        </a>
                        <p>${noticia.data}</p>
                    </div>
                `;
                noticiasContainer.innerHTML += noticiaElement;
            });
        }
        
        // Função para adicionar um gasto
        async function adicionarGasto() {
            let user_id = JSON.parse(sessionStorage.getItem('usuarioCorrente')).id
            const nome = prompt("Digite o nome do gasto:");
            const valor = parseFloat(prompt("Digite o valor do gasto:"));
            if (!nome || isNaN(valor)) return alert("Entrada inválida!");
        
            await fetch(`${apiUrl}/entrada`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    valor,
                    tipo: "gasto",
                    usuario_id: user_id, // Substitua pelo ID real do usuário
                    recorrente: true,
                    data: Date.now()
                })
            });
            carregarGastos();
        }
        
        // Função para adicionar uma renda
        async function adicionarRenda() {
            let user_id = JSON.parse(sessionStorage.getItem('usuarioCorrente')).id
            const nome = prompt("Digite o nome do investimento:");
            const valor = parseFloat(prompt("Digite o valor investido:"));
            const valor_renda = parseFloat(prompt("Digite a renda média"));
            if (!nome || isNaN(valor)) return alert("Entrada inválida!");
        
            await fetch(`/entrada`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome,
                    valor,
                    valor_renda,
                    tipo: "investimento",
                    usuario_id: user_id, // Substitua pelo ID real do usuário
                    recorrente: true,
                    data: Date.now()
                })
            });
            carregarRenda();
        }
        
        // Carrega dados iniciais
        carregarGastos();
        carregarRenda();
        carregarNoticias();