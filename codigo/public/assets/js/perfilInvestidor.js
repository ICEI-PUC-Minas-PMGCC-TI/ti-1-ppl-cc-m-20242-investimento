document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const questions = document.querySelectorAll('.pergunta');
    let currentQuestion = 0;


    let respostas = [];
    const usuario = {
        id_usuario: "1",
        nome_usuario: "Victor Guimaraes"
    };

    const ctx = document.getElementById('classificationChart').getContext('2d');
    const classificationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Conservador', 'Moderado', 'Arriscado'],
            datasets: [{
                label: 'Indicador de Perfil Comportamental',
                data: [0, 0, 0], // Initial empty data
                backgroundColor: ['yellow', 'orange', 'red']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    nextButton.addEventListener('click', () => {
        const selectedOption = questions[currentQuestion].querySelector('input[type="radio"]:checked');
        if (!selectedOption) {
            alert('Por favor, selecione uma resposta.');
            return;
        }

        const resposta = selectedOption.id.split('-')[2];

        respostas.push({
            ...usuario,
            pergunta: (currentQuestion + 1).toString(),
            resposta: resposta,
            classificacao: classifyAnswer(selectedOption.value)
        });

        updateChart(selectedOption.value);

        questions[currentQuestion].classList.remove('active');
        currentQuestion++;

        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.add('active');
        } else {
            nextButton.style.display = 'none';
            restartButton.style.display = 'block';

            const mediaClassificacoes = calculateAverageClassification(respostas);
            sendAnswersToServer(respostas, mediaClassificacoes);
        }

        if (currentQuestion === questions.length - 1) {
            nextButton.textContent = 'Enviar';
        }
    });

    function updateChart(value) {
        const index = value - 1; // value is 1, 2, or 3 for Conservador, Moderado, Arriscado
        classificationChart.data.datasets[0].data[index]++;
        classificationChart.update();
    }

    restartButton.addEventListener('click', () => {
        currentQuestion = 0;
        respostas = []; 
        questions.forEach(q => q.classList.remove('active'));
        questions[0].classList.add('active');

        nextButton.style.display = 'block';
        restartButton.style.display = 'none';
        nextButton.textContent = 'Próxima';

        document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    });

    // Function to classify a single answer based on its value
    function classifyAnswer(value) {
        switch (value) {
            case '1': return 'Conservador';
            case '2': return 'Moderado';
            case '3': return 'Arriscado';
            default: return 'Desconhecido';
        }
    }

    // Function to calculate the average classification based on all answers
    function calculateAverageClassification(respostas) {
        const counts = { a: 0, b: 0, c: 0 };

        // Count occurrences of each answer type
        respostas.forEach(resp => counts[resp.resposta]++);

        const totalAnswers = respostas.length;

        // Determine the classification based on majority answers
        if (counts.a > totalAnswers / 2) return 'Conservador';
        if (counts.c > totalAnswers / 2) return 'Arriscado';

        // If no majority, default to "Moderado"
        return 'Moderado';
    }

    // Function to send the answers to the JSON server
    function sendAnswersToServer(data, mediaClassificacoes) {
        const payload = {
            comportamento: data,
            mediaClassificacoes: mediaClassificacoes
        };

        fetch('http://localhost:3000/comportamento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar as respostas para o servidor');
            }
            alert('Respostas enviadas com sucesso!');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Houve um problema ao enviar as respostas.');
        });
    }
    
});
