const vaidosoElement = document.getElementById('vaidoso');
const totalImages = 24;
let currentImageIndex = 1;

let audioContext;
let analyser;
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

// ✅ Função para mostrar balões com fade-in funcional
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
}

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

function preloadImages() {
  for (let i = 1; i <= totalImages; i++) {
    const img = new Image();
    img.src = `imagens/vaidoso/movimento/vaidoso${i}.png`;
  }
}

window.addEventListener('load', () => {
  preloadImages();
  iniciarSomAmbiente();
});
