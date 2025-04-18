document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecasCenario = document.querySelector(".peças-cenario");
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa ícones de som
  somOn.style.display = "none";
  somOff.style.display = "block";

  // Tenta iniciar o áudio automaticamente
  function startAudio() {
    audio.play().catch(e => {
      console.log("Autoplay prevented, showing paused state");
      somOff.style.display = "block";
      somOn.style.display = "none";
    });
  }
    // Inicia o áudio quando a página carrega
    startAudio();
    
  // Controlo do som
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

  somOff.addEventListener("click", toggleAudio);
  somOn.addEventListener("click", toggleAudio);

  // Quando a animação do avião termina
  aviao.addEventListener("animationend", function () {
    console.log("Animação terminou"); 
    aviao.src = "imagens/cenario/avião-sombra.png";

  
    setTimeout(() => {
      pecasCenario.style.opacity = "1";
      pecasCenario.classList.add("active"); 
    }, 300)
  });  
});
