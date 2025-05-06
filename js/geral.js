//som entre páginas

document.addEventListener("DOMContentLoaded", function () {

  const somOn = document.getElementById("som-on");
  const somOff = document.getElementById("som-off");
  const audio = document.getElementById("background-music");

  // Inicializa ícones
  somOn.style.display = "block";
  somOff.style.display = "none";

  // Inicia o áudio de acordo com o estado guardado no localStorage
  function startAudio() {
    const somLigado = localStorage.getItem('somLigado');

    if (somLigado === 'true') {
      audio.play().then(() => {
        somOn.style.display = "block";
        somOff.style.display = "none";
      }).catch(() => {
        somOn.style.display = "none";
        somOff.style.display = "block";
      });
    } else {
      somOn.style.display = "none";
      somOff.style.display = "block";
    }
  }

  // Alterna o estado do áudio e atualiza o localStorage
  function toggleAudio() {
    if (audio.paused) {
      audio.play().then(() => {
        somOn.style.display = "block";
        somOff.style.display = "none";
        localStorage.setItem('somLigado', 'true');
      }).catch(() => {
        console.log("Autoplay bloqueado");
      });
    } else {
      audio.pause();
      somOn.style.display = "none";
      somOff.style.display = "block";
      localStorage.setItem('somLigado', 'false');
    }
  }

  // Eventos nos ícones de som
  somOff.addEventListener("click", toggleAudio);
  somOn.addEventListener("click", toggleAudio);

  // Executa ao carregar a página
  startAudio();

});

function myPopUp() {
  const popup = document.getElementById("popup");
  popup.classList.toggle("show");

  // Fechar o popup após 10 segundos
  setTimeout(function () {
    popup.classList.remove("show");
  }, 10000);
}

// Fechar o popup ao clicar em qualquer lugar
document.addEventListener('click', function (event) {
  const popup = document.getElementById("popup");
  const helpIcon = document.querySelector('.ajuda img');

  if (!popup.contains(event.target) && event.target !== helpIcon) {
    popup.classList.remove("show");
  }
});