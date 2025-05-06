async function iniciarWebcam() {
    Webcam.set({
        width: 630,    // Largura da webcam
        height: 375,   // Altura da webcam
        image_format: 'jpeg',
        jpeg_quality: 90,
        flip_horiz: false // NÃO espelha a imagem
    });

    Webcam.attach('#webcam-container');

    // Carregar os modelos do face-api.js
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    
    // Iniciar a detecção de sorriso
    detectarSorriso();
}

// Função para detectar o sorriso
async function detectarSorriso() {
    const video = document.querySelector('video'); // A webcam estará em um elemento de vídeo
    const detections = await faceapi.detectAllFaces(video).withFaceExpressions();

    if (detections.length > 0) {
        // Verificar se a pessoa está sorrindo
        const sorriso = detections[0].expressions.happy;
        
        // Se o sorriso for maior que 0.5 (indicando que a pessoa está sorrindo)
        if (sorriso > 0.5) {
            const audioAcerto = document.getElementById("audio-acerto");
            audioAcerto.play();
        }
    }

    // Chamar novamente a função para continuar detectando
    requestAnimationFrame(detectarSorriso);
}

// Quando a página estiver carregada, inicia a webcam
window.addEventListener("DOMContentLoaded", iniciarWebcam);

// Exemplo de popup
function myPopUp() {
    const popup = document.getElementById("popup");
    popup.classList.toggle("show");
}
