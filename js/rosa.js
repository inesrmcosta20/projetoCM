// Espera que o conteúdo da página esteja completamente carregado antes de executar a função
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona os elementos da página necessários para manipulação
    const principezinhoinicio = document.querySelector(".principezinho-inicio");
    const balaoinstrucao = document.querySelector(".balao-instruçao");
    const timerDisplay = document.getElementById("timer");
    const zonaSucesso = document.getElementById("zona-sucesso");
    const balaoFala1 = document.getElementById("balao-fala1");
    const insucessoImagem = document.getElementById("insucesso");
    const backgroundInsucesso = document.getElementById("background-insucesso");
    const balaoInsucesso = document.getElementById("balao-insucesso");
    const tentarNovamente = document.getElementById("tentar-novamente");

    let tempoRestante = 15; // Define o tempo inicial do temporizador
    let contagem;

    // Define a fonte do temporizador
    timerDisplay.style.fontFamily = '"Nunito Sans", sans-serif';

    // Exibe o balão de fala e começa a contagem do temporizador após 6 segundos
    setTimeout(() => {
        balaoFala1.classList.remove("hidden");
        contagem = setInterval(atualizarTimer, 1000);
    }, 6000);

    // Função para atualizar o temporizador a cada segundo
    function atualizarTimer() {
        let segundos = tempoRestante.toString().padStart(2, '0'); // Formata os segundos com dois dígitos
        timerDisplay.textContent = `00:${segundos}`; // Exibe o tempo restante

        if (tempoRestante > 0) {
            tempoRestante--; // Diminui o tempo restante
        } else {
            clearInterval(contagem); // Para a contagem quando o tempo chega a zero
            timerDisplay.textContent = "00:00";
            timerDisplay.style.color = "red";

            // Exibe imagens de insucesso caso o tempo acabe
            backgroundInsucesso.classList.remove("hidden");
            balaoInsucesso.classList.remove("hidden");
            tentarNovamente.classList.remove("hidden");
        }
    }

    // Esconde o "príncipezinho" e o balão de instruções após 4 segundos
    setTimeout(() => principezinhoinicio?.classList.add("hidden"), 4000);
    setTimeout(() => balaoinstrucao?.classList.add("hidden"), 4000);

    // Função para tornar um elemento arrastável na página
    function makeDraggable(element, scaleInside) {
        let isDragging = false; // Variável para controlar o estado de arrasto
        let offsetX, offsetY; // Variáveis para armazenar a posição do clique
        let startX = element.offsetLeft; // Posição inicial do elemento
        let startY = element.offsetTop; // Posição inicial do elemento

        // Define o css inicial do elemento que é movido
        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease, left 0.2s ease, top 0.2s ease";

        // Inicia o movimento ao clicar no elemento
        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left; // Calcula a diferença entre o clique e a posição do elemento
            offsetY = e.clientY - element.getBoundingClientRect().top; // Calcula a diferença entre o clique e a posição do elemento
            element.style.zIndex = 1000; // Coloca o elemento acima dos outros durante o movimento
        });

        // Atualiza a posição do elemento enquanto está a ser arrastado
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX; // Calcula a nova posição horizontal
                let newY = e.clientY - offsetY; // Calcula a nova posição vertical

                // Limita a movimentação do elemento para dentro da janela
                element.style.left = Math.min(Math.max(0, newX), window.innerWidth - element.clientWidth) + "px";
                element.style.top = Math.min(Math.max(0, newY), window.innerHeight - element.clientHeight) + "px";
            }
        });

        // Finaliza o movimento quando o mouse é solto
        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";

                let elemRect = element.getBoundingClientRect(); // Obtém a posição e o tamanho do elemento
                let zonaRect = zonaSucesso.getBoundingClientRect(); // Obtém a posição e o tamanho da zona de sucesso

                // Verifica se o elemento está completamente dentro da zona de sucesso
                let completamenteDentro =
                    elemRect.left >= zonaRect.left &&
                    elemRect.right <= zonaRect.right &&
                    elemRect.top >= zonaRect.top &&
                    elemRect.bottom <= zonaRect.bottom;

                if (completamenteDentro) {
                    // Se o elemento for a cúpula, aplica escala e centraliza na zona de sucesso
                    if (element.id === "cupula") {
                        element.style.transform = `scale(${scaleInside})`; // Aplica a escala ao elemento
                        element.style.transformOrigin = "center"; // Define o centro de transformação

                        // Centraliza o elemento na zona de sucesso
                        element.style.left = `${zonaRect.left + (zonaRect.width - elemRect.width) / 2}px`;
                        element.style.top = `${zonaRect.top + (zonaRect.height - elemRect.height) / 2}px`;

                        // Exibe a mensagem de missão concluída
                        const missaoConcluida = document.getElementById("principezinho-fim");
                        const conclusao = document.getElementById("balao-conclusao");

                        if (missaoConcluida) {
                            missaoConcluida.classList.remove("hidden");
                            missaoConcluida.removeAttribute("style");
                        }

                        if (conclusao) {
                            conclusao.classList.remove("hidden");
                            conclusao.removeAttribute("style");
                        }

                        clearInterval(contagem); // Pára a contagem do tempo
                    } else {
                        // Se o objeto não for a cúpula, retorna à posição inicial
                        element.style.left = `${startX}px`;
                        element.style.top = `${startY}px`;
                    }
                }
            }
        });
    }

    // Definir a escala para cada objeto
    const objetosComEscala = {
        "regador": 2.5,
        "guarda-chuva": 3,
        "cupula": 3.5,
        "sol": 3
    };

    // Torna cada objeto movível com a escala definida
    Object.keys(objetosComEscala).forEach(id => {
        let elemento = document.getElementById(id);
        if (elemento) {
            makeDraggable(elemento, objetosComEscala[id]);
        }
    });
});


