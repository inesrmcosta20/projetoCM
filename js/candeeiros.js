// candeeiros.js
document.addEventListener('DOMContentLoaded', function() {

  // Elementos do DOM
  const luzes = [
      document.getElementById('luz1'),
      document.getElementById('luz2'),
      document.getElementById('luz3')
  ];
  const planeta = document.getElementById('planeta');
  const fundoLampiao = document.getElementById('fundo_lampiao');
  

  // Estados das lâmpadas
  const aceso = [false, false, false];
  const tempoDesligar = [0, 0, 0];
  
  // Imagens para estados (substitua pelos caminhos corretos se necessário)
  const imgLuzAcesa = 'imagens/candeeiro/luz.png';
  const imgLuzApagada = 'imagens/candeeiro/semluz.png'; // Você precisará criar esta imagem
  
  
  // Inicializa as lâmpadas como apagadas
  luzes.forEach(luz => {
      luz.src = imgLuzApagada;
      luz.style.pointerEvents = 'auto'; // Permite interação com as lâmpadas
  });
  
  // Atualiza o estado das lâmpadas a cada frame
  function update() {
      const now = Date.now();
      
      for (let i = 0; i < 3; i++) {
          if (aceso[i] && now > tempoDesligar[i]) {
              aceso[i] = false;
              luzes[i].src = imgLuzApagada;
          }
      }
      
      requestAnimationFrame(update);
  }
  
  // Inicia a animação
  update();
  
  // Adiciona event listeners para as lâmpadas
  luzes.forEach((luz, index) => {
      luz.addEventListener('click', function() {
          if (!aceso[index]) {
              aceso[index] = true;
              luz.src = imgLuzAcesa;
              tempoDesligar[index] = Date.now() + 1000 + Math.random() * 2000; // 1-3 segundos
              
          }
      });
  });
  
  
});