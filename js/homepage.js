document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecasCenario = document.querySelector(".peças-cenario");
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");
  const corpo = document.getElementById("corpo");

  
   // Inicializa estados das animações se não existirem
   if (localStorage.getItem('aviaoAnimado') === null) {
    localStorage.setItem('aviaoAnimado', 'false');
  }
  if (localStorage.getItem('corpoAnimado') === null) {
    localStorage.setItem('corpoAnimado', 'false');
  }

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


 // Função para animar o avião
 function animarAviao() {
  const jaAnimado = localStorage.getItem('aviaoAnimado') === 'true';
  
  if (!jaAnimado) {
    console.log("Iniciando animação do avião");
    
    aviao.addEventListener("animationend", function onAnimationEnd() {
      console.log("Animação do avião terminou - marcando como concluída");
      aviao.src = "imagens/homepage-cenário/avião-sombra.png";
      
      setTimeout(() => {
        pecasCenario.style.opacity = "1";
        pecasCenario.classList.add("active");
        localStorage.setItem('aviaoAnimado', 'true');
        
        // Remove o listener para evitar múltiplas execuções
        aviao.removeEventListener("animationend", onAnimationEnd);
      }, 300);
    });
  } else {
    console.log("Animação do avião já foi concluída anteriormente");
    // Estado final sem animação
    aviao.src = "imagens/homepage-cenário/avião-sombra.png";
    pecasCenario.style.opacity = "1";
    pecasCenario.classList.add("active");
  }
}


  // Função para animar a peça corpo (executa apenas uma vez)
  
  function animarCorpo() {
    const jaAnimado = localStorage.getItem('corpoAnimado') === 'true';
    const corpo = document.getElementById("corpo");
    
    if (!jaAnimado && corpo) {
      console.log("Iniciando animação da peça corpo");
      
      corpo.style.display = 'block';
      
      corpo.addEventListener("animationend", function onCorpoAnimationEnd() {
        console.log("Animação da peça corpo terminou - marcando como concluída");
        localStorage.setItem('corpoAnimado', 'true');
        
        // Remove o listener
        corpo.removeEventListener("animationend", onCorpoAnimationEnd);
      });
    } else if (corpo) {
      console.log("Animação da peça corpo já foi concluída ou elemento não encontrado");
      // Mostra a peça sem animação se já estiver animada
      corpo.style.display = 'block';
    }
  }

  // Verifica e executa animações
  animarAviao();
  
  // Gerenciamento de peças via localStorage
  const imagemIdMostrar = localStorage.getItem('imagemParaMostrar');
  const imagemIdEsconder = localStorage.getItem('imagemParaEsconder');

  if (imagemIdMostrar) {
    const imagemParaMostrar = document.getElementById(imagemIdMostrar);
    if (imagemParaMostrar) {
      if (imagemIdMostrar === 'corpo') {
        animarCorpo();
      } else {
        imagemParaMostrar.style.display = 'block';
      }
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
