const vaidosoElement = document.getElementById('vaidoso');
const totalImages = 24;
let currentImageIndex = 1;

// Configurações de áudio e animação
let audioContext;
let analyser;
let smoothAmplitude = 0;
const SMOOTHING_FACTOR = 0.8;
const sensitivity = 2.5; // Sensibilidade ajustada para evitar mudanças rápidas
const MIN_AMPLITUDE_THRESHOLD = 0.02; // Ignora ruído de fundo muito baixo

let started = false;
let startTime = null;

function preloadImages() {
    for (let i = 1; i <= totalImages; i++) {
        new Image().src = `imagens/vaidoso/movimento/vaidoso${i}.png`;
    }
}

function analyzeSound(timestamp) {
    if (!analyser) return;

    // Inicializar o tempo inicial
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const bufferLength = analyser.frequencyBinCount;
    const timeDomainData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDomainData);

    // Calcular a amplitude máxima
    let maxAmplitude = 0;
    for (let i = 0; i < bufferLength; i++) {
        const amplitude = Math.abs((timeDomainData[i] - 128) / 128);
        if (amplitude > maxAmplitude) {
            maxAmplitude = amplitude;
        }
    }

    // Suavização da amplitude
    smoothAmplitude = SMOOTHING_FACTOR * smoothAmplitude + (1 - SMOOTHING_FACTOR) * maxAmplitude;

    // Ativar animação após 1 segundo e se amplitude for significativa
    if (elapsed > 1000 && smoothAmplitude > MIN_AMPLITUDE_THRESHOLD) {
        started = true;
    }

    if (started) {
        const effectiveAmplitude = smoothAmplitude;
        let imageIndex = Math.min(
            totalImages,
            Math.max(1, Math.ceil(effectiveAmplitude * sensitivity * totalImages))
        );

        if (imageIndex !== currentImageIndex) {
            currentImageIndex = imageIndex;
            vaidosoElement.src = `imagens/vaidoso/movimento/vaidoso${currentImageIndex}.png`;
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
        const microfoneFonte = audioContext.createMediaStreamSource(stream);
        microfoneFonte.connect(analyser);

        preloadImages();
        requestAnimationFrame(analyzeSound);
    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
    }
}

window.addEventListener('load', iniciarSomAmbiente);
