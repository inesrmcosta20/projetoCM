document.addEventListener("DOMContentLoaded", function () {
  function makeDraggable(element) {
      let isDragging = false;
      let offsetX, offsetY;

      // Alterar o cursor para indicar que o elemento pode ser arrastado
      element.style.cursor = 'grab';

      element.addEventListener("mousedown", function (e) {
          isDragging = true;

          // Impede o cursor de mostrar o símbolo "proibido"
          element.style.cursor = 'grabbing';

          // Calcular o deslocamento entre o clique e a posição do elemento
          offsetX = e.clientX - element.getBoundingClientRect().left;
          offsetY = e.clientY - element.getBoundingClientRect().top;

          element.style.position = "absolute"; // Garante que o elemento seja posicionado livremente
          element.style.zIndex = 1000; // Torna o elemento visível acima dos outros elementos
          element.style.opacity = 1; // Garante que a opacidade não seja alterada durante o movimento
      });

      document.addEventListener("mousemove", function (e) {
          if (isDragging) {
              // Atualiza a posição do elemento com base no movimento do mouse
              element.style.left = (e.clientX - offsetX) + "px";
              element.style.top = (e.clientY - offsetY) + "px";
          }
      });

      document.addEventListener("mouseup", function () {
          isDragging = false; // Finaliza o movimento
          // Reverte o cursor para o padrão
          element.style.cursor = 'grab';
      });
  }

  // Tornar todos os objetos dentro da div .objetos arrastáveis
  document.querySelectorAll(".objetos img").forEach(makeDraggable);
});
