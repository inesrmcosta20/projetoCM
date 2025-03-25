/* Substitui a imagem aviao.png por aviao-sombra.png quando a animação terminar*/
document.addEventListener("DOMContentLoaded", function () {
    const aviao = document.getElementById('aviao');
    aviao.addEventListener('animationend', function () {
      aviao.src = 'imagens/elices.png';
    });
  });
  