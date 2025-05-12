document.addEventListener("DOMContentLoaded", function () {
  // Variáveis de controle
  let animationRunning = false;
  let animationStartTime = null;
  const animationDuration = 5000; // 5 segundos

  // Elementos
  const aviao = document.getElementById('aviao');
  const aviao2 = document.getElementById('aviao2');
  const pecasCenario = document.querySelector('.peças-cenario');

  // Posições e transformações para cada etapa da animação
  const keyframes = [
    { time: 0,    top: -10, left: 100, rotate: 10,   scale: 0 },
    { time: 500,  top: 10,  left: 90,  rotate: 15,   scale: 0.5 },
    { time: 1000, top: 15,  left: 85,  rotate: 20,   scale: 1 },
    { time: 1500, top: 25,  left: 75,  rotate: 45,   scale: 1.5 },
    { time: 2000, top: 25,  left: 70,  rotate: 180,  scale: 2 },
    { time: 2500, top: 35,  left: 60,  rotate: 360,  scale: 3 },
    { time: 5000, top: 70,  left: 45,  rotate: 385,  scale: 4 }
  ];

  // Verificar se a animação já foi executada nesta sessão
  const animationAlreadyPlayed = sessionStorage.getItem('animationPlayed');
  
  if (!animationAlreadyPlayed) {
    console.log("Animação será executada (primeira vez nesta sessão)");
    startAnimation();
  } else {
    console.log("Animação já foi executada nesta sessão - pulando");
    // Mostrar estado final (avião como sombra e peças visíveis)
    aviao.style.display = 'none';
    aviao2.style.display = 'block';
    pecasCenario.style.opacity = "1";
    pecasCenario.classList.add("active");
  }

  function startAnimation() {
    if (animationRunning) return;
    
    animationRunning = true;
    animationStartTime = performance.now();
    aviao.style.display = 'block';
    aviao2.style.display = 'none';
    
    requestAnimationFrame(animate);
  }

  function stopAnimation() {
    animationRunning = false;
  }

  function animate(currentTime) {
    if (!animationRunning) return;
    
    if (!animationStartTime) animationStartTime = currentTime;
    const elapsedTime = currentTime - animationStartTime;
    
    // Encontrar os keyframes atual e próximo
    let currentFrame, nextFrame;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (elapsedTime >= keyframes[i].time && elapsedTime < keyframes[i+1].time) {
        currentFrame = keyframes[i];
        nextFrame = keyframes[i+1];
        break;
      }
    }
    
    // Se chegou ao final
    if (elapsedTime >= animationDuration) {
      const finalFrame = keyframes[keyframes.length - 1];
      applyTransform(finalFrame);
      
      // Trocar avião pela sombra
      aviao.style.display = 'none';
      aviao2.style.display = 'block';
      animationRunning = false;
      
      // Mostrar peças do cenário
      setTimeout(() => {
        pecasCenario.style.opacity = "1";
        pecasCenario.classList.add("active");
      }, 300);
      
      // Marcar na sessão que a animação já foi executada
      sessionStorage.setItem('animationPlayed', 'true');
      console.log("Animação terminada - marcando como executada nesta sessão");
      
      return;
    }
    
    // Interpolar entre os keyframes
    if (currentFrame && nextFrame) {
      const progress = (elapsedTime - currentFrame.time) / (nextFrame.time - currentFrame.time);
      const interpolatedFrame = {
        top: currentFrame.top + (nextFrame.top - currentFrame.top) * progress,
        left: currentFrame.left + (nextFrame.left - currentFrame.left) * progress,
        rotate: currentFrame.rotate + (nextFrame.rotate - currentFrame.rotate) * progress,
        scale: currentFrame.scale + (nextFrame.scale - currentFrame.scale) * progress
      };
      
      applyTransform(interpolatedFrame);
    }
    
    requestAnimationFrame(animate);
  }

  function applyTransform(frame) {
    aviao.style.top = `${frame.top}%`;
    aviao.style.left = `${frame.left}%`;
    aviao.style.transform = `rotate(${frame.rotate}deg) scale(${frame.scale})`;
  }

// Mostrar ou esconder peças do avião com base no localStorage
const imagemIdMostrar = localStorage.getItem('imagemParaMostrar');
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
// Controle da peça corpo
const pecaCorpo = document.getElementById('corpo');
const pecaCenarioCorpo = document.getElementById('peça-corpo');

// Verificar se devemos desativar a peça do cenário e animar a do avião
const pecaParaDesativar = sessionStorage.getItem('desativarPecaCenario');
const pecaParaAnimar = sessionStorage.getItem('animarPecaAviao');

if (pecaParaDesativar === 'peça-corpo' && pecaCenarioCorpo) {
    // Desativar definitivamente a peça do cenário
    pecaCenarioCorpo.style.display = 'none';
    sessionStorage.setItem('pecaCorpoDesativada', 'true');
    sessionStorage.removeItem('desativarPecaCenario');
}

if (pecaParaAnimar === 'corpo' && pecaCorpo) {
    // Executar animação da peça no avião
    pecaCorpo.style.display = 'block';
    pecaCorpo.style.animation = 'moveCorpo 5s ease-out forwards';
    
    pecaCorpo.addEventListener('animationend', function() {
        sessionStorage.setItem('pecaCorpoAnimada', 'true');
        sessionStorage.removeItem('animarPecaAviao');
    });
} else if (sessionStorage.getItem('pecaCorpoAnimada') && pecaCorpo) {
    // Mostrar estado final se já foi animada
    pecaCorpo.style.display = 'block';
    pecaCorpo.style.top = '64%';
    pecaCorpo.style.left = '37.2%';
    pecaCorpo.style.width = '24vw';
    pecaCorpo.style.transform = 'rotate(25deg)';
    pecaCorpo.style.zIndex = '13';
    pecaCorpo.style.animation = 'none';
}

// Verificar se a peça já estava desativada de sessões anteriores
if (sessionStorage.getItem('pecaCorpoDesativada') && pecaCenarioCorpo) {
    pecaCenarioCorpo.style.display = 'none';
}