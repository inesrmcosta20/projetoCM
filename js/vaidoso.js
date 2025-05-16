const somErrado = document.getElementById("audio-errado");
const somCorreto = document.getElementById("audio-correto");
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

    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        const microfoneFonte = audioContext.createMediaStreamSource(stream);
        microfoneFonte.connect(analyser);
        setInterval(detectSoundAndSetImage, 100);
    }).catch(function (err) {
        console.error('Erro ao aceder ao microfone:', err);
    });
}

window.addEventListener('load', () => {
    iniciarSomAmbiente();
});
