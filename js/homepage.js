//Substituição no final da animação
document.addEventListener("DOMContentLoaded", function () {
  const aviao = document.getElementById("aviao");
  const missaoRosa = document.querySelector(".missao-rosa");
  const missaoRaposa = document.querySelector(".missao-raposa");
  const missaoVaidoso = document.querySelector(".missao-vaidoso");
  const missaoAcendedorCandeeiros = document.querySelector(".missao-acendedor-candeeiros");
  const missaoHomemNegocios = document.querySelector(".missao-homem-negocios");
  const missaoRei = document.querySelector(".missao-rei");


  //Após a animação do avião
  aviao.addEventListener("animationend", function () {
    aviao.src = "imagens/cenario/aviao-sombra.png";
    missaoRosa.style.display = "inline-block"; // Exibe o botão da Missão da Rosa 
    missaoRaposa.style.display = "inline-block"; // Exibe o botão da Missão da Raposa 
    missaoVaidoso.style.display = "inline-block"; // Exibe o botão da Missão do Vaidoso 
    missaoAcendedorCandeeiros.style.display = "inline-block"; // Exibe o botão da Missão do Acendedor de Candeeiros
    missaoHomemNegocios.style.display = "inline-block"; // Exibe o botão da Missão do Homem de Negócios
    missaoRei.style.display = "inline-block"; // Exibe o botão da Missão Rei
  });
});


/*
  pecas.forEach(peça => {
      peça.style.opacity = "0"; // Inicialmente ocultas
      peça.addEventListener("click", function () {
          peça.style.opacity = "1"; // Torna visível ao clicar
      });
  });
*/

//Controlo do som
document.addEventListener("DOMContentLoaded", function () {
  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa os ícones de som 
  somOn.style.display = "none";
  somOff.style.display = "block";

  // Verifica se o áudio está em reprodução e ajusta os ícones
  function toggleAudio() {
    if (audio.paused) {
      audio.play();
      somOff.style.display = "none";
      somOn.style.display = "block";
    } else {
      audio.pause();
      somOff.style.display = "block";
      somOn.style.display = "none";
    }
  }

  // Quando o ícone de som desligado for clicado
  somOff.addEventListener("click", toggleAudio);

  // Quando o ícone de som ligado for clicado
  somOn.addEventListener("click", toggleAudio);
});
