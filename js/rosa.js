document.addEventListener("DOMContentLoaded", function () {
    // Zona onde o objeto correto deve ser colocado
    const zonaSucesso = document.getElementById("zona-sucesso");

    // Objetos
    const objetos = {
        "cupula": document.getElementById("cupula"),
        "regador": document.getElementById("regador"),
        "sol": document.getElementById("sol"),
        "guarda-chuva": document.getElementById("guarda-chuva")
    };

    // Balões de fala e objeto associado a cada um
    const balaoFalas = [
        { id: "balao-fala1", objeto: "cupula" },
        { id: "balao-fala2", objeto: "regador" },
        { id: "balao-fala3", objeto: "sol" }
    ];

    // Posições finais dos objetos após serem colocados corretamente
    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "70%", top: "27%" }
    };

    // Áudio para respostas erradas e corretas
    const somErrado = document.getElementById("audio-errado");
    const somCorreto = document.getElementById("audio-correto");

    // Rosa em movimento
    const rosa = document.getElementById("rosa");
    let frameAtual = 0;
    let intervaloRosa;

    // Função para randomizar a ordem dos balões de fala
    function randomizar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Balões numa ordem aleatória
    let ordemFalas = randomizar([...balaoFalas]);
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

    // Mostra o balão de fala correspondente à etapa atual
    function mostrarBalao(etapa) {
        balaoFalas.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        const falaAtual = ordemFalas[etapa];
        const balao = document.getElementById(falaAtual.id);
        if (balao) balao.style.display = "block";

        // Se o objeto for a cúpula, inicia a animação da rosa
        if (falaAtual.objeto === "cupula") {
            iniciarAnimacaoRosa();
        } else {
            pararAnimacaoRosa();
        }
    }

    // Mostra o primeiro balão
    mostrarBalao(etapaAtual);

    // Se o primeiro balão estiver visível, começa a animação da rosa
    const balao1 = document.getElementById("balao-fala1");
    if (balao1 && balao1.style.display !== "none") {
        iniciarAnimacaoRosa();
    }

    // Função que torna os objetos movíveis
    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX = element.offsetLeft;
        let startY = element.offsetTop;

        //Comportamento enquanto se move o objeto
        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease, left 0.2s ease, top 0.2s ease";

        // Evento ao clicar e começar a mover o objeto
        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
        });

        // Evento ao mover com o rato pressionado
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                element.style.left = Math.min(Math.max(0, newX), window.innerWidth - element.clientWidth) + "px";
                element.style.top = Math.min(Math.max(0, newY), window.innerHeight - element.clientHeight) + "px";
            }
        });

        // Largar o botão do rato
        document.addEventListener("mouseup", function () {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";

            let elemRect = element.getBoundingClientRect();
            let zonaRect = zonaSucesso.getBoundingClientRect();

            // Verifica se o objeto foi posicionado dentro da zona de sucesso
            let intersecta =
                elemRect.right > zonaRect.left &&
                elemRect.left < zonaRect.right &&
                elemRect.bottom > zonaRect.top &&
                elemRect.top < zonaRect.bottom;

            // Verifica se é o objeto correto para esta etapa
            const objetoEsperado = ordemFalas[etapaAtual].objeto;
            const correto = element.id === objetoEsperado;

            if (intersecta && correto) {
                somCorreto.currentTime = 0;
                somCorreto.play();

                if (element.id === "cupula") pararAnimacaoRosa();

                // Coloca o objeto na posição final e aplica as transformações
                const final = posicoesFinais[element.id];
                element.style.left = final.left;
                element.style.top = final.top;
                element.style.transform = `scale(${scaleInside}) rotate(${final.rotate || "0deg"})`;
                element.style.transformOrigin = "center";
                element.style.pointerEvents = "none";

                if (element.id === "sol") {
                    element.classList.add("animacao-sol");
                }

                // Após 2500ms, reinicia para a próxima etapa
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
                        ordemFalas = randomizar([...balaoFalas]);
                        etapaAtual = 0;
                        mostrarBalao(etapaAtual);
                    }
                }, 2500);
            } else if (intersecta && !correto) {
                // O objeto errado foi posicionado na zona de sucesso
                somErrado.currentTime = 0;
                somErrado.play();
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            } else {
                // Não foi posicionado na zona correta
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            }
        });
    }

    // Escalas de cada objeto ao ser posicionado corretamente
    const escalas = {
        "cupula": 3.5,
        "regador": 2.5,
        "sol": 3,
        "guarda-chuva": 3
    };

    // Aplica a função de mover a todos os objetos
    Object.keys(objetos).forEach(id => {
        makeDraggable(objetos[id], escalas[id]);
    });

    //Animação das estrelas a cintilzar
    const numEstrelas = 50;
    const main = document.querySelector("main");

    function criarEstrela() {
        const estrela = document.createElement("img");
        estrela.src = "imagens/rosa/cenario/estrela.png";
        estrela.classList.add("estrela-animada");

        // Tamanho aleatório
        const size = Math.floor(Math.random() * 15) + 10;
        estrela.style.width = `${size}px`;

        // Posição aleatória na tela
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        estrela.style.left = `${x}vw`;
        estrela.style.top = `${y}vh`;

        // Delay aleatório na animação
        estrela.style.animationDelay = `${Math.random() * 5}s`;

        main.appendChild(estrela);

        // Após cada ciclo da animação, muda de posição
        estrela.addEventListener('animationiteration', function () {
            const newX = Math.random() * 100;
            const newY = Math.random() * 100;
            estrela.style.left = `${newX}vw`;
            estrela.style.top = `${newY}vh`;
        });
    }

    // Cria as estrelas
    for (let i = 0; i < numEstrelas; i++) {
        criarEstrela();
    }
});
