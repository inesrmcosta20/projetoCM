document.addEventListener("DOMContentLoaded", function () {

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

// Iniciar animação automaticamente quando a página carrega
window.addEventListener('load', startAnimation);

// Para controlar manualmente:
// startAnimation() - inicia a animação
// stopAnimation() - para a animação


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
