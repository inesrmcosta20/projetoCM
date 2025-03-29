document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".draggable");

  images.forEach(img => {
    img.addEventListener("mousedown", (e) => {
      // Captura a posição inicial do clique em relação à imagem
      let offsetX = e.clientX - img.getBoundingClientRect().left;
      let offsetY = e.clientY - img.getBoundingClientRect().top;

      // Ajusta a posição inicial da imagem para onde o clique foi
      img.style.left = e.clientX - offsetX + "px";
      img.style.top = e.clientY - offsetY + "px";

      // Quando o mouse for solto, a imagem vai permanecer nessa posição
      const stopDrag = () => {
        document.removeEventListener("mousemove", moveImage);
        document.removeEventListener("mouseup", stopDrag);
      };

      const moveImage = (event) => {
        // A imagem fica parada na posição onde o clique ocorreu
      };

      // Para o movimento ao soltar o botão do mouse
      document.addEventListener("mouseup", stopDrag);
    });
  });
});
