document.addEventListener("DOMContentLoaded", function () {
  // Variáveis de controle
  let animationRunning = false;
  let animationStartTime = null;
  const animationDuration = 5000; // 5 segundos

  // Elementos
  const aviao = document.getElementById('aviao');
  const aviao2 = document.getElementById('aviao2');
  const pecasCenario = document.querySelector('.peças-cenario');

  // Verificar se é a primeira visita
  const firstVisit = localStorage.getItem('firstVisit') === null;

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

function checkCompletedPieces() {
    const completedPieces = JSON.parse(localStorage.getItem('completedPieces') || '{}');
    
    // Esconde peças do cenário que já foram completadas
    Object.keys(completedPieces).forEach(pieceId => {
        const scenarioPiece = document.querySelector(`.peças-cenario a[href="${completedPieces[pieceId]}"] img`);
        if (scenarioPiece) {
            scenarioPiece.style.display = 'none';
            scenarioPiece.parentElement.style.pointerEvents = 'none';
        }
        
        // Mostra a peça correspondente no avião
        const airplanePiece = document.getElementById(pieceId);
        if (airplanePiece) {
            airplanePiece.style.display = 'block';
        }
    });

}
    checkCompletedPieces();

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

  // Configurar estado inicial baseado no localStorage
  if (firstVisit) {
    // Primeira visita - animar o avião
    localStorage.setItem('firstVisit', 'false');
    localStorage.setItem('shouldAnimate', 'true');
    console.log("Primeira visita - animação será executada");
  } else {
    // Visitas subsequentes - verificar se deve animar
    const shouldAnimate = localStorage.getItem('shouldAnimate') === 'true';
    console.log(`Visita subsequente - animação será executada? ${shouldAnimate}`);
  }

  // Iniciar animação apenas se shouldAnimate for true
  const shouldAnimate = localStorage.getItem('shouldAnimate') === 'true';
  if (shouldAnimate) {
    window.addEventListener('load', startAnimation);
    // Resetar o flag após a animação
    localStorage.setItem('shouldAnimate', 'false');
  } else {
    // Estado padrão quando não há animação
    aviao.style.display = 'none';
    aviao2.style.display = 'block';
    pecasCenario.style.opacity = "1";
    pecasCenario.classList.add("active");
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