document.addEventListener("DOMContentLoaded", function () {
    const zonaSucesso = document.getElementById("zona-sucesso");
    const balaoFala1 = document.getElementById("balao-fala1");

    // Exibe o balão de fala após 6 segundos
    setTimeout(() => {
        balaoFala1.classList.remove("hidden");
        contagem = setInterval(atualizarTimer, 1000);
    }, 6000);

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

                let completamenteDentro =
                    elemRect.left >= zonaRect.left &&
                    elemRect.right <= zonaRect.right &&
                    elemRect.top >= zonaRect.top &&
                    elemRect.bottom <= zonaRect.bottom;

                if (completamenteDentro) {
                    element.style.transform = `scale(${scaleInside})`;
                    element.style.transformOrigin = "center";

                    // Caso seja a cúpula, pode adicionar lógica especial aqui
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
                    element.style.left = `${startX}px`;
                    element.style.top = `${startY}px`;
                    element.style.transform = "scale(1)";
                }
            }
        });
    }

    // Escalas definidas para cada objeto
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

// Animação da rosa
const imagens = [
    "rosa0.png", "rosa1.png", "rosa2.png", "rosa3.png", "rosa4.png", "rosa5.png",
    "rosa6.png", "rosa7.png", "rosa8.png", "rosa9.png", "rosa10.png",
    "rosa11.png", "rosa12.png", "rosa13.png", "rosa14.png", "rosa15.png",
];

let indice = 0;
let direcao = 1;
let ultimaTroca = 0;
const intervalo = 50;

function animarRosa(timestamp) {
    if (!ultimaTroca) ultimaTroca = timestamp;

    const rosa = document.getElementById("rosa");
    if (!rosa) return;

    if (timestamp - ultimaTroca >= intervalo) {
        indice += direcao;
        if (indice >= imagens.length - 1 || indice <= 0) {
            direcao *= -1;
        }
        rosa.src = "imagens/rosa/movimento/" + imagens[indice];
        ultimaTroca = timestamp;
    }

    requestAnimationFrame(animarRosa);
}

requestAnimationFrame(animarRosa);
