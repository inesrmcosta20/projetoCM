document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os objetos que podem ser arrastados
    const objetos = document.getElementsClassName("arrastavel");
  
let leftBox = document.getElementsById("left");
  
let rightBox = document.getElementsById("right");

  
    // Adiciona eventos a cada objeto interativo
    objetos.forEach(objeto => {
      objeto.addEventListener("mousedown", (evento) => {
        objetoAtivo = objeto;
        
        // Calcula o deslocamento entre o clique e a posição do objeto
        offsetX = evento.clientX - objetoAtivo.getBoundingClientRect().left;
        offsetY = evento.clientY - objetoAtivo.getBoundingClientRect().top;
        
        // Garante que o objeto seja "trazido para frente" na tela
        objetoAtivo.style.position = "absolute";
      });
    });
  
    // Evento de movimento do mouse
    document.addEventListener("mousemove", (evento) => {
      if (objetoAtivo) {
        objetoAtivo.style.left = evento.clientX - offsetX + "px";
        objetoAtivo.style.top = evento.clientY - offsetY + "px";
      }
    });
  
    // Solta o objeto ao soltar o botão do mouse
    document.addEventListener("mouseup", () => {
      objetoAtivo = null;
    });
  });
  