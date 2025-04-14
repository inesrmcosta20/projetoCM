document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecasCenario = document.querySelector(".peças-cenario");

  // Animação do avião finalizada
  aviao.addEventListener("animationend", function () {
    // Muda a imagem do avião
    aviao.src = "imagens/cenario/aviao-sombra.png";

    // Torna visíveis as peças do cenário com efeito de fade-in
    setTimeout(() => {
      pecasCenario.style.opacity = "1";
    }, 300); // opcional: atraso de 300ms para fluidez
  });
});

// Controlo do som
document.addEventListener("DOMContentLoaded", function () {
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa ícones
  somOn.style.display = "none";
  somOff.style.display = "block";

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

  // Eventos de clique nos ícones de som
  somOff.addEventListener("click", toggleAudio);
  somOn.addEventListener("click", toggleAudio);
});
