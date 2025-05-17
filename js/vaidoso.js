const vaidosoElement = document.getElementById('vaidoso');
const totalImages = 24;
let currentImageIndex = 1;

let audioContext, analyser;
let smoothAmplitude = 0;
const SMOOTHING_FACTOR = 0.8;
const sensitivity = 4;
const MIN_AMPLITUDE_THRESHOLD = 0.02;
let started = false;

const baloesAleatorios = [
  'balao-fala1', 'balao-fala2', 'balao-fala3', 'balao-fala4', 'balao-fala5',
  'balao-fala6', 'balao-fala7', 'balao-fala8', 'balao-fala9', 'balao-fala10',
];

let ultimaFraseTimestamp = 0;
const INTERVALO_ENTRE_FRASES = 4000;

let interacoes = 0;
const LIMITE_INTERACOES = 7;

// Função para mostrar balões com controlo de interações
function mostrarBalao(id) {
  const baloes = document.querySelectorAll('.balao');
  baloes.forEach(b => {
    b.classList.remove('fade-in');
    b.classList.add('fade-out');
  });

  const novoBalao = document.getElementById(id);
  if (novoBalao) {
    novoBalao.classList.remove('fade-out');
    void novoBalao.offsetWidth; // força reflow
    novoBalao.classList.add('fade-in');
  }

  interacoes++;
  if (interacoes >= LIMITE_INTERACOES) {
    const btnDesistir = document.getElementById('btnDesistir');
    if (btnDesistir) btnDesistir.style.display = 'block';
  }
}

// Análise do microfone
function analyzeSound() {
  if (!analyser) return;

  const bufferLength = analyser.frequencyBinCount;
  const timeDomainData = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(timeDomainData);

  let maxAmplitude = 0;
  for (let i = 0; i < bufferLength; i++) {
    const amplitude = Math.abs((timeDomainData[i] - 128) / 128);
    if (amplitude > maxAmplitude) maxAmplitude = amplitude;
  }

  smoothAmplitude = SMOOTHING_FACTOR * smoothAmplitude + (1 - SMOOTHING_FACTOR) * maxAmplitude;

  if (!started && smoothAmplitude > MIN_AMPLITUDE_THRESHOLD) started = true;

  if (started) {
    const effectiveAmplitude = smoothAmplitude;

    const imageIndex = Math.min(
      totalImages,
      Math.max(1, Math.ceil(effectiveAmplitude * sensitivity * totalImages))
    );

    if (imageIndex !== currentImageIndex) {
      currentImageIndex = imageIndex;
      vaidosoElement.src = `imagens/vaidoso/movimento/vaidoso${currentImageIndex}.png`;
    }

    const agora = Date.now();
    if (effectiveAmplitude > 0.05 && agora - ultimaFraseTimestamp > INTERVALO_ENTRE_FRASES) {
      const idBalao = baloesAleatorios[Math.floor(Math.random() * baloesAleatorios.length)];
      mostrarBalao(idBalao);
      ultimaFraseTimestamp = agora;
    }
  }

  requestAnimationFrame(analyzeSound);
}

// Inicialização do microfone
async function iniciarSomAmbiente() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const fonteMicrofone = audioContext.createMediaStreamSource(stream);
    fonteMicrofone.connect(analyser);

    setTimeout(() => {
      requestAnimationFrame(analyzeSound);
    }, 1000);
  } catch (err) {
    console.error('Erro ao aceder ao microfone:', err);
  }
}

// Mostrar tela fullscreen 
function mostrarFullscreen() {
  const fullscreenContainer = document.getElementById('fullscreen-container');
  document.body.classList.add('fullscreen-active');

  fullscreenContainer.innerHTML = `
    <div class="fullScreen-img-container">
      <img src="imagens/principe1.png" id="posicao1" alt="príncipe">
      <img src="imagens/vaidoso/mensagem.png" id="posicao2" alt="mensagem"> 
    </div>
    <button id="homeButton">Finalizar</button>
  `;

  fullscreenContainer.style.display = 'flex';

  const principeImg = document.getElementById('posicao1');
  let frame = 1;
  const maxFrames = 10;
  const intervalo = 150;

  const animacaoIntervalo = setInterval(() => {
    frame = frame >= maxFrames ? 1 : frame + 1;
    principeImg.src = `imagens/principe/principe${frame}.png`;
  }, intervalo);

  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener('click', () => {
    clearInterval(animacaoIntervalo);
    window.location.href = 'homepage.html';
  });
}

// Configurar botão desistir para mostrar fullscreen
function configurarBotaoDesistir() {
  const btnDesistir = document.getElementById('btnDesistir');
  if (btnDesistir) {
    btnDesistir.addEventListener('click', () => {
      mostrarFullscreen();
    });
  }
}

// Pré-carregamento de imagens do vaidoso
function preloadImages() {
  for (let i = 1; i <= totalImages; i++) {
    const img = new Image();
    img.src = `imagens/vaidoso/movimento/vaidoso${i}.png`;
  }
}

// Inicialização ao carregar a página
window.addEventListener('load', () => {
  preloadImages();
  iniciarSomAmbiente();
  configurarBotaoDesistir();
});
