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
        { id: "balao-fala3_esq", objeto: "sol" }
    ];

    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "37%", top: "27%" }
    };

    const somErrado = document.getElementById("audio-errado");
    const somCorreto = document.getElementById("audio-correto");
    const rosa = document.getElementById("rosa");

    let frameAtual = 0;
    let intervaloRosa;

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function randomizarSemRepetir(array, evitarInicialCom = null) {
        if (array.length <= 1) return [...array];

        let tentativas = 0;
        while (tentativas < 1000) {
            let resultado = [];
            let restantes = [...array];

            let candidatosIniciais = evitarInicialCom
                ? restantes.filter(item => item.objeto !== evitarInicialCom)
                : [...restantes];

            if (candidatosIniciais.length === 0) return shuffleArray(array);

            let primeiro = candidatosIniciais[Math.floor(Math.random() * candidatosIniciais.length)];
            resultado.push(primeiro);
            restantes = restantes.filter(item => item !== primeiro);
            let anterior = primeiro;

            while (restantes.length > 0) {
                let candidatos = restantes.filter(item => item.objeto !== anterior.objeto);
                if (candidatos.length === 0) break;

                let proximo = candidatos[Math.floor(Math.random() * candidatos.length)];
                resultado.push(proximo);
                restantes = restantes.filter(item => item !== proximo);
                anterior = proximo;
            }

            if (resultado.length === array.length) return resultado;
            tentativas++;
        }

        return shuffleArray(array);
    }

    let ordemFalas = randomizarSemRepetir(balaoFalas);
    let etapaAtual = 0;

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
                    if (etapaAtual < ordemFalas.length) {
                        mostrarBalao(etapaAtual);
                    } else {
                        const ultimoObjeto = ordemFalas[ordemFalas.length - 1]?.objeto;
                        ordemFalas = randomizarSemRepetir(balaoFalas, ultimoObjeto);
                        etapaAtual = 0;
                        mostrarBalao(etapaAtual);
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

        estrela.addEventListener('animationiteration', function () {
            estrela.style.left = `${Math.random() * 100}vw`;
            estrela.style.top = `${Math.random() * 100}vh`;
        });
    }

    for (let i = 0; i < numEstrelas; i++) {
        criarEstrela();
    }
});