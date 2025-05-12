const somErrado = document.getElementById("audio-errado");
const somCorreto = document.getElementById("audio-correto");
const musicaFundo = document.getElementById("background-music-jogo");
const vaidosoElement = document.getElementById('vaidoso');

let currentImageIndex = 1;
const totalImages = 24;

let audioContext;
let analyser;
let dataArray;

function detectSoundAndSetImage() {
    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }

    const average = sum / dataArray.length;

    let imageIndex = Math.floor((average / 255) * totalImages);
    imageIndex = Math.min(Math.max(imageIndex, 1), totalImages);

    if (imageIndex !== currentImageIndex) {
        currentImageIndex = imageIndex;
        vaidosoElement.src = `imagens/vaidoso/movimento/vaidoso${currentImageIndex}.png`;
    }
}

function iniciarSomAmbiente() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    // Solicita áudio apenas do microfone, com filtros
    navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }
    }).then(function (stream) {
        const microfoneFonte = audioContext.createMediaStreamSource(stream);
        microfoneFonte.connect(analyser);

        // Inicia detecção a cada 100ms
        setInterval(detectSoundAndSetImage, 100);

        // Após iniciar detecção, toca música se necessário
        if (localStorage.getItem("somAtivo") === "true") {
            musicaFundo.volume = 0.1; // Volume bem baixo
            musicaFundo.play().catch(e => console.warn("Autoplay bloqueado:", e));
        }

    }).catch(function (err) {
        console.error('Erro ao acessar o microfone:', err);
    });
}

// Espera a página carregar
window.addEventListener('load', () => {
    iniciarSomAmbiente(); // Inicia detecção de som antes da música
});
