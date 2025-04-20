document.addEventListener("DOMContentLoaded", function () {
    // Zona onde o objeto deve ser colocado corretamente
    const zonaSucesso = document.getElementById("zona-sucesso");

    // Referência aos objetos interativos
    const objetos = {
        "cupula": document.getElementById("cupula"),
        "regador": document.getElementById("regador"),
        "sol": document.getElementById("sol"),
        "guarda-chuva": document.getElementById("guarda-chuva")
    };

    // Lista dos balões de fala com o objeto correto para cada um
    const balaoFalas = [
        { id: "balao-fala1_dir", objeto: "cupula" },
        { id: "balao-fala2_esq", objeto: "regador" },
        { id: "balao-fala3_esq", objeto: "sol" }
    ];

    // Posições finais para cada objeto ao ser colocado corretamente
    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "70%", top: "27%" }
    };

    // Áudios de feedback
    const somErrado = document.getElementById("audio-errado");
    const somCorreto = document.getElementById("audio-correto");

    // Animação da rosa
    const rosa = document.getElementById("rosa");
    let frameAtual = 0;
    let intervaloRosa;

    // Função para embaralhar os balões sem repetir o mesmo objeto duas vezes seguidas
    function randomizarSemRepetir(array) {
        let resultado = [];
        let anterior = null;
        let tentativas = 0;

        while (resultado.length < array.length && tentativas < 100) {
            const copia = [...array];
            if (anterior !== null) {
                const indiceAnterior = copia.findIndex(f => f.objeto === anterior);
                if (indiceAnterior !== -1) {
                    copia.splice(indiceAnterior, 1);
                }
            }

            const escolhido = copia[Math.floor(Math.random() * copia.length)];
            resultado.push(escolhido);
            anterior = escolhido.objeto;
            tentativas++;
        }

        // Caso não consiga, retorna aleatório comum
        return resultado.length === array.length ? resultado : [...array].sort(() => Math.random() - 0.5);
    }

    // Inicializa a ordem dos balões embaralhada
    let ordemFalas = randomizarSemRepetir([...balaoFalas]);
    let etapaAtual = 0;

    // Inicia a animação da rosa
    function iniciarAnimacaoRosa() {
        if (intervaloRosa) return;

        let direcao = 1;

        intervaloRosa = setInterval(() => {
            rosa.src = `imagens/rosa/movimento/rosa${frameAtual}.png`;
            frameAtual += direcao;

            if (frameAtual === 15) {
                direcao = -1;
            } else if (frameAtual === 0) {
                direcao = 1;
            }
        }, 100);
    }

    // Pára a animação da rosa
    function pararAnimacaoRosa() {
        clearInterval(intervaloRosa);
        intervaloRosa = null;
    }

    // Exibe o balão de fala correspondente à etapa atual
    function mostrarBalao(etapa) {
        balaoFalas.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        const falaAtual = ordemFalas[etapa];
        const balao = document.getElementById(falaAtual.id);
        if (balao) balao.style.display = "block";

        if (falaAtual.objeto === "cupula") {
            iniciarAnimacaoRosa();
        } else {
            pararAnimacaoRosa();
        }
    }

    // Mostra o primeiro balão
    mostrarBalao(etapaAtual);

    // Se a primeira fala é da cúpula, inicia animação da rosa
    const balao1 = document.getElementById("balao-fala1_dir");
    if (balao1 && balao1.style.display !== "none") {
        iniciarAnimacaoRosa();
    }

    // Torna um objeto arrastável
    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX = element.offsetLeft;
        let startY = element.offsetTop;

        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease, left 0.2s ease, top 0.2s ease";

        // Ao clicar no objeto
        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
        });

        // Ao mover o mouse com o botão pressionado
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                element.style.left = Math.min(Math.max(0, newX), window.innerWidth - element.clientWidth) + "px";
                element.style.top = Math.min(Math.max(0, newY), window.innerHeight - element.clientHeight) + "px";
            }
        });

        // Ao soltar o botão do mouse
        document.addEventListener("mouseup", function () {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";

            let elemRect = element.getBoundingClientRect();
            let zonaRect = zonaSucesso.getBoundingClientRect();

            // Verifica se o objeto está dentro da zona
            let intersecta =
                elemRect.right > zonaRect.left &&
                elemRect.left < zonaRect.right &&
                elemRect.bottom > zonaRect.top &&
                elemRect.top < zonaRect.bottom;

            const objetoEsperado = ordemFalas[etapaAtual].objeto;
            const correto = element.id === objetoEsperado;

            if (intersecta && correto) {
                somCorreto.currentTime = 0;
                somCorreto.play();

                if (element.id === "cupula") pararAnimacaoRosa();

                const final = posicoesFinais[element.id];
                element.style.left = final.left;
                element.style.top = final.top;
                element.style.transform = `scale(${scaleInside}) rotate(${final.rotate || "0deg"})`;
                element.style.transformOrigin = "center";
                element.style.pointerEvents = "none";

                if (element.id === "sol") {
                    element.classList.add("animacao-sol");
                }

                // Passa para a próxima etapa após um tempo
                setTimeout(() => {
                    element.style.left = `${startX}px`;
                    element.style.top = `${startY}px`;
                    element.style.transform = "scale(1)";
                    element.style.pointerEvents = "auto";

                    if (element.id === "sol") {
                        element.classList.remove("animacao-sol");
                    }

                    etapaAtual++;
                    if (etapaAtual < ordemFalas.length) {
                        mostrarBalao(etapaAtual);
                    } else {
                        // Reinicia o ciclo
                        ordemFalas = randomizarSemRepetir([...balaoFalas]);
                        etapaAtual = 0;
                        mostrarBalao(etapaAtual);
                    }
                }, 2500);
            } else {
                // Objeto errado ou fora da zona
                somErrado.currentTime = 0;
                somErrado.play();
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            }
        });
    }

    // Escala ao posicionar corretamente
    const escalas = {
        "cupula": 3.5,
        "regador": 2.5,
        "sol": 3,
        "guarda-chuva": 3
    };

    // Ativa a movimentação para todos os objetos
    Object.keys(objetos).forEach(id => {
        makeDraggable(objetos[id], escalas[id]);
    });

    // Animação de estrelas cintilando
    const numEstrelas = 50;
    const main = document.querySelector("main");

    function criarEstrela() {
        const estrela = document.createElement("img");
        estrela.src = "imagens/rosa/cenario/estrela.png";
        estrela.classList.add("estrela-animada");

        const size = Math.floor(Math.random() * 15) + 10;
        estrela.style.width = `${size}px`;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        estrela.style.left = `${x}vw`;
        estrela.style.top = `${y}vh`;

        estrela.style.animationDelay = `${Math.random() * 5}s`;

        main.appendChild(estrela);

        // Reposiciona após cada animação
        estrela.addEventListener('animationiteration', function () {
            const newX = Math.random() * 100;
            const newY = Math.random() * 100;
            estrela.style.left = `${newX}vw`;
            estrela.style.top = `${newY}vh`;
        });
    }

    // Cria várias estrelas
    for (let i = 0; i < numEstrelas; i++) {
        criarEstrela();
    }
});
