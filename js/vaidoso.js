// Definir a sequência de imagens
let currentImageIndex = 1; // Começa da vaidoso1.png
const totalImages = 24; // Total de imagens vaidoso1.png até vaidoso24.png
const vaidosoElement = document.getElementById('vaidoso');

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

// Configura a troca de imagem a cada 100ms
setInterval(changeImage, 100);
