document.addEventListener("DOMContentLoaded", function () {
    const zonaSucesso = document.getElementById("zona-sucesso");
    const fullscreenContainer = document.getElementById("fullscreen-container");

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

    function iniciarAnimacaoRosa() {
        if (intervaloRosa) return;
        let direcao = 1;
        intervaloRosa = setInterval(() => {
            rosa.src = `imagens/rosa/movimento/rosa${frameAtual}.png`;
            frameAtual += direcao;
            if (frameAtual === 15) direcao = -1;
            else if (frameAtual === 0) direcao = 1;
        }, 100);
    }

    function pararAnimacaoRosa() {
        clearInterval(intervaloRosa);
        intervaloRosa = null;
    }

    // CHUVA
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

    function mostrarBalao(etapa) {
        if (todosBaloesMostrados) return;

        balaoFalas.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        const falaAtual = balaoFalas[etapa];
        const balao = document.getElementById(falaAtual.id);
        if (balao) balao.style.display = "block";

        if (falaAtual.objeto === "cupula") iniciarAnimacaoRosa();
        else pararAnimacaoRosa();

        if (falaAtual.objeto === "guarda-chuva") iniciarChuva();
        else pararChuva();
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
        const startX = element.offsetLeft;
        const startY = element.offsetTop;

        element.style.cursor = "grab";
        element.style.position = "absolute";

        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            element.style.left = `${Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - element.clientWidth)}px`;
            element.style.top = `${Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - element.clientHeight)}px`;
        });

        document.addEventListener("mouseup", function () {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";

            const elemRect = element.getBoundingClientRect();
            const zonaRect = zonaSucesso.getBoundingClientRect();
            const intersecta =
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
                    } else {
                        todosBaloesMostrados = true;

                        document.getElementById("balao-fala4_esq").style.display = "none";
                        pararChuva();

                        mostrarFullscreen();
                    }
                }
            }

        });



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

// Estrelas
const numEstrelas = 50;
const main = document.querySelector("main");

function criarEstrela() {
    const estrela = document.createElement("img");
    estrela.src = "imagens/rosa/cenario/estrela.png";
    estrela.classList.add("estrela-animada");

    const size = Math.floor(Math.random() * 15) + 10;
    estrela.style.width = `${size}px`;

    estrela.style.left = `${Math.random() * 100}vw`;
    estrela.style.top = `${Math.random() * 100}vh`;
    estrela.style.animationDelay = `${Math.random() * 5}s`;

    main.appendChild(estrela);

    estrela.addEventListener("animationiteration", () => {
        estrela.style.left = `${Math.random() * 100}vw`;
        estrela.style.top = `${Math.random() * 100}vh`;
    });
}

for (let i = 0; i < numEstrelas; i++) criarEstrela();
});

// Botão fechar fullscreen

function mostrarFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    document.body.classList.add('fullscreen-active');

    fullscreenContainer.innerHTML = `
        <a class="close" onclick="fecharFullscreen()">×</a>
        
        <div class="fullScreen-img-container">
            <img src="imagens/candeeiro/principe.png" id="posicao1" alt="Imagem 1">
            <img src="imagens/candeeiro/mensagem.png" id="posicao2" alt="Imagem 2"> 
        </div>
         <button id="homeButton">Finalizar</button>
    `;

    homeButton.addEventListener('click', function () {
        const imagemAtivar = 'corpo';
        const imagemDesativar = 'peça-corpo';

        // Marca que a animação do corpo deve ser executada
        localStorage.setItem('corpoAnimado', 'false');
        localStorage.setItem('imagemParaMostrar', imagemAtivar);
        localStorage.setItem('imagemParaEsconder', imagemDesativar);

        window.location.href = "homepage.html";
    });



    fullscreenContainer.style.display = 'flex';
}
// Função para fechar o fullscreen
function fecharFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    fullscreenContainer.style.display = 'none';
}

