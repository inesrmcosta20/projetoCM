document.addEventListener("DOMContentLoaded", function () {
    let introRosa = document.querySelector(".intro-rosa");
    let instrucoes = document.querySelector(".instrucoes");
    let timerDisplay = document.getElementById("timer");
    let tempoRestante = 15;
    let contagem;

    // Função que atualiza o timer
    function atualizarTimer() {
        let segundos = tempoRestante % 60;
        segundos = segundos < 10 ? "0" + segundos : segundos;
        timerDisplay.textContent = `00:${segundos}`;

        if (tempoRestante > 0) {
            tempoRestante--;
        } else {
            clearInterval(contagem);
            timerDisplay.textContent = "Tempo Esgotado!";
        }
    }

    // Ocultar intro/instruções após 5 segundos
    if (introRosa) setTimeout(() => introRosa.classList.add("hidden"), 5000);
    if (instrucoes) setTimeout(() => instrucoes.classList.add("hidden"), 5000);

    // Iniciar o timer após 5 segundos
    setTimeout(() => {
        contagem = setInterval(atualizarTimer, 1000);
    }, 5000);

    // Função para permitir arrastar o elemento
    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX = element.offsetLeft;
        let startY = element.offsetTop;
        let zonaSucesso = document.getElementById("zona-sucesso");

        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease";

        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
        });

        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                element.style.left = Math.min(Math.max(0, newX), window.innerWidth - element.clientWidth) + "px";
                element.style.top = Math.min(Math.max(0, newY), window.innerHeight - element.clientHeight) + "px";
            }
        });

        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";

                let elemRect = element.getBoundingClientRect();
                let zonaRect = zonaSucesso.getBoundingClientRect();

                let completamenteDentro =
                    elemRect.left >= zonaRect.left &&
                    elemRect.right <= zonaRect.right &&
                    elemRect.top >= zonaRect.top &&
                    elemRect.bottom <= zonaRect.bottom;

                    if (completamenteDentro) {
                        element.style.transform = `scale(${scaleInside})`;
                      
                        // Missão concluída
                        const balaoFala1 = document.getElementById("balao-fala1");
                        const missaoConcluida = document.getElementById("missao-concluida");
                        const conclusao = document.getElementById("conclusao");
                      
                        if (balaoFala1 && balaoFala1.style.display !== "none") {
                          if (missaoConcluida) {
                            missaoConcluida.classList.remove("hidden");
                            missaoConcluida.removeAttribute("style"); // Remove qualquer estilo inline
                          }
                          clearInterval(contagem);   
                        }
                          
                        if (balaoFala1 && balaoFala1.style.display !== "none") {
                            if (conclusao) {
                              conclusao.classList.remove("hidden");
                              conclusao.removeAttribute("style"); // Remove qualquer estilo inline
                            }
                            clearInterval(contagem);   
                          }
                      }
                    }           
        });
    }

    // Aplica a função de arrastar aos elementos com suas escalas
    const objetosComEscala = {
        "regador": 2.5,
        "guarda-chuva": 3,
        "cupula": 3.5,
        "sol": 3
    };

    Object.keys(objetosComEscala).forEach(id => {
        let elemento = document.getElementById(id);
        if (elemento) {
            makeDraggable(elemento, objetosComEscala[id]);
        }
    });
});

