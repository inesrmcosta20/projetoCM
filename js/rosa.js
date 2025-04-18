document.addEventListener("DOMContentLoaded", function () {
    // Zona de Sucesso 
    const zonaSucesso = document.getElementById("zona-sucesso");

    // Objetos arrastáveis
    const objetos = {
        "cupula": document.getElementById("cupula"),
        "regador": document.getElementById("regador"),
        "sol": document.getElementById("sol"),
        "guarda-chuva": document.getElementById("guarda-chuva")
    };

    // Associar os balões de fala aos objetos correspondentes
    const balaoFalas = [
        { id: "balao-fala1", objeto: "cupula" },
        { id: "balao-fala2", objeto: "regador" },
        { id: "balao-fala3", objeto: "sol" }
    ];

    // Posições finais que cada objeto deve ocupar quando colocado corretamente
    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "35%", top: "30%" }
    };

    // Sons Errado/Correto
    const somErrado = document.getElementById("audio-errado");
    const somCorreto = document.getElementById("audio-correto");

    // Referência à imagem da rosa animada
    const rosa = document.getElementById("rosa");
    let frameAtual = 0;
    let intervaloRosa;

<<<<<<< Updated upstream
    // Randomizar a ordem dos balões de fala
=======
    //random balão de fala
>>>>>>> Stashed changes
    function embaralhar(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    let ordemFalas = embaralhar([...balaoFalas]); // Ordem aleatória dos balões de fala
    let etapaAtual = 0;

    // Inicia a animação da rosa 
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

        if (falaAtual.objeto === "cupula") iniciarAnimacaoRosa();
        else pararAnimacaoRosa();
    }

    mostrarBalao(etapaAtual);

    // Caso o primeiro balão já esteja visível, inicia a animação da rosa
    const balao1 = document.getElementById("balao-fala1");
    if (balao1 && balao1.style.display !== "none") iniciarAnimacaoRosa();

    // Torna um objeto movível
    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX = element.offsetLeft;
        let startY = element.offsetTop;

        element.style.cursor = "grab";
        element.style.position = "absolute";
        element.style.transition = "transform 0.3s ease, left 0.2s ease, top 0.2s ease";

        // Início do mover o objeto
        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";
            e.preventDefault();
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.zIndex = 1000;
        });

        // Movimento durante o mover o objeto
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                element.style.left = Math.min(Math.max(0, newX), window.innerWidth - element.clientWidth) + "px";
                element.style.top = Math.min(Math.max(0, newY), window.innerHeight - element.clientHeight) + "px";
            }
        });

        // Fim do mover o objeto
        document.addEventListener("mouseup", function () {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = "grab";

            // Verifica se o objeto foi posicionado na zona correta
            let elemRect = element.getBoundingClientRect();
            let zonaRect = zonaSucesso.getBoundingClientRect();

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

                if (element.id === "sol") element.classList.add("animacao-sol");

                // Após um tempo, volta à posição inicial e avança para a próxima etapa
                setTimeout(() => {
                    element.style.left = `${startX}px`;
                    element.style.top = `${startY}px`;
                    element.style.transform = "scale(1)";
                    element.style.pointerEvents = "auto";

                    if (element.id === "sol") element.classList.remove("animacao-sol");

                    etapaAtual++;
                    if (etapaAtual < ordemFalas.length) {
                        mostrarBalao(etapaAtual);
                    } else {
                        // Reinicia o ciclo
                        ordemFalas = embaralhar([...balaoFalas]);
                        etapaAtual = 0;
                        mostrarBalao(etapaAtual);
                    }
                }, 2500);
            } else if (intersecta && !correto) {
                // Se foi posicionado na zona correta mas não é o objeto correto
                somErrado.currentTime = 0;
                somErrado.play();
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            } else {
                // Se não foi posicionado na zona correta
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            }
        });
    }

    // Escala a aplicar a cada objeto quando for posicionado corretamente
    const escalas = {
        "cupula": 3.5,
        "regador": 2.5,
        "sol": 3,
        "guarda-chuva": 3
    };

    // Torna todos os objetos movíveis
    Object.keys(objetos).forEach(id => {
        makeDraggable(objetos[id], escalas[id]);
    });

    //Animação de Estrelas
    const numEstrelas = 50;
    const main = document.querySelector("main");

    // Cria uma estrela com posição e atraso aleatórios
    function criarEstrela() {
        const estrela = document.createElement("img");
        estrela.src = "imagens/rosa/estrela.png";
        estrela.classList.add("estrela-animada");

        const size = Math.floor(Math.random() * 15) + 10;
        estrela.style.width = `${size}px`;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        estrela.style.left = `${x}vw`;
        estrela.style.top = `${y}vh`;

        estrela.style.animationDelay = `${Math.random() * 5}s`;

        main.appendChild(estrela);

        // Muda a posição da estrela cada vez que a animação recomeça
        estrela.addEventListener('animationiteration', function () {
            const newX = Math.random() * 100;
            const newY = Math.random() * 100;
            estrela.style.left = `${newX}vw`;
            estrela.style.top = `${newY}vh`;
        });
    }

    // Cria o número de estrelas definidas
    for (let i = 0; i < numEstrelas; i++) {
        criarEstrela();
    }
});
