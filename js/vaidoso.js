// Definir a sequência de imagens
let currentImageIndex = 1; // Começa da vaidoso1.png
const totalImages = 24; // Total de imagens vaidoso1.png até vaidoso24.png
const vaidosoElement = document.getElementById('vaidoso');

// Inicializando o contexto de áudio
const audio = document.getElementById('background-music-jogo');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Definir o tamanho do buffer de frequência
analyser.fftSize = 50;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Variável para controle da detecção de som
let isSoundDetected = false; // Flag para controlar a execução da mudança de imagem

// Função para mudar a imagem
function changeImage() {
    // Monta o caminho da imagem baseado no índice atual
    vaidosoElement.src = `imagens/vaidoso/movimento/vaidoso${currentImageIndex}.png`;

    // Atualiza o índice da imagem
    currentImageIndex++;

    // Se o índice ultrapassar o total de imagens, reinicia para 1
    if (currentImageIndex > totalImages) {
        currentImageIndex = 1;
    }
}

// Função para detectar o som e iniciar a sequência de imagens
function detectSoundAndStartSequence() {
    analyser.getByteFrequencyData(dataArray);

    // Calcula o volume (média dos valores dos bytes do áudio)
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    const average = sum / bufferLength;

    // Se o som for detectado (valor médio maior que um limiar)
    if (average > 30 && !isSoundDetected) {  // Verifica se o som é suficiente e ainda não foi detectado
        changeImage(); // Muda a imagem
        isSoundDetected = true; // Marca que o som foi detectado
    } else if (average <= 30) {
        isSoundDetected = false; // Reseta quando o som cair abaixo do limiar
    }
}

// Inicia o áudio e a detecção quando a página é carregada
audio.play();
audioContext.resume().then(() => {
    setInterval(detectSoundAndStartSequence, 100); // Verifica o som a cada 100ms
});
