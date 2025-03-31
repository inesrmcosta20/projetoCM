document.addEventListener("DOMContentLoaded", function () {
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY; // Armazena posição inicial
        let zonaSucesso = document.getElementById("zona-sucesso");

        element.style.cursor = "grab";
        element.style.position = "absolute"; // Garante que os elementos possam mover-se

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

            // Garante que o elemento fique acima dos outros durante o movimento
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

                // Verifica se o objeto está completamente dentro da zona-sucesso
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

                if (!completamenteDentro) {
                    if (parcialmenteDentro) {
                        alert("O objeto está nos limites da zona-sucesso, mas não completamente dentro!");
                    }
                    // Retorna à posição inicial
                    element.style.left = startX + "px";
                    element.style.top = startY + "px";
                }
            }
        });
    }

    // Aplica a função a todos os elementos dentro da classe .objetos
    document.querySelectorAll(".objetos img").forEach(makeDraggable);
});
