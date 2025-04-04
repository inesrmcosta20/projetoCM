//Intro Jogo Rosa
document.addEventListener("DOMContentLoaded", function () {
    let introRosa = document.querySelector(".intro-rosa");
    let instrucoes = document.querySelector(".instrucoes");

    if (introRosa) {
        setTimeout(() => {
            introRosa.classList.add("hidden"); // Adiciona a classe que faz a imagem desaparecer
        }, 5000); // Tempo que a imagem fica visível antes de desaparecer 
    }
    
    if (instrucoes) {
        setTimeout(() => {
            instrucoes.classList.add("hidden"); // Adiciona a classe que faz a imagem desaparecer
        }, 5000); // Tempo que a imagem fica visível antes de desaparecer 
    }
});

// Mover objetos
document.addEventListener("DOMContentLoaded", function () {
  function makeDraggable(element, scaleInside) {
      let isDragging = false;
      let offsetX, offsetY;
      let startX, startY; // Armazena posição inicial
      let zonaSucesso = document.getElementById("zona-sucesso");

      element.style.cursor = "grab";
      element.style.position = "absolute"; // Permite movimentar 
      element.style.transition = "transform 0.3s ease"; // Suaviza a escala

      // Salvar posição inicial do objeto
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

              // Garante que o objeto não saia da tela
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

  // Lista de objetos com escalas personalizadas
  let objetosComEscala = {
      "regador": 2.5,       
      "guarda-chuva": 3, 
      "cupula": 3.5,        
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

// Nível 1 - Cúpula
// Nível 1 - Cúpula
document.addEventListener("DOMContentLoaded", function () {
    const cupula = document.getElementById("cupula");
    const zonaSucesso = document.getElementById("zona-sucesso");
    const balaoFala1 = document.getElementById("balao-fala1");

    function makeDraggable(element) {
        let isDragging = false;
        let offsetX, offsetY;

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
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                let maxX = window.innerWidth - element.clientWidth;
                let maxY = window.innerHeight - element.clientHeight;

                element.style.left = Math.min(Math.max(0, newX), maxX) + "px";
                element.style.top = Math.min(Math.max(0, newY), maxY) + "px";

                // Verifica se a cúpula entrou na zona de sucesso
                let elemRect = element.getBoundingClientRect();
                let zonaRect = zonaSucesso.getBoundingClientRect();

                let dentro = elemRect.left >= zonaRect.left &&
                            elemRect.right <= zonaRect.right &&
                            elemRect.top >= zonaRect.top &&
                            elemRect.bottom <= zonaRect.bottom;

                if (dentro && balaoFala1.style.display !== "none") {
                    // Reposiciona a cúpula imediatamente quando estiver dentro da zona de sucesso
                    element.style.left = "50%";  // Ajuste a posição X para o centro
                    element.style.top = "50%";   // Ajuste a posição Y para o centro
                    element.style.transform = "scale(3.5)";  // Ajusta a escala para 3.5
                    element.style.transition = "transform 0.3s ease, left 0.3s ease, top 0.3s ease";  // Suaviza a transição
                }
            }
        });

        document.addEventListener("mouseup", function () {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "grab";
            }
        });
    }

    // Aplica a função de arrastar apenas à cúpula
    if (cupula) {
        makeDraggable(cupula);
    }
});
