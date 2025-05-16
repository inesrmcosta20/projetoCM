const vaidosoElement = document.getElementById('vaidoso');
const totalImages = 24;
let currentImageIndex = 1;

// Configuração do áudio
let audioContext;
let analyser;
let smoothAmplitude = 0;
const SMOOTHING_FACTOR = 0.8; // Fator de suavização (0 a 1)

function preloadImages() {
    for (let i = 1; i <= totalImages; i++) {
        new Image().src = `imagens/vaidoso/movimento/vaidoso${i}.png`;
    }
}

function analyzeSound() {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const timeDomainData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeDomainData);

    // Calcular amplitude máxima
    let maxAmplitude = 0;
    for (let i = 0; i < bufferLength; i++) {
        const amplitude = Math.abs((timeDomainData[i] - 128) / 128);
        if (amplitude > maxAmplitude) {
            maxAmplitude = amplitude;
        }
    }

    // Aplicar suavização
    smoothAmplitude = SMOOTHING_FACTOR * smoothAmplitude + (1 - SMOOTHING_FACTOR) * maxAmplitude;

    // Mapear amplitude para frames (ajuste a sensibilidade conforme necessário)
    const sensitivity = 4;
    let imageIndex = Math.min(totalImages, 
        Math.max(1, 
            Math.ceil(smoothAmplitude * sensitivity * totalImages)
        )
    );

    // Atualizar imagem se necessário
    if (imageIndex !== currentImageIndex) {
        currentImageIndex = imageIndex;
        vaidosoElement.src = `imagens/vaidoso/movimento/vaidoso${currentImageIndex}.png`;
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
        analyzeSound();
    } catch (err) {
        console.error('Erro ao acessar microfone:', err);
    }
}

window.addEventListener('load', iniciarSomAmbiente);