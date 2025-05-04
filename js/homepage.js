document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const pecasCenario = document.querySelector(".peças-cenario");

  
// Quando a animação do avião termina
aviao.addEventListener("animationend", function() {
  // Esconde o avião animado
  aviao.style.display = "none";
  
  // Mostra o avião estático (sombra)
  aviao2.style.display = "block";
  
  // Remove a animação para evitar que ocorra novamente
  aviao.style.animation = "none";

  setTimeout(() => {
      pecasCenario.style.opacity = "1";
      pecasCenario.classList.add("active");
  }, 300);
});



  // Mostrar ou esconder peças do avião com base no localStorage
  const imagemIdMostrar =getItem('imagemParaMostrar');
  const imagemIdEsconder = localStorage.getItem('imagemParaEsconder');

  if (imagemIdMostrar) {
    const imagemParaMostrar = document.getElementById(imagemIdMostrar);
    if (imagemParaMostrar) {
      imagemParaMostrar.style.display = 'block';
    }
    localStorage.removeItem('imagemParaMostrar');
  }

  if (imagemIdEsconder) {
    const imagemParaEsconder = document.getElementById(imagemIdEsconder);
    if (imagemParaEsconder) {
      imagemParaEsconder.style.display = 'none';
    }
    localStorage.removeItem('imagemParaEsconder');
  }
});
