document.addEventListener("DOMContentLoaded", function () {
    const aviao = document.getElementById('aviao');
    aviao.addEventListener('animationend', function () {
      // Substitui a imagem quando a animação terminar
      aviao.src = 'imagens/aviãofinal-preto.png';
    });
  });
  