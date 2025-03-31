document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecas = document.querySelectorAll(".peça");

  aviao.addEventListener("animationend", function () {
    aviao.src = "imagens/aviao-sombra.png";

  });

  /*

    pecas.forEach(peça => {
        peça.style.opacity = "0"; // Inicialmente ocultas
        peça.addEventListener("click", function () {
            peça.style.opacity = "1"; // Torna visível ao clicar
        });
    });
*/
}); 
