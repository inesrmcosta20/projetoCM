document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const luzes = [
        document.getElementById('luz1'),
        document.getElementById('luz2'),
        document.getElementById('luz3')
    ];
    const planeta = document.getElementById('planeta');

    // Contador de interações
    let interactionCount = 0;




    // Áudios
    const lightOn = new Audio('audios/lightOn.mp3');
    const lightOff = new Audio('audios/lightOff.mp3');
    lightOn.volume = lightOff.volume = 1;

    // Estados e controle
    const aceso = [true, true, false];
    const tempoDesligar = [0, 0, 0];

    // Controle de animação
    let currentRotation = 0;
    let lastTimestamp = null;
    let animationId = null;
    const baseSpeed = 10; // Velocidade constante

    // Caminhos das imagens
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    // Animação contínua dos candeeiros
    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        currentRotation += (deltaTime / 1000) * (360 / baseSpeed);

        if (planeta) planeta.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        if (luzes[0]) luzes[0].style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        if (luzes[1]) luzes[1].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 120}deg)`;
        if (luzes[2]) luzes[2].style.transform = `translate(-50%, -50%) rotate(${currentRotation + 240}deg)`;

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId) {
            animationId = requestAnimationFrame(animate);
        }
    }

    // Atualização contínua das luzes apagadas automaticamente
    function updateLights() {
        const now = Date.now();
        for (let i = 0; i < 3; i++) {
            if (aceso[i] && now > tempoDesligar[i]) {
                aceso[i] = false;
                if (luzes[i]) luzes[i].src = imgLuzApagada;
                lightOff.currentTime = 0;
                lightOff.play().catch(e => console.error("Erro no som:", e));
            }
        }
        requestAnimationFrame(updateLights);
    }

    // Inicialização das luzes com clique
    if (luzes && luzes.length > 0) {
        luzes.forEach((luz, index) => {
            if (luz) {
                luz.src = imgLuzApagada;
                luz.style.pointerEvents = 'auto';
                luz.addEventListener('click', function () {
                    if (!aceso[index]) {
                        aceso[index] = true;
                        luz.src = imgLuzAcesa;
                        lightOn.currentTime = 0;
                        lightOn.play();
                        tempoDesligar[index] = Date.now() + 1000 + Math.random() * 2000;

                        interactionCount++;
                        console.log(`Interação número: ${interactionCount}`);
                        
                        if (interactionCount === 5) {
                            showButton();
                        }
                    }
                });
            }
        });
    }
    function showButton() {
        const botao = document.querySelector(".desistir");
        if (botao) {
            botao.style.display = "block";
        }
        }
   

    startAnimation();
    updateLights();
});


// Adicione o event listener para o botão Desistir
document.addEventListener('DOMContentLoaded', function() {
    const desistirBtn = document.querySelector('.desistir');
    if (desistirBtn) {
        desistirBtn.addEventListener('click', mostrarFullscreen);
    }
});


// Função para mostrar o fullscreen
function mostrarFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    document.body.classList.add('fullscreen-active');
    
    fullscreenContainer.innerHTML = `
        <a class="close" onclick="fecharFullscreen()">×</a>
        <div class="fullScreen-img-container">
            <img src="imagens/candeeiro/principe.png" id="posicao1" alt="Imagem 1">
            <img src="imagens/candeeiro/mensagem.png" id="posicao2" alt="Imagem 2"> 
        </div>
         <button id="homeButton">Finalizar</button>
    `;
    
    homeButton.addEventListener('click', function() {
        const imagemAtivar = 'corpo';
        const imagemDesativar = 'peça-corpo';
      
        // Marca que a animação do corpo deve ser executada
        localStorage.setItem('corpoAnimado', 'false');
        localStorage.setItem('imagemParaMostrar', imagemAtivar);
        localStorage.setItem('imagemParaEsconder', imagemDesativar);
      
        window.location.href = "homepage.html"; 
      });
    


    fullscreenContainer.style.display = 'flex';
}
// Função para fechar o fullscreen
function fecharFullscreen() {
    const fullscreenContainer = document.getElementById('fullscreen-container');
    fullscreenContainer.style.display = 'none';
}

