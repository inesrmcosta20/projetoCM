document.addEventListener("DOMContentLoaded", function () {
    const zonaSucesso = document.getElementById("zona-sucesso");
    const balaoFala1 = document.getElementById("balao-fala1");

    // Exibe o balão de fala após 6 segundos
    setTimeout(() => {
        balaoFala1.classList.remove("hidden");
        contagem = setInterval(atualizarTimer, 1000);
    }, 6000);

    const posicoesFinais = {
        "regador": { left: "60%", top: "60%" },
        "guarda-chuva": { left: "63%", top: "40%" },
        "cupula": { left: "66%", top: "50%" },
        "sol": { left: "62%", top: "30%" }
    };

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
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";

                let elemRect = element.getBoundingClientRect();
                let zonaRect = zonaSucesso.getBoundingClientRect();

                // Verifica interseção parcial
                let intersecta =
                    elemRect.right > zonaRect.left &&
                    elemRect.left < zonaRect.right &&
                    elemRect.bottom > zonaRect.top &&
                    elemRect.top < zonaRect.bottom;

                if (intersecta) {
                    // Define posição personalizada
                    const final = posicoesFinais[element.id];
                    if (final) {
                        element.style.left = final.left;
                        element.style.top = final.top;
                    }

                    element.style.transform = `scale(${scaleInside})`;
                    element.style.transformOrigin = "center";

                    // Lógica especial para a cúpula
                    if (element.id === "cupula") {
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

                        clearInterval(contagem);
                    }

                } else {
                    // Volta à posição inicial
                    element.style.left = `${startX}px`;
                    element.style.top = `${startY}px`;
                    element.style.transform = "scale(1)";
                }
            }
        });
    }

    // Escalas para cada objeto
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
