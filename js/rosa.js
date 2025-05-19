document.addEventListener("DOMContentLoaded", function () {
    const zonaSucesso = document.getElementById("zona-sucesso");

    const objetos = {
        "cupula": document.getElementById("cupula"),
        "regador": document.getElementById("regador"),
        "sol": document.getElementById("sol"),
        "guarda-chuva": document.getElementById("guarda-chuva")
    };

    const balaoFalas = [
        { id: "balao-fala1_dir", objeto: "cupula" },
        { id: "balao-fala2_esq", objeto: "regador" },
        { id: "balao-fala3_esq", objeto: "sol" },
        { id: "balao-fala4_esq", objeto: "guarda-chuva" }
    ];

    const falaCupulaExtras = [
        "balao-fala5_esq",
        "balao-fala6_esq",
        "balao-fala7_dir"
    ];

    const falaSincronizada = {
        "balao-fala1_dir": ["balao-fala5_esq", "balao-fala6_esq", "balao-fala7_dir"],
        "balao-fala2_esq": ["balao-fala8_esq", "balao-fala9_dir"],
        "balao-fala3_esq": ["balao-fala10_esq"]
    };

    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "37%", top: "27%" }
    };

    const somErrado = document.getElementById("audio-errado");
    const somCorreto = document.getElementById("audio-correto");
    const musicaFundo = document.getElementById("background-music-jogo");
    const rosa = document.getElementById("rosa");

    if (localStorage.getItem("somAtivo") === "true") {
        musicaFundo.volume = 0.5;
        musicaFundo.play().catch(e => console.warn("Autoplay bloqueado:", e));
    }

    let frameAtual = 0;
    let intervaloRosa;
    const MAX_FRAMES_ROSA = 15;

    function iniciarAnimacaoRosa() {
        if (intervaloRosa) return;
        let direcao = 1;
        intervaloRosa = setInterval(() => {
            rosa.src = `imagens/rosa/movimento/rosa${frameAtual}.png`;
            frameAtual += direcao;
            if (frameAtual === MAX_FRAMES_ROSA) direcao = -1;
            else if (frameAtual === 0) direcao = 1;
        }, 100);
    }

    function pararAnimacaoRosa() {
        clearInterval(intervaloRosa);
        intervaloRosa = null;
    }

    const chuvaContainer = document.createElement("div");
    chuvaContainer.id = "chuva";
    document.body.appendChild(chuvaContainer);

    function iniciarChuva() {
        chuvaContainer.innerHTML = '';
        chuvaContainer.style.display = 'block';
        for (let i = 0; i < 100; i++) {
            const pingo = document.createElement("div");
            pingo.className = "pingo";
            pingo.style.left = `${Math.random() * 100}vw`;
            pingo.style.animationDelay = `${Math.random() * 2}s`;
            chuvaContainer.appendChild(pingo);
        }
    }

    function pararChuva() {
        chuvaContainer.innerHTML = '';
        chuvaContainer.style.display = 'none';
    }

    let etapaAtual = 0;
    let todosBaloesMostrados = false;

    function esconderTodosBaloes() {
        [...balaoFalas.map(b => b.id), ...Object.values(falaSincronizada).flat()].forEach(id => {
            const el = document.getElementById(id);
            if (el && el.classList.contains('fade-in')) {
                el.classList.remove('fade-in');
                el.classList.add('fade-out');
                setTimeout(() => {
                    el.classList.remove('fade-out');
                    el.style.display = 'none';
                }, 700);
            } else if (el) {
                el.style.display = 'none';
            }
        });
    }

    function mostrarBalao(etapa) {
        if (todosBaloesMostrados) return;

        esconderTodosBaloes();

        const falaAtual = balaoFalas[etapa];
        const balaoPrincipal = document.getElementById(falaAtual.id);
        if (balaoPrincipal) {
            balaoPrincipal.classList.remove("fade-out");
            balaoPrincipal.style.display = "block";
            void balaoPrincipal.offsetWidth; // força reflow para reiniciar animação
            balaoPrincipal.classList.add("fade-in");
        }

        // Mostrar extras sincronizados
        if (falaSincronizada[falaAtual.id]) {
            falaSincronizada[falaAtual.id].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove("fade-out");
                    el.style.display = "block";
                    void el.offsetWidth;
                    el.classList.add("fade-in");
                }
            });
        }

        // Condições adicionais
        if (falaAtual.id === "balao-fala4_esq") {
            iniciarChuva();
        } else {
            pararChuva();
        }

        if (falaAtual.objeto === "cupula") {
            iniciarAnimacaoRosa();
        } else {
            pararAnimacaoRosa();
        }
    }


    mostrarBalao(etapaAtual);

    const escalas = {
        "cupula": 3.5,
        "regador": 2.5,
        "sol": 3,
        "guarda-chuva": 3
    };

    Object.keys(objetos).forEach(id => {
        makeDraggable(objetos[id], escalas[id]);
    });

    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX = element.offsetLeft;
        let startY = element.offsetTop;

        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease, left 0.2s ease, top 0.2s ease";

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
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";

            let elemRect = element.getBoundingClientRect();
            let zonaRect = zonaSucesso.getBoundingClientRect();
            let intersecta =
                elemRect.right > zonaRect.left &&
                elemRect.left < zonaRect.right &&
                elemRect.bottom > zonaRect.top &&
                elemRect.top < zonaRect.bottom;

            const objetoEsperado = balaoFalas[etapaAtual].objeto;
            const correto = element.id === objetoEsperado;

            if (intersecta && correto) {
                somCorreto.currentTime = 0;
                somCorreto.play();

                if (element.id === "cupula") pararAnimacaoRosa();

                const final = posicoesFinais[element.id];
                element.style.left = final.left;
                element.style.top = final.top;
                element.style.transform = `scale(${scaleInside}) rotate(${final.rotate || "0deg"})`;
                element.style.pointerEvents = "none";

                if (element.id === "sol") {
                    element.classList.add("animacao-sol");
                }

                const resetarElemento = () => {
                    element.style.left = `${startX}px`;
                    element.style.top = `${startY}px`;
                    element.style.transform = "scale(1)";
                    element.style.pointerEvents = "auto";

                    if (element.id === "sol") {
                        element.classList.remove("animacao-sol");
                    }

                    etapaAtual++;
                    if (etapaAtual < balaoFalas.length) {
                        mostrarBalao(etapaAtual);
                    }

                    if (element.id === "guarda-chuva") {
                        todosBaloesMostrados = true;
                        pararChuva();
                        mostrarFullscreen();
                    }
                };

                if (element.id === "regador") {
                    animarRegador(element, resetarElemento);
                } else {
                    setTimeout(resetarElemento, 2500);
                }

            } else {
                somErrado.currentTime = 0;
                somErrado.play();
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            }
        });
    }

    function animarRegador(element, callback) {
        let frame = 0;
        const totalFrames = 10;
        const caminhoBase = "imagens/rosa/objetos/regador/regador";
        const intervalo = 150;

        const animar = setInterval(() => {
            if (frame < totalFrames) {
                element.src = `${caminhoBase}${frame}.png`;
                frame++;
            } else {
                clearInterval(animar);
                element.src = `${caminhoBase}0.png`;
                if (callback) callback();
            }
        }, intervalo);
    }

    function mostrarFullscreen() {
        const fullscreenContainer = document.getElementById('fullscreen-container');
        document.body.classList.add('fullscreen-active');

        fullscreenContainer.innerHTML = `
        <div class="fullScreen-img-container">
          <img src="imagens/principe/principe1.png" id="posicao1" alt="príncipe">
        <img src="imagens/rosa/mensagem.png" id="posicao2" alt="mensagem"> 
        </div>
        <button id="homeButton">Finalizar</button>
    `;

        // Iniciar animação do principezinho
        const principeImg = document.getElementById('posicao1');
        let frame = 1;
        const maxFrames = 10;
        const intervalo = 150; // ms

        let animacaoIntervalo = setInterval(() => {
            frame = frame >= maxFrames ? 1 : frame + 1;
            principeImg.src = `imagens/principe/principe${frame}.png`;
        }, intervalo);

        // Botão Finalizar
        const homeButton = document.getElementById('homeButton');
        homeButton.addEventListener('click', function () {
            // Parar a animação ao sair
            clearInterval(animacaoIntervalo);

            // Ativar peça rodas no avião e desativar no cenário
            sessionStorage.setItem('desativarPecaCenario', 'peça-rodas');
            sessionStorage.setItem('animarPecaAviao', 'rodas');

            window.location.href = 'homepage.html';
        });

        fullscreenContainer.style.display = 'flex';
    }

});

