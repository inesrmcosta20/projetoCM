document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const luzes = [
        document.getElementById('luz1'),
        document.getElementById('luz2'),
        document.getElementById('luz3')
    ];
    const planeta = document.getElementById('planeta');
    const acendedor = document.getElementById('acendedor');
    const botao = document.querySelector('.botao');
    const fullScreenDiv = document.querySelector('.fullScreen');

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
    const baseSpeed = 20; // Velocidade constante
    
    // Inicializa a animação dos candeeiros
    startAnimation();

    // Caminhos das imagens
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    function animate(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        currentRotation += (deltaTime / 1000) * (360 / baseSpeed);
        
        // rodar planeta
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

    function showButton() {
        botao.style.display = 'block';
        setTimeout(() => {
            botao.style.opacity = '1';
        }, 10);
    }

    function showFullscreenImage() {
        fullScreenDiv.innerHTML = '<img src="imagens/candeeiro/principe com fundo.png" alt="Imagem em tela cheia">';
        fullScreenDiv.style.display = 'flex';
        
        setTimeout(() => {
            fullScreenDiv.style.opacity = '1';
        }, 10);
        
        // Fechar ao clicar
        fullScreenDiv.addEventListener('click', () => {
            fullScreenDiv.style.opacity = '0';
            setTimeout(() => {
                fullScreenDiv.style.display = 'none';
                fullScreenDiv.innerHTML = '';
            }, 300);
        });
    }

    // configuração do botão com rato 
    if (botao) {
        botao.addEventListener('click', showFullscreenImage);
        botao.addEventListener('mouseenter', () => {
            botao.style.backgroundColor = '#ff6b6b';
            botao.style.color = 'white';
        });
        botao.addEventListener('mouseleave', () => {
            botao.style.backgroundColor = '#AEB1E5';
            botao.style.color = 'white';
        });
    }

    // Inicialização das luzes
    if (luzes && luzes.length > 0) {
        luzes.forEach((luz, index) => {
            if (luz) {
                luz.src = imgLuzApagada;
                luz.style.pointerEvents = 'auto';
                luz.addEventListener('click', function() {
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
    
    updateLights();
});
