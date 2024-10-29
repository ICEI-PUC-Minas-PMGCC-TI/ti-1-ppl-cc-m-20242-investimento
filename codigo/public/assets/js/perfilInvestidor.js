document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const questions = document.querySelectorAll('.pergunta');
    let currentQuestion = 0;

    nextButton.addEventListener('click', () => {
        // Não permite enviar formulário sem respostas
        const selectedOption = questions[currentQuestion].querySelector('input[type="radio"]:checked');
        if (!selectedOption) {
            alert('Por favor, selecione uma resposta.');
            return;
        }

        // Escondoe questões
        questions[currentQuestion].classList.remove('active');

        // Mostra próxima questão ou botao de reiniciar se for a ultima
        currentQuestion++;
        if (currentQuestion < questions.length) {
            questions[currentQuestion].classList.add('active');
        } else {
            nextButton.style.display = 'none';  // Hide the Next button
            restartButton.style.display = 'block';  // Show the Restart button
        }

        // Muda texto botao da ultima questao para "Enviar"
        if (currentQuestion === questions.length - 1) {
            nextButton.textContent = 'Enviar';
        }
    });

    restartButton.addEventListener('click', () => {
        // Reinicia questionario
        currentQuestion = 0;
        questions.forEach(q => q.classList.remove('active')); // Hide all questions
        questions[0].classList.add('active'); // Show the first question

        // Reinicia botoes
        nextButton.style.display = 'block';
        restartButton.style.display = 'none';
        nextButton.textContent = 'Próxima';

        // Limpa todas as opcoes selecionadas
        document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    });
});
