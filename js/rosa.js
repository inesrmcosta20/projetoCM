document.addEventListener("DOMContentLoaded", function () {
  function makeDraggable(element) {
      let isDragging = false;
      let offsetX, offsetY;

      element.style.cursor = "grab";
      element.style.position = "absolute"; // Garante que os elementos possam se mover

      element.addEventListener("mousedown", function (e) {
          isDragging = true;
          element.style.cursor = "grabbing";

          // Evita comportamento indesejado do navegador
          e.preventDefault();

          // Calcula a posição inicial do clique
          offsetX = e.clientX - element.getBoundingClientRect().left;
          offsetY = e.clientY - element.getBoundingClientRect().top;

          // Garante que o elemento fique acima dos outros durante o arrasto
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
          isDragging = false;
          element.style.cursor = "grab";
      });
  }

  // Aplica a função a todos os elementos dentro da classe .objetos
  document.querySelectorAll(".objetos img").forEach(makeDraggable);
});
