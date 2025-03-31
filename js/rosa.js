document.addEventListener("DOMContentLoaded", function () {
    function makeDraggable(element, scaleInside) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY; // Armazena posição inicial
        let zonaSucesso = document.getElementById("zona-sucesso");

        element.style.cursor = "grab";
        element.style.position = "absolute"; // Permite movimentar
        element.style.transition = "transform 0.3s ease"; // Suaviza a escala

        // Salvar posição inicial do elemento
        startX = element.offsetLeft;
        startY = element.offsetTop;

        element.addEventListener("mousedown", function (e) {
            isDragging = true;
            element.style.cursor = "grabbing";

            // Evita comportamento indesejado do navegador
            e.preventDefault();

            // Calcula a posição inicial do clique
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;

            // Garante que o objeto fique acima dos outros durante o movimento
            element.style.zIndex = 1000;
        });

        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                // Garante que o elemento não saia da tela
                let maxX = window.innerWidth - element.clientWidth;
                let maxY = window.innerHeight - element.clientHeight;

                element.style.left = Math.min(Math.max(0, newX), maxX) + "px";
                element.style.top = Math.min(Math.max(0, newY), maxY) + "px";
            }
        });

        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";

                // Verifica se o objeto está dentro da zona-sucesso
                let elemRect = element.getBoundingClientRect();
                let zonaRect = zonaSucesso.getBoundingClientRect();

                let completamenteDentro =
                    elemRect.left >= zonaRect.left &&
                    elemRect.right <= zonaRect.right &&
                    elemRect.top >= zonaRect.top &&
                    elemRect.bottom <= zonaRect.bottom;

                let parcialmenteDentro =
                    (elemRect.left < zonaRect.right && elemRect.right > zonaRect.left) &&
                    (elemRect.top < zonaRect.bottom && elemRect.bottom > zonaRect.top);

                if (completamenteDentro || parcialmenteDentro) {
                    // Define a escala personalizada para cada objeto
                    element.style.transform = `scale(${scaleInside})`;
                } else {
                    // Retorna à posição inicial e tamanho original
                    element.style.left = startX + "px";
                    element.style.top = startY + "px";
                    element.style.transform = "scale(1)";
                }
            }
        });
    }

    // Escala dos objetos
    let objetosComEscala = {
        "regador": 2.5,       
        "guarda-chuva": 3,  
        "cupula": 4,       
        "sol": 3            
    };

    // Aplica a função a cada objeto com sua escala específica
    Object.keys(objetosComEscala).forEach(id => {
        let elemento = document.getElementById(id);
        if (elemento) {
            makeDraggable(elemento, objetosComEscala[id]);
        }
    });
});
