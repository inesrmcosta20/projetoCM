//Substituição no final da animação
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

//Controlo do som
document.addEventListener("DOMContentLoaded", function () {
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa os ícones de som corretamente
  somOn.style.display = "none";
  somOff.style.display = "block";

  // Verifica se o áudio está em reprodução e ajusta os ícones
  function toggleAudio() {
    if (audio.paused) {
      audio.play();
      somOff.style.display = "none";
      somOn.style.display = "block";
    } else {
      audio.pause();
      somOff.style.display = "block";
      somOn.style.display = "none";
    }
  }

  // Quando o ícone de som desligado for clicado
  somOff.addEventListener("click", toggleAudio);

  // Quando o ícone de som ligado for clicado
  somOn.addEventListener("click", toggleAudio);
});
