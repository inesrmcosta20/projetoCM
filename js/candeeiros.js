// candeeiros.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const luzes = [
        document.getElementById('luz1'),
        document.getElementById('luz2'),
        document.getElementById('luz3')
    ];
    const planeta = document.getElementById('planeta');
    
    // Áudios
    const lightOn = new Audio('audios/lightOn.mp3');
    const lightOff = new Audio('audios/lightOff.mp3');
    lightOn.volume = lightOff.volume = 1;

    // Estados e controle
    const aceso = [false, false, false];
    const tempoDesligar = [0, 0, 0];
    
    // Controle de velocidade
    let firstInteractionTime = null;
    let baseSpeed = 16;
    let currentSpeed = baseSpeed;
    let speedIncreaseInterval = null;
    const minSpeed = 4;

    // Caminhos das imagens 
    const imgLuzAcesa = 'imagens/candeeiro/luz.png';
    const imgLuzApagada = 'imagens/candeeiro/semluz.png';

    // Função para verificar se as imagens existem
    function checkImagePaths() {
        console.log('Verificando caminhos das imagens:');
        console.log('Luz acesa:', imgLuzAcesa);
        console.log('Luz apagada:', imgLuzApagada);
        
        // Verificação adicional (opcional)
        const imgTest = new Image();
        imgTest.onload = () => console.log('Imagem de luz acesa carregada com sucesso');
        imgTest.onerror = () => console.error('Erro ao carregar imagem de luz acesa');
        imgTest.src = imgLuzAcesa;
    }

    // Inicialização
    luzes.forEach(luz => {
        luz.src = imgLuzApagada;
        luz.style.pointerEvents = 'auto'; // Garante que é clicável
    });
    checkImagePaths();

    // Função para atualizar a velocidade das animações
    function updateAnimationsSpeed() {
        const animationDuration = `${currentSpeed}s`;
        
        planeta.style.animationDuration = animationDuration;
        luzes[0].style.animationDuration = animationDuration;
        luzes[1].style.animationDuration = animationDuration;
        luzes[2].style.animationDuration = animationDuration;
    }

    // Função para aumentar a velocidade
    function increaseSpeed() {
        if (currentSpeed > minSpeed) {
            currentSpeed -= 1;
            updateAnimationsSpeed();
            console.log(`Velocidade aumentada: ${currentSpeed}s por rotação`);
        } else {
            clearInterval(speedIncreaseInterval);
        }
    }

    // Registra interação
    function registerInteraction() {
        if (!firstInteractionTime) {
            firstInteractionTime = Date.now();
            console.log("Primeira interação registrada");
            

//aumentar a velocidade da rotação a cada 5 segundos  
            setTimeout(() => {
                increaseSpeed();
                speedIncreaseInterval = setInterval(increaseSpeed, 5000);
            }, 15000);
        }
    }

    // Atualização do estado das lâmpadas
    function update() {
        const now = Date.now();
        
        for (let i = 0; i < 3; i++) {
            if (aceso[i] && now > tempoDesligar[i]) {
                aceso[i] = false;
                luzes[i].src = imgLuzApagada;
                lightOff.currentTime = 0;
                lightOff.play().catch(e => console.error("Erro no som:", e));
            }
        }
        
        requestAnimationFrame(update);
    }

    // Event listeners melhorados
    luzes.forEach((luz, index) => {
        luz.addEventListener('click', function() {
            console.log(`Clicou na luz ${index+1}`);
            
            if (!aceso[index]) {
                aceso[index] = true;
                luz.src = imgLuzAcesa;
                console.log(`Tentando carregar imagem: ${imgLuzAcesa}`);
                
                lightOn.currentTime = 0;
                lightOn.play().catch(e => console.error("Erro no som:", e));
                tempoDesligar[index] = Date.now() + 1000 + Math.random() * 2000;
                
                registerInteraction();
            }
        });
    });

    // Inicialização
    update();
    updateAnimationsSpeed();
});