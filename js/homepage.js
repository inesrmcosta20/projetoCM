document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecasCenario = document.querySelector(".peças-cenario");
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa ícones
  somOn.style.display = "none";
  somOff.style.display = "block";

  // Inicia o áudio de acordo com o estado guardado no localStorage
  function startAudio() {
    const somLigado = localStorage.getItem('somLigado');
    if (somLigado === 'true') {
      audio.play().then(() => {
        somOn.style.display = "block";
        somOff.style.display = "none";
      }).catch(() => {
        somOn.style.display = "none";
        somOff.style.display = "block";
      });
    } else {
      somOn.style.display = "none";
      somOff.style.display = "block";
    }
  }

  // Alterna o estado do áudio e atualiza o localStorage
  function toggleAudio() {
    if (audio.paused) {
      audio.play().then(() => {
        somOn.style.display = "block";
        somOff.style.display = "none";
        localStorage.setItem('somLigado', 'true');
      }).catch(() => {
        console.log("Autoplay bloqueado");
      });
    } else {
      audio.pause();
      somOn.style.display = "none";
      somOff.style.display = "block";
      localStorage.setItem('somLigado', 'false');
    }
  }

  // Eventos nos ícones de som
  somOff.addEventListener("click", toggleAudio);
  somOn.addEventListener("click", toggleAudio);

  // Executa ao carregar a página
  startAudio();

 
  
// Quando a animação do avião termina
aviao.addEventListener("animationend", function() {
  // Esconde o avião animado
  aviao.style.display = "none";
  
  // Mostra o avião estático (sombra)
  aviao2.style.display = "block";
  
  // Remove a animação para evitar que ocorra novamente
  aviao.style.animation = "none";

  setTimeout(() => {
      pecasCenario.style.opacity = "1";
      pecasCenario.classList.add("active");
  }, 300);
});



  // Mostrar ou esconder peças do avião com base no localStorage
  const imagemIdMostrar =getItem('imagemParaMostrar');
  const imagemIdEsconder = localStorage.getItem('imagemParaEsconder');

  if (imagemIdMostrar) {
    const imagemParaMostrar = document.getElementById(imagemIdMostrar);
    if (imagemParaMostrar) {
      imagemParaMostrar.style.display = 'block';
    }
    localStorage.removeItem('imagemParaMostrar');
  }

  if (imagemIdEsconder) {
    const imagemParaEsconder = document.getElementById(imagemIdEsconder);
    if (imagemParaEsconder) {
      imagemParaEsconder.style.display = 'none';
    }
    localStorage.removeItem('imagemParaEsconder');
  }
});
