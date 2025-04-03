document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const missaoRosa = document.querySelector(".missao-rosa");

  aviao.addEventListener("animationend", function () {
    aviao.src = "imagens/aviao-sombra.png";
    missaoRosa.style.display = "inline-block"; // Exibe o botão da rosa após a animação
  });
});


/*
  pecas.forEach(peça => {
      peça.style.opacity = "0"; // Inicialmente ocultas
      peça.addEventListener("click", function () {
          peça.style.opacity = "1"; // Torna visível ao clicar
      });
  });
*/

