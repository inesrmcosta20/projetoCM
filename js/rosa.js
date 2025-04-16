document.addEventListener("DOMContentLoaded", function () {
    const zonaSucesso = document.getElementById("zona-sucesso");

    const objetos = {
        "cupula": document.getElementById("cupula"),
        "regador": document.getElementById("regador"),
        "sol": document.getElementById("sol"),
        "guarda-chuva": document.getElementById("guarda-chuva")
    };

    const balaoFalas = [
        "balao-fala1",
        "balao-fala2",
        "balao-fala3"
    ];

    let etapaAtual = 0;
    let ordemCorreta = ["cupula", "regador", "sol"];

    const posicoesFinais = {
        "regador": { left: "37%", top: "35%", rotate: "20deg" },
        "guarda-chuva": { left: "47%", top: "35%", rotate: "-25deg" },
        "cupula": { left: "54%", top: "50%" },
        "sol": { left: "35%", top: "30%" }
    };

    // Áudios
    const somErro = document.getElementById("audio-erro");
    const somAcerto = document.getElementById("audio-acerto");

    function mostrarBalao(etapa) {
        balaoFalas.forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.display = (i === etapa) ? "block" : "none";
        });
    }

    mostrarBalao(etapaAtual);

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

            const correto = element.id === ordemCorreta[etapaAtual];

            if (intersecta && correto) {
                // Toca som de acerto
                somAcerto.currentTime = 0;
                somAcerto.play();

                const final = posicoesFinais[element.id];
                element.style.left = final.left;
                element.style.top = final.top;

                if (element.id === "sol") {
                    element.classList.add("animacao-sol");
                    element.style.transform = `scale(${scaleInside}) rotate(0deg)`;
                } else {
                    element.style.transform = `scale(${scaleInside}) rotate(${final.rotate || "0deg"})`;
                }

                element.style.transformOrigin = "center";
                element.style.pointerEvents = "none";

                // Avança após 2.5s
                setTimeout(() => {
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
                        console.log("Jogo concluído!");
                    }
                }, 2500);

            } else if (intersecta && !correto) {
                somErro.currentTime = 0;
                somErro.play();

                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            } else {
                element.style.left = `${startX}px`;
                element.style.top = `${startY}px`;
                element.style.transform = "scale(1)";
            }
        });
    }

    const escalas = {
        "cupula": 3.5,
        "regador": 2.5,
        "sol": 3,
        "guarda-chuva": 3
    };

    Object.keys(objetos).forEach(id => {
        makeDraggable(objetos[id], escalas[id]);
    });
});
